import React, { useContext } from "react";
import PlusIcon from "../icons/PlusIcon";
import Link from "next/link";
import Avatar from "../common/Avatar";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { MainContext } from "../context/MainContext";

type Props = {};

const MobileAccountHeader = (props: Props) => {
  const { data: session } = useSession();
  const fetchProfileQuery = api.user.fetchProfile.useQuery(
    { username: session?.user.username as string },
    { enabled: session?.user.username !== "" },
  );
  const { setMobileMenuIsOpen } = useContext(MainContext);

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <Link
          href={`/${session?.user.username}`}
          onClick={() => setMobileMenuIsOpen(false)}
        >
          <div className="h-10 w-10 rounded-full bg-black">
            <Avatar
              profileImage={session?.user.profileImageId}
              image={session?.user.image}
            />
          </div>
        </Link>
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-gray-300">
          <PlusIcon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <Link
        href={`/${session?.user.username}`}
        className="mt-2 block"
        onClick={() => setMobileMenuIsOpen(false)}
      >
        <span className="block text-17px font-bold text-grayText">
          {session?.user.displayName}
        </span>
        <span className="-mt-1 block text-lightGrayText">
          @{session?.user.username}
        </span>
      </Link>
      <div className="mt-3 text-sm">
        <Link
          href={`/${session?.user.username}/following`}
          className="mr-5 active:underline"
          onClick={() => setMobileMenuIsOpen(false)}
        >
          <span className="font-semibold text-grayText">
            {fetchProfileQuery.data?._count.following}
          </span>
          <span className="text-lightGrayText"> Following</span>
        </Link>
        <Link
          href={`/${session?.user.username}/followers`}
          className="active:underline"
          onClick={() => setMobileMenuIsOpen(false)}
        >
          <span className="font-semibold text-grayText">
            {fetchProfileQuery.data?._count.followers}
          </span>
          <span className="text-lightGrayText"> Followers</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileAccountHeader;
