import React, { useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import CameraIcon from "../icons/CameraIcon";
import Avatar from "../common/Avatar";
import TextInput from "../common/FormComponents/TextInput";
import TextAreaInput from "../common/FormComponents/TextAreaInput";
import { api } from "~/utils/api";
import { User } from "@prisma/client";
import Modal from "../common/Modal";
import BlackButton from "../common/Buttons/BlackButton";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  profile: User;
};

const EditProfileForm = ({ isOpen, setIsOpen, profile }: Props) => {
  const utils = api.useUtils();
  const editProfileMutation = api.user.editProfile.useMutation({
    onSuccess() {
      utils.user.fetchProfile.invalidate({ username: profile.username! });
    },
  });

  const [name, setName] = useState(profile.displayName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [website, setWebsite] = useState(profile.website || "");

  const close = () => {
    setName(profile.displayName || "");
    setBio(profile.bio || "");
    setLocation(profile.location || "");
    setWebsite(profile.website || "");
    setIsOpen(false);
  };

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editProfileMutation.mutate({
      displayName: name,
      bio: bio != "" ? bio : undefined,
      location: location != "" ? location : undefined,
      website: website != "" ? website : undefined,
      //TODO: Add banner image and profile image
    });
    close();
  };

  return (
    <Modal centered isOpen={isOpen} onClose={close}>
      <form
        onSubmit={(e) => onSave(e)}
        className="z-10 flex h-[650px] w-[600px] flex-col rounded-2xl bg-white text-black"
      >
        <div className="sticky top-0 flex h-[53px] min-h-[53px] items-center justify-between rounded-2xl bg-white px-4">
          <div className="flex h-full min-w-14 items-center">
            <div
              className="-ml-1 flex  h-[34px] w-[34px] items-center justify-center rounded-full hover:bg-gray-300 "
              onClick={close}
            >
              <CloseIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="w-full text-xl font-semibold">Edit profile</div>
          <BlackButton className="h-8">Save</BlackButton>
        </div>
        <div className="relative aspect-[3/1] w-full bg-gray-400">
          <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black opacity-50">
            <CameraIcon className="h-[22px] w-[22px] fill-white" />
          </div>
        </div>
        <div className=" -mt-12 h-auto w-full px-4">
          <div className="relative aspect-square w-1/4 max-w-32 overflow-hidden rounded-lg">
            <div className="absolute flex aspect-square h-full w-full items-center justify-center overflow-hidden rounded-full bg-white p-1">
              <Avatar />
              <div className="absolute flex h-[calc(100%-8px)] w-[calc(100%-8px)] items-center overflow-hidden rounded-full ">
                <div className="flex h-[42px] w-full  items-center justify-center bg-black opacity-75">
                  <CameraIcon className="h-[22px] w-[22px]  fill-white " />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-4 py-2">
          <TextInput
            placeholder="Name"
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-full px-4 py-2">
          <TextAreaInput
            placeholder="Bio"
            maxLength={160}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className="w-full px-4 py-2">
          <TextInput
            placeholder="Location"
            maxLength={30}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="w-full px-4 py-2">
          <TextInput
            placeholder="Website"
            maxLength={100}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileForm;
