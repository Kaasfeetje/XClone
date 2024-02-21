import React from "react";
import IconButton from "~/components/common/IconButton";
import EmojiIcon from "~/components/icons/EmojiIcon";
import GifIcon from "~/components/icons/GifIcon";
import ImageIcon from "~/components/icons/ImageIcon";
import ListIcon from "~/components/icons/ListIcon";
import LocationIcon from "~/components/icons/LocationIcon";
import ScheduleIcon from "~/components/icons/ScheduleIcon";

type Props = {};

const PostFormActions = (props: Props) => {
  return (
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
  );
};

export default PostFormActions;
