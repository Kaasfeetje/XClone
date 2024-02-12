import React from "react";
import LeftArrowIcon from "../icons/LeftArrow";
import { useRouter } from "next/router";

type Props = {};

const DetailedPostHeader = (props: Props) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 flex h-[53px] items-center bg-white fill-grayText px-4 text-grayText">
      <div className=" min-w-14" onClick={() => router.back()}>
        <div className="h-5 w-5 min-w-5">
          <LeftArrowIcon />
        </div>
      </div>
      <div className="text-xl font-semibold">Post</div>
    </div>
  );
};

export default DetailedPostHeader;
