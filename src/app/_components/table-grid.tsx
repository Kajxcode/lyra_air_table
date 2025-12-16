"use client";


import { api } from "@/trpc/react";
import { useMemo } from "react";
import { ColumnType } from "generated/prisma";


export default function TableGrid({ tableId }: { tableId: string }) {
  const { data: table } = api.table.getById.useQuery({ id: tableId });
  const { data: cells } = api.cell.getByTable.useQuery({ tableId });

  const updateCell = api.cell.update.useMutation(); // ✅ FIX
  const utils = api.useUtils();

    const createRow = api.row.create.useMutation({
    onMutate: async ({ tableId }) => {
        // cancel any outgoing fetches
        await utils.table.getById.cancel({ id: tableId });

        // snapshot previous state
        const previousTable = utils.table.getById.getData({ id: tableId });

        // optimistically insert a row
        utils.table.getById.setData({ id: tableId }, (old) => {
        if (!old) return old;

        return {
            ...old,
            rows: [
                ...old.rows,
                {
                    id: "optimistic-" + Math.random(),
                    tableId,
                    index: old.rows.length,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                ],
        };
        });

        return { previousTable };
    },

    onError: (_err, { tableId }, ctx) => {
        // rollback if it fails
        if (ctx?.previousTable) {
        utils.table.getById.setData(
            { id: tableId },
            ctx.previousTable
        );
        }
    },

    onSettled: (_data, _error, { tableId }) => {
        // sync with server
        utils.table.getById.invalidate({ id: tableId });
    },
    });

    const createColumn = api.column.create.useMutation({
  onMutate: async (input) => {
    // cancel outgoing refetches
    await utils.table.getById.cancel({ id: tableId });

    // snapshot current table
    const previous = utils.table.getById.getData({ id: tableId });

    // optimistically update cache
    utils.table.getById.setData({ id: tableId }, (old) => {
      if (!old) return old;

      return {
        ...old,
        columns: [
          ...old.columns,
          {
            id: `optimistic-${Math.random()}`,
            tableId,
            name: input.name,
            type: input.type ?? ColumnType.TEXT,
            position: old.columns.length,
            isHidden: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
    });

    return { previous };
  },

  onError: (_err, _input, ctx) => {
    // rollback on failure
    if (ctx?.previous) {
      utils.table.getById.setData({ id: tableId }, ctx.previous);
    }
  },

  onSettled: () => {
    // sync with server result
    utils.table.getById.invalidate({ id: tableId });
  },
});


  const cellMap = useMemo(() => {
    const map: Record<string, Record<string, string | number | null>> = {};
    cells?.forEach((cell) => {
      if (!map[cell.rowId]) map[cell.rowId] = {};
      map[cell.rowId][cell.columnId] =
        cell.valueText ?? cell.valueNumber ?? null;
    });
    return map;
  }, [cells]);

  if (!table) return null;

  const { columns, rows } = table;

  return (
    <div className="overflow-auto h-full bg-white">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.id} className="border border-gray-300 px-3 py-2 bg-gray-50 text-left">
                {col.name}
              </th>
            ))}
            <th className="border border-gray-300 bg-gray-50 px-2">
            <button
                onClick={() =>
                createColumn.mutate({
                    tableId,
                    name: "New column",
                    type: "TEXT",
                })
                }
                className="text-sm text-gray-400 hover:text-black"
            >
                + Add column
            </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.id} className="border border-gray-300 px-2 py-1">
                  <input
                    className="w-full bg-transparent outline-none"
                    defaultValue={String(cellMap[row.id]?.[col.id] ?? "")}
                    onBlur={(e) =>
                        updateCell.mutate({
                        rowId: row.id,
                        columnId: col.id,
                        valueText: e.target.value,
                        })
                    }
                    />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => createRow.mutate({ tableId })}
        className="text-sm text-gray-500 hover:text-black"
        >
        + Add row
        </button>
    </div>
    
  );
}
