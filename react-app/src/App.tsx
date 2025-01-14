import { useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Panel,
} from "@xyflow/react";

// https://www.npmjs.com/package/@fingerprintjs/fingerprintjs
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import "@xyflow/react/dist/style.css";

import { formatQuestionsToNode, nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";
import { RunButton } from "./components/RunButton";
import { RunReportPanel } from "./components/RunReportPanel";
import { Logo } from "./components/Logo";
import { fetchQuestions, postQuestion } from "./service/Question";
import { NodeDetails } from "./components/NodeDetails";
import { AppNode, DebugNode } from "./nodes/types";
import { LeftSideBar } from "./components/LeftSideBar";
import { NodeSelector } from "./components/NodeSelector";
import { DebugUtils } from "./utils/debugUtils";
import FeedBackFlow from "./components/FeedBackFlow";
import { postFeedBack } from "./service/FeedBack";

const initialEdges = [
  { id: "e1-2", source: "a", target: "c" },
  { id: "e2-3", source: "c", target: "d" },
];

const initialNodes: AppNode[] = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [pending_nodes, setPendingNodes] = useState<AppNode[]>([]);
  const [debugNode, setDebugNode] = useState<DebugNode | null>(null);
  const [isFeedBackFlowOpen, setIsFeedBackFlowOpen] = useState(false);
  useEffect(() => {
    async function fetchInitNodes() {
      const fpPromise = FingerprintJS.load();
      const fp = await fpPromise;
      const id = (await fp.get()).visitorId;
      setUserId(id);
      const questions = await fetchQuestions(userId);
      const { appNodes, edges } = formatQuestionsToNode(questions, userId);
      setNodes(appNodes);
      setEdges(edges);
    }
    fetchInitNodes();
  }, [userId]);

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as AppNode);
  };

  const onRun = () => {
    setIsPanelOpen(true);
  };

  const addNewNode = () => {
    const newNode: AppNode = {
      id: `new-${Math.random().toString(36).substring(2, 15)}`,
      type: "question-node",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: "New Question",
        question: "New Question",
        answer: "",
        func: (node, debug_id) => postQuestion(userId, node, debug_id),
      },
    };
    setNodes((nodes) => [...nodes, newNode]);
  };

  const addDebugNode = () => {
    const newNode: DebugNode = {
      id: `debug-${Math.random().toString(36).substring(2, 15)}`,
      type: "debug-node",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: "Debug Node",
        func: () => {},
        debugUtils: new DebugUtils(),
      },
    };
    // TODO: hack for now
    setNodes((nodes) => [...nodes, newNode as AppNode]);
    setDebugNode(newNode);
  };

  const removeDebugNode = () => {
    setNodes((nodes) => nodes.filter((n) => n.id !== debugNode?.id));
    setDebugNode(null);
  };

  const handleAskQuestion = (node: AppNode, question: string) => {
    const newNodes = nodes.map((n) =>
      n.id === node.id
        ? { ...n, data: { ...n.data, pending_question: question } }
        : n
    );
    setNodes(newNodes);
    setPendingNodes([...newNodes.filter((n) => n.data.pending_question)]);
  };

  const handleRemoveQuestion = (node: AppNode) => {
    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === node.id
          ? { ...n, data: { ...n.data, pending_question: "" } }
          : n
      )
    );
    setPendingNodes((nodes) => nodes.filter((n) => n.id !== node.id));
  };

  // Kinda hard coded for now
  const submitFeedBack = (feedback: {
    question1: string;
    question2: string;
    question3: string;
  }) => {
    postFeedBack(feedback, userId)
      .then(() => {
        console.log("Feedback submitted");
      })
      .catch(() => {
        console.log("Failed to submit feedback");
      });
    // close anyways
    setIsFeedBackFlowOpen(false);
  };

  const toggleFeedBackFlow = () => {
    setIsFeedBackFlowOpen(!isFeedBackFlowOpen);
  };

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      // onConnect={onConnect}
      onNodeClick={onNodeClick}
      fitView
      deleteKeyCode={null}
    >
      <Background />
      <Logo toggleFeedBackFlow={toggleFeedBackFlow} />
      <Panel position="top-center">
        {isFeedBackFlowOpen && (
          <FeedBackFlow
            onSubmit={submitFeedBack}
            onClose={() => setIsFeedBackFlowOpen(false)}
          />
        )}
      </Panel>
      <RunButton onRun={onRun} />
      <LeftSideBar>
        <NodeSelector
          addNode={addNewNode}
          addDebugNode={addDebugNode}
          debugNode={debugNode}
          removeDebugNode={removeDebugNode}
        />
      </LeftSideBar>
      <RunReportPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        pending_nodes={pending_nodes}
        debugNode={debugNode}
      />
      {selectedNode && (
        <NodeDetails
          node={selectedNode}
          onClose={(reload) => {
            setSelectedNode(null);
            if (reload) {
              window.location.reload();
            }
          }}
          onAskQuestion={handleAskQuestion}
          onRemoveQuestion={handleRemoveQuestion}
        />
      )}
    </ReactFlow>
  );
}
