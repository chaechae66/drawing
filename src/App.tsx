import { Link } from "react-router-dom";
import AddDrawing from "./components/AddDrawing";
import List from "./components/List";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { removeUser } from "./store/features/user/userSlice";
import { MouseEventHandler, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { removeToken } from "./store/features/token/tokenSlice";
import { saveUUID } from "./store/features/uuid/uuidSlice";

function App() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const uuid = useSelector((state: RootState) => state.uuid.uuid);
  const queryClient = useQueryClient();

  const onLogOut: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    dispatch(removeToken());
    dispatch(removeUser());
    queryClient.invalidateQueries({ queryKey: ["article"] });
  };

  useEffect(() => {
    if (uuid) {
      return;
    }

    dispatch(saveUUID(uuidv4()));
  }, [uuid, dispatch]);

  return (
    <>
      <header className="h-14 bg-slate-300 flex justify-center">
        <div className="w-1/2 flex justify-end items-center px-6">
          {user.id && user.nickname ? (
            <>
              반갑습니다.{user.nickname}님
              <button
                onClick={onLogOut}
                className="block px-2 py-1 text-white bg-slate-500 rounded"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link to={"/login"}>
              <button className="px-2 py-1 text-white bg-slate-500 rounded">
                로그인
              </button>
            </Link>
          )}
        </div>
      </header>
      <div className="flex justify-center">
        <div className="w-1/2 h-dvh flex p-6">
          <AddDrawing />
          <List />
        </div>
      </div>
    </>
  );
}

export default App;
