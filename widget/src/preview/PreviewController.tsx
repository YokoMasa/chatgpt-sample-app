import { createRoot } from "react-dom/client";
import { PreviewControllerContent } from "./PreviewControllerContent";

function PreviewController() {
  return <PreviewControllerContent/>
}
const root = createRoot(document.getElementById("preview-controller")!);
root.render(<PreviewController/>);