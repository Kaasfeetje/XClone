import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import LeftArrowIcon from "../icons/LeftArrow";
import Tabs from "../common/Tabs";
import ListForm from "./ListForm";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { List } from "@prisma/client";
import ManageMembers from "./ManageMembers";

type Props = {
  list: List;
  editListModalIsOpen: boolean;
  setEditListModalIsOpen: (value: boolean) => void;
};

const EditFormModal = ({
  list,
  editListModalIsOpen,
  setEditListModalIsOpen,
}: Props) => {
  const router = useRouter();
  const updateListMutation = api.list.update.useMutation();
  const deleteListMutation = api.list.delete.useMutation();
  const [isManagingMembers, setIsManagingMembers] = useState(false);

  useEffect(() => {
    if (deleteListMutation.isSuccess) {
      router.push(`/`).then();
    }
  }, [deleteListMutation.isSuccess]);

  const handleEditList = ({
    name,
    bio,
    isPrivate,
    bannerImageId,
  }: {
    name: string;
    bio?: string;
    isPrivate?: boolean;
    bannerImageId?: string;
  }) => {
    updateListMutation.mutate({
      listId: list.id,
      name,
      bio,
      isPrivate,
      bannerImageId,
    });

    setEditListModalIsOpen(false);
  };

  return (
    <Modal
      centered
      isOpen={editListModalIsOpen}
      onClose={() => setEditListModalIsOpen(false)}
    >
      {isManagingMembers ? (
        <ManageMembers
          listId={list.id}
          setIsManagingMembers={setIsManagingMembers}
        />
      ) : (
        <ListForm
          headerText="Edit List"
          saveText="Done"
          list={list}
          onSubmit={handleEditList}
          onCancel={() => setEditListModalIsOpen(false)}
          onDelete={() => deleteListMutation.mutate({ listId: list.id })}
          onManageMembers={() => setIsManagingMembers(true)}
        />
      )}
    </Modal>
  );
};

export default EditFormModal;
