import React, { useEffect, useState } from "react";
import PostAction, { PostActionColorVariants } from "./PostAction";
import CommentIcon from "../icons/CommentIcon";
import RepostIcon from "../icons/RepostIcon";
import LikeIcon from "../icons/LikeIcon";
import StatsIcon from "../icons/StatsIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import ShareIcon from "../icons/ShareIcon";
import { api } from "~/utils/api";

type Props = {
  postId: string;
  liked: boolean;
  likeCount: number;
  reposted: boolean;
  repostCount: number;
  commentCount: number;
  detailed?: boolean;
};

const PostActions = ({
  postId,
  liked,
  likeCount,
  reposted,
  repostCount,
  commentCount,
  detailed,
}: Props) => {
  const utils = api.useUtils();
  const repostMutation = api.post.repost.useMutation({
    onMutate() {
      if (isReposted) {
        setIsReposted(false);
        setRepostCount(_repostCount - 1);
      } else {
        setIsReposted(true);
        setRepostCount(_repostCount + 1);
      }
    },
    onSuccess() {
      utils.post.fetchAll.invalidate();
    },
  });
  const likeMutation = api.post.like.useMutation({
    onMutate() {
      if (isLiked) {
        setIsLiked(false);
        setLikeCount(_likeCount - 1);
      } else {
        setIsLiked(true);
        setLikeCount(_likeCount + 1);
      }
    },
    onSuccess() {
      utils.post.fetchAll.invalidate();
    },
  });

  const [isLiked, setIsLiked] = useState(liked);
  const [_likeCount, setLikeCount] = useState(likeCount);
  const [isReposted, setIsReposted] = useState(reposted);
  const [_repostCount, setRepostCount] = useState(repostCount);

  const onRepost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (repostMutation.isLoading) return;
    repostMutation.mutate({ postId });
  };

  const onLike = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (likeMutation.isLoading) return;
    likeMutation.mutate({ postId });
  };

  return (
    <div className="mt-3 flex w-full justify-between">
      <PostAction
        icon={<CommentIcon className="h-5 w-5" />}
        value={commentCount}
        color={PostActionColorVariants.blue}
        onClick={(e) => {
          e.preventDefault();
          alert("Not implemented yet.");
        }}
      />
      <PostAction
        icon={<RepostIcon className="h-5 w-5" />}
        value={_repostCount}
        color={PostActionColorVariants.green}
        onClick={onRepost}
        active={isReposted}
      />
      <PostAction
        icon={<LikeIcon className="h-5 w-5" />}
        value={_likeCount}
        color={PostActionColorVariants.red}
        onClick={onLike}
        active={isLiked}
      />
      {!detailed && (
        <PostAction
          icon={<StatsIcon className="h-5 w-5" />}
          value={0}
          color={PostActionColorVariants.blue}
          onClick={(e) => {
            e.preventDefault();
            alert("Not implemented yet.");
          }}
        />
      )}
      {detailed ? (
        <>
          <PostAction
            icon={<BookmarkIcon className="h-5 w-5" />}
            color={PostActionColorVariants.blue}
            value={0}
            onClick={(e) => {
              e.preventDefault();
              alert("Not implemented yet.");
            }}
          />
          <PostAction
            icon={<ShareIcon className="h-5 w-5" />}
            color={PostActionColorVariants.blue}
            onClick={(e) => {
              e.preventDefault();
              alert("Not implemented yet.");
            }}
          />
        </>
      ) : (
        <div className={`flex`}>
          <div className={`mr-3 hidden md:block`}>
            <PostAction
              icon={<BookmarkIcon className="h-5 w-5" />}
              color={PostActionColorVariants.blue}
              onClick={(e) => {
                e.preventDefault();
                alert("Not implemented yet.");
              }}
            />
          </div>
          <PostAction
            icon={<ShareIcon className="h-5 w-5" />}
            color={PostActionColorVariants.blue}
            onClick={(e) => {
              e.preventDefault();
              alert("Not implemented yet.");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PostActions;
