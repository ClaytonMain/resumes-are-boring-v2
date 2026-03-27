import { Leva } from "leva";
import "./App.css";
import HtmlElementsContainer from "./components/html/HtmlElementsContainer";
import ComponentStateListener from "./components/three/ComponentStateListener";
import DebugListener from "./components/three/DebugListener";
import ThreeCanvas from "./components/three/ThreeCanvas";
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
