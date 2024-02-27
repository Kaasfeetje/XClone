import React from "react";
import OverlayButton from "~/components/common/Buttons/OverlayButton";
import CloseIcon from "~/components/icons/CloseIcon";

type Props = {
  file: File;
  alone?: boolean;
  onDelete: (file: File) => void;
};

const ImagePreview = ({ file, alone, onDelete }: Props) => {
  return (
    <div className={`relative ${alone ? "" : "pr-2"}`}>
      <div className="absolute top-1 flex w-full items-center justify-between px-1">
        <OverlayButton
          type="button"
          onClick={() => alert("Not implemented yet.")}
        >
          Edit
        </OverlayButton>
        <button
          type="button"
          onClick={() => onDelete(file)}
          className={`flex h-[30px] w-[30px] items-center justify-center rounded-full bg-black bg-opacity-75 fill-white hover:bg-opacity-60 ${alone ? "" : "mr-2"}`}
        >
          <CloseIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
      <img
        src={URL.createObjectURL(file)}
        className={`${alone ? "aspect-[3/4] w-full max-w-full" : "h-[290px] max-h-[290px] w-[249px] min-w-[249px] max-w-[249px] "} overflow-hidden rounded-xl object-cover`}
      />
    </div>
  );
};

export default ImagePreview;
