import React, { useContext, useState } from "react";
import DotsIcon from "../icons/DotsIcon";
import OutsideAlerter from "../hooks/useOutsideAlerter";
import PostOption from "./PostOption";
import SadEmojiIcon from "../icons/SadEmojiIcon";
import UnfollowIcon from "../icons/UnfollowIcon";
import AddListIcon from "../icons/AddListIcon";
import MuteIcon from "../icons/MuteIcon";
import BlockIcon from "../icons/BlockIcon";
import StatsIcon from "../icons/StatsIcon";
import EmbedIcon from "../icons/EmbedIcon";
import ReportIcon from "../icons/ReportIcon";
import { Post, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import CommentIcon from "../icons/CommentIcon";
import TrashIcon from "../icons/TrashIcon";
import EditIcon from "../icons/EditIcon";
import PinIcon from "../icons/PinIcon";
import HighlightIcon from "../icons/HighlightIcon";
import { api } from "~/utils/api";
import PinIconFilled from "../icons/PinIconFilled";
import { PostIncludeType } from "./Post";
import AddRemoveToListModal from "../Lists/AddRemoveToListModal";
import FollowedIcon from "../icons/FollowedIcon";
import { MainContext } from "../context/MainContext";

type Props = {
  post: Post & PostIncludeType;
};

const PostOptions = ({ post }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addToListIsOpen, setAddToListIsOpen] = useState(false);

  return (
    <div
      onClick={(e) => e.preventDefault()}
      className="relative -mr-2 -mt-2 ml-auto flex min-w-9 items-center"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-blue-100 hover:fill-blue-500"
      >
        <DotsIcon className="h-5 w-5" />
      </button>
      {isOpen && (
        <OutsideAlerter
          onOutsideClick={() => setIsOpen(false)}
          className="absolute right-0 top-0 z-10 w-[350px] rounded-lg border border-gray-300 bg-white fill-black"
        >
          <PostOptionsDropdown
            post={post}
            onClose={() => setIsOpen(false)}
            setAddToListIsOpen={setAddToListIsOpen}
          />
        </OutsideAlerter>
      )}
      <AddRemoveToListModal
        isOpen={addToListIsOpen}
        setIsOpen={setAddToListIsOpen}
        postUsername={post.user.username!}
        userId={post.userId}
      />
    </div>
  );
};

type DropdownType = {
  post: Post & PostIncludeType;
  onClose: () => void;
  setAddToListIsOpen: (value: boolean) => void;
};

const PostOptionsDropdown = ({
  post,
  onClose,
  setAddToListIsOpen,
}: DropdownType) => {
  // Own post mutations
  const deletePostMutation = api.post.delete.useMutation();
  const pinPostMutation = api.user.pinPost.useMutation();
  const unPinPostMutation = api.user.unPinPost.useMutation();
  const highlightMutation = api.post.highlight.useMutation();

  // Other posts mutations
  const [following, setFollowing] = useState(post.user.followers.length == 1);
  const followMutation = api.user.follow.useMutation({
    onSuccess(data) {
      if (data != following) setFollowing(data);
    },
  });

  const { data: session } = useSession();

  const onFollow = () => {
    if (followMutation.isLoading) return;
    followMutation.mutate({ id: post.userId });
    setFollowing(!following);
  };

  if (post.userId == session?.user.id) {
    return (
      <>
        <PostOption
          icon={<TrashIcon className="h-5 w-5" />}
          text="Delete"
          onClick={() => {
            deletePostMutation.mutate({ postId: post.id });
            onClose();
          }}
          danger
        />
        <PostOption
          icon={<EditIcon className="h-5 w-5" />}
          text="Edit"
          onClick={() => alert("Not implemented yet.")}
        />
        {/* Pin */}
        {post.pinnedUserId == session.user.id ? (
          <PostOption
            icon={<PinIconFilled className="h-5 w-5" />}
            text="Unpin from your profile"
            onClick={() => {
              unPinPostMutation.mutate({ postId: post.id });
              onClose();
            }}
          />
        ) : (
          <PostOption
            icon={<PinIcon className="h-5 w-5" />}
            text="Pin to your profile"
            onClick={() => {
              pinPostMutation.mutate({ postId: post.id });
              onClose();
            }}
          />
        )}
        {/* Highlight */}
        {post.highlight?.postId == post.id ? (
          <PostOption
            icon={<HighlightIcon className="h-5 w-5" />}
            text="Remove highlight from your profile"
            onClick={() => {
              highlightMutation.mutate({ postId: post.id });
              onClose();
            }}
          />
        ) : (
          <PostOption
            icon={<HighlightIcon className="h-5 w-5" />}
            text="Highlight on your profile"
            onClick={() => {
              highlightMutation.mutate({ postId: post.id });
              onClose();
            }}
          />
        )}

        <PostOption
          icon={<AddListIcon className="h-5 w-5" />}
          text={`Add/remove @${post.user.username}`}
          onClick={() => setAddToListIsOpen(true)}
        />
        <PostOption
          icon={<CommentIcon className="h-5 w-5" />}
          text="Change who can reply"
          onClick={() => alert("Not implemented yet.")}
        />
        <PostOption
          icon={<StatsIcon className="h-5 w-5" />}
          text="View post engagements"
          onClick={() => alert("Not implemented yet.")}
        />
        <PostOption
          icon={<EmbedIcon className="h-5 w-5" />}
          text="Embed post"
          onClick={() => alert("Not implemented yet.")}
        />
        <PostOption
          icon={<StatsIcon className="h-5 w-5" />}
          text="View post analytics"
          onClick={() => alert("Not implemented yet.")}
        />
      </>
    );
  }

  return (
    <>
      <PostOption
        icon={<SadEmojiIcon className="h-5 w-5" />}
        text="Not interested in this post"
        onClick={() => alert("Not implemented.")}
      />
      {following ? (
        <PostOption
          icon={<UnfollowIcon className="h-5 w-5" />}
          text={`Unfollow @${post.user.username}`}
          onClick={onFollow}
        />
      ) : (
        <PostOption
          icon={<FollowedIcon className="h-5 w-5" />}
          text={`Follow @${post.user.username}`}
          onClick={onFollow}
        />
      )}
      <PostOption
        icon={<AddListIcon className="h-5 w-5" />}
        text={`Add/remove @${post.user.username}`}
        onClick={() => setAddToListIsOpen(true)}
      />
      <PostOption
        icon={<MuteIcon className="h-5 w-5" />}
        text={`Mute @${post.user.username}`}
        onClick={() => alert("Not implemented yet.")}
      />
      <PostOption
        icon={<BlockIcon className="h-5 w-5" />}
        text={`Block @${post.user.username}`}
        onClick={() => alert("Not implemented yet.")}
      />
      <PostOption
        icon={<StatsIcon className="h-5 w-5" />}
        text={`View post engagements`}
        onClick={() => alert("Not implemented yet.")}
      />
      <PostOption
        icon={<EmbedIcon className="h-5 w-5" />}
        text={`Embed post`}
        onClick={() => alert("Not implemented yet.")}
      />
      <PostOption
        icon={<ReportIcon className="h-5 w-5" />}
        text={`Report post`}
        onClick={() => alert("Not implemented yet.")}
      />
      <PostOption
        icon={<ReportIcon className="h-5 w-5" />}
        text={`Report EU illegal content`}
        onClick={() => alert("Not implemented yet.")}
      />
    </>
  );
};

export default PostOptions;
