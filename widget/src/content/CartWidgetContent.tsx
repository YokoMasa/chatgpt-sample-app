import { clsx } from "clsx";
import { useOpenAiGlobal } from "../hooks/use-openai-global";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { ExternalLink } from "@openai/apps-sdk-ui/components/Icon";
import { useCallback } from "react";
import { ENV } from "../utils/Env";

export type CartWidgetToolOutput = {
  items: {
    id: string;
    productName: string;
    productId: string;
    productImagePath?: string;
    quantity: number;
  }[]
}

export function CartWidgetContent() {
  const toolOutput = useOpenAiGlobal("toolOutput") as CartWidgetToolOutput | null;
  const theme = useOpenAiGlobal("theme");

  const handleOpenInExternalTabClick = useCallback(() => {
    window.openai.openExternal({ href: ENV.baseUrl });
  }, []);

  return (
    <div
      className={clsx(
        theme === "dark" ? "dark" : undefined,
        "dark:text-white"
      )}>
      <h2 className="text-xl my-3">
        カートの中身
      </h2>
      <div
        className={"grid grid-cols-[max-content_1fr] gap-3"}>
        { toolOutput != null && toolOutput.items.map(item => (
          <>
            <div className="flex items-center gap-x-2">
              { item.productImagePath != null &&
                <img
                  className="w-[60px] h-[60px]"
                  src={`${ENV.baseUrl}/${item.productImagePath}`}/>
              }
              <span>
                { item.productName }
              </span>
            </div>
            <div className="self-center">
              ×{ item.quantity }個
            </div>
          </>
        )) }

        { toolOutput != null && toolOutput.items.length === 0 &&
          <div className="col-span-2 flex items-center justify-center h-[40px] text-[#8F8F8F] dark:text-[AFAFAF]">
            カートは空です
          </div>
        }
      </div>

      { toolOutput != null && 0 < toolOutput.items.length &&
        <div className="mt-4">
          <Button
            color="secondary"
            block
            onClick={handleOpenInExternalTabClick}>
            ○×商店でカートを確認する
            <ExternalLink/>
          </Button>
        </div>
      }
    </div>
  );
}