import React from "react";

type Props = {
  className?: string;
};

const PinIcon = ({ className }: Props) => {
  return (
    <svg
      className={className ? className : ""}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M17 9.76V4.5C17 3.12 15.88 2 14.5 2h-5C8.12 2 7 3.12 7 4.5v5.26L3.88 16H11v5l1 2 1-2v-5h7.12L17 9.76zM7.12 14L9 10.24V4.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v5.74L16.88 14H7.12z" />
    </svg>
  );
};

export default PinIcon;
