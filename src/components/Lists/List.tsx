import React from "react";
import Avatar from "../common/Avatar";
import PinIcon from "../icons/PinIcon";
import { List, User } from "@prisma/client";
import { env } from "~/env";
import LockIcon from "../icons/LockIcon";
import Link from "next/link";

type Props = {
  list: List & {
    user: User;
    _count: {
      followers: number;
      listMembers: number;
    };
  };
};

const List = ({ list }: Props) => {
  return (
    <Link
      href={`/lists/${list.id}`}
      className="flex items-center p-4 text-13px text-lightGrayText"
    >
      <div className="mr-4 h-12 min-h-12 w-12 min-w-12 overflow-hidden rounded-lg ">
        <img
          src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${list.bannerImageId}`}
          className="h-full w-full"
        />
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
      <div
        onClick={(e) => e.preventDefault()}
        className="flex min-h-[34px] min-w-[34px] items-center justify-center rounded-full fill-blue-500 duration-200 hover:bg-blue-100"
      >
        <PinIcon className="h-5 w-5" />
      </div>
    </Link>
  );
};

export default List;
