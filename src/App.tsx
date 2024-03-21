import AddDrawing from "./components/AddDrawing/AddDrawing";
import List from "./components/List/List";

function App() {
  return (
    <div className="flex justify-center">
      <div className="w-1/2 h-dvh flex p-6">
        <AddDrawing />
        <List />
      </div>
    </div>
  );
}

export default App;
