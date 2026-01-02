import { notifyGlobalsChange } from "../types";
import { CartWidgetToolOutput } from "./CartWidgetContent";

setTimeout(() => {
  const toolOutput: CartWidgetToolOutput = {
    items: [
      { id: "1", productId: "10", productName: "キャベツ", quantity: 1 },
      { id: "2", productId: "46", productName: "にんじん", quantity: 3 },
      { id: "3", productId: "19", productName: "さつまいも", quantity: 1 },
    ]
  };
  window.openai.toolOutput = toolOutput;
  notifyGlobalsChange();
}, 300);