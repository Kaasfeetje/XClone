import React, { useContext } from "react";
import MobileActions from "../MobileActions";
import { MainContext } from "../context/MainContext";
import Modal from "./Modal";
import CloseIcon from "../icons/CloseIcon";
import TextButton from "./Buttons/TextButton";
import PostForm from "../Post/PostForm/PostForm";
import LeftArrowIcon from "../icons/LeftArrow";
import DetailedPostForm from "../Post/PostForm/DetailedPostForm";
import { useRouter } from "next/router";
import Post from "../Post/Post";
import { api } from "~/utils/api";

type Props = {
  menu: React.ReactNode;
  main: React.ReactNode;
  sidebar: React.ReactNode;
};

const Layout = ({ menu, main, sidebar }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const { createPostModalIsOpen, setCreatePostModalIsOpen } =
    useContext(MainContext);

  const fetchPost = api.post.fetch.useQuery(
    { postId: id as string },
    { enabled: router.pathname == "/[username]/status/[id]" && id != "" },
  );
  return (
    <div className="w-full text-normal lg:flex lg:justify-center">
      <div className="pointer-events-none fixed top-0 z-50 w-full max-w-[1310px]">
        {menu}
      </div>
      <main className="pointer-events-none relative z-0 flex w-full  justify-end lg:ml-[80px] lg:max-w-[1310px]">
        <MobileActions />
        <div className="flex w-full md:w-[920px] md:justify-between  lg:w-[1050px]">
          <div className="pointer-events-auto h-full w-full md:w-[600px]">
            {main}
          </div>
          <div className="pointer-events-auto hidden md:block md:w-[290px] lg:ml-[25px] lg:mr-[75px] lg:w-[350px]">
            {sidebar}
          </div>
        </div>

        <Modal
          isOpen={createPostModalIsOpen}
          onClose={() => setCreatePostModalIsOpen(false)}
          centered
        >
          <div className="z-10 h-full w-full overflow-y-auto  bg-white md:h-fit md:max-h-[calc(80%-53px)] md:w-[650px] md:overflow-y-auto md:rounded-2xl">
            <div className="sticky top-0 z-20 flex h-[53px] items-center justify-between rounded-2xl bg-white px-4">
              <div
                onClick={() => setCreatePostModalIsOpen(false)}
                className="-ml-2 flex h-[34px] w-[34px] items-center justify-center rounded-full hover:bg-gray-200"
              >
                <CloseIcon className="hidden h-5 w-5 md:block" />
                <LeftArrowIcon className="block h-5 w-5 md:hidden" />
              </div>
              <TextButton>Drafts</TextButton>
            </div>
            {fetchPost.data && <Post post={fetchPost.data} replying />}
            <div className="px-4 py-2">
              {createPostModalIsOpen && (
                <DetailedPostForm
                  replyTo={fetchPost.data ? fetchPost.data : undefined}
                  onPost={() => setCreatePostModalIsOpen(false)}
                />
              )}
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default Layout;
