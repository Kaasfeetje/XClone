import React from "react";

type Props = {
  className?: string;
};

const BookmarkIconFilled = ({ className }: Props) => {
  return (
    <svg className={className ? className : ""} viewBox="0 0 24 24">
      <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path>
    </svg>
  );
};

export default BookmarkIconFilled;
