import React from "react";

type Props = {
  className?: string;
};

const PlusIcon = ({ className }: Props) => {
  return (
    <svg className={className ? className : ""} viewBox="0 0 24 24">
      <path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"></path>
    </svg>
  );
};

export default PlusIcon;
