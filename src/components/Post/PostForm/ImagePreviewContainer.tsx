import React, { useEffect, useRef, useState } from "react";
import ImagePreview from "./ImagePreview";
import LeftArrowIcon from "~/components/icons/LeftArrow";

type Props = {
  files?: File[];
  handleFiles: (value: File[]) => void;
};

const ImagePreviewContainer = ({ files, handleFiles }: Props) => {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.marginLeft = `-${index * 257}px`;
    }
  }, [index]);

  const onDelete = (file: File) => {
    if (!files) return;
    handleFiles(files.filter((f) => f != file));
    if (index == files.length - 2) {
      setIndex(index - 1);
    }
  };

  if (!files) return undefined;
  return (
    <div className={`relative flex overflow-hidden pl-1`}>
      <div ref={ref} className="flex duration-300">
        {files.map((file) => (
          <ImagePreview
            key={file.name}
            file={file}
            alone={files.length == 1}
            onDelete={onDelete}
          />
        ))}
      </div>
      <div className="absolute top-1/2 flex w-full -translate-y-1/2 items-center justify-between px-2">
        {index > 0 && (
          <div
            onClick={() => setIndex((value) => value - 1)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-75 fill-white duration-200 hover:bg-opacity-60"
          >
            <LeftArrowIcon className="h-5 w-5 " />
          </div>
        )}
        {index < files.length - 2 && (
          <>
            <div></div>
            <div
              onClick={() => setIndex((value) => value + 1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-75 fill-white duration-200 hover:bg-opacity-60"
            >
              <LeftArrowIcon className="h-5 w-5 -scale-100" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewContainer;
