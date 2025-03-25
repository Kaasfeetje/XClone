import React, { useContext, useEffect, useState } from "react";
import Avatar from "../common/Avatar";
import { Follow, User } from "@prisma/client";
import Tabs from "../common/Tabs";
import { MainContext, ProfilePageTabs } from "../context/MainContext";
import EditProfileForm from "./EditProfileForm";
import LocationIcon from "../icons/LocationIcon";
import LinkIcon from "../icons/LinkIcon";
import CalendarIcon from "../icons/ScheduleIcon";
import ProfileDataPoint from "./ProfileDataPoint";
import { months } from "../common/data/months";
import Link from "next/link";
import { useSession } from "next-auth/react";
import DotsIcon from "../icons/DotsIcon";
import { api } from "~/utils/api";
import MinimalistButton from "../common/Buttons/MinimalistButton";
import BlackButton from "../common/Buttons/BlackButton";
import { env } from "~/env";

type Props = {
  profile: User & {
    followers: Follow[];
    _count: {
      followers: number;
      following: number;
      posts: number;
    };
  };
};

const Profile = ({ profile }: Props) => {
  const utils = api.useUtils();
  const followMutation = api.user.follow.useMutation({
    onMutate() {
      setFollowed((val) => !val);
    },
    onSuccess() {
      void utils.user.fetchProfile.invalidate();
    },
  });

  const { data: session } = useSession();
  const { profilePageSelectedTab, setProfilePageSelectedTab } =
    useContext(MainContext);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [followButtonText, setFollowButtonText] = useState("Following");

  useEffect(() => {
    if (profile.followers.length != 0) {
      setFollowed(true);
    }
  }, [profile]);

  return (
    <>
      <EditProfileForm
        isOpen={editModalIsOpen}
        setIsOpen={setEditModalIsOpen}
        profile={profile}
      />
      <div>
        <div className="aspect-[3/1] w-full bg-gray-300">
          {profile.bannerImageId && (
            <img
              src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${profile.bannerImageId}`}
              className=" h-full w-full bg-gray-400 "
            ></img>
          )}
        </div>
        <div className="px-4 pt-3">
          <div className=" flex justify-between">
            <div className="relative -mt-[15%] mb-3 aspect-square h-auto w-1/4 min-w-12 rounded-full bg-white">
              <div className="absolute h-full w-full p-1">
                <Avatar
                  profileImage={profile.profileImageId}
                  image={profile.image}
                />
              </div>
            </div>
            {session?.user.username == profile.username ? (
              <MinimalistButton onClick={() => setEditModalIsOpen(true)}>
                Edit Profile
              </MinimalistButton>
            ) : (
              <div className="flex">
                <div className="mr-2 flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-gray-300 duration-200 hover:bg-gray-200 ">
                  <DotsIcon className="h-5 w-5" />
                </div>
                {!followed && (
                  <BlackButton
                    onClick={() => followMutation.mutate({ id: profile.id })}
                  >
                    Follow
                  </BlackButton>
                )}
                {followed && (
                  <button
                    onClick={() => followMutation.mutate({ id: profile.id })}
                    className="block h-[36px] w-[104px] rounded-full border border-gray-300 px-4 font-semibold duration-200 hover:border-red-500 hover:bg-red-100 hover:text-red-500"
                    onMouseEnter={() => setFollowButtonText("Unfollow")}
                    onMouseLeave={() => setFollowButtonText("Following")}
                  >
                    {followButtonText}
                  </button>
                )}
              </div>
            )}
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
              <span className="font-semibold text-grayText">
                {profile._count.following}
              </span>{" "}
              Following
            </div>
            <div>
              <span className="font-semibold text-grayText">
                {profile._count.followers}
              </span>{" "}
              Followers
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
