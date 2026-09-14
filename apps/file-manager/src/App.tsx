import "./App.css";
import { useVolumnes } from "./hooks";
import { fsApi } from "./modules/fs";

function App() {
  const { data } = useVolumnes();

  return (
    <>
      <div
        onClick={async () => {
          console.log("hehee", await fsApi.readDir(data?.[0].path || ""));
        }}
      >
        test
      </div>
      <div
        onClick={async () => {
          console.log("hehee", await fsApi.favorites());
        }}
      >
        test 2
      </div>
    </>
  );
}

export default App;
