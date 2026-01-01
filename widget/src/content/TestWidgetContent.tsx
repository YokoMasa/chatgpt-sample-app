import { useOpenAiGlobal } from "../hooks/use-openai-global";

export type TestWidgetToolOutput = {
  products: {
    id: string;
    name: string;
    imagePath: string | undefined;
  }[];
}

export function TestWidgetContent() {
  const toolOutput = useOpenAiGlobal("toolOutput") as TestWidgetToolOutput | null;
  
  return (
    <>
      <div className="grid row-gap-2">
        { toolOutput != null && toolOutput.products.map(product => (
          <div className="flex items-center column-gap-2">
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