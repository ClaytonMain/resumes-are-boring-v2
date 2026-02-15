import { Leva } from "leva";
import "./App.css";
import ComponentStateListener from "./components/ComponentStateListener";
import DebugListener from "./components/DebugListener";
import HtmlElementsContainer from "./components/HtmlElementsContainer";
import ThreeCanvas from "./components/ThreeCanvas";
import useAppStore from "./stores/useAppStore";

function App() {
  const debug = useAppStore((state) => state.debug);
  return (
    <>
      <Leva hidden={!debug} />
      <div className="h-full w-full overflow-hidden text-sky-50">
        <DebugListener />
        <ComponentStateListener />
        <HtmlElementsContainer />
        <ThreeCanvas />
      </div>
    </>
  );
}

export default App;
