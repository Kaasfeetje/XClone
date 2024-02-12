import React from "react";
import Avatar from "../common/Avatar";
import { User } from "@prisma/client";
import Tabs from "../common/Tabs";

type Props = {
  profile: User;
};

const Profile = ({ profile }: Props) => {
  return (
    <div>
      <div className="aspect-[3/1] w-full bg-gray-300"></div>
      <div className="px-4 pt-3">
        <div className=" flex justify-between">
          <div className="relative -mt-[15%] mb-3 aspect-square h-auto w-1/4 min-w-12 rounded-full bg-white">
            <div className="absolute h-full w-full p-1">
              <Avatar
                profileImage={profile.profileImage}
                image={profile.image}
              />
            </div>
          </div>
          <button className="h-9 rounded-full border border-gray-300 bg-white px-4 font-semibold text-grayText">
            Edit profile
          </button>
        </div>
        <div className="mb-3 flex flex-col">
          <span className="text-xl font-bold text-grayText">
            {profile.displayName}
          </span>
          <span className="-mt-1 text-lightGrayText ">@{profile.username}</span>
        </div>
        <p className="mb-3">Description</p>
        <div className="mb-3 text-lightGrayText">other data</div>
        <div className="mb-3 flex text-sm text-grayText">
          <div className="mr-5">
            <span className="font-semibold text-grayText">{0}</span> Following
          </div>
          <div>
            <span className="font-semibold text-grayText">{0}</span> Followers
          </div>
        </div>
        <Tabs
          options={["Posts", "Replies", "Highlights", "Media", "Likes"]}
        ></Tabs>
      </div>
    </div>
  );
};

export default Profile;
