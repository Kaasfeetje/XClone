import React from "react";

type Props = {
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) => void;
};

const AutoHeightTextArea = ({
  className,
  placeholder,
  value,
  onChange,
  onFocus,
  onKeyDown,
  onClick,
}: Props) => {
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
      onChange={onChange}
      value={value}
      onKeyDownCapture={onKeyDown}
      onClick={onClick}
    ></textarea>
  );
};

export default AutoHeightTextArea;
