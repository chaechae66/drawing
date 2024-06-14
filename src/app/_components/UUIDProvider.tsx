"use client";

import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { v4 as uuidv4 } from "uuid";
import { saveUUID } from "../../store/features/uuid/uuidSlice";

interface Props {
  children: ReactNode;
}

export default function UUIDProvider({ children }: Props) {
  const dispatch = useDispatch();
  const uuid = useSelector((state: RootState) => state.uuid.uuid);
  useEffect(() => {
    if (uuid) {
      return;
    }

    dispatch(saveUUID(uuidv4()));
  }, [uuid, dispatch]);

  return <>{children}</>;
}
