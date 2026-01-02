import { notifyGlobalsChange } from "../types";
import { CartWidgetToolOutput } from "./CartWidgetContent";

setTimeout(() => {
  const toolOutput: CartWidgetToolOutput = {
    items: [
      // { id: "1", productId: "10", productName: "キャベツ", productImagePath: "/static/cabbage.png", quantity: 1 },
      // { id: "2", productId: "46", productName: "にんじん", productImagePath: "/static/carrot.png" ,quantity: 3 },
      // { id: "3", productId: "19", productName: "さつまいも", productImagePath: "/static/satsumaimo.png", quantity: 1 },
    ]
  };
  window.openai.toolOutput = toolOutput;
  notifyGlobalsChange();
}, 300);