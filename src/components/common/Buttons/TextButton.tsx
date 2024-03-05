import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const TextButton = ({ className, children, disabled, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-6 rounded-full px-3 font-semibold text-blue-500 hover:bg-blue-100 ${className ? className : ""}`}
    >
      {children}
    </button>
  );
};

export default TextButton;
