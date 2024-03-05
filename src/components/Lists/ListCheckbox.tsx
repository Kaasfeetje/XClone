import { ListMember, List as ListType, User } from "@prisma/client";
import React, { useState } from "react";
import List from "./List";
import CheckIcon from "../icons/CheckIcon";

type Props = {
  list: ListType & {
    user: User;
    listMembers: ListMember[];
    _count: {
      followers: number;
      listMembers: number;
    };
  };
  checked: boolean;
  onToggleChecked: () => void;
};

const ListCheckbox = ({ list, checked, onToggleChecked }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <List list={list} onClick={onToggleChecked} />
      {checked && (
        <div className="mr-4 flex h-9 w-9 min-w-9  items-center justify-center rounded-full fill-blue-500">
          <CheckIcon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

export default ListCheckbox;
