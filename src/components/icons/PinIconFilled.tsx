import React from "react";

type Props = {
  className?: string;
};

const PinIconFilled = ({ className }: Props) => {
  return (
    <svg
      className={className ? className : ""}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M7 4.5C7 3.12 8.12 2 9.5 2h5C15.88 2 17 3.12 17 4.5v5.26L20.12 16H13v5l-1 2-1-2v-5H3.88L7 9.76V4.5z" />
    </svg>
  );
};

export default PinIconFilled;
