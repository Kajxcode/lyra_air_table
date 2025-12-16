import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const tableRouter = createTRPCRouter({
  /**
   * Create a table inside a base
   */
  create: protectedProcedure
  .input(
    z.object({
      baseId: z.string().cuid(),
      name: z.string().min(1),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const base = await ctx.prisma.base.findFirst({
      where: {
        id: input.baseId,
        ownerId: ctx.session.user.id,
      },
    });

    if (!base) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Base not found",
      });
    }

    const position = await ctx.prisma.table.count({
      where: { baseId: input.baseId },
    });

    return ctx.prisma.$transaction(async (tx) => {
      // 1. Create table
      const table = await tx.table.create({
        data: {
          name: input.name,
          baseId: input.baseId,
          position,
        },
      });

      // 2. Default column
      const column = await tx.column.create({
        data: {
          tableId: table.id,
          name: "Name",
          type: "TEXT",
          position: 0,
        },
      });

      // 3. Default row
      const row = await tx.row.create({
        data: {
          tableId: table.id,
          index: 0,
        },
      });

      // 4. Default cell
      await tx.cell.create({
        data: {
          rowId: row.id,
          columnId: column.id,
          valueText: "",
        },
      });

      return table;
    });
  }),

  /**
   * Get all tables for a base (for tabs)
   */
  getByBase: protectedProcedure
    .input(
      z.object({
        baseId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.table.findMany({
        where: {
          base: {
            id: input.baseId,
            ownerId: ctx.session.user.id,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }),

  /**
   * Get one table with its structure (NO CELLS YET)
   */
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const table = await ctx.prisma.table.findFirst({
        where: {
          id: input.id,
          base: {
            ownerId: ctx.session.user.id,
          },
        },
        include: {
          columns: {
            orderBy: { position: "asc" },
          },
          rows: {
            orderBy: { index: "asc" },
          },
        },
      });

      if (!table) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Table not found",
        });
      }

      return table;
    }),
});
