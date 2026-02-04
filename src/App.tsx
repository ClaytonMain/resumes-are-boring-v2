import "./App.css";
import { HtmlElementsContainer } from "./components/HtmlElementsContainer";
import ThreeCanvas from "./components/ThreeCanvas";

function App() {
  return (
    <div className="h-full w-full overflow-hidden bg-zinc-900 text-sky-50">
      <HtmlElementsContainer />
      <ThreeCanvas />
    </div>
  );
}

export default App;
