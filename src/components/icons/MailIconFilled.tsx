import React from "react";

type Props = {
  className?: string;
};

const MailIconFilled = ({ className }: Props) => {
  return (
    <svg className={className ? className : ""} viewBox="0 0 24 24">
      <path d="M1.998 4.499c0-.828.671-1.499 1.5-1.499h17c.828 0 1.5.671 1.5 1.499v2.858l-10 4.545-10-4.547V4.499zm0 5.053V19.5c0 .828.671 1.5 1.5 1.5h17c.828 0 1.5-.672 1.5-1.5V9.554l-10 4.545-10-4.547z"></path>
    </svg>
  );
};

export default MailIconFilled;
