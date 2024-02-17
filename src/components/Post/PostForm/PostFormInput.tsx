import React, { useEffect, useState } from "react";
import AutoHeightTextArea from "~/components/common/AutoHeightTextArea";
import { api } from "~/utils/api";
import Avatar from "~/components/common/Avatar";

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus: () => void;
  setText: (value: string) => void;
};

const PostFormInput = ({ value, onChange, onFocus, setText }: Props) => {
  //Autocomplete stuff
  const [autoCompleteIndex, setAutoCompleteIndex] = useState(0);
  const [autoCompleteKeyword, setAutoCompleteKeyword] = useState("");
  const { data: autoCompleteUsers, refetch } =
    api.user.fetchAutoCompleteUsers.useQuery(
      { keyword: autoCompleteKeyword },
      { enabled: false },
    );
  const [autoCompleteIsOpen, setAutoCompleteIsOpen] = useState(false);

  const [cursorIndex, setCursorIndex] = useState(0);

  useEffect(() => {
    if (value.endsWith(" ")) {
      return setAutoCompleteIsOpen(false);
    }
    const { currentWord } = getCurrentWord();
    if (currentWord?.startsWith("@")) {
      setAutoCompleteIsOpen(true);
      setAutoCompleteKeyword(currentWord.replace("@", ""));
      const delayedSearch = setTimeout(() => {
        refetch({});
      }, 200);
      return () => clearTimeout(delayedSearch);
    } else {
      setAutoCompleteIsOpen(false);
    }
  }, [cursorIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.code) {
      case "ArrowDown":
        if (
          autoCompleteUsers &&
          autoCompleteIndex < autoCompleteUsers.length - 1
        ) {
          e.preventDefault();
          setAutoCompleteIndex((value) => value + 1);
        } else {
          setCursorIndex(e.currentTarget.selectionStart);
        }
        break;
      case "ArrowUp":
        if (autoCompleteUsers && autoCompleteIndex > 0) {
          e.preventDefault();
          setAutoCompleteIndex((value) => value - 1);
        } else {
          setCursorIndex(e.currentTarget.selectionStart);
        }
        break;
      case "ArrowLeft":
      case "ArrowRight":
        setCursorIndex(e.currentTarget.selectionStart);
        break;
      case "Enter":
        if (autoCompleteUsers) {
          e.preventDefault();
          onAutoComplete(autoCompleteUsers[autoCompleteIndex]!.username!);
        }
        break;
      case "Escape":
        if (autoCompleteIsOpen) {
          e.preventDefault();
          setAutoCompleteIsOpen(false);
        }
    }
  };

  const getCurrentWord = () => {
    const words = value.split(" ");
    let count = 0;
    let i = 0;
    while (count <= cursorIndex && i < words.length) {
      count += words[i]!.length + 1;
      i += 1;
    }
    return { currentWord: words[i - 1], index: i };
  };

  const onAutoComplete = (username: string) => {
    const words = value.split(" ");
    const { index: i } = getCurrentWord();
    words[i - 1] = `@${username}`;
    setText(words.join(" "));
    setAutoCompleteIsOpen(false);
  };

  return (
    <div>
      <AutoHeightTextArea
        className="py-3 text-xl outline-none"
        placeholder="What is happening?!"
        value={value}
        onChange={(e) => {
          onChange(e);
          setCursorIndex(e.target.selectionStart);
        }}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        onClick={(e) => setCursorIndex(e.currentTarget.selectionStart)}
      />
      {autoCompleteIsOpen && (
        <ul className="absolute top-14 z-30 w-[380px] rounded-md border border-gray-300 bg-white">
          {autoCompleteUsers &&
            autoCompleteUsers.map((user, idx) => (
              <li
                key={user.id}
                onClick={() => onAutoComplete(user.username!)}
                className={`flex px-4 py-3 ${autoCompleteIndex == idx ? "bg-gray-200" : ""}`}
              >
                <div className="mr-2 h-10 w-10">
                  <Avatar profileImage={user.profileImage} image={user.image} />
                </div>
                <div>
                  <div className="font-semibold text-grayText">
                    {user.displayName}
                  </div>
                  <div className="text-lightGrayText">@{user.username}</div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default PostFormInput;
