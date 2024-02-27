import React, { useEffect, useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import CameraIcon from "../icons/CameraIcon";
import Avatar from "../common/Avatar";
import TextInput from "../common/FormComponents/TextInput";
import TextAreaInput from "../common/FormComponents/TextAreaInput";
import { api } from "~/utils/api";
import { User } from "@prisma/client";
import Modal from "../common/Modal";
import BlackButton from "../common/Buttons/BlackButton";
import axios from "axios";
import { env } from "~/env";

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
  const getUploadPresignedUrlMutation =
    api.upload.getUploadPresignedUrl.useMutation();
  const deleteUnusedUrlsMutation =
    api.upload.deleteUnusedPresignedUrls.useMutation();

  const [name, setName] = useState(profile.displayName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [profileImageFile, setProfileImageFile] = useState<File | undefined>();
  const [bannerImageFile, setBannerImageFile] = useState<File>();

  useEffect(() => {
    return () => deleteUnused();
  }, []);

  const deleteUnused = () => {
    if (getUploadPresignedUrlMutation.data) {
      // This gets called if you deleted a image from the preview
      // It cleans up the Image rows created
      deleteUnusedUrlsMutation.mutate(
        getUploadPresignedUrlMutation.data.map((value) => ({
          id: value.image.id,
        })),
      );
    }
  };

  const close = () => {
    setName(profile.displayName || "");
    setBio(profile.bio || "");
    setLocation(profile.location || "");
    setWebsite(profile.website || "");
    setIsOpen(false);
    setProfileImageFile(undefined);
    setBannerImageFile(undefined);
  };

  const handleImageFile = (
    files: FileList | null,
    type: "profile" | "banner",
  ) => {
    if (files && files[0]) {
      const toBeAdded = [];
      if (type == "profile") {
        setProfileImageFile(files[0]);
        toBeAdded.push({ type: files[0].type.split("image/")[1]! });
        if (bannerImageFile) {
          toBeAdded.push({ type: bannerImageFile.type.split("image/")[1]! });
        }
      } else {
        setBannerImageFile(files[0]);
        if (profileImageFile) {
          toBeAdded.push({ type: profileImageFile.type.split("image/")[1]! });
        }
        toBeAdded.push({ type: files[0].type.split("image/")[1]! });
      }
      deleteUnused();
      getUploadPresignedUrlMutation.mutate(toBeAdded);
    }
  };

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let imagesData;
    if (getUploadPresignedUrlMutation.data) {
      imagesData = getUploadPresignedUrlMutation.data.map((image, idx) => {
        let imgFile;
        let type;
        if (getUploadPresignedUrlMutation.data.length == 2) {
          if (idx == 1) {
            imgFile = bannerImageFile;
            type = "banner";
          } else {
            imgFile = profileImageFile;
            type = "profile";
          }
        } else {
          if (bannerImageFile) {
            imgFile = bannerImageFile;
            type = "banner";
          } else {
            imgFile = profileImageFile;
            type = "profile";
          }
        }
        axios.put(image.presignedUrl, imgFile?.slice(), {
          headers: { "Content-Type": imgFile?.type },
        });
        return { id: image.image.id, type };
      });
    }

    const profileImageId = imagesData?.filter((d) => d.type == "profile")[0]
      ?.id;
    const bannerImageId = imagesData?.filter((d) => d.type == "banner")[0]?.id;

    editProfileMutation.mutate({
      displayName: name,
      bio: bio != "" ? bio : undefined,
      location: location != "" ? location : undefined,
      website: website != "" ? website : undefined,
      profileImageId: profileImageId,
      bannerImageId: bannerImageId,
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
        <div className="relative aspect-[3/1] w-full overflow-hidden">
          <img
            src={
              bannerImageFile
                ? URL.createObjectURL(bannerImageFile)
                : `${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${profile.bannerImageId}`
            }
            className=" h-full w-full bg-gray-400 "
          ></img>
          <label className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black opacity-50">
            <input
              type="file"
              accept="image/*"
              className="h-0 w-0"
              onChange={(e) => handleImageFile(e.target.files, "banner")}
            />
            <CameraIcon className="h-[22px] w-[22px] fill-white" />
          </label>
        </div>
        <div className=" -mt-12 h-auto w-full px-4">
          <div className="relative aspect-square w-1/4 max-w-32 overflow-hidden rounded-lg">
            <div className="absolute flex aspect-square h-full w-full items-center justify-center overflow-hidden rounded-full bg-white p-1">
              <Avatar
                preview={
                  profileImageFile
                    ? URL.createObjectURL(profileImageFile)
                    : undefined
                }
                profileImage={profile.profileImageId}
                image={profile.image}
              />
              <div className="absolute flex h-[calc(100%-8px)] w-[calc(100%-8px)] items-center overflow-hidden rounded-full ">
                <label className="flex h-[42px] w-full  items-center justify-center bg-black opacity-75">
                  <input
                    type="file"
                    accept="image/*"
                    className="h-0 w-0"
                    onChange={(e) => handleImageFile(e.target.files, "profile")}
                  />
                  <CameraIcon className="h-[22px] w-[22px]  fill-white " />
                </label>
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
