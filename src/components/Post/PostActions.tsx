import React, { useEffect, useState } from "react";
import PostAction, { PostActionColorVariants } from "./PostAction";
import CommentIcon from "../icons/CommentIcon";
import RepostIcon from "../icons/RepostIcon";
import LikeIcon from "../icons/LikeIcon";
import StatsIcon from "../icons/StatsIcon";
import ShareIcon from "../icons/ShareIcon";
import { api } from "~/utils/api";
import BookmarkAction from "./BookmarkAction";
import LikeIconFilled from "../icons/LikeIconFilled";
import { useRouter } from "next/router";
import { Post, User } from "@prisma/client";

type Props = {
  imageView?: boolean;
  post: Post & {
    user: User;
  };
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
  post,
  liked,
  likeCount,
  reposted,
  repostCount,
  bookmarked,
  commentCount,
  detailed,
}: Props) => {
  const router = useRouter();
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
      invalidate();
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
      invalidate();
    },
  });
  const bookmarkMutation = api.bookmark.createBookmark.useMutation({
    onMutate() {
      setIsBookmarked(true);
    },
    onSuccess() {
      invalidate();
    },
  });
  const deleteBookmarkMutation = api.bookmark.deleteBookmark.useMutation({
    onMutate() {
      setIsBookmarked(false);
    },
    onSuccess() {
      invalidate();
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
    repostMutation.mutate({ postId: post.id });
  };

  const onLike = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (likeMutation.isLoading) return;
    likeMutation.mutate({ postId: post.id });
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

  const refetchPage = (
    lastPage: any,
    index: any,
    allPages: any,
    key: string = "posts",
  ) => {
    const test = lastPage[key].filter((_post: any) => _post.id == post.id);
    return test.length != 0;
  };

  const invalidate = () => {
    utils.post.fetchAll.invalidate({}, { refetchPage });
    utils.post.fetchListPosts.invalidate({}, { refetchPage });
    utils.post.fetchProfileHighlights.invalidate({}, { refetchPage });
    utils.post.fetchProfileLikes.invalidate({}, { refetchPage });
    utils.post.fetchProfilePosts.invalidate({}, { refetchPage });
    utils.post.fetchProfileReplies.invalidate({}, { refetchPage });
    utils.post.fetch.invalidate({ postId: post.id });
    // Add more in the future
    // Maybe find a better way of adding the key value
    utils.post.fetchComments.invalidate(
      {},
      {
        refetchPage: (lastPage, index, allPages) =>
          refetchPage(lastPage, index, allPages, "comments"),
      },
    );
  };

  useEffect(() => {
    setIsReposted(reposted);
    setRepostCount(repostCount);
  }, [reposted]);

  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(likeCount);
  }, [liked]);

  useEffect(() => {
    setIsBookmarked(bookmarked);
  }, [bookmarked]);

  return (
    <div className="mt-3 flex w-full justify-between">
      <PostAction
        icon={<CommentIcon className="h-5 w-5" />}
        value={commentCount}
        color={PostActionColorVariants.blue}
        imageView={imageView}
        onClick={(e) => {
          e.preventDefault();
          router.push(`/${post.user.username}/status/${post.id}`);
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
            alert("Not implemented.");
          }}
        />
      )}
      {detailed ? (
        <>
          <BookmarkAction
            className="relative"
            postId={post.id}
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
              alert("Not implemented yet.");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PostActions;
