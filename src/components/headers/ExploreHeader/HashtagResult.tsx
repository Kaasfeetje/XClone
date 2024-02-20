import { HashTag } from "@prisma/client";
import Link from "next/link";
import React from "react";
import SearchIconFilled from "~/components/icons/SearchIconFilled";

type Props = {
  hashtag: HashTag;
  onClick?: () => void;
};

const HashtagResult = ({ hashtag, onClick }: Props) => {
  return (
    <Link href={`/hashtag/${hashtag.hashtag}`} onClick={onClick}>
      <div className="flex cursor-pointer items-center p-4">
        <div className="flex h-10 w-10 items-center ">
          <SearchIconFilled className="h-5 w-5" />
        </div>
        <div>#{hashtag.hashtag}</div>
      </div>
    </Link>
  );
};

export default HashtagResult;
