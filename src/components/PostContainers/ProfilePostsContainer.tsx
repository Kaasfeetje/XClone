import React from "react";
import { api } from "~/utils/api";
import Post from "../Post/Post";

type Props = {
  username: string;
};

const ProfilePostsContainer = ({ username }: Props) => {
  const posts = api.post.fetchProfilePosts.useQuery({ username });
  if (!posts.data) {
    return <div></div>;
  }
  return (
    <div>
      {posts.data.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
};

export default ProfilePostsContainer;
