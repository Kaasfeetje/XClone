import React from "react";
import LeftArrowIcon from "../icons/LeftArrow";
import { useRouter } from "next/router";

type Props = {
  children: React.ReactNode;
};

const BackHeader = ({ children }: Props) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 flex h-[53px] items-center bg-white fill-grayText px-4 text-grayText">
      <div
        className=" min-w-14 hover:cursor-pointer"
        onClick={() => router.back()}
      >
        <div className="h-5 w-5 min-w-5">
          <LeftArrowIcon />
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default BackHeader;
