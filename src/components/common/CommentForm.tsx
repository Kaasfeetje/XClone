import { COMMENTPERMISSIONS, Post, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Avatar from "~/components/common/Avatar";
import { api } from "~/utils/api";
import PrimaryButton from "./Buttons/PrimaryButton";
import axios from "axios";
import PostFormActions from "../Post/PostForm/PostFormActions";
import PostFormInput from "../Post/PostForm/PostFormInput";
import ImagePreviewContainer from "../Post/PostForm/ImagePreviewContainer";
type Props = {
  comment: Post & {
    user: User;
  };
};

const CommentForm = ({ comment }: Props) => {
  const utils = api.useUtils();
  const createCommentMutation = api.post.create.useMutation({
    onSuccess() {
      utils.post.fetchComments.invalidate();
    },
  });
  const getUploadPresignedUrlMutation =
    api.upload.getUploadPresignedUrl.useMutation();
  const deleteUnusedUrlsMutation =
    api.upload.deleteUnusedPresignedUrls.useMutation();
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text == "") {
      return;
    }
    if (files && files[0] && getUploadPresignedUrlMutation.data) {
      // Upload each pic to s3
      getUploadPresignedUrlMutation.data.forEach((image, idx) =>
        axios.put(image.presignedUrl, files[idx]?.slice(), {
          headers: { "Content-Type": files[idx]?.type },
        }),
      );
    }

    createCommentMutation.mutate({
      commentPermission: COMMENTPERMISSIONS.EVERYONE,
      textContent: text,
      commentToId: comment.id,
      images: getUploadPresignedUrlMutation.data
        ? getUploadPresignedUrlMutation.data.map((image) => image.image.id)
        : undefined,
    });
    setText("");
    setCanPost(false);
    setFiles(undefined);
  };

  return (
    <>
      <div className={`flex duration-200 ${isOpen ? "h-5" : "h-0"}`}>
        <div className="mr-3 w-10"></div>
        <div>
          Replying to{" "}
          <Link
            href={`/${comment.user.username}`}
            className="text-blue-500 hover:underline"
          >
            @{comment.user.username}
          </Link>
        </div>
      </div>
      <form className="hidden pb-2 md:flex" onSubmit={onSubmit}>
        <div className="mr-3 mt-3 h-10 w-10 min-w-10 rounded-full bg-black">
          <Avatar
            profileImage={session?.user.profileImageId}
            image={session?.user.image}
          />
        </div>
        <div className="w-full">
          <div className="flex w-full">
            <PostFormInput
              value={text}
              onChange={handleText}
              setText={setText}
              onFocus={() => setIsOpen(true)}
            />
            <PrimaryButton
              className={`${isOpen ? "hidden" : "block"}`}
              disabled={!canPost}
              type="submit"
            >
              Reply
            </PrimaryButton>
          </div>
          <ImagePreviewContainer handleFiles={handleFiles} files={files} />
          <div
            className={`flex items-end justify-between ${isOpen ? "visible h-12" : "invisible h-0"} duration-200`}
          >
            <PostFormActions files={files} setFiles={handleFiles} />
            <PrimaryButton disabled={!canPost} type="submit">
              Reply
            </PrimaryButton>
          </div>
        </div>
      </form>
    </>
  );
};

export default CommentForm;
