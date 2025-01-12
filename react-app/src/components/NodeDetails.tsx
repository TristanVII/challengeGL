import { QuestionNode } from "../nodes/types";
import { useEffect, useState } from "react";
import { deleteQuestion } from "../service/Question";

interface NodeDetailsProps {
  node: QuestionNode;
  onClose: (reload: boolean) => void;
  onAskQuestion: (node: QuestionNode, question: string) => void;
  onRemoveQuestion: (node: QuestionNode) => void;
}

export function NodeDetails({
  node,
  onClose,
  onAskQuestion,
  onRemoveQuestion,
}: NodeDetailsProps) {
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    if (node.data.pending_question) {
      setNewQuestion(node.data.pending_question || "");
    }
  }, [node]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      onAskQuestion(node, newQuestion.trim());
    } else {
      onRemoveQuestion(node);
    }
  };

  const handleDelete = () => {
    if (node.id.startsWith("new-")) {
      onClose(true);
    }
    deleteQuestion(node.id)
      .then(() => {
        onClose(true);
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  // TODO handle this else where
  if ((node.type as any) === "debug-node") {
    return;
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative shadow-lg">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={() => onClose(false)}
        >
          ×
        </button>
        <div className="flex flex-row mb-2">
          <h3 className="text-xl font-semibold">Question</h3>
          <button
            onClick={handleDelete}
            className="px-3 ml-2 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
          >
            Delete
          </button>
        </div>
        <p className="mb-4 text-gray-700">{node.data.question}</p>
        <h3 className="text-xl font-semibold mb-2">Answer</h3>
        <p className="mb-6 text-gray-700">{node.data.answer}</p>

        <form onSubmit={handleSubmit} className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold mb-2">Pending question:</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
