import React from "react";
import Avatar from "../common/Avatar";
import { ListMember, User } from "@prisma/client";
import { api } from "~/utils/api";

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
    <div className="flex px-4 py-3">
      <div className="mr-2 h-10 w-10 min-w-10">
        <Avatar
          profileImage={member.member.profileImageId}
          image={member.member.image}
        />
      </div>
      <div className="w-full">
        <div className="flex w-full items-end justify-between">
          <div>
            <div className="font-semibold hover:underline">
              {member.member.displayName}
            </div>
            <div className="-mt-1 text-lightGrayText">{`@${member.member.username}`}</div>
          </div>
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
        </div>
        <p className="mt-1">{member.member.bio}</p>
      </div>
    </div>
  );
};

export default ListMember;
