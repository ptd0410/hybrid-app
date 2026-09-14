import {
  Background,
  Body,
  Dock,
  DragItem,
  Pagination,
  SnapPreview,
  Statusbar,
} from "./components";
import { useKeyboard } from "./hooks";

function App() {
  useKeyboard();

  return (
    <>
      <div className="h-screen w-screen text-white">
        <Statusbar />
        <Body />
        <div className="fixed w-full bottom-0 left-0 z-1">
          <Pagination />
          <Dock />
        </div>
        <Background />
      </div>
      <SnapPreview />
      <DragItem />
    </>
  );
}

export default App;
