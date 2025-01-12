import { useState } from "react";
import { DebugNode, QuestionNode } from "../nodes/types";
import ReportNode from "./ReportNode";
import { Status } from "../service/Question";
import { DebugUtils } from "../utils/debugUtils";

interface RunReportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pending_nodes: QuestionNode[];
  debugNode: DebugNode | null;
}

export function RunReportPanel({
  isOpen,
  onClose,
  pending_nodes,
  debugNode,
}: RunReportPanelProps) {
  const [status, setStatus] = useState<Status>(Status.PENDING);
  const [doneNodes, setDoneNodes] = useState<
    { node: QuestionNode; status: Status }[]
  >([]);
  const onRun = async () => {
    setStatus(Status.RUNNING);
    let mediaRecorder: MediaRecorder | null = null;
    let dataUtils: DebugUtils | null = null;

    try {
      if (debugNode && debugNode.data.debugUtils) {
        dataUtils = debugNode.data.debugUtils;
        mediaRecorder = await dataUtils.startScreenCapture();
        await dataUtils.interceptFetch();
      }

      for (const node of pending_nodes) {
        if (node.data?.func) {
          try {
            await node.data.func(node);
            setDoneNodes((prev) => [
              ...prev,
              { node, status: Status.COMPLETED },
            ]);
          } catch (error) {
            setDoneNodes((prev) => [...prev, { node, status: Status.FAILED }]);
          }
        }
      }
    } catch (error) {
      setStatus(Status.FAILED);
      console.error("Error in onRun:", error);
    } finally {
      setStatus(Status.COMPLETED);
      if (mediaRecorder && dataUtils) {
        mediaRecorder.stop();
        dataUtils.stopAndSaveTrafficLog();
      }
    }
  };

  console.log(status);

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
              if (status === Status.COMPLETED) {
                window.location.reload();
              }
              onClose();
              setStatus(Status.PENDING);
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
        {(status === Status.PENDING || status === Status.FAILED) && (
          <div className="flex flex-col gap-2">
            {pending_nodes.map((node, index) => (
              <ReportNode
                node={node}
                index={index}
                key={index}
                status={status}
              />
            ))}
          </div>
        )}
        {status !== Status.PENDING && (
          <div className="flex flex-col gap-2">
            {doneNodes.map(({ node, status }, index) => (
              <ReportNode
                node={node}
                index={index}
                key={index}
                status={status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
