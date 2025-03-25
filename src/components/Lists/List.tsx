import React from "react";
import Avatar from "../common/Avatar";
import PinIcon from "../icons/PinIcon";
import { List, User } from "@prisma/client";
import { env } from "~/env";
import LockIcon from "../icons/LockIcon";
import Link from "next/link";
import ImageIcon from "../icons/ImageIcon";

type Props = {
  list: List & {
    user: User;
    _count: {
      followers: number;
      listMembers: number;
    };
  };
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const List = ({ list, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="flex w-full cursor-pointer items-center p-4 text-13px text-lightGrayText"
    >
      <div className="mr-4 h-12 min-h-12 w-12 min-w-12 overflow-hidden rounded-lg bg-blue-500">
        {list.bannerImageId ? (
          <img
            src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${list.bannerImageId}`}
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center fill-white">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="w-full">
        <div className="flex items-center">
          <span className="text-normal font-bold text-black">{list.name}</span>
          {list.visibility == "PRIVATE" && (
            <div className="ml-1">
              <LockIcon className="h-5 w-5" />
            </div>
          )}
          <span className="mx-1">·</span>
          <span>{`${list._count.listMembers} members`}</span>
        </div>
        <Link
          href={`/${list.user.username}`}
          className="flex w-fit items-center"
        >
          <div className="h-4 w-4">
            <Avatar
              profileImage={list.user.profileImageId}
              image={list.user.image}
            />
          </div>
          <span className="mx-1 font-semibold text-black hover:underline">
            {list.user.displayName}
          </span>
          <span>{`@${list.user.username}`}</span>
        </Link>
      </div>
    </div>
  );
};

export default List;
