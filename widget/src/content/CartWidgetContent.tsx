import { clsx } from "clsx";
import { useOpenAiGlobal } from "../hooks/use-openai-global";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { ExternalLink } from "@openai/apps-sdk-ui/components/Icon";
import { useCallback } from "react";

export type CartWidgetToolOutput = {
  items: {
    id: string;
    productName: string;
    productId: string;
    quantity: number;
  }[]
}

export function CartWidgetContent() {
  const toolOutput = useOpenAiGlobal("toolOutput") as CartWidgetToolOutput | null;
  const theme = useOpenAiGlobal("theme");

  const handleOpenInExternalTabClick = useCallback(() => {
    window.openai.openExternal({ href: "https://chatgpt-sample-app-481008.an.r.appspot.com/" });
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
        className={"grid grid-cols-[max-content_1fr] gap-2"}>
        { toolOutput != null && toolOutput.items.map(item => (
          <>
            <div>{ item.productName }</div>
            <div>×{ item.quantity }個</div>
          </>
        )) }
      </div>
      <div className="mt-4">
        <Button
          color="secondary"
          block
          onClick={handleOpenInExternalTabClick}>
          ○×商店でカートを確認する
          <ExternalLink/>
        </Button>
      </div>
    </div>
  );
}