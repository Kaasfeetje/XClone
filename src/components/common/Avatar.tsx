import React from "react";

type Props = {
  profileImage?: string | null;
  image?: string | null;
};

const Avatar = ({ profileImage, image }: Props) => {
  if (profileImage) {
    return <img className="h-full w-full rounded-full" src={profileImage} />;
  } else if (image) {
    return <img className="h-full w-full rounded-full" src={image} />;
  } else {
    return <div className="h-full w-full rounded-full bg-black"></div>;
  }
};

export default Avatar;
