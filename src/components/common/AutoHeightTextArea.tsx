import React from "react";

type Props = {
  className?: string;
  placeholder?: string;
  onFocus?: () => void;
};

const AutoHeightTextArea = ({ className, placeholder, onFocus }: Props) => {
  const autoHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "1px";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  };

  return (
    <textarea
      rows={1}
      placeholder={placeholder ? placeholder : ""}
      className={`w-full ${className ? className : ""}`}
      onInput={(e) => autoHeight(e)}
      onFocus={onFocus}
    ></textarea>
  );
};

export default AutoHeightTextArea;
