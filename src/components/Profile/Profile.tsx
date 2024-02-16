import React, { useContext, useState } from "react";
import Avatar from "../common/Avatar";
import { User } from "@prisma/client";
import Tabs from "../common/Tabs";
import { MainContext, ProfilePageTabs } from "../context/MainContext";
import Modal from "../common/Modal";
import CloseIcon from "../icons/CloseIcon";
import CameraIcon from "../icons/CameraIcon";
import TextInput from "../common/FormComponents/TextInput";
import TextAreaInput from "../common/FormComponents/TextAreaInput";
import EditProfileForm from "./EditProfileForm";
import LocationIcon from "../icons/LocationIcon";
import LinkIcon from "../icons/LinkIcon";
import CalendarIcon from "../icons/ScheduleIcon";
import ProfileDataPoint from "./ProfileDataPoint";
import { months } from "../common/data/months";
import Link from "next/link";

type Props = {
  profile: User;
};

const Profile = ({ profile }: Props) => {
  const { profilePageSelectedTab, setProfilePageSelectedTab } =
    useContext(MainContext);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  return (
    <>
      <EditProfileForm
        isOpen={editModalIsOpen}
        setIsOpen={setEditModalIsOpen}
        profile={profile}
      />
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
            <button
              onClick={() => setEditModalIsOpen(true)}
              className="h-9 rounded-full border border-gray-300 bg-white px-4 font-semibold text-grayText"
            >
              Edit profile
            </button>
          </div>
          <div className="mb-3 flex flex-col">
            <span className="text-xl font-bold text-grayText">
              {profile.displayName}
            </span>
            <span className="-mt-1 text-lightGrayText ">
              @{profile.username}
            </span>
          </div>
          <p className="mb-3">{profile.bio}</p>
          <div className="mb-3 flex flex-wrap text-lightGrayText">
            {profile.location && (
              <ProfileDataPoint
                icon={<LocationIcon className="h-5 w-5" />}
                textContent={profile.location}
              />
            )}
            {profile.website && (
              <Link
                href={profile.website}
                className="text-blue-500 hover:underline"
              >
                <ProfileDataPoint
                  icon={<LinkIcon className="h-5 w-5" />}
                  textContent={profile.website}
                />
              </Link>
            )}
            {profile.createdAt && (
              <ProfileDataPoint
                icon={<CalendarIcon className="h-5 w-5" />}
                textContent={`Joined ${months[profile.createdAt.getUTCMonth()]} ${profile.createdAt.getUTCFullYear()}`}
              />
            )}
          </div>
          <div className="mb-3 flex text-sm text-grayText">
            <div className="mr-5">
              <span className="font-semibold text-grayText">{0}</span> Following
            </div>
            <div>
              <span className="font-semibold text-grayText">{0}</span> Followers
            </div>
          </div>
        </div>
        <Tabs
          options={[
            ProfilePageTabs.Posts,
            ProfilePageTabs.Replies,
            ProfilePageTabs.Highlights,
            ProfilePageTabs.Media,
            ProfilePageTabs.Likes,
          ]}
          value={profilePageSelectedTab}
          onChange={(option: string) =>
            setProfilePageSelectedTab(option as ProfilePageTabs)
          }
        ></Tabs>
      </div>
    </>
  );
};

export default Profile;
