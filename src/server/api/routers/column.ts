// src/server/api/routers/column.ts
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const columnRouter = createTRPCRouter({
  getByTable: protectedProcedure
    .input(z.object({ tableId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.column.findMany({
        where: {
          tableId: input.tableId,
          table: {
            base: {
              ownerId: ctx.session.user.id,
            },
          },
        },
        orderBy: { position: "asc" },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        tableId: z.string().cuid(),
        name: z.string().min(1),
        type: z.enum(["TEXT", "NUMBER"]).default("TEXT"),
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

      const position = await ctx.prisma.column.count({
        where: { tableId: input.tableId },
      });

      return ctx.prisma.column.create({
        data: {
          tableId: input.tableId,
          name: input.name,
          type: input.type,
          position,
        },
      });
    }),

  rename: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.column.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
});
