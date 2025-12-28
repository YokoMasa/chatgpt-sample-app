import { ReactNode } from "react";

export function CustomButton({ children }: { children: ReactNode }) {
  return (
    <button className="bg-blue-800 text-white p-1 rounded hover:bg-blue-700">
      { children }
    </button>
  );
}