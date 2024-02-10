import React from "react";
import PostAction from "./PostAction";
import CommentIcon from "../icons/CommentIcon";
import RepostIcon from "../icons/RepostIcon";
import LikeIcon from "../icons/LikeIcon";
import StatsIcon from "../icons/StatsIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import ShareIcon from "../icons/ShareIcon";

type Props = {};

const PostActions = (props: Props) => {
  return (
    <div className="mt-3 flex w-full justify-between">
      <PostAction
        icon={<CommentIcon className="h-5 w-5" />}
        value={0}
        onClick={() => alert("Not implemented yet.")}
      />
      <PostAction
        icon={<RepostIcon className="h-5 w-5" />}
        value={0}
        onClick={() => alert("Not implemented yet.")}
      />
      <PostAction
        icon={<LikeIcon className="h-5 w-5" />}
        value={0}
        onClick={() => alert("Not implemented yet.")}
      />
      <PostAction
        icon={<StatsIcon className="h-5 w-5" />}
        value={0}
        onClick={() => alert("Not implemented yet.")}
      />
      <div className="flex">
        <div className="mr-3 hidden md:block">
          <PostAction
            icon={<BookmarkIcon className="h-5 w-5" />}
            onClick={() => alert("Not implemented yet.")}
          />
        </div>
        <PostAction
          icon={<ShareIcon className="h-5 w-5" />}
          onClick={() => alert("Not implemented yet.")}
        />
      </div>
    </div>
  );
};

export default PostActions;
