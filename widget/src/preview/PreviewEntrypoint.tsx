import { createRoot } from "react-dom/client";
import { PreviewContent } from "./PreviewContent";
import { notifyOpenaiGlobalsChange } from "../types";

// Setup openai object mock
window.openai.openExternal = (({ href }) => {
  window.open(href, "_blank");
});

// Modify entrypoint html for preview
const originalBodyContents = [...document.body.children];

document.body.replaceChildren();
document.body.insertAdjacentHTML("afterbegin", `
<div class="grid grid-cols-[1fr_400px]">
  <div id="_preview-control-panel" class="p-4 h-screen border-r"></div>
  <div id="_preview-content-wrapper">
    <div id="_preview-content">
    </div>
  </div>
</div>
`);

const previewContentEl = document.getElementById("_preview-content") as HTMLDivElement;
const previewContentWrapperEl = document.getElementById("_preview-content-wrapper") as HTMLDivElement;
const previewControlPanelEl = document.getElementById("_preview-control-panel") as HTMLDivElement;

previewContentEl.replaceChildren(...originalBodyContents.values());

// Render preview
function PreviewController() {
  return <PreviewContent previewContentWrapperEl={previewContentWrapperEl}/>
}
const root = createRoot(previewControlPanelEl);
root.render(<PreviewController/>);

// Notify widget
notifyOpenaiGlobalsChange();
