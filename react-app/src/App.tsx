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
import { fetchQuestions } from "./service/fetchQuestions";
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

  useEffect(() => {
    async function fetchInitNodes() {
      const fpPromise = FingerprintJS.load();
      const fp = await fpPromise;
      const id = (await fp.get()).visitorId;
      setUserId(id);
      const questions = await fetchQuestions(userId);
      const { appNodes, edges } = formatQuestionsToNode(questions);
      setNodes(appNodes);
      setEdges(edges);
    }
    fetchInitNodes();
  }, [userId]);

  // const onConnect: OnConnect = useCallback(
  //   (connection) => {
  //     const { source, target } = connection;
  //     const map = stagedNodesRef.current;

  //     // If both nodes are staged, prevent connection
  //     if (map.has(source) && map.has(target)) {
  //       return;
  //     }

  //     // If connecting a staged node to a non-staged node
  //     if (map.has(source)) {
  //       const stagedNode = map.get(source)!;
  //       setNodes((nodes) => [
  //         ...nodes,
  //         { ...stagedNode, data: { ...stagedNode.data, parent: target } },
  //       ]);
  //     } else if (map.has(target)) {
  //       const stagedNode = map.get(target)!;
  //       setNodes((nodes) => [
  //         ...nodes,
  //         { ...stagedNode, data: { ...stagedNode.data, parent: source } },
  //       ]);
  //     }

  //     // Add the edge
  //     setEdges((edges) => addEdge(connection, edges));
  //   },
  //   [setEdges, setNodes]
  // );

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
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: "New Question",
        question: "New Question",
        answer: "",
      },
    };
    console.log(newNode);
    // stagedNodesRef.current.set(newNode.id, newNode);
    setNodes((nodes) => [...nodes, newNode]);
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
      />
      {selectedNode && (
        <NodeDetails
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </ReactFlow>
  );
}
