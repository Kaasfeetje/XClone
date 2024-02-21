import { COMMENTPERMISSIONS, Post } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Avatar from "~/components/common/Avatar";
import Select, { OptionType } from "~/components/common/Select/Select";
import GlobalIcon from "~/components/icons/GlobalIcon";
import { api } from "~/utils/api";
import PostFormInput from "./PostFormInput";
import PrimaryButton from "~/components/common/Buttons/PrimaryButton";
import { commentPermissionOptions } from "~/components/common/data/commentPermissionOptions";
import PostFormActions from "./PostFormActions";

type Props = {
  onPost: () => void;
  replyTo?: Post;
};

const DetailedPostForm = ({ onPost, replyTo }: Props) => {
  const useCreatePostMutation = api.post.create.useMutation();

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
    if (replyTo) {
      useCreatePostMutation.mutate({
        textContent: text,
        commentPermission: commentPermission.value,
        commentToId: replyTo.id,
      });
    } else {
      useCreatePostMutation.mutate({
        textContent: text,
        commentPermission: commentPermission.value,
      });
    }

    setText("");
    setCanPost(false);
    setCommentPermission({
      icon: <GlobalIcon className="h-4 w-4" />,
      title: "Everyone",
      description: "Everyone can reply",
      value: COMMENTPERMISSIONS.EVERYONE,
    });
    onPost();
  };

  return (
    <form className={` flex flex-col pb-2`} onSubmit={onSubmit}>
      <div className="flex min-h-[120px] w-full">
        <div className="mr-3 mt-3 h-10 w-10 min-w-10 rounded-full bg-black">
          <Avatar
            profileImage={session?.user.profileImage}
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
        <PostFormActions />
        <PrimaryButton disabled={!canPost} type="submit">
          {replyTo ? "Reply" : "Post"}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default DetailedPostForm;
