import React from "react";

export enum PostActionColorVariants {
  white = "white",
  blue = "blue",
  green = "green",
  red = "red",
}

type Props = {
  imageView?: boolean;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  value?: number;
  active?: boolean;
  color: PostActionColorVariants;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const variants: {
  [key in PostActionColorVariants]: {
    active: string;
    hover: string;
    popup: string;
  };
} = {
  white: {
    active: "fill-white text-white",
    hover: "hover:fill-white hover:text-white",
    popup:
      "group-hover/postAction:bg-gray-100 group-hover/postAction:bg-opacity-15",
  },
  blue: {
    active: "fill-blue-500 text-blue-500",
    hover: "hover:fill-blue-500 hover:text-blue-500",
    popup: "group-hover/postAction:bg-blue-100",
  },
  green: {
    active: "fill-green-500 text-green-500",
    hover: "hover:fill-green-500 hover:text-green-500",
    popup: "group-hover/postAction:bg-green-100",
  },
  red: {
    active: "fill-red-500 text-red-500",
    hover: "hover:fill-red-500 hover:text-red-500",
    popup: "group-hover/postAction:bg-red-100",
  },
};

const PostAction = ({
  imageView,
  icon,
  activeIcon,
  value,
  active,
  color,
  onClick,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`group/postAction flex ${active ? variants[imageView ? PostActionColorVariants.white : color].active : imageView ? "fill-white text-white" : "fill-lightGrayText text-lightGrayText"} ${variants[imageView ? PostActionColorVariants.white : color].hover}`}
    >
      <div className="relative">
        <div
          className={`absolute -left-1/2 -top-1/2 -z-10 ml-px mt-px h-9 w-9 rounded-full  duration-200 ${variants[imageView ? PostActionColorVariants.white : color].popup}`}
        ></div>
        {active && activeIcon ? activeIcon : icon}
      </div>
      {value != undefined && (
        <span className="block px-1 text-13px">{value}</span>
      )}
    </button>
  );
};

export default PostAction;
