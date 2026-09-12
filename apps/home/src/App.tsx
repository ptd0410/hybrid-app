import { Body, Dock, Pagination, Statusbar } from "./components";

function App() {
  return (
    <>
      <div className="h-screen w-screen">
        <Statusbar />
        <Body />
        <div className="fixed w-full bottom-0 left-0 z-1">
          <Pagination />
          <Dock />
        </div>
      </div>
    </>
  );
}

export default App;
