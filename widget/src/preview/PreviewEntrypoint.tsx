import { createRoot } from "react-dom/client";
import { PreviewContent } from "./PreviewContent";
import { notifyGlobalsChange } from "../types";

const originalBodyContents = [...document.body.children];

document.body.replaceChildren();
document.body.insertAdjacentHTML("afterbegin", `
<div class="grid grid-cols-[350px_1fr]">
  <div id="_preview-control-panel" class="p-4 h-screen border-r"></div>
  <div id="_preview-content-wrapper" class="p-4">
    <div id="_preview-content">
    </div>
  </div>
</div>
`);

const previewContentEl = document.getElementById("_preview-content") as HTMLDivElement;
const previewContentWrapperEl = document.getElementById("_preview-content-wrapper") as HTMLDivElement;
const previewControlPanelEl = document.getElementById("_preview-control-panel") as HTMLDivElement;

previewContentEl.replaceChildren(...originalBodyContents.values());

function PreviewController() {
  return <PreviewContent previewContentWrapperEl={previewContentWrapperEl}/>
}
const root = createRoot(previewControlPanelEl);
root.render(<PreviewController/>);
notifyGlobalsChange();
