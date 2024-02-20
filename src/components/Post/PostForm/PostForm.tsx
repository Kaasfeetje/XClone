import { COMMENTPERMISSIONS } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import AutoHeightTextArea from "~/components/common/AutoHeightTextArea";
import Avatar from "~/components/common/Avatar";
import IconButton from "~/components/common/IconButton";
import Select, { OptionType } from "~/components/common/Select/Select";
import ScheduleIcon from "~/components/icons/ScheduleIcon";
import EmojiIcon from "~/components/icons/EmojiIcon";
import FollowedIcon from "~/components/icons/FollowedIcon";
import GifIcon from "~/components/icons/GifIcon";
import GlobalIcon from "~/components/icons/GlobalIcon";
import ImageIcon from "~/components/icons/ImageIcon";
import ListIcon from "~/components/icons/ListIcon";
import LocationIcon from "~/components/icons/LocationIcon";
import MentionIcon from "~/components/icons/MentionIcon";
import VerifiedIcon from "~/components/icons/VerifiedIcon";
import { api } from "~/utils/api";
import PostFormInput from "./PostFormInput";
import PrimaryButton from "~/components/common/Buttons/PrimaryButton";

type Props = {};

const PostForm = (props: Props) => {
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

    useCreatePostMutation.mutate({
      textContent: text,
      commentPermission: commentPermission.value,
    });

    setText("");
    setCanPost(false);
    setCommentPermission({
      icon: <GlobalIcon className="h-4 w-4" />,
      title: "Everyone",
      description: "Everyone can reply",
      value: COMMENTPERMISSIONS.EVERYONE,
    });
  };

  return (
    <form className="hidden pb-2 md:flex" onSubmit={onSubmit}>
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

        {isOpen && (
          <Select
            dropdownTitle="Who can reply?"
            dropdownDescription="Choose who can reply to this post.\n Anyone mentioned can always reply."
            options={[
              {
                icon: <GlobalIcon className="h-4 w-4" />,
                title: "Everyone",
                description: "Everyone can reply",
                value: COMMENTPERMISSIONS.EVERYONE,
              },
              {
                icon: <FollowedIcon className="h-4 w-4" />,
                title: "Accounts you follow",
                description: "Accounts you follow can reply",
                value: COMMENTPERMISSIONS.FOLLOW,
              },
              {
                icon: <VerifiedIcon className="h-4 w-4" />,
                title: "Verified accounts",
                description: "Only Verified accounts can reply",
                value: COMMENTPERMISSIONS.VERIFIED,
              },
              {
                icon: <MentionIcon className="h-4 w-4" />,
                title: "Only accounts you mention",
                description: "Only accounts you mention can reply",
                value: COMMENTPERMISSIONS.MENTIONED,
              },
            ]}
            selected={commentPermission}
            setSelected={setCommentPermission}
          ></Select>
        )}
        <div className="flex items-end justify-between">
          <div className="flex">
            <IconButton>
              <ImageIcon className="h-5 w-5" />
            </IconButton>
            <IconButton>
              <GifIcon className="h-5 w-5" />
            </IconButton>
            <IconButton>
              <ListIcon className="h-5 w-5" />
            </IconButton>
            <IconButton>
              <EmojiIcon className="h-5 w-5" />
            </IconButton>
            <IconButton>
              <ScheduleIcon className="h-5 w-5" />
            </IconButton>
            <IconButton disabled={true}>
              <LocationIcon className="h-5 w-5" />
            </IconButton>
          </div>
          <PrimaryButton disabled={!canPost} type="submit">
            Post
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
