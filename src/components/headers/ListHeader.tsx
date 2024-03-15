import React from "react";
import LeftArrowIcon from "../icons/LeftArrow";
import LockIcon from "../icons/LockIcon";
import ShareIcon from "../icons/ShareIcon";
import DotsIcon from "../icons/DotsIcon";
import { useRouter } from "next/router";
import { List, User } from "@prisma/client";

type Props = {
  list?: List & {
    user: User;
    _count: {
      followers: number;
      listMembers: number;
    };
  };
};

const ListHeader = ({ list }: Props) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 flex h-[53px] items-center justify-between bg-white px-4">
      <div className="w-14 min-w-14">
        <button
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full hover:bg-gray-200"
          onClick={() => router.back()}
        >
          <LeftArrowIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="w-full">
        <div className="flex items-center">
          <span className="text-xl font-semibold">{`${list?.name}`}</span>
          {list?.visibility == "PRIVATE" && <LockIcon className="h-5 w-5" />}
        </div>
        <div className="-mt-1 text-13px text-lightGrayText">{`@${list?.user.username}`}</div>
      </div>
      <div className="flex">
        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-full hover:bg-gray-200">
          <ShareIcon className="h-5 w-5" />
        </button>
        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-full hover:bg-gray-200">
          <DotsIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ListHeader;
