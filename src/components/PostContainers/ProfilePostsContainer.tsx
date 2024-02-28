import React from "react";
import { api } from "~/utils/api";
import Post, { PostIncludeType } from "../Post/Post";
import { Post as PostType } from "@prisma/client";
import PinIconFilled from "../icons/PinIconFilled";

type Props = {
  pinnedPost?: PostType & PostIncludeType;
  username: string;
};

const ProfilePostsContainer = ({ pinnedPost, username }: Props) => {
  const posts = api.post.fetchProfilePosts.useQuery({ username });
  if (!posts.data) {
    return <div></div>;
  }
  return (
    <div>
      {pinnedPost && (
        <div>
          <div className="-mb-3 flex items-center fill-lightGrayText px-4 text-13px font-semibold text-lightGrayText">
            <div className="mr-2 flex w-10 justify-end">
              <PinIconFilled className="h-4 w-4" />
            </div>
            <div>Pinned</div>
          </div>
          <Post post={pinnedPost} />
        </div>
      )}
      {posts.data.map(
        (post) => post.id != pinnedPost?.id && <Post post={post} />,
      )}
    </div>
  );
};

export default ProfilePostsContainer;
