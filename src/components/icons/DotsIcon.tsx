import React from "react";

type Props = {
  className?: string;
};

const DotsIcon = ({ className }: Props) => {
  return (
    <svg className={className ? className : ""} viewBox="0 0 24 24">
      <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
    </svg>
  );
};

export default DotsIcon;