import { createRoot } from "react-dom/client";
import { CartWidgetContent } from "./content/CartWidgetContent";

function CartWidget() {
  return <CartWidgetContent/>
}
const root = createRoot(document.getElementById("root")!);
root.render(<CartWidget/>);
