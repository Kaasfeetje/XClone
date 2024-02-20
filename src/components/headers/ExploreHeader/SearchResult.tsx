import Link from "next/link";
import React from "react";
import SearchIconFilled from "~/components/icons/SearchIconFilled";

type Props = {
  searchWord: string;
  onClick?: () => void;
};

const SearchResult = ({ searchWord, onClick }: Props) => {
  return (
    <Link href={`/explore/${searchWord}`} onClick={onClick}>
      <div className="flex cursor-pointer items-center p-4">
        <div className="flex h-10 w-10 items-center ">
          <SearchIconFilled className="h-5 w-5" />
        </div>
        <div>{searchWord}</div>
      </div>
    </Link>
  );
};

export default SearchResult;
