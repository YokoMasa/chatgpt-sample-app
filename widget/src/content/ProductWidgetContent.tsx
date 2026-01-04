import { useOpenAiGlobal } from "../hooks/use-openai-global";
import { clsx } from "clsx";
import { ENV } from "../utils/Env";

export type ProductWidgetToolOutput = {
  products: {
    id: string;
    name: string;
    imagePath: string | undefined;
  }[];
}

export function ProductWidgetContent() {
  const toolOutput = useOpenAiGlobal("toolOutput") as ProductWidgetToolOutput | null;
  const theme = useOpenAiGlobal("theme");
  
  return (
    <>
      <div className="grid gap-y-2">
        { toolOutput != null && toolOutput.products.map(product => (
          <div
            className={clsx(
              "flex items-center gap-x-2",
              theme === "dark" ? "text-white" : undefined
            )}>
            { product.imagePath != null &&
              <img
                className="w-[60px] h-[60px]"
                src={`${ENV.baseUrl}/${product.imagePath}`}/>
            }
            { product.name }
          </div>
        ))}
      </div>
    </>
  );
}