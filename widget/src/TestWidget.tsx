import "./styles.css";
import { createRoot } from "react-dom/client";
import { TestWidgetContent } from "./content/TestWidgetContent";

function TestWidget() {
  return <TestWidgetContent/>
}

const root = createRoot(document.getElementById("root")!);
root.render(<TestWidget/>);