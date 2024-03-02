import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { hashtagRouter } from "./routers/hashtag";
import { bookmarkRouter } from "./routers/bookmark";
import { searchRouter } from "./routers/search";
import { uploadRouter } from "./routers/upload";
import { listRouter } from "./routers/list";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  hashtag: hashtagRouter,
  bookmark: bookmarkRouter,
  search: searchRouter,
  upload: uploadRouter,
  list: listRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
