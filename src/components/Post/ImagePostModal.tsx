import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import CloseIcon from "../icons/CloseIcon";
import AngleDownIcon from "../icons/AngleDownIcon";
import { api } from "~/utils/api";
import Post from "./Post";
import { env } from "~/env";
import PostActions from "./PostActions";
import LeftArrowIcon from "../icons/LeftArrow";
import CommentForm from "../common/CommentForm";
import { useInView } from "react-intersection-observer";

type Props = {
  postId: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  index: number;
  setIndex: (value: number) => void;
  imageCount: number;
};

const ImagePostModal = ({
  postId,
  isOpen,
  setIsOpen,
  index,
  setIndex,
  imageCount,
}: Props) => {
  const post = api.post.fetch.useQuery(
    { postId },
    { enabled: postId != undefined && isOpen },
  );
  const comments = api.post.fetchComments.useInfiniteQuery(
    { postId },
    {
      enabled: postId != undefined && isOpen,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (comments.hasNextPage && !comments.isLoading) {
        void comments.fetchNextPage();
      }
    }
  }, [inView, comments.hasNextPage, comments.isLoading, comments.fetchStatus]);

  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} centered>
      <div
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(false);
        }}
        className=" z-10 flex h-full w-full justify-between"
      >
        <div className="relative w-full">
          <div
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-none absolute top-0 z-10 flex w-full items-center justify-between p-3"
          >
            <div
              className="pointer-events-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black fill-white hover:bg-gray-900"
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon className="h-5 w-5" />
            </div>
            <div
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              className={`hidden md:flex ${sidebarIsOpen ? "" : "rotate-180"} pointer-events-auto relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black fill-white hover:bg-gray-900`}
            >
              <AngleDownIcon className="absolute h-5 w-5 -rotate-90" />
              <AngleDownIcon className="absolute ml-3 h-5 w-5 -rotate-90" />
            </div>
          </div>
          <div className="relative flex h-full w-full flex-col items-center justify-end">
            {post.data && post.data.images.length > 0 && (
              <div className="flex h-full items-center">
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="max-h-full max-w-full select-none object-contain "
                  src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${post.data.images[index]?.id}`}
                />
              </div>
            )}
            <div className="pointer-events-none absolute top-1/2 flex w-full -translate-y-[calc(50%+24px)] items-center justify-between px-4">
              {index == 0 ? (
                <div></div>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(index - 1);
                  }}
                  className="pointer-events-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-85 fill-white hover:bg-opacity-70"
                >
                  <LeftArrowIcon className="h-5 w-5" />
                </div>
              )}
              {index != imageCount - 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(index + 1);
                  }}
                  className="pointer-events-auto flex h-9 w-9 rotate-180 cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-85 fill-white hover:bg-opacity-70"
                >
                  <LeftArrowIcon className="h-5 w-5" />
                </div>
              )}
            </div>

            {post.data && (
              <div
                className={`z-10 h-12 min-h-12 w-full px-8 md:w-[600px] `}
                onClick={(e) => e.stopPropagation()}
              >
                <PostActions
                  imageView={true}
                  post={post.data}
                  liked={post.data.likes.length > 0}
                  likeCount={post.data._count.likes}
                  reposted={post.data.reposts.length > 0}
                  repostCount={post.data._count.reposts}
                  bookmarked={post.data.bookmarks.length > 0}
                  commentCount={post.data._count.comments}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`hidden h-full w-[400px] min-w-[400px] bg-white duration-200 md:flex md:flex-col ${sidebarIsOpen ? "" : "-mr-[400px]"}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {post.data && (
            <>
              <Post post={post.data} imageView={true} />
              <div className="px-4">
                <CommentForm comment={post.data} />
              </div>
            </>
          )}
          {comments.data?.pages.map((page, idx) => (
            <div key={page.comments[0]?.id}>
              {page.comments.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          ))}
          {comments.hasNextPage && <div ref={ref}>Loading...</div>}
        </div>
      </div>
    </Modal>
  );
};

export default ImagePostModal;
