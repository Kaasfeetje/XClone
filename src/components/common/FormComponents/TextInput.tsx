import React, { useState } from "react";

type Props = {
  placeholder: string;
  maxLength?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInput = ({ placeholder, maxLength, value, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(value != "" || false);

  return (
    <label
      className={`group/focused relative block h-[62px] w-full rounded-md border border-gray-300  text-lightGrayText focus-within:text-blue-500  focus-within:outline`}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={() => {
        if (value == "") setIsOpen(false);
      }}
    >
      <span
        className={`absolute left-2 ${isOpen ? "top-2 text-13px" : "top-4 text-17px"} duration-200`}
      >
        {placeholder}
      </span>
      <span
        className={`absolute right-2 top-2 hidden text-13px text-lightGrayText group-focus-within/focused:inline`}
      >
        {value.length}
        {maxLength ? `/${maxLength}` : ""}
      </span>
      <div className="mt-4 px-2 pb-2 pt-3">
        <input
          className="h-5 w-full text-xl text-black outline-none"
          value={value}
          onChange={onChange}
        />
      </div>
    </label>
  );
};

export default TextInput;
