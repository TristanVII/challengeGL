import { useState, useEffect } from "react";
import { QuestionNode } from "../nodes/types";

export default function ReportNode({
  node,
  index,
  isRunning,
}: {
  node: QuestionNode;
  index: number;
  isRunning: boolean;
}) {
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (isRunning) {
      const execFunc = async () => {
        console.log(node);
        if (node.data.func) {
          try {
            const res = await node.data.func(node);
            console.log(res);
            setResult(res.statusText);
          } catch (error) {
            setResult("An error occurred.");
          }
        }
      };

      execFunc();
    }
  }, [isRunning, node]);

  return (
    <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
      <p className="font-medium">Node {index + 1}:</p>
      {isRunning ? (
        <>
          <p className="mt-1">Running...</p>
          <p className="mt-1">{result}</p>
        </>
      ) : (
        <p className="mt-1">{node.data.pending_question}</p>
      )}
    </div>
  );
}
