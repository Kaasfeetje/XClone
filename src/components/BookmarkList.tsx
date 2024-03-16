import {
  Bookmark,
  HashTag,
  Post as PostType,
  PostLike,
  PostRepost,
  User,
} from "@prisma/client";
import React, { useState } from "react";
import Post, { PostIncludeType } from "./Post/Post";
import AngleDownIcon from "./icons/AngleDownIcon";

type Props = {
  name: string;
  bookmarks: (Bookmark & {
    post: PostType & PostIncludeType;
  })[];
};

const BookmarkList = ({ name, bookmarks }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 flex cursor-pointer select-none justify-between px-4 text-xl font-semibold"
      >
        <span>{name}</span>
        <div
          className={`w-[34px flex h-[34px] items-center justify-center ${isOpen ? "" : "-rotate-90"}`}
        >
          <AngleDownIcon className="h-5 w-5" />
        </div>
      </div>
      {isOpen && (
        <div>
          {bookmarks.map((bookmark) => (
            <Post key={bookmark.post.id} post={bookmark.post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
