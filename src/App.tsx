import List from "./components/List";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { saveUUID } from "./store/features/uuid/uuidSlice";

function App() {
  const dispatch = useDispatch();
  const uuid = useSelector((state: RootState) => state.uuid.uuid);
  useEffect(() => {
    if (uuid) {
      return;
    }

    dispatch(saveUUID(uuidv4()));
  }, [uuid, dispatch]);

  return (
    <>
      <div className="flex justify-center">
        <div className="w-[768px] max-md:w-full min-h-dvh flex py-6">
          <List />
        </div>
      </div>
    </>
  );
}

export default App;
