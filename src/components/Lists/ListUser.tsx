import { User } from "@prisma/client";
import React from "react";
import Avatar from "../common/Avatar";
import Link from "next/link";

type Props = {
  user: User;
  children?: React.ReactNode;
};

const ListUser = ({ user, children }: Props) => {
  return (
    <div className="flex px-4 py-3">
      <div className="mr-2 h-10 w-10 min-w-10">
        <Avatar profileImage={user.profileImageId} image={user.image} />
      </div>
      <div className="w-full">
        <div className="flex w-full items-end justify-between">
          <Link href={`/${user.username}`}>
            <div className="font-semibold hover:underline">
              {user.displayName}
            </div>
            <div className="-mt-1 text-lightGrayText">{`@${user.username}`}</div>
          </Link>
          {children}
        </div>
        <p className="mt-1">{user.bio}</p>
      </div>
    </div>
  );
};

export default ListUser;
