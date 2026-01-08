import { useCallback, useState } from "react";
import { notifyOpenaiGlobalsChange } from "../types";
import { clsx } from "clsx";
import { ToolOutputSetting } from "./ToolOutputSetting";

export type PreviewContentProps = {
  previewContentWrapperEl: HTMLElement;
}

export function PreviewContent({
  previewContentWrapperEl
}: PreviewContentProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = useCallback((isDarkMode: boolean) => {
    setIsDarkMode(isDarkMode);
    if (isDarkMode) {
      previewContentWrapperEl.style.backgroundColor = "#212121";
      window.openai.theme = "dark";
    } else {
      previewContentWrapperEl.style.backgroundColor = "#FFFFFF";
      window.openai.theme = "light";
    }
    notifyOpenaiGlobalsChange();
  }, [
    setIsDarkMode,
    previewContentWrapperEl
  ]);

  return (
    <div>
      <h2 className="text-2xl">
        プレビュー設定
      </h2>
      <div className="mt-3 grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2">
        <div className="font-bold self-center">
          テーマ:
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <input
              type="radio"
              name="theme"
              checked={!isDarkMode}
              onChange={() => handleThemeChange(false)}
              id="ctrl-theme-dark"/>
            <label
              htmlFor="ctrl-theme-dark"
              className={clsx(
                "p-2 border rounded-sm cursor-pointer",
                isDarkMode ? "border-transparent" : "border-black"
              )}>
              ライト
            </label>
          </div>
          <div className="flex items-center gap-x-1">
            <input
              type="radio"
              name="theme"
              checked={isDarkMode}
              onChange={() => handleThemeChange(true)}
              id="ctrl-theme-light"/>
            <label
              htmlFor="ctrl-theme-light"
              className={clsx(
                "p-2 border rounded-sm cursor-pointer",
                isDarkMode ? "border-black" : "border-transparent"
              )}>
              ダーク
            </label>
          </div>
        </div>

        <div className="font-bold self-center">
          toolOutput:
        </div>
        <ToolOutputSetting/>
      </div>
    </div>
  );
}
