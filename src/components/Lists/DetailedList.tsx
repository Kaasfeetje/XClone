import React, { useEffect, useState } from "react";
import { env } from "~/env";
import LockIcon from "../icons/LockIcon";
import Link from "next/link";
import Avatar from "../common/Avatar";
import { List, ListFollow, User } from "@prisma/client";
import EditFormModal from "./EditFormModal";
import ListMembersModal from "./ListMembersModal";
import { useSession } from "next-auth/react";
import BlackButton from "../common/Buttons/BlackButton";
import { api } from "~/utils/api";
import ListFollowersModal from "./ListFollowersModal";

type Props = {
  list?: List & {
    user: User;
    followers: ListFollow[];
    _count: {
      followers: number;
      listMembers: number;
    };
  };
};

const DetailedList = ({ list }: Props) => {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const [followed, setFollowed] = useState(false);

  const followListMutation = api.list.followList.useMutation({
    onMutate() {
      setFollowed((val) => !val);
    },
    onSuccess() {
      utils.list.fetch.invalidate({ listId: list?.id });
    },
  });

  const [editListModalIsOpen, setEditListModalIsOpen] = useState(false);
  const [listMembersModalIsOpen, setListMembersModalIsOpen] = useState(false);
  const [listFollowersModalIsOpen, setListFollowersModalIsOpen] =
    useState(false);

  useEffect(() => {
    if (list && list.followers.length != 0) {
      setFollowed(true);
    }
  }, [list]);

  if (!list) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <EditFormModal
        list={list}
        editListModalIsOpen={editListModalIsOpen}
        setEditListModalIsOpen={setEditListModalIsOpen}
      />
      <ListMembersModal
        listId={list.id}
        isOpen={listMembersModalIsOpen}
        setIsOpen={setListMembersModalIsOpen}
      />
      <ListFollowersModal
        listId={list.id}
        isOpen={listFollowersModalIsOpen}
        setIsOpen={setListFollowersModalIsOpen}
      />
      <div className="aspect-[3/1] w-full bg-gray-300">
        {list.bannerImageId && (
          <img
            className="h-full w-full"
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${list.bannerImageId}`}
          />
        )}
      </div>
      <div className="flex flex-col items-center p-3">
        <div className="mb-3 flex items-center">
          <h1 className=" text-xl font-semibold">{list.name}</h1>
          {list.visibility == "PRIVATE" && (
            <LockIcon className="ml-1 h-5 w-5" />
          )}
        </div>
        <p className="mb-3">{list.bio}</p>
        <Link href={`/${list.user.username}`}>
          <div className="mb-3 flex items-center">
            <div className="h-6 w-6">
              <Avatar
                profileImage={list.user.profileImageId}
                image={list.user.image}
              />
            </div>
            <span className="mx-1 font-semibold hover:underline">
              {list.user.displayName}
            </span>
            <span className="text-lightGrayText">{`@${list.user.username}`}</span>
          </div>
        </Link>
        <div className="flex">
          <div
            onClick={() => setListMembersModalIsOpen(true)}
            className="mr-5 cursor-pointer text-sm hover:underline"
          >
            <span className="text-bold">{list._count.listMembers}</span>
            <span className="text-lightGrayText">{` Members`}</span>
          </div>
          <div
            onClick={() => setListFollowersModalIsOpen(true)}
            className="cursor-pointer hover:underline"
          >
            <span className="text-bold">{list._count.followers}</span>
            <span className="text-lightGrayText">{` Followers`}</span>
          </div>
        </div>
        <div className="mb-3 mt-5">
          {list.userId == session?.user.id && (
            <button
              onClick={() => setEditListModalIsOpen(true)}
              className="h-9 rounded-full border border-gray-300 px-4 font-semibold duration-200 hover:bg-gray-200"
            >
              Edit List
            </button>
          )}
          {list.userId != session?.user.id && (
            <>
              {followed ? (
                <button
                  onClick={() => followListMutation.mutate({ listId: list.id })}
                  className="h-9 rounded-full border border-gray-300 px-4 font-semibold duration-200 hover:bg-gray-200"
                >
                  Unfollow
                </button>
              ) : (
                <BlackButton
                  onClick={() => followListMutation.mutate({ listId: list.id })}
                >
                  Follow
                </BlackButton>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedList;
