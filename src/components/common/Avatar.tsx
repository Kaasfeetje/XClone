import React from "react";
import { env } from "~/env";

type Props = {
  profileImage?: string | null;
  image?: string | null;
  className?: string;
};

const Avatar = ({ profileImage, image, className }: Props) => {
  if (profileImage) {
    return (
      <img
        className={`h-full w-full rounded-full ${className ? className : ""}`}
        src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${profileImage}`}
      />
    );
  } else if (image) {
    return (
      <img
        className={`h-full w-full rounded-full ${className ? className : ""}`}
        src={image}
      />
    );
  } else {
    return (
      <div
        className={`h-full w-full rounded-full bg-black ${className ? className : ""}`}
      ></div>
    );
  }
};

export default Avatar;
