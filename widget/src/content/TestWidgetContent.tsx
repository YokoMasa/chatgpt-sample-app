import { useOpenAiGlobal } from "../hooks/use-openai-global";
import { clsx } from "clsx";

export type TestWidgetToolOutput = {
  products: {
    id: string;
    name: string;
    imagePath: string | undefined;
  }[];
}

export function TestWidgetContent() {
  const toolOutput = useOpenAiGlobal("toolOutput") as TestWidgetToolOutput | null;
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
                src={`https://chatgpt-sample-app-481008.an.r.appspot.com/${product.imagePath}`}/>
            }
            { product.name }
          </div>
        ))}
      </div>
    </>
  );
}