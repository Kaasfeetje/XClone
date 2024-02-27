import React, { useState } from "react";
import IconButton from "~/components/common/IconButton";
import EmojiIcon from "~/components/icons/EmojiIcon";
import GifIcon from "~/components/icons/GifIcon";
import ImageIcon from "~/components/icons/ImageIcon";
import ListIcon from "~/components/icons/ListIcon";
import LocationIcon from "~/components/icons/LocationIcon";
import ScheduleIcon from "~/components/icons/ScheduleIcon";

type Props = {
  files?: File[];
  setFiles: (value: File[]) => void;
};

const PostFormActions = ({ files, setFiles }: Props) => {
  return (
    <div className="flex">
      <label
        htmlFor="fileupload"
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full fill-blue-500 hover:bg-blue-100 `}
      >
        <input
          type="file"
          id="fileupload"
          className="invisible h-0 w-0"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files!))}
        />
        <ImageIcon className="h-5 w-5" />
      </label>
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
