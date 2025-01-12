import { DebugNode } from "../nodes/types";

interface NodeSelectorProps {
  addNode: () => void;
  addDebugNode: () => void;
  debugNode: DebugNode | null;
  removeDebugNode: () => void;
}

export function NodeSelector({
  addNode,
  addDebugNode,
  debugNode,
  removeDebugNode,
}: NodeSelectorProps) {
  return (
    <div className="flex flex-col gap-y-2 p-2 border rounded-xl bg-white">
      <button
        onClick={addNode}
        className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
      >
        Add Question Node
      </button>
      {!debugNode && (
        <button
          onClick={addDebugNode}
          className="px-3 py-2 bg-black text-white rounded-lg transition-colors"
        >
          Add Debug Node
        </button>
      )}
      {debugNode && (
        <button
          onClick={removeDebugNode}
          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Del Debug Node
        </button>
      )}
    </div>
  );
}
