import { Post } from "@prisma/client";
import { CursorType } from "../routers/post";

export const getNextPostCursor = (
  posts: Post[],
  POST_PER_REQUEST = 20,
) => {
  let nextCursor: CursorType | undefined = undefined;
  if (posts.length > POST_PER_REQUEST - 1) {
    const nextItem = posts.pop();
    nextCursor = {
      id: nextItem?.id,
      createdAt: nextItem?.createdAt,
    };
  }
  return nextCursor;
};
