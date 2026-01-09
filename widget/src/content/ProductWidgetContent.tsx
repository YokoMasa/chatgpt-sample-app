import { useOpenAiGlobal } from "../hooks/UseOpenaiGlobal";
import { clsx } from "clsx";
import { ENV } from "../utils/Env";
import { useMemo, useState } from "react";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Plus as PlusIcon } from "@openai/apps-sdk-ui/components/Icon"


export type ProductWidgetToolInput = {
  names: string[];
}

export type ProductWidgetToolOutput = {
  products: {
    id: string;
    name: string;
    imagePath: string | undefined;
  }[];
}

export function ProductWidgetContent() {
  const toolInput = useOpenAiGlobal("toolInput") as ProductWidgetToolInput | null;
  const toolOutput = useOpenAiGlobal("toolOutput") as ProductWidgetToolOutput | null;
  const theme = useOpenAiGlobal("theme");
  const [isExpanded, setIsExpanded] = useState(false);

  const productsToShow = useMemo(() => {
    if (toolOutput?.products == null) {
      return [];
    }

    if (3 < toolOutput.products.length && !isExpanded) {
      return toolOutput.products.slice(0, 3);
    } else {
      return toolOutput.products;
    }
  }, [
    toolOutput,
    isExpanded
  ]);

  if (toolOutput?.products == null) {
    return null;
  }
  
  return (
    <div
      className={clsx(
        theme === "dark" ? "dark" : undefined,
        "dark:text-white"
      )}>
      <h2 className="text-xl mt-3 mb-2">
        検索結果
      </h2>
      { toolInput != null && toolInput.names.length !== 0 &&
        <div className="py-1 text-xs">
          キーワード: { toolInput.names.join(",") }
        </div>
      }
      <div className="grid gap-y-2">
        { productsToShow.map(product => (
          <div
            className={"flex items-center gap-x-2"}>
            { product.imagePath != null &&
              <img
                className="w-[60px] h-[60px]"
                src={`${ENV.baseUrl}${product.imagePath}`}/>
            }
            { product.name }
          </div>
        ))}

        { 3 < toolOutput.products.length &&
          <div className="text-center">
            <Button variant="ghost" color="secondary" onClick={() => setIsExpanded(!isExpanded)}>
              { !isExpanded && <PlusIcon/> }
              { isExpanded ? "折りたたむ" : `もっと見る（${toolOutput.products.length - 3}件）` }
            </Button>
          </div>
        }

        { productsToShow.length === 0 &&
          <div className="col-span-2 flex items-center justify-center h-[40px] text-[#8F8F8F] dark:text-[AFAFAF]">
            条件に合う商品はありませんでした
          </div>
        }
      </div>
    </div>
  );
}