import { useEffect, useMemo, useState } from "react";

export function useAction<T>() {
  const [openCreate, setOpenCreate] = useState(false);
  const [edit, setEdit] = useState<{ open: boolean; value: T | null }>({
    open: false,
    value: null,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [valueDelete, setValueDelete] = useState<string | number | null>(null);

  useEffect(() => {
    if (!edit.open) {
      setEdit((prev) => ({ ...prev, value: null }));
    }
  }, [edit.open]);

  useEffect(() => {
    if (valueDelete) {
      setDeleteOpen(true);
    } else {
      setDeleteOpen(false);
    }
  }, [valueDelete]);

  const memoizedAction = useMemo(
    () => ({
      openCreate,
      setOpenCreate,
      editOpen: edit.open,
      setEditOpen: (open: boolean) => setEdit((prev) => ({ ...prev, open })),
      valueEdit: edit.value,
      setValueEdit: (value: T | null) =>
        setEdit((prev) => ({ ...prev, value })),
      deleteOpen,
      setDeleteOpen,
      valueDelete,
      setValueDelete,
    }),
    [
      openCreate,
      setOpenCreate,
      edit.open,
      setEdit,
      edit.value,
      setEdit,
      deleteOpen,
      setDeleteOpen,
      valueDelete,
      setValueDelete,
    ],
  );

  return memoizedAction;
}
