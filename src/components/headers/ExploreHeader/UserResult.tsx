import { User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import Avatar from "~/components/common/Avatar";

type Props = {
  user: User;
  onClick?: () => void;
};

const UserResult = ({ user, onClick }: Props) => {
  return (
    <Link href={`/${user.username}`} onClick={onClick}>
      <div className="flex cursor-pointer items-center p-4">
        <div className="mr-2 h-10 w-10 rounded-full">
          <Avatar profileImage={user.profileImage} image={user.image} />
        </div>
        <div>
          <span className="block font-semibold ">{user.displayName}</span>
          <span className="block text-lightGrayText">@{user.username}</span>
        </div>
      </div>
    </Link>
  );
};

export default UserResult;
