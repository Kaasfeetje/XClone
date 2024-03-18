import { CursorType } from "../routers/post";

export const getNextCreatedAtCursor = (
  posts: { id: string; createdAt: Date }[],
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
