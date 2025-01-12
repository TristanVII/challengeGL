import { QuestionNode } from "../nodes/types";

interface NodeDetailsProps {
  node: QuestionNode;
  onClose: () => void;
}

export function NodeDetails({ node, onClose }: NodeDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-xl font-semibold mb-2">Question</h3>
        <p className="mb-4 text-gray-700">{node.data.question}</p>
        <h3 className="text-xl font-semibold mb-2">Answer</h3>
        <p className="text-gray-700">{node.data.answer}</p>
      </div>
    </div>
  );
}
