import { useCallback, useEffect, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  Node,
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
import { AppNode } from "./nodes/types";
import { LeftSideBar } from "./components/LeftSideBar";
import { NodeSelector } from "./components/NodeSelector";

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
    console.log("Running flow...");
    console.log(nodes);
    const nodesToRun = nodes.filter((node) => node.data.answer === "");
    console.log(nodesToRun);
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
        func: (node) => postQuestion(userId, node),
      },
    };
    console.log(newNode);
    setNodes((nodes) => [...nodes, newNode]);
  };

  const handleAskQuestion = (node: AppNode, question: string) => {
    const newNodes = nodes.map((n) =>
      n.id === node.id
        ? { ...n, data: { ...n.data, pending_question: question } }
        : n
    );
    setNodes(newNodes);
    console.log(nodes);
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
      <Logo />
      <RunButton onRun={onRun} />
      <LeftSideBar>
        <NodeSelector addNode={addNewNode} />
      </LeftSideBar>
      <RunReportPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        pending_nodes={pending_nodes}
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
