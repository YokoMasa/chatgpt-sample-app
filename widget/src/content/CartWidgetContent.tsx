import { clsx } from "clsx";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { ExternalLink, Plus as PlusIcon } from "@openai/apps-sdk-ui/components/Icon";
import { Fragment, useCallback, useMemo, useState } from "react";
import { ENV } from "../utils/Env";
import { useOpenAiGlobal } from "../hooks/UseOpenaiGlobal";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOpenInExternalTabClick = useCallback(() => {
    window.openai.openExternal({ href: ENV.baseUrl });
  }, []);

  const itemsToShow = useMemo(() => {
    if (toolOutput == null) {
      return [];
    }

    if (3 < toolOutput.items.length && !isExpanded) {
      return toolOutput.items.slice(0, 3);
    } else {
      return toolOutput.items;
    }
  }, [
    toolOutput,
    isExpanded
  ]);

  if (toolOutput == null) {
    return null;
  }

  return (
    <div
      data-theme={theme === "dark" ? "dark" : undefined}
      className={clsx(
        theme === "dark" ? "dark" : undefined,
        "dark:text-white"
      )}>
      <h2 className="text-xl mb-3">
        カートの中身
      </h2>
      <div
        className={"grid grid-cols-[max-content_1fr] gap-3"}>
        { itemsToShow.map(item => (
          <Fragment key={item.id}>
            <div className="flex items-center gap-x-2">
              { item.productImagePath != null &&
                <img
                  className="w-[60px] h-[60px]"
                  src={`${ENV.baseUrl}${item.productImagePath}`}/>
              }
              <span>
                { item.productName }
              </span>
            </div>
            <div className="self-center">
              ×{ item.quantity }個
            </div>
          </Fragment>
        )) }

        { 3 < toolOutput.items.length &&
          <div className="col-span-2 text-center">
            <Button variant="ghost" color="secondary" onClick={() => setIsExpanded(!isExpanded)}>
              { !isExpanded && <PlusIcon/> }
              { isExpanded ? "折りたたむ" : `もっと見る（${toolOutput.items.length - 3}件）` }
            </Button>
          </div>
        }

        { itemsToShow.length === 0 &&
          <div className="col-span-2 flex items-center justify-center h-[40px] text-[#8F8F8F] dark:text-[AFAFAF]">
            カートは空です
          </div>
        }
      </div>

      { 0 < itemsToShow.length &&
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