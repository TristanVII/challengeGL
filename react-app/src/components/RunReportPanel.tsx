import { useState } from "react";
import { AppNode, DebugNode, QuestionNode } from "../nodes/types";
import ReportNode from "./ReportNode";
import { Status } from "../service/Question";
import { DebugUtils } from "../utils/debugUtils";
import { Edge } from "@xyflow/react";
import { getExecutionOrder } from "../utils/topologicalSort";

interface RunReportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pending_nodes: QuestionNode[];
  debugNode: DebugNode | null;
  nodes: AppNode[];
  edges: Edge[];
}

export function RunReportPanel({
  isOpen,
  onClose,
  pending_nodes,
  debugNode,
  nodes,
}: RunReportPanelProps) {
  const [status, setStatus] = useState<Status>(Status.PENDING);
  const [doneNodes, setDoneNodes] = useState<
    { node: QuestionNode; status: Status }[]
  >([]);

  console.log(getExecutionOrder(nodes), nodes);
  const onRun = async () => {
    setStatus(Status.RUNNING);
    let mediaRecorder: MediaRecorder | null = null;
    let dataUtils: DebugUtils | null = null;
    let debug_id: string | null = null;

    try {
      if (debugNode && debugNode.data.debugUtils) {
        debug_id = `${debugNode.id}-${Date.now()}`;
        dataUtils = debugNode.data.debugUtils;
        dataUtils.setDebugId(debug_id);
        mediaRecorder = await dataUtils.startScreenCapture();
        await dataUtils.interceptFetch();
        // use flowid or smth
      }

      const executionOrder = getExecutionOrder(nodes);

      for (let i = 0; i < executionOrder.length; i++) {
        const node = executionOrder[i];
        if (node.data?.func) {
          try {
            await node.data.func(node, debug_id);
            setDoneNodes((prev) => [
              ...prev,
              { node, status: Status.COMPLETED },
            ]);
          } catch (error) {
            setDoneNodes((prev) => [...prev, { node, status: Status.FAILED }]);
            break; // Stop execution on failure
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
        dataUtils.downloadServerLogs(debug_id);
      }
    }
  };

  return (
    <div
      className={`fixed top-20 right-4 h-[90vh] w-96 bg-white border border-gray-200 rounded-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-40 flex flex-col`}
    >
      <div className="flex justify-between items-center p-4 border-b shrink-0">
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
      <div className="p-4 text-gray-600 overflow-hidden flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-4 shrink-0">
          {status === Status.RUNNING ? "Processing Tasks..." : "Pending Tasks"}
        </h3>
        <div className="overflow-y-auto flex-grow">
          {status === Status.RUNNING && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="text-gray-600 animate-pulse">
                Executing {doneNodes.length} of {pending_nodes.length} tasks...
              </p>
            </div>
          )}
          {(status === Status.PENDING || status === Status.FAILED) && (
            <div className="flex flex-col gap-2">
              {pending_nodes.map((node, index) => (
                <ReportNode
                  node={node}
                  index={index}
                  key={index}
                  status={status}
                  parent={nodes.find((n) => n.id === node.data.parent)}
                />
              ))}
            </div>
          )}
          {status !== Status.PENDING && status !== Status.RUNNING && (
            <div className="flex flex-col gap-2">
              {doneNodes.map(({ node, status }, index) => (
                <ReportNode
                  node={node}
                  index={index}
                  key={index}
                  status={status}
                  parent={nodes.find((n) => n.id === node.data.parent)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
