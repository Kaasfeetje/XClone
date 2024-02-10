import { Post, User } from "@prisma/client";
import React from "react";
import Avatar from "../common/Avatar";

import PostActions from "./PostActions";
import Link from "next/link";

type Props = {
  post: Post & {
    user: User;
  };
};

const Post = ({ post }: Props) => {
  return (
    <div className="flex px-4 py-3">
      <Link href={`/${post.user.username}`} className="mr-3 block">
        <Avatar profileImage={post.user.profileImage} image={post.user.image} />
      </Link>
      <div className="w-full">
        <div>
          <span>DisplayName</span>
          <span>@username</span>
          <span>*</span>
          <span>16m</span>
        </div>
        <div>{post.textContent}</div>
        <PostActions />
      </div>
    </div>
  );
};

export default Post;
