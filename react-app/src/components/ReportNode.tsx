import { QuestionNode } from "../nodes/types";
import { Status } from "../service/Question";

export default function ReportNode({
  node,
  index,
  status,
}: {
  node: QuestionNode;
  index: number;
  status: Status;
}) {
  return (
    <div
      key={index}
      className="mb-6 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <p className="text-xl font-semibold text-gray-800">
        Node {index + 1} - {status}
      </p>
      <div className="mt-4 space-y-3">
        <p className="text-gray-600">
          <span className="font-medium text-gray-700">Previous Question:</span>{" "}
          {node.data.question}
        </p>
        <p className="text-gray-600">
          <span className="font-medium text-gray-700">Pending Question:</span>{" "}
          {node.data.pending_question}
        </p>
        {status === "running" && (
          <>
            <p className="text-gray-600">
              <span className="font-medium text-gray-700">Status:</span>{" "}
              Running...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
