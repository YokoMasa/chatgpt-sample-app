import { ProductWidgetToolOutput } from "./ProductWidgetContent";
import { notifyGlobalsChange } from "../types";

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.openai.toolOutput = {
      products: [
        { id: "1", name: "明日葉", imagePath: "/static/ashitaba.png" },
        { id: "8", name: "かぼちゃ", imagePath: "/static/kabocha.png" }
      ]
    } as ProductWidgetToolOutput;
    notifyGlobalsChange();
  }, 300);
});