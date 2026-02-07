import "./App.css";
import DebugListener from "./components/DebugListener";
import HtmlElementsContainer from "./components/HtmlElementsContainer";
import ThreeCanvas from "./components/ThreeCanvas";

function App() {
  return (
    <div className="h-full w-full overflow-hidden text-sky-50">
      <DebugListener />
      <HtmlElementsContainer />
      <ThreeCanvas />
    </div>
  );
}

export default App;
