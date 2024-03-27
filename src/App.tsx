import { Link } from "react-router-dom";
import AddDrawing from "./components/AddDrawing";
import List from "./components/List";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

function App() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <>
      <header className="h-14 bg-slate-300 flex justify-center">
        <div className="w-1/2 flex justify-end items-center px-6">
          {user ? (
            <>
              반갑습니다.{user.nickname}님
              <button className="px-2 py-1 text-white bg-slate-500 rounded">
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
