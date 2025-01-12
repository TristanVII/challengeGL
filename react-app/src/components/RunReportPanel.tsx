import { useState } from "react";
import { QuestionNode } from "../nodes/types";
import ReportNode from "./ReportNode";

interface RunReportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pending_nodes: QuestionNode[];
}

export function RunReportPanel({
  isOpen,
  onClose,
  pending_nodes,
}: RunReportPanelProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const onRun = async () => {
    setIsRunning(true);
  };

  return (
    <div
      className={`fixed top-20 right-4 h-[90vh] w-96 bg-white border border-gray-200 rounded-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-40`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsRunning(false);
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold">Run Report</h2>
        </div>
        <button
          className="text-lg text-gray-500 hover:text-green-700 p-1 bg-green-100 hover:bg-green-200 text-green-500 font-semibold rounded-lg border border-green-500 transition-colors z-50 flex items-center"
          onClick={onRun}
        >
          Execute
        </button>
      </div>
      <div className="p-4 text-gray-600">
        <h3 className="text-lg font-bold">Pending Tasks</h3>
        <div className="flex flex-col gap-2">
          {pending_nodes.map((node, index) => (
            <ReportNode
              node={node}
              index={index}
              key={index}
              isRunning={isRunning}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
