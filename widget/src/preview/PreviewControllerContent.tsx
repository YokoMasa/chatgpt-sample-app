import { useCallback, useState } from "react";
import { notifyGlobalsChange } from "../types";

export function PreviewControllerContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = useCallback((isDarkMode: boolean) => {
    setIsDarkMode(isDarkMode);
    if (isDarkMode) {
      document.body.style.backgroundColor = "#212121";
      document.body.classList.add("dark");
      window.openai.theme = "dark";
    } else {
      document.body.style.backgroundColor = "#FFFFFF";
      document.body.classList.remove("dark");
      window.openai.theme = "light";
    }
    notifyGlobalsChange();
  }, [
    setIsDarkMode
  ]);

  return (
    <div className="dark:text-white">
      <h2 className="my-3 text-xl">
        コントロールパネル
      </h2>
      <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2">
        <div>
          テーマ
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
              htmlFor="ctrl-theme-dark">
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
              htmlFor="ctrl-theme-light">
              ダーク
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
