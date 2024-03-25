import { Link } from "react-router-dom";
import AddDrawing from "./components/AddDrawing";
import List from "./components/List";

function App() {
  return (
    <>
      <header className="h-14 bg-slate-300 flex justify-center">
        <div className="w-1/2 flex justify-end items-center px-6">
          <Link to={"/login"}>
            <button className="px-2 py-1 text-white bg-slate-500 rounded">
              로그인
            </button>
          </Link>
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
