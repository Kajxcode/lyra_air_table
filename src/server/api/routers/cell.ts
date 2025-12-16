// src/server/api/routers/cell.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cellRouter = createTRPCRouter({
  getByTable: protectedProcedure
    .input(
      z.object({
        tableId: z.string().cuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.cell.findMany({
        where: {
          row: {
            tableId: input.tableId,
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        rowId: z.string().cuid(),
        columnId: z.string().cuid(),
        valueText: z.string().nullable().optional(),
        valueNumber: z.number().nullable().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.cell.upsert({
        where: {
          rowId_columnId: {
            rowId: input.rowId,
            columnId: input.columnId,
          },
        },
        update: {
          valueText: input.valueText,
          valueNumber: input.valueNumber,
        },
        create: {
          rowId: input.rowId,
          columnId: input.columnId,
          valueText: input.valueText,
          valueNumber: input.valueNumber,
        },
      });
    }),
});
