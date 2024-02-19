import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { postInclude } from "./post";

export const bookmarkRouter = createTRPCRouter({
  fetchBookmarkLists: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.bookmarkList.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  createBookmarkList: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.bookmarkList.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });
    }),
  fetchBookmarks: protectedProcedure.query(async ({ input, ctx }) => {
    return await ctx.db.bookmark.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        post: {
          include: postInclude(ctx.session.user.id),
        },
      },
    });
  }),
  createBookmark: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
        listId: z.string().min(1).nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const bookmark = await ctx.db.bookmark.create({
        data: {
          listId: input.listId,
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
      return bookmark;
    }),
  deleteBookmark: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.bookmark.delete({
        where: {
          userId_postId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),
});
