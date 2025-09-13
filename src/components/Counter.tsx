import { Plus, Minus, RotateCcw } from "lucide-react";
import { useAppStore } from "../stores/appStore";

export function Counter() {
  const { count, increment, decrement, reset } = useAppStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Counter
      </h2>
      <div className="text-4xl font-bold text-blue-600 text-center mb-6">
        {count}
      </div>
      <div className="flex gap-2 justify-center">
        <button
          onClick={decrement}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Minus size={20} />
          Decrement
        </button>
        <button
          onClick={increment}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={20} />
          Increment
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
    </div>
  );
}