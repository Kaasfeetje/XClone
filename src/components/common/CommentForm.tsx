import { COMMENTPERMISSIONS, Post, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import AutoHeightTextArea from "~/components/common/AutoHeightTextArea";
import Avatar from "~/components/common/Avatar";
import IconButton from "~/components/common/IconButton";
import EmojiIcon from "~/components/icons/EmojiIcon";
import GifIcon from "~/components/icons/GifIcon";
import ImageIcon from "~/components/icons/ImageIcon";
import LocationIcon from "~/components/icons/LocationIcon";
import { api } from "~/utils/api";
import PrimaryButton from "./Buttons/PrimaryButton";
type Props = {
  comment: Post & {
    user: User;
  };
};

const CommentForm = ({ comment }: Props) => {
  const createCommentMutation = api.post.create.useMutation();
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [canPost, setCanPost] = useState(false);

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value == "" || e.target.value.length > 244) {
      setCanPost(false);
    } else {
      setCanPost(true);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text == "") {
      return;
    }

    createCommentMutation.mutate({
      commentPermission: COMMENTPERMISSIONS.EVERYONE,
      textContent: text,
      commentToId: comment.id,
    });
    setText("");
    setCanPost(false);
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
            profileImage={session?.user.profileImage}
            image={session?.user.image}
          />
        </div>
        <div className="w-full">
          <div className="flex">
            <AutoHeightTextArea
              className="py-3 text-xl outline-none"
              placeholder="What is happening?!"
              value={text}
              onChange={handleText}
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
          <div
            className={`flex items-end justify-between ${isOpen ? "visible h-12" : "invisible h-0"} duration-200`}
          >
            <div className="flex">
              <IconButton>
                <ImageIcon className="h-5 w-5" />
              </IconButton>
              <IconButton>
                <GifIcon className="h-5 w-5" />
              </IconButton>
              <IconButton>
                <EmojiIcon className="h-5 w-5" />
              </IconButton>
              <IconButton disabled={true}>
                <LocationIcon className="h-5 w-5" />
              </IconButton>
            </div>
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
