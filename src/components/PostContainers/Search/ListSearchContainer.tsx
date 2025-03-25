import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import List from "~/components/Lists/List";
import { api } from "~/utils/api";

type Props = {
  keyword: string;
};

const ListSearchContainer = ({ keyword }: Props) => {
  const router = useRouter();
  const lists = api.search.fetchSearchList.useInfiniteQuery(
    { keyword },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      if (lists.hasNextPage && !lists.isLoading) {
        void lists.fetchNextPage();
      }
    }
  }, [inView, lists.hasNextPage, lists.isLoading, lists.fetchStatus]);
  if (!lists.data) {
    return <div></div>;
  }
  return (
    <div>
      {lists.data.pages.map((page) =>
        page.lists.map((list) => (
          <List
            key={list.id}
            onClick={() => router.push(`/lists/${list.id}`)}
            list={list}
          />
        )),
      )}
      {lists.hasNextPage && <div ref={ref}>Loading...</div>}
    </div>
  );
};

export default ListSearchContainer;
