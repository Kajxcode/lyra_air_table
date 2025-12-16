import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const baseRouter = createTRPCRouter({
  create: protectedProcedure
  .input(
    z.object({
      name: z.string().min(1),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      // 1️⃣ Create base
      const base = await prisma.base.create({
        data: {
          name: input.name,
          ownerId: ctx.session.user.id,
        },
      });

      // 2️⃣ Create default table
      const table = await prisma.table.create({
        data: {
          name: "Table 1",
          baseId: base.id,
          position: 0,
        },
      });

      // 3️⃣ Create default column
      const column = await prisma.column.create({
        data: {
          name: "Name",
          type: "TEXT",
          tableId: table.id,
          position: 0,
        },
      });

      // 4️⃣ Create default row
      const row = await prisma.row.create({
        data: {
          tableId: table.id,
          index: 0,
        },
      });

      // 5️⃣ Create default cell
      await prisma.cell.create({
        data: {
          rowId: row.id,
          columnId: column.id,
          valueText: "",
        },
      });

      return base;
    });
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.base.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const base = await ctx.prisma.base.findFirst({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
      });

      if (!base) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Base not found or you do not have access to update it.",
        });
      }

      return ctx.prisma.base.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const base = await ctx.prisma.base.findFirst({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
        include: {
          tables: {
            orderBy: { position: "asc" },
          },
        },
      });

      if (!base) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Base not found",
        });
      }

      return base;
    }),
});
