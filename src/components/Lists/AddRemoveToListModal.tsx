import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import CloseIcon from "../icons/CloseIcon";
import BlackButton from "../common/Buttons/BlackButton";
import TextButton from "../common/Buttons/TextButton";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import ListCheckbox from "./ListCheckbox";
import ListForm from "./ListForm";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  postUsername?: string;
  userId?: string;
};

enum AddRemoveListState {
  normal,
  create,
}

const AddRemoveToListModal = ({
  isOpen,
  setIsOpen,
  postUsername,
  userId,
}: Props) => {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const fetchListsQuery = api.list.fetchUserLists.useQuery(
    { username: session?.user.username || "", postUsername: postUsername },
    {
      enabled:
        session?.user.username != undefined &&
        postUsername != undefined &&
        isOpen,
    },
  );
  const addRemoveMembersMutation = api.list.addRemoveMembers.useMutation();
  const createListMutation = api.list.create.useMutation({
    async onSuccess() {
      await utils.list.fetchUserLists.invalidate();
    },
  });

  const [state, setState] = useState<AddRemoveListState>(
    AddRemoveListState.normal,
  );

  const [hasChanged, setHasChanged] = useState(false);
  const [addedList, setAddedList] = useState<boolean[]>([]);

  useEffect(() => {
    if (fetchListsQuery.data && addedList.length == 0) {
      setAddedList(
        fetchListsQuery.data.map((list) => list.listMembers.length == 1),
      );
    }
  }, [fetchListsQuery.data]);

  const isChanged = (arr: boolean[]) => {
    if (!fetchListsQuery.data) {
      return false;
    }
    const orig = fetchListsQuery.data.map(
      (list) => list.listMembers.length == 1,
    );
    if (arr.every((val, idx) => val == orig[idx])) {
      return false;
    }
    return true;
  };

  const handleCreateList = ({
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
    createListMutation.mutate({
      name,
      bio,
      isPrivate,
      bannerImageId,
    });

    setState(AddRemoveListState.normal);
  };

  const save = () => {
    if (!fetchListsQuery.data) {
      return false;
    }
    if (!isChanged(addedList)) return;

    const orig = fetchListsQuery.data.map(
      (list) => list.listMembers.length == 1,
    );

    const changed = addedList
      .map((val, idx) => ({
        listId: fetchListsQuery.data[idx]!.id,
        userId: userId!,
        added: val,
      }))
      .filter((_, idx) => addedList[idx] != orig[idx]);

    const deleted: { listId: string; userId: string }[] = [];
    const created: { listId: string; userId: string }[] = [];
    changed.forEach((val) => {
      if (val.added) {
        created.push({ listId: val.listId, userId: val.userId });
      } else {
        deleted.push({ listId: val.listId, userId: val.userId });
      }
    });

    addRemoveMembersMutation.mutate({ delete: deleted, create: created });
    setIsOpen(false);
  };

  return (
    <Modal centered isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {state == AddRemoveListState.create && (
        <ListForm
          headerText="Create a new List"
          saveText="Save"
          onSubmit={handleCreateList}
          onCancel={() => setState(AddRemoveListState.normal)}
          onDelete={() => {
            // eslint-disable-line @typescript-eslint/no-empty-function
          }}
        />
      )}
      {state == AddRemoveListState.normal && (
        <div className="z-10 h-[650px] w-[600px] overflow-y-auto rounded-2xl bg-white">
          <div className="sticky top-0 flex h-[53px] items-center bg-white px-4">
            <div className="w-14 cursor-pointer">
              <div
                onClick={() => setIsOpen(false)}
                className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200"
              >
                <CloseIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="w-full text-xl font-semibold">Pick a List</div>
            <BlackButton onClick={save} disabled={!hasChanged}>
              Save
            </BlackButton>
          </div>
          <TextButton
            type="button"
            onClick={(e) => setState(AddRemoveListState.create)}
            className="ml-1 font-normal text-blue-400"
          >
            Create a new List
          </TextButton>
          {fetchListsQuery.data?.map((list, idx) => (
            <ListCheckbox
              key={list.id}
              list={list}
              checked={addedList[idx]!}
              onToggleChecked={() => {
                const newList = addedList.map((val, index) =>
                  index == idx ? !val : val,
                );
                setAddedList(newList);
                setHasChanged(isChanged(newList));
              }}
            />
          ))}
        </div>
      )}
    </Modal>
  );
};

export default AddRemoveToListModal;
