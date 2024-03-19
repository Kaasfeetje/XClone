import React, { useEffect, useState } from "react";
import PostAction, { PostActionColorVariants } from "./PostAction";
import BookmarkIcon from "../icons/BookmarkIcon";
import OutsideAlerter from "../hooks/useOutsideAlerter";
import { api } from "~/utils/api";
import PlusIcon from "../icons/PlusIcon";
import { BookmarkList } from "@prisma/client";
import BookmarkIconFilled from "../icons/BookmarkIconFilled";
import PrimaryButton from "../common/Buttons/PrimaryButton";

type Props = {
  imageView?: boolean;
  className?: string;
  postId: string;
  onBookmark: (bookmark: {
    listId: string | undefined;
    postId: string;
  }) => void;
  onDeleteBookmark: (postId: string) => void;
  active: boolean;
};

const BookmarkAction = ({
  imageView,
  className,
  postId,
  onBookmark,
  onDeleteBookmark,
  active,
}: Props) => {
  const utils = api.useUtils();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const [selectedList, setSelectedList] = useState("");
  const [lists, setLists] = useState<(BookmarkList | { name: string })[]>([]);

  const fetchBookmarkLists = api.bookmark.fetchBookmarkLists.useQuery(
    undefined,
    { enabled: isOpen },
  );
  const createBookmarkListMutation =
    api.bookmark.createBookmarkList.useMutation({
      onMutate(value) {
        setLists([...lists, { name: value.name }]);
        setSelectedList(value.name);
      },
      onSuccess() {
        utils.bookmark.fetchBookmarkLists.invalidate();
      },
    });

  useEffect(() => {
    if (fetchBookmarkLists.data) {
      setLists(fetchBookmarkLists.data);
      setSelectedList(fetchBookmarkLists.data[0]?.name || "");
    }
  }, [fetchBookmarkLists.data]);

  const onCreateList = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (name == "") return;
    createBookmarkListMutation.mutate({ name });
    setName("");
  };

  const onCreate = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!fetchBookmarkLists.data) return;
    const list = fetchBookmarkLists.data.filter(
      (val) => val.name == selectedList,
    )[0];
    onBookmark({ postId, listId: list ? list.id : undefined });
  };

  return (
    <div
      className={`${className ? className : ""}`}
      onClick={(e) => e.preventDefault()}
    >
      <PostAction
        imageView={imageView}
        icon={
          <BookmarkIcon
            className={`h-5 w-5 ${isOpen ? "fill-blue-500" : ""}`}
          />
        }
        activeIcon={<BookmarkIconFilled className="h-5 w-5" />}
        color={PostActionColorVariants.blue}
        onClick={(e) => {
          if (active) {
            onDeleteBookmark(postId);
          } else {
            setIsOpen(true);
          }
        }}
        active={active}
      />
      {isOpen && (
        <OutsideAlerter onOutsideClick={() => setIsOpen(false)}>
          <div className="absolute right-0 top-8 z-10 w-[200px] cursor-default rounded-md border border-gray-300 bg-white px-4 py-3">
            <form onSubmit={onCreateList}>
              <div className="relative flex items-center">
                <input
                  className="w-full border border-gray-300 py-1 pl-1 pr-6"
                  placeholder="New list"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  className="absolute right-1"
                  type="submit"
                  onClick={(e) => onCreateList()}
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
            <form onSubmit={(e) => onCreate(e)} className="mt-3">
              <select
                className="w-full border border-gray-300 "
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
              >
                {lists.map((list) => (
                  <option value={list.name} key={list.name}>
                    {list.name}
                  </option>
                ))}
              </select>
              <PrimaryButton
                className="w-full"
                type="submit"
                onClick={() => {
                  setIsOpen(false);
                  onCreate();
                }}
              >
                Bookmark
              </PrimaryButton>
            </form>
          </div>
        </OutsideAlerter>
      )}
    </div>
  );
};

export default BookmarkAction;
