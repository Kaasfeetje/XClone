import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  size?: string;
  disabled?: boolean;
};

const IconButton = ({ children, onClick, size, disabled }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center ${disabled ? "fill-blue-300" : "fill-blue-500"} ${size ? size : "h-9 w-9"} cursor-pointer rounded-full hover:bg-blue-100 `}
    >
      {children}
    </button>
  );
};

export default IconButton;
