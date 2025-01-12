interface NodeSelectorProps {
  addNode: () => void;
}

export function NodeSelector({ addNode }: NodeSelectorProps) {
  return (
    <div className="flex flex-col gap-y-2 p-2 border rounded-xl bg-white">
      <button
        onClick={addNode}
        className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
      >
        Add Question Node
      </button>
    </div>
  );
}
