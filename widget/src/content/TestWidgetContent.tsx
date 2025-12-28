import { useState } from "react";

export function TestWidgetContent() {
  const [count, setCount] = useState(0);
  
  return (
    <>
      <h1 className="text-2xl text-green-800">
        Hello World! It's me.
      </h1>
      <div>
        <button
          className="p-1 bg-green-700 text-white hover:bg-green-600 rounded"
          onClick={() => setCount(count + 1)}>
          push me
        </button>
        <div>
          { count }
        </div>
      </div>
    </>
  );
}