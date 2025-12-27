import "./styles.css";
import { createRoot } from "react-dom/client";

function HelloWorldWidget() {
  return (
    <h1 className="text-2xl text-blue-800">
      Hello World!
    </h1>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<HelloWorldWidget/>);