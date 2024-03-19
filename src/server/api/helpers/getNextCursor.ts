import { ListFollow, ListMember } from "@prisma/client";

export type CreatedAtCursorType = {
  id?: string;
  createdAt?: Date;
};

export const getNextCreatedAtCursor = (
  posts: { id: string; createdAt: Date }[],
  POST_PER_REQUEST = 20,
) => {
  let nextCursor: CreatedAtCursorType | undefined = undefined;
  if (posts.length > POST_PER_REQUEST - 1) {
    const nextItem = posts.pop();
    nextCursor = {
      id: nextItem?.id,
      createdAt: nextItem?.createdAt,
    };
  }
  return nextCursor;
};

export type ListMemberCursorType = {
  memberId_listId: {
    listId?: string;
    memberId?: string;
  };
  createdAt?: Date;
};

export const getNextListMemberCursor = (
  members: ListMember[],
  POST_PER_REQUEST = 20,
) => {
  let nextCursor: ListMemberCursorType | undefined = undefined;
  if (members.length > POST_PER_REQUEST - 1) {
    const nextItem = members.pop();
    nextCursor = {
      memberId_listId: {
        listId: nextItem?.listId,
        memberId: nextItem?.memberId,
      },
      createdAt: nextItem?.createdAt,
    };
  }
  return nextCursor;
};

export type ListFollowerCursorType = {
  followerId_listId: {
    listId?: string;
    followerId?: string;
  };
  createdAt?: Date;
};

export const getNextListFollowerCursor = (
  followers: ListFollow[],
  POST_PER_REQUEST = 20,
) => {
  let nextCursor: ListFollowerCursorType | undefined = undefined;
  if (followers.length > POST_PER_REQUEST - 1) {
    const nextItem = followers.pop();
    nextCursor = {
      followerId_listId: {
        listId: nextItem?.listId,
        followerId: nextItem?.followerId,
      },
      createdAt: nextItem?.createdAt,
    };
  }
  return nextCursor;
};
