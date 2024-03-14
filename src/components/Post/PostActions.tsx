import React, { useEffect, useState } from "react";
import PostAction, { PostActionColorVariants } from "./PostAction";
import CommentIcon from "../icons/CommentIcon";
import RepostIcon from "../icons/RepostIcon";
import LikeIcon from "../icons/LikeIcon";
import StatsIcon from "../icons/StatsIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import ShareIcon from "../icons/ShareIcon";
import { api } from "~/utils/api";
import BookmarkAction from "./BookmarkAction";
import LikeIconFilled from "../icons/LikeIconFilled";

type Props = {
  imageView?: boolean;
  postId: string;
  liked: boolean;
  likeCount: number;
  reposted: boolean;
  repostCount: number;
  bookmarked: boolean;
  commentCount: number;
  detailed?: boolean;
};

const PostActions = ({
  imageView,
  postId,
  liked,
  likeCount,
  reposted,
  repostCount,
  bookmarked,
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
  const bookmarkMutation = api.bookmark.createBookmark.useMutation({
    onMutate() {
      setIsBookmarked(true);
    },
    onSuccess() {
      utils.post.fetchAll.invalidate();
    },
  });
  const deleteBookmarkMutation = api.bookmark.deleteBookmark.useMutation({
    onMutate() {
      setIsBookmarked(false);
    },
    onSuccess() {
      utils.post.fetchAll.invalidate();
    },
  });
  const [isLiked, setIsLiked] = useState(liked);
  const [_likeCount, setLikeCount] = useState(likeCount);
  const [isReposted, setIsReposted] = useState(reposted);
  const [_repostCount, setRepostCount] = useState(repostCount);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);

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

  const onBookmark = (bookmark: {
    listId: string | undefined;
    postId: string;
  }) => {
    bookmarkMutation.mutate(bookmark);
  };

  const onDeleteBookmark = (postId: string) => {
    deleteBookmarkMutation.mutate({ postId });
  };

  return (
    <div className="mt-3 flex w-full justify-between">
      <PostAction
        icon={<CommentIcon className="h-5 w-5" />}
        value={commentCount}
        color={PostActionColorVariants.blue}
        imageView={imageView}
        onClick={(e) => {
          e.preventDefault();
          alert("Not implemented yet.");
        }}
      />
      <PostAction
        icon={<RepostIcon className="h-5 w-5" />}
        value={_repostCount}
        color={PostActionColorVariants.green}
        imageView={imageView}
        onClick={onRepost}
        active={isReposted}
      />
      <PostAction
        icon={<LikeIcon className="h-5 w-5" />}
        activeIcon={<LikeIconFilled className="h-5 w-5" />}
        value={_likeCount}
        color={PostActionColorVariants.red}
        imageView={imageView}
        onClick={onLike}
        active={isLiked}
      />
      {!detailed && (
        <PostAction
          icon={<StatsIcon className="h-5 w-5" />}
          value={0}
          color={PostActionColorVariants.blue}
          imageView={imageView}
          onClick={(e) => {
            e.preventDefault();
            alert("Not implemented yet.");
          }}
        />
      )}
      {detailed ? (
        <>
          <BookmarkAction
            className="relative"
            postId={postId}
            onBookmark={onBookmark}
            onDeleteBookmark={onDeleteBookmark}
            imageView={imageView}
            active={isBookmarked}
          />
          <PostAction
            icon={<ShareIcon className="h-5 w-5" />}
            imageView={imageView}
            color={PostActionColorVariants.blue}
            onClick={(e) => {
              e.preventDefault();
              alert("Not implemented yet.");
            }}
          />
        </>
      ) : (
        <div className={`flex`}>
          <BookmarkAction
            className={`relative mr-3 hidden md:block`}
            imageView={imageView}
            postId={postId}
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
              alert("Not implemented yet.");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PostActions;
