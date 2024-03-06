import React from "react";
import Avatar from "../common/Avatar";
import { ListMember, User } from "@prisma/client";
import { api } from "~/utils/api";
import ListUser from "./ListUser";

type Props = {
  member: ListMember & {
    member: User;
  };
};

const ListMember = ({ member }: Props) => {
  const deleteListMemberMutation = api.list.deleteListMember.useMutation();

  if (
    deleteListMemberMutation.isLoading ||
    deleteListMemberMutation.isSuccess
  ) {
    return undefined;
  }

  return (
    <ListUser user={member.member}>
      <button
        onClick={() =>
          deleteListMemberMutation.mutate({
            listId: member.listId,
            memberId: member.memberId,
          })
        }
        className="h-8 rounded-full bg-red-500 px-4 text-white hover:bg-red-600"
      >
        Remove
      </button>
    </ListUser>
  );
};

export default ListMember;
