import React, { useEffect } from "react";
import { api } from "~/utils/api";
import Post from "./Post/Post";

type Props = {};

const PostContainer = (props: Props) => {
  const posts = api.post.fetchAll.useQuery();
  
  return (
    <div>{posts.data?.map((post) => <Post key={post.id} post={post} />)}</div>
  );
};

export default PostContainer;
