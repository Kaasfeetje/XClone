import React from "react";
import Post from "~/components/Post/Post";
import { api } from "~/utils/api";

type Props = {
  keyword: string;
};

const LatestSearchContainer = ({ keyword }: Props) => {
  //   const posts = api.search.fetchListPosts.useQuery({ keyword });
  const posts = api.search.fetchSearchLatest.useQuery({ keyword });
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

export default LatestSearchContainer;
