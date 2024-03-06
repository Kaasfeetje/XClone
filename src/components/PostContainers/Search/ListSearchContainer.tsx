import { useRouter } from "next/router";
import React from "react";
import List from "~/components/Lists/List";
import Post from "~/components/Post/Post";
import { api } from "~/utils/api";

type Props = {
  keyword: string;
};

const ListSearchContainer = ({ keyword }: Props) => {
  const router = useRouter();
  const lists = api.search.fetchSearchList.useQuery({ keyword });
  if (!lists.data) {
    return <div></div>;
  }
  return (
    <div>
      {lists.data.map((list) => (
        <List onClick={() => router.push(`/lists/${list.id}`)} list={list} />
      ))}
    </div>
  );
};

export default ListSearchContainer;
