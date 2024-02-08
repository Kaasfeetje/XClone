import React, { useState } from "react";
import AutoHeightTextArea from "~/components/common/AutoHeightTextArea";
import IconButton from "~/components/common/IconButton";
import Option from "~/components/common/Select/Option";
import Select, { OptionType } from "~/components/common/Select/Select";
import CalendarIcon from "~/components/icons/CalendarIcon";
import EmojiIcon from "~/components/icons/EmojiIcon";
import FollowedIcon from "~/components/icons/FollowedIcon";
import GifIcon from "~/components/icons/GifIcon";
import GlobalIcon from "~/components/icons/GlobalIcon";
import ImageIcon from "~/components/icons/ImageIcon";
import ListIcon from "~/components/icons/ListIcon";
import LocationIcon from "~/components/icons/LocationIcon";
import MentionIcon from "~/components/icons/MentionIcon";
import VerifiedIcon from "~/components/icons/VerifiedIcon";

type Props = {};

const TweetForm = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [whoCanReply, setWhoCanReply] = useState<OptionType>({
    icon: <GlobalIcon className="h-4 w-4" />,
    title: "Everyone",
    value: "Everyone can reply",
  });

  return (
    <form className="hidden pb-2 md:flex">
      <div className="mr-3 mt-3 h-10 w-10 min-w-10 rounded-full bg-black"></div>
      <div className="w-full">
        <AutoHeightTextArea
          className="py-3 text-xl outline-none"
          placeholder="What is happening?!"
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
                value: "Everyone can reply",
              },
              {
                icon: <FollowedIcon className="h-4 w-4" />,
                title: "Accounts you follow",
                value: "Accounts you follow can reply",
              },
              {
                icon: <VerifiedIcon className="h-4 w-4" />,
                title: "Verified accounts",
                value: "Only Verified accounts can reply",
              },
              {
                icon: <MentionIcon className="h-4 w-4" />,
                title: "Only accounts you mention",
                value: "Only accounts you mention can reply",
              },
            ]}
            selected={whoCanReply}
            setSelected={setWhoCanReply}
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
              <CalendarIcon className="h-5 w-5" />
            </IconButton>
            <IconButton disabled={true}>
              <LocationIcon className="h-5 w-5" />
            </IconButton>
          </div>
          <button
            className="mt-3 block h-9 rounded-full bg-blue-400 px-4 font-bold text-white"
            type="submit"
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
};

export default TweetForm;
