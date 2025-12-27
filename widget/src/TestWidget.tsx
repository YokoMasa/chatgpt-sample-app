import "./styles.css";
import { useState } from "react";
import { createRoot } from "react-dom/client";

function TestWidget() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-xl text-green-800">
        Hello World!
      </h1>
      <div>
        <button onClick={() => setCount(count + 1)}>
          push me
        </button>
        <div>
          { count }
        </div>
      </div>
    </>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<TestWidget/>);