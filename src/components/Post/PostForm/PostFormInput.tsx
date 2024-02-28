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
  const [acMentionKeyword, setACMentionKeyword] = useState("");
  const { data: autoCompleteUsers, refetch: refetchUsers } =
    api.user.fetchAutoCompleteUsers.useQuery(
      { keyword: acMentionKeyword },
      { enabled: false },
    );
  const [acHashtagKeyword, setACHashtagKeyword] = useState("");
  const { data: autoCompleteHashtags, refetch: refetchHashtags } =
    api.hashtag.fetchAutoCompleteHashtags.useQuery(
      { keyword: acHashtagKeyword },
      { enabled: false },
    );
  const [autoCompleteIsOpen, setAutoCompleteIsOpen] = useState<
    "" | "hashtag" | "mention"
  >("");

  const [cursorIndex, setCursorIndex] = useState(0);

  useEffect(() => {
    if (value.endsWith(" ")) {
      return setAutoCompleteIsOpen("");
    }
    const { currentWord } = getCurrentWord();
    if (currentWord?.startsWith("@")) {
      setAutoCompleteIsOpen("mention");
      setACMentionKeyword(currentWord.replace("@", ""));
      const delayedSearch = setTimeout(() => {
        refetchUsers();
      }, 200);
      return () => clearTimeout(delayedSearch);
    } else if (currentWord?.startsWith("#")) {
      setAutoCompleteIsOpen("hashtag");
      setACHashtagKeyword(currentWord.replace("#", ""));
      const delayedSearch = setTimeout(() => {
        refetchHashtags();
      }, 200);
      return () => clearTimeout(delayedSearch);
    } else {
      setAutoCompleteIsOpen("");
    }
  }, [cursorIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.code) {
      case "ArrowDown":
        if (autoCompleteIsOpen != "") {
          if (
            (autoCompleteIsOpen == "mention" &&
              autoCompleteUsers &&
              autoCompleteIndex < autoCompleteUsers.length - 1) ||
            (autoCompleteIsOpen == "hashtag" &&
              autoCompleteHashtags &&
              autoCompleteIndex < autoCompleteHashtags.length - 1)
          ) {
            e.preventDefault();
            setAutoCompleteIndex((value) => value + 1);
          }
        } else {
          setCursorIndex(e.currentTarget.selectionStart);
        }
        break;
      case "ArrowUp":
        if (autoCompleteIsOpen != "") {
          if (autoCompleteIndex > 0) {
            e.preventDefault();
            setAutoCompleteIndex((value) => value - 1);
          }
        } else {
          setCursorIndex(e.currentTarget.selectionStart);
        }
        break;
      case "ArrowLeft":
      case "ArrowRight":
        setCursorIndex(e.currentTarget.selectionStart);
        break;
      case "Enter":
        if (autoCompleteIsOpen != "") {
          e.preventDefault();
          if (autoCompleteIsOpen == "mention" && autoCompleteUsers) {
            onAutoComplete(
              `@${autoCompleteUsers[autoCompleteIndex]!.username!}`,
            );
          } else if (autoCompleteIsOpen == "hashtag" && autoCompleteHashtags) {
            onAutoComplete(
              `#${autoCompleteHashtags[autoCompleteIndex]!.hashtag}`,
            );
          }
        }
        break;
      case "Escape":
        if (autoCompleteIsOpen != "") {
          e.preventDefault();
          setAutoCompleteIsOpen("");
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

  const onAutoComplete = (autocomplete: string) => {
    const words = value.split(" ");
    const { index: i } = getCurrentWord();
    words[i - 1] = autocomplete;
    setText(words.join(" "));
    setAutoCompleteIsOpen("");
  };

  return (
    <div className="w-full">
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

      {autoCompleteIsOpen != "" && (
        <ul className="absolute top-14 z-30 w-[380px] rounded-md border border-gray-300 bg-white">
          {autoCompleteIsOpen == "mention" &&
            autoCompleteUsers &&
            autoCompleteUsers.map((user, idx) => (
              <li
                key={user.id}
                onClick={() => onAutoComplete(`@${user.username!}`)}
                className={`flex px-4 py-3 ${autoCompleteIndex == idx ? "bg-gray-200" : ""}`}
              >
                <div className="mr-2 h-10 w-10">
                  <Avatar
                    profileImage={user.profileImageId}
                    image={user.image}
                  />
                </div>
                <div>
                  <div className="font-semibold text-grayText">
                    {user.displayName}
                  </div>
                  <div className="text-lightGrayText">@{user.username}</div>
                </div>
              </li>
            ))}
          {autoCompleteIsOpen == "hashtag" &&
            autoCompleteHashtags &&
            autoCompleteHashtags.map((hashtag, idx) => (
              <li
                key={hashtag.hashtag}
                onClick={() => onAutoComplete(`#${hashtag.hashtag}`)}
                className={`px-4 py-3 text-17px font-semibold ${autoCompleteIndex == idx ? "bg-gray-200" : ""}`}
              >
                #{hashtag.hashtag}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default PostFormInput;
