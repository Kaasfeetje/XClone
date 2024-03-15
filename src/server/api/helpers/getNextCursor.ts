import { Post } from "@prisma/client";
import { CursorType } from "../routers/post";

export const getNextPostCursor = (
  cursor: CursorType | undefined | null,
  posts: Post[],
  POST_PER_REQUEST = 20,
) => {
  let nextItem;
  if (cursor == undefined || cursor == null) {
    nextItem = posts.at(-1);
  } else {
    nextItem = posts.pop();
  }
  let nextCursor: CursorType | undefined = undefined;
  if (posts.length > POST_PER_REQUEST - 1) {
    nextCursor = {
      id: nextItem?.id,
      createdAt: nextItem?.createdAt,
    };
  }
  return nextCursor;
};
