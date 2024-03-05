import React, { useEffect, useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import BlackButton from "../common/Buttons/BlackButton";
import CameraIcon from "../icons/CameraIcon";
import TextInput from "../common/FormComponents/TextInput";
import TextAreaInput from "../common/FormComponents/TextAreaInput";
import { api } from "~/utils/api";
import axios from "axios";
import { List } from "@prisma/client";
import { env } from "~/env";
import AngleDownIcon from "../icons/AngleDownIcon";

type Props = {
  headerText: string;
  saveText: string;
  list?: List;
  onSubmit: (listParams: {
    name: string;
    bio?: string;
    isPrivate?: boolean;
    bannerImageId?: string;
  }) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onManageMembers?: () => void;
};

const ListForm = ({
  headerText,
  saveText,
  list,
  onSubmit,
  onCancel,
  onDelete,
  onManageMembers,
}: Props) => {
  const getUploadPresignedUrlMutation =
    api.upload.getUploadPresignedUrl.useMutation();
  const deleteUnusedUrlsMutation =
    api.upload.deleteUnusedPresignedUrls.useMutation();

  const [name, setName] = useState(list?.name || "");
  const [bio, setBio] = useState(list?.bio || "");
  const [isPrivate, setIsPrivate] = useState(
    list?.visibility == "PRIVATE" ? true : false,
  );
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

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return;
    }
    setBannerImageFile(e.target.files[0]);
    deleteUnused();
    getUploadPresignedUrlMutation.mutate([
      { type: e.target.files[0].type.split("image/")[1]! },
    ]);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (
      getUploadPresignedUrlMutation.data &&
      getUploadPresignedUrlMutation.data[0]
    )
      await axios.put(
        getUploadPresignedUrlMutation.data[0].presignedUrl,
        bannerImageFile?.slice(),
        {
          headers: { "Content-Type": bannerImageFile?.type },
        },
      );
    onSubmit({
      name,
      bio,
      isPrivate,
      bannerImageId: getUploadPresignedUrlMutation.data
        ? getUploadPresignedUrlMutation.data[0]?.image.id
        : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="z-10 h-full w-full overflow-y-auto border-2  border-white bg-white md:h-fit md:max-h-[calc(80%-53px)] md:min-h-[650px] md:w-[600px] md:rounded-2xl"
    >
      <div className="sticky top-0 flex h-[53px] w-full items-center px-4">
        <div className="w-14">
          <div
            onClick={onCancel}
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
          >
            <CloseIcon className="h-5 w-5" />
          </div>
        </div>
        <span className="w-full text-xl font-semibold">{headerText}</span>
        <BlackButton disabled={name == ""} type="submit" onClick={handleSubmit}>
          {saveText}
        </BlackButton>
      </div>
      <div className="relative aspect-[3/1] w-full bg-gray-300">
        <img
          className="h-full w-full"
          src={
            bannerImageFile
              ? URL.createObjectURL(bannerImageFile)
              : list
                ? `${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${list.bannerImageId}`
                : undefined
          }
        />
        <label className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black bg-opacity-50 fill-white hover:bg-opacity-40">
          <CameraIcon className="h-5 w-5" />
          <input type="file" className="h-0 w-0" onChange={handleImageFile} />
        </label>
      </div>
      <div className="px-4 py-3">
        <TextInput
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          maxLength={25}
        />
      </div>
      <div className="px-4 py-3">
        <TextAreaInput
          placeholder="Bio"
          onChange={(e) => setBio(e.target.value)}
          value={bio}
          maxLength={100}
        />
      </div>
      <div className="flex justify-between p-4">
        <div className="flex flex-col">
          <label htmlFor="privatecheckbox">Make private</label>
          <span className="text-13px text-lightGrayText">
            When you make a List private, only you can see it.
          </span>
        </div>
        <input
          className="h-5 w-5 shadow-lg"
          id="privatecheckbox"
          type="checkbox"
          onChange={(e) => setIsPrivate(e.target.checked)}
          checked={isPrivate}
        />
      </div>
      {list && (
        <>
          <div
            onClick={onManageMembers}
            className="flex cursor-pointer justify-between px-4 py-3"
          >
            <span>Manage members</span>
            <div>
              <AngleDownIcon className="h-4 w-4 -rotate-90 fill-lightGrayText" />
            </div>
          </div>
          <button
            onClick={onDelete}
            className="mt-auto w-full p-4 text-red-500 hover:bg-red-100"
          >
            Delete List
          </button>
        </>
      )}
    </form>
  );
};

export default ListForm;
