import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const hashtagRouter = createTRPCRouter({
  fetchAutoCompleteHashtags: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input, ctx }) => {
      const hashtags = await ctx.db.hashTag.findMany({
        where: {
          hashtag: {
            startsWith: input.keyword,
          },
        },
      });
      return hashtags;
    }),
});
