import { COMMENTPERMISSIONS, Post } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Avatar from "~/components/common/Avatar";
import Select, { OptionType } from "~/components/common/Select/Select";
import GlobalIcon from "~/components/icons/GlobalIcon";
import { api } from "~/utils/api";
import PostFormInput from "./PostFormInput";
import PrimaryButton from "~/components/common/Buttons/PrimaryButton";
import { commentPermissionOptions } from "~/components/common/data/commentPermissionOptions";
import PostFormActions from "./PostFormActions";
import ImagePreviewContainer from "./ImagePreviewContainer";
import axios from "axios";

type Props = {
  onPost: () => void;
  replyTo?: Post;
};

const DetailedPostForm = ({ onPost, replyTo }: Props) => {
  const utils = api.useUtils();
  const useCreatePostMutation = api.post.create.useMutation({
    async onSuccess() {
      await utils.post.invalidate();
    },
  });
  const getUploadPresignedUrlMutation =
    api.upload.getUploadPresignedUrl.useMutation();
  const deleteUnusedUrlsMutation =
    api.upload.deleteUnusedPresignedUrls.useMutation();

  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [commentPermission, setCommentPermission] = useState<OptionType>({
    icon: <GlobalIcon className="h-4 w-4" />,
    title: "Everyone",
    description: "Everyone can reply",
    value: COMMENTPERMISSIONS.EVERYONE,
  });
  const [canPost, setCanPost] = useState(false);
  // File upload
  const [files, setFiles] = useState<File[]>();

  useEffect(() => {
    return () => {
      deleteUnused();
    };
  }, []);
  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value == "" || e.target.value.length > 244) {
      setCanPost(false);
    } else {
      setCanPost(true);
    }
  };

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

  const handleFiles = (value: File[]) => {
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    deleteUnused();

    setFiles(value);
    if (value[0]) {
      // TODO: delete the image objects if not used
      getUploadPresignedUrlMutation.mutate(
        value.map((file) => ({ type: file.type.split("image/")[1]! })),
      );
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text == "") {
      return;
    }
    if (files?.[0] && getUploadPresignedUrlMutation.data) {
      // Upload each pic to s3
      getUploadPresignedUrlMutation.data.forEach((image, idx) => {
        axios.put(image.presignedUrl, files[idx]?.slice(), {
          headers: { "Content-Type": files[idx]?.type },
        });
      });
    }

    useCreatePostMutation.mutate({
      textContent: text,
      commentPermission: commentPermission.value,
      commentToId: replyTo ? replyTo.id : undefined,
      images: getUploadPresignedUrlMutation.data
        ? getUploadPresignedUrlMutation.data.map((image) => image.image.id)
        : undefined,
    });

    setText("");
    setCanPost(false);
    setCommentPermission({
      icon: <GlobalIcon className="h-4 w-4" />,
      title: "Everyone",
      description: "Everyone can reply",
      value: COMMENTPERMISSIONS.EVERYONE,
    });
    setFiles(undefined);
    onPost();
  };

  return (
    <form className={` flex flex-col pb-2`} onSubmit={onSubmit}>
      <div className="flex min-h-[120px] w-full">
        <div className="mr-3 mt-3 h-10 w-10 min-w-10 rounded-full bg-black">
          <Avatar
            profileImage={session?.user.profileImageId}
            image={session?.user.image}
          />
        </div>
        <div className="relative w-full">
          <PostFormInput
            value={text}
            onChange={handleText}
            setText={setText}
            onFocus={() => setIsOpen(true)}
          />
        </div>
      </div>
      {/* TODO: Maybe edit this to use the same shape as the post images layout(no carousel) */}
      <ImagePreviewContainer handleFiles={handleFiles} files={files} />
      {isOpen && (
        <Select
          dropdownTitle="Who can reply?"
          dropdownDescription="Choose who can reply to this post.\n Anyone mentioned can always reply."
          options={commentPermissionOptions}
          selected={commentPermission}
          setSelected={setCommentPermission}
        ></Select>
      )}
      <div className="flex items-end justify-between">
        <PostFormActions files={files} setFiles={handleFiles} />
        <PrimaryButton disabled={!canPost} type="submit">
          {replyTo ? "Reply" : "Post"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default DetailedPostForm;
