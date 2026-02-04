import { Theme } from "@radix-ui/themes";
import "./App.css";
import HtmlElementsContainer from "./components/HtmlElementsContainer";
import ThreeCanvas from "./components/ThreeCanvas";

function App() {
  return (
    // <div className="h-full w-full overflow-hidden bg-zinc-900 text-sky-50">
    <Theme>
      <HtmlElementsContainer />
      <ThreeCanvas />
    </Theme>
    // </div>
  );
}

export default App;
