import { COMMENTPERMISSIONS } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  create: protectedProcedure
    .input(
      z.object({
        textContent: z.string().nullish(),
        commentPermission: z.nativeEnum(COMMENTPERMISSIONS),
        commentToId: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.create({
        data: {
          textContent: input.textContent,
          userId: ctx.session.user.id,
          commentToId: input.commentToId,
        },
      });

      return post;
    }),
});
