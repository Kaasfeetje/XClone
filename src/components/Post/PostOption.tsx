import React from "react";

type Props = {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
};

const PostOption = ({ text, icon, onClick, danger }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center px-4 py-3 active:bg-gray-200 ${danger ? "fill-red-500 text-red-500" : ""}`}
    >
      {icon}
      <span className="pl-3 font-bold">{text}</span>
    </button>
  );
};

export default PostOption;
