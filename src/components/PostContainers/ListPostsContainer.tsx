import React from "react";
import { api } from "~/utils/api";
import Post from "../Post/Post";

type Props = {
  listId: string;
};

const ListPostsContainer = ({ listId }: Props) => {
  const posts = api.post.fetchListPosts.useQuery({ listId });
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

export default ListPostsContainer;
