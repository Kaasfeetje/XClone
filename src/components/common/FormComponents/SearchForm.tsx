import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import OutsideAlerter from "~/components/hooks/useOutsideAlerter";
import SearchIcon from "~/components/icons/SearchIcon";
import { api } from "~/utils/api";
import TextButton from "../Buttons/TextButton";
import HashtagResult from "~/components/headers/ExploreHeader/HashtagResult";
import UserResult from "~/components/headers/ExploreHeader/UserResult";
import SearchResult from "~/components/headers/ExploreHeader/SearchResult";
import Link from "next/link";
import CloseIcon from "~/components/icons/CloseIcon";
import { useInView } from "react-intersection-observer";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const SearchForm = ({ isOpen, setIsOpen }: Props) => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const searchAutocompleteQuery = api.search.fetchAutoComplete.useQuery(
    {
      keyword,
    },
    { enabled: false, refetchOnWindowFocus: false },
  );
  const searchHistoryQuery = api.search.fetchSearchHistory.useInfiniteQuery(
    {},
    {
      enabled: isOpen && keyword == "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const createSearchMutation = api.search.search.useMutation();
  const clearSearchHistoryMutation =
    api.search.clearSearchHistory.useMutation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (keyword != "") searchAutocompleteQuery.refetch();
    }, 500);
    return () => clearTimeout(timeout);
  }, [keyword]);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (searchHistoryQuery.hasNextPage && !searchHistoryQuery.isLoading) {
        searchHistoryQuery.fetchNextPage();
      }
    }
  }, [
    inView,
    searchHistoryQuery.hasNextPage,
    searchHistoryQuery.isLoading,
    searchHistoryQuery.fetchStatus,
  ]);

  useEffect(() => {
    if (
      router.pathname == "/explore/[keyword]" ||
      router.pathname == "/hashtag/[keyword]"
    ) {
      if (router.query) {
        setKeyword((router.query.keyword as string) || "");
      }
    }
  }, [router.pathname, router.query]);

  return (
    <OutsideAlerter onOutsideClick={() => setIsOpen(false)} className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSearchMutation.mutate({
            keyword,
          });
          router.push(`/explore/${keyword.replace("#", "%23")}`);
        }}
        onFocusCapture={() => setIsOpen(true)}
        className="group/focus  relative w-full rounded-full border border-white py-px focus-within:border-blue-500"
      >
        <div className="flex h-[42px] w-full items-center">
          <div className="min-w-8 pl-3 group-focus-within/focus:fill-blue-500">
            <SearchIcon className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="h-[42px] w-full rounded-full p-3 outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword != "" && isOpen && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              className="mx-4 flex h-[22px] w-[22px] min-w-[22px] items-center justify-center rounded-full bg-blue-500 fill-white hover:bg-blue-600"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        {isOpen && (
          <div
            className="max-height-[calc(-53px+80vh)] absolute left-0 top-[42px] min-h-[100px] w-full rounded-md border border-gray-300 bg-white
          "
          >
            {keyword == "" ? (
              <div className="h-full w-full">
                <div className="flex items-end justify-between px-4 py-3">
                  <h2 className="text-xl font-semibold">Recent</h2>
                  <TextButton
                    onClick={() => clearSearchHistoryMutation.mutate()}
                  >
                    Clear all
                  </TextButton>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {searchHistoryQuery.data?.pages.map((page) =>
                    page.searchHistory.map((history) => {
                      if (history.hashtag) {
                        return (
                          <HashtagResult
                            hashtag={history.hashtag}
                            key={history.id}
                          />
                        );
                      }
                      if (history.searchedUser) {
                        return (
                          <UserResult
                            key={history.id}
                            user={history.searchedUser}
                          />
                        );
                      }
                      if (history.text) {
                        return (
                          <SearchResult
                            key={history.id}
                            searchWord={history.text}
                          />
                        );
                      }
                    }),
                  )}
                  {searchHistoryQuery.hasNextPage && (
                    <div ref={ref}>Loading...</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full w-full">
                <Link
                  href={`/explore/${keyword.replace("#", "%23")}`}
                  onClick={() => {
                    createSearchMutation.mutate({
                      keyword,
                    });
                  }}
                >
                  <div className="p-4">Search for "{keyword}"</div>
                </Link>
                {searchAutocompleteQuery.data?.hashtags?.map((hashtag) => (
                  <HashtagResult
                    key={hashtag.hashtag}
                    hashtag={hashtag}
                    onClick={() =>
                      createSearchMutation.mutate({
                        hashtag: hashtag.hashtag,
                      })
                    }
                  />
                ))}
                {searchAutocompleteQuery.data?.users?.map((user) => (
                  <UserResult
                    key={user.id}
                    user={user}
                    onClick={() =>
                      createSearchMutation.mutate({ searchedUserId: user.id })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </form>
    </OutsideAlerter>
  );
};

export default SearchForm;
