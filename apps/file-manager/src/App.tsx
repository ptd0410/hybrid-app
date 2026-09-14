import { bridge } from "bridge";
import "./App.css";

function App() {
  return (
    <>
      <div
        onClick={async () => {
          console.log(await bridge.request("volumes"));
        }}
      >
        test
      </div>
    </>
  );
}

export default App;
