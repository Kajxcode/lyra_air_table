"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import TableGrid from "@/app/_components/table-grid";

export default function BaseClient({ baseId }: { baseId: string }) {
  const { data: tables, isLoading } = api.table.getByBase.useQuery({
    baseId,
  });

  const [activeTableId, setActiveTableId] = useState<string | null>(null);

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (!tables || tables.length === 0)
    return <div className="p-6">No tables yet</div>;

  const currentTableId = activeTableId ?? tables[0].id;

  return (
    <div className="flex flex-col h-full">
      {/* TABLE TABS */}
      <div className="flex border-b border-gray-200 bg-white px-4">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => setActiveTableId(table.id)}
            className={`px-4 py-2 text-sm font-medium ${
              currentTableId === table.id
                ? "border-b-2 border-red-500 text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {table.name}
          </button>
        ))}
      </div>

      {/* TABLE GRID */}
      <div className="flex-1 overflow-hidden">
        <TableGrid tableId={currentTableId} />
      </div>
    </div>
  );
}
