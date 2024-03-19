import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import List from "~/components/Lists/List";
import ListForm from "~/components/Lists/ListForm";
import Menu from "~/components/Menu/Menu";
import Layout from "~/components/common/Layout";
import Modal from "~/components/common/Modal";
import { MainContext } from "~/components/context/MainContext";
import ListsHeader from "~/components/headers/ListsHeader/ListsHeader";
import PinIcon from "~/components/icons/PinIcon";
import PinIconFilled from "~/components/icons/PinIconFilled";
import { api } from "~/utils/api";
type Props = {};

const ListsPage = (props: Props) => {
  const router = useRouter();
  const { username } = router.query;
  const { createListModalIsOpen, setCreateListModalIsOpen } =
    useContext(MainContext);

  const utils = api.useUtils();
  const createListMutation = api.list.create.useMutation();
  const fetchUserLists = api.list.fetchUserLists.useQuery(
    { username: username as string },
    { enabled: username != undefined },
  );
  const pinListMutation = api.list.pinList.useMutation({
    onSuccess(data, variables, context) {
      utils.list.fetchUserLists.invalidate();
    },
  });

  const handleCreateList = ({
    name,
    bio,
    isPrivate,
    bannerImageId,
  }: {
    name: string;
    bio?: string;
    isPrivate?: boolean;
    bannerImageId?: string;
  }) => {
    createListMutation.mutate({
      name,
      bio,
      isPrivate,
      bannerImageId,
    });

    setCreateListModalIsOpen(false);
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        menu={<Menu />}
        main={
          <div className="h-full">
            <Modal
              isOpen={createListModalIsOpen}
              onClose={() => setCreateListModalIsOpen(false)}
              centered
            >
              <ListForm
                headerText="Create a new List"
                saveText="Save"
                onSubmit={handleCreateList}
                onCancel={() => setCreateListModalIsOpen(false)}
                onDelete={() => {}}
              />
            </Modal>
            <ListsHeader />
            <div className="px-4 py-3">
              <h2 className="text-xl font-bold">Pinned Lists</h2>
              <div className="">
                {fetchUserLists.data?.filter((list) => list.isPinned).length ==
                0 ? (
                  <span className="block p-8">
                    Nothing to see here yet - pin your favorite Lists to access
                    them quickly.
                  </span>
                ) : (
                  fetchUserLists.data
                    ?.filter((list) => list.isPinned)
                    .map((list) => (
                      <div className="flex items-center justify-between">
                        <List
                          key={list.id}
                          list={list}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/lists/${list.id}`);
                          }}
                        />
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            pinListMutation.mutate({ listId: list.id });
                          }}
                          className="flex min-h-[34px] min-w-[34px] items-center justify-center rounded-full fill-blue-500 duration-200 hover:bg-blue-100"
                        >
                          {list.isPinned ? (
                            <PinIconFilled className="h-5 w-5" />
                          ) : (
                            <PinIcon className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
            <div className="px-4">
              <h2 className="text-xl font-bold">Discover new Lists</h2>
              <div className="py-4">Recommend 3 lists</div>
            </div>
            <div className="px-4">
              <h2 className="text-xl font-bold">Your lists</h2>
              <div className="py-4">
                {fetchUserLists.data?.map((list) => (
                  <div className="flex items-center justify-between">
                    <List
                      key={list.id}
                      list={list}
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/lists/${list.id}`);
                      }}
                    />
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        pinListMutation.mutate({ listId: list.id });
                      }}
                      className="flex min-h-[34px] min-w-[34px] items-center justify-center rounded-full fill-blue-500 duration-200 hover:bg-blue-100"
                    >
                      {list.isPinned ? (
                        <PinIconFilled className="h-5 w-5" />
                      ) : (
                        <PinIcon className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        sidebar={
          <div>
            <div className="h-screen w-full">Recommended</div>
            <div className="sticky top-0 h-screen w-full bg-blue-200">
              TRENDS
            </div>
          </div>
        }
      />
    </>
  );
};

export default ListsPage;
