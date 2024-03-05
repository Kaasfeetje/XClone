import React, { useEffect, useState } from "react";
import { env } from "~/env";
import LockIcon from "../icons/LockIcon";
import Link from "next/link";
import Avatar from "../common/Avatar";
import { List, User } from "@prisma/client";
import Modal from "../common/Modal";
import ListForm from "./ListForm";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

type Props = {
  list?: List & {
    user: User;
    _count: {
      followers: number;
      listMembers: number;
    };
  };
};

const DetailedList = ({ list }: Props) => {
  const router = useRouter();
  const updateListMutation = api.list.update.useMutation();
  const deleteListMutation = api.list.delete.useMutation();
  const [editListModalIsOpen, setEditListModalIsOpen] = useState(false);

  useEffect(() => {
    if (deleteListMutation.isSuccess) {
      router.push(`/`);
    }
  }, [deleteListMutation.isSuccess]);

  if (!list) {
    return <div>Loading...</div>;
  }

  const handleEditList = ({
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
    updateListMutation.mutate({
      listId: list.id,
      name,
      bio,
      isPrivate,
      bannerImageId,
    });

    setEditListModalIsOpen(false);
  };

  return (
    <div>
      <Modal
        centered
        isOpen={editListModalIsOpen}
        onClose={() => setEditListModalIsOpen(false)}
      >
        <ListForm
          headerText="Edit List"
          saveText="Done"
          list={list}
          onSubmit={handleEditList}
          onCancel={() => setEditListModalIsOpen(false)}
          onDelete={() => deleteListMutation.mutate({ listId: list.id })}
        />
      </Modal>
      <div className="aspect-[3/1] w-full bg-gray-300">
        <img
          className="h-full w-full"
          src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${list.bannerImageId}`}
        />
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
          <div className="mr-5 cursor-pointer text-sm hover:underline">
            <span className="text-bold">{list._count.listMembers}</span>
            <span className="text-lightGrayText">{` Members`}</span>
          </div>
          <div className="cursor-pointer hover:underline">
            <span className="text-bold">{list._count.followers}</span>
            <span className="text-lightGrayText">{` Followers`}</span>
          </div>
        </div>
        <div className="mb-3 mt-5">
          <button
            onClick={() => setEditListModalIsOpen(true)}
            className="h-9 rounded-full border border-gray-300 px-4 font-semibold duration-200 hover:bg-gray-200"
          >
            Edit List
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedList;
