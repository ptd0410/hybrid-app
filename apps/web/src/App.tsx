import { bridge } from "bridge";
import "./App.css";

function App() {
  return (
    <>
      <div
        onClick={async () => {
          console.log(
            "haaha",
            await bridge.request("openApp", { id: "file-manager" }),
          );
        }}
      >
        aha
      </div>
    </>
  );
}

export default App;
