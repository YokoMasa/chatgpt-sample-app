import { useCallback, useMemo, useState } from "react";
import { useOpenAiGlobal } from "../hooks/UseOpenaiGlobal";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { notifyOpenaiGlobalsChange } from "../types";

export function ToolInputSetting() {
  const toolInput = useOpenAiGlobal("toolInput");
  const [isEditing, setIsEditing] = useState(false);

  const currentValue = toolInput == null
    ? ""
    : JSON.stringify(toolInput, null, 2);

  if (!isEditing) {
    return (
      <div className="grid gap-y-2">
        <pre className={"p-2 border rounded-sm text-xs min-h-[100px] max-h-[300px] overflow-y-auto"}>
          { currentValue }
        </pre>

        <div>
          <Button
            color="primary"
            variant="ghost"
            onClick={() => setIsEditing(true)}>
            編集する
          </Button>
        </div>
      </div>
    );
  } else {
    return <ToolInputEditor value={currentValue} onFinish={() => setIsEditing(false)}/>
  }
}

function ToolInputEditor({
  value: initialValue,
  onFinish
}: {
  value: string;
  onFinish: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  const isValid = useMemo(() => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }, [
    value
  ]);

  const handleSave = useCallback(() => {
    window.openai.toolInput = JSON.parse(value);
    notifyOpenaiGlobalsChange();
    onFinish();
  }, [
    value,
    onFinish
  ]);

  return (
    <div className="grid gap-y-2">
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        className="w-full text-xs h-[300px] p-2 border rounded-sm">
      </textarea>

      <div className="gap-x-2">
        { !isValid &&
          <div className="text-xs text-red-600 pb-1">
            有効なJSONではありません。
          </div>
        }

        <div className="flex items-center">
          <Button
            color="secondary"
            variant="ghost"
            onClick={onFinish}>
            キャンセル
          </Button>
          <Button
            color="primary"
            disabled={!isValid}
            onClick={handleSave}>
            保存する
          </Button>
        </div>
      </div>
    </div>
  );
}