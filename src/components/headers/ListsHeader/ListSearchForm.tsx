import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Avatar from "~/components/common/Avatar";
import OutsideAlerter from "~/components/hooks/useOutsideAlerter";
import CloseIcon from "~/components/icons/CloseIcon";
import SearchIcon from "~/components/icons/SearchIcon";
import { env } from "~/env";
import { api } from "~/utils/api";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const ListSearchForm = ({ isOpen, setIsOpen }: Props) => {
  const [keyword, setKeyword] = useState("");
  const fetchAutoCompleteQuery = api.list.fetchAutoComplete.useQuery(
    {
      keyword,
    },
    { enabled: false },
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (keyword != "") fetchAutoCompleteQuery.refetch().then();
    }, 500);
    return () => clearTimeout(timeout);
  }, [keyword]);

  return (
    <OutsideAlerter onOutsideClick={() => setIsOpen(false)} className="w-full">
      <form
        onFocusCapture={() => setIsOpen(true)}
        className="group/focus  relative w-full rounded-full border border-white py-px focus-within:border-blue-500"
      >
        <div className="flex h-[42px] w-full items-center">
          <div className="min-w-8 pl-3 group-focus-within/focus:fill-blue-500">
            <SearchIcon className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="h-[42px] w-full rounded-full p-3 outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword != "" && isOpen && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              className="mx-4 flex h-[22px] w-[22px] min-w-[22px] items-center justify-center rounded-full bg-blue-500 fill-white hover:bg-blue-600"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        {isOpen && (
          <div
            className="max-height-[calc(-53px+80vh)] absolute left-0 top-[42px] min-h-[100px] w-full rounded-md border border-gray-300 bg-white
          "
          >
            {keyword == "" ? (
              <div className="mt-4 text-center text-lightGrayText">
                Try searching for lists
              </div>
            ) : (
              <div className="h-full w-full">
                {fetchAutoCompleteQuery.data?.map((list) => (
                  <Link
                    key={list.id}
                    href={`/lists/${list.id}`}
                    className="flex items-center p-4"
                  >
                    <div className="mr-2 h-10 w-10 overflow-hidden rounded-lg bg-blue-500">
                      <img
                        className="h-full w-full object-cover"
                        src={`${env.NEXT_PUBLIC_IMAGE_HOSTING_URL}${list.bannerImageId}`}
                      />
                    </div>
                    <div className="flex flex-col text-lightGrayText">
                      <div>
                        <span className="font-bold text-grayText">
                          {list.name}
                        </span>
                        <span>·</span>
                        <span className="text-13px">{`${list._count.listMembers} members`}</span>
                      </div>
                      <div className="-mt-1 flex items-center">
                        <div className="mr-1 h-[14px] w-[14px]">
                          <Avatar
                            profileImage={list.user.profileImageId}
                            image={list.user.image}
                          />
                        </div>
                        <span>{`${list._count.followers} followers`}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </form>
    </OutsideAlerter>
  );
};

export default ListSearchForm;
