import React, { useState } from "react";
import BookmarkAction from "./BookmarkAction";
import OutsideAlerter from "../hooks/useOutsideAlerter";
import ShareIcon from "../icons/ShareIcon";
import PostAction, { PostActionColorVariants } from "./PostAction";
import PostOption from "./PostOption";
import LinkIcon from "../icons/LinkIcon";
import { Post, User } from "@prisma/client";

type Props = {
  imageView?: boolean;
  post: Post & {
    user: User;
  };
  onBookmark: (bookmark: {
    listId: string | undefined;
    postId: string;
  }) => void;
  onDeleteBookmark: (postId: string) => void;
  isBookmarked: boolean;
};

const SharePostOption = ({
  imageView,
  post,
  onBookmark,
  onDeleteBookmark,
  isBookmarked,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`relative flex`}>
      <BookmarkAction
        className={`relative mr-3 hidden md:block`}
        imageView={imageView}
        postId={post.id}
        onBookmark={onBookmark}
        onDeleteBookmark={onDeleteBookmark}
        active={isBookmarked}
      />
      <PostAction
        icon={<ShareIcon className="h-5 w-5" />}
        imageView={imageView}
        color={PostActionColorVariants.blue}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      />
      {isOpen && (
        <OutsideAlerter
          onOutsideClick={() => setIsOpen(false)}
          className="absolute right-0 top-0 z-10 w-fit rounded-lg border border-gray-300 bg-white fill-black"
        >
          <ShareOptionsDropdown
            onClose={() => setIsOpen(false)}
            url={`http://localhost:3000/${post.user.username}/status/${post.id}`}
          />
        </OutsideAlerter>
      )}
    </div>
  );
};

export default SharePostOption;

type ShareOptionsDropdownProps = {
  url: string;
  onClose: () => void;
};

const ShareOptionsDropdown = ({ url, onClose }: ShareOptionsDropdownProps) => {
  return (
    <>
      <PostOption
        icon={<LinkIcon className="h-5 w-5" />}
        text="Copy link"
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(url).then();
          onClose();
        }}
      />
    </>
  );
};
