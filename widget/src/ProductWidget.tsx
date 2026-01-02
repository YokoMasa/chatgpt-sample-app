import "./styles.css";
import { createRoot } from "react-dom/client";
import { ProductWidgetContent } from "./content/ProductWidgetContent";

function ProductWidget() {
  return <ProductWidgetContent/>
}

const root = createRoot(document.getElementById("root")!);
root.render(<ProductWidget/>);