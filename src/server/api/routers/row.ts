import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const rowRouter = createTRPCRouter({
  getByTable: protectedProcedure
    .input(z.object({ tableId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.row.findMany({
        where: {
          tableId: input.tableId,
          table: {
            base: {
              ownerId: ctx.session.user.id,
            },
          },
        },
        orderBy: { index: "asc" },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        tableId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const table = await ctx.prisma.table.findFirst({
        where: {
          id: input.tableId,
          base: {
            ownerId: ctx.session.user.id,
          },
        },
      });

      if (!table) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Table not found",
        });
      }

      // Next row index
      const index = await ctx.prisma.row.count({
        where: { tableId: input.tableId },
      });

      return ctx.prisma.row.create({
        data: {
          tableId: input.tableId,
          index,
        },
      });
    }),
});
