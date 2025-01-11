"use client";

import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import { GPTNode, ProcessedGraphNode } from "@/utils/buildGraph";

interface GraphVisualizationProps {
  roots: ProcessedGraphNode[];
  onNodeClick: (nodeId: string) => void;
  highlightedPath: string[];
}

export function GraphVisualization({
  roots,
  onNodeClick,
  highlightedPath,
}: GraphVisualizationProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodePositions, setNodePositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  const processNodes = useCallback(
    // TODO ANY FOR NOW
    (node: ProcessedGraphNode<GPTNode | any>, x = 0, y = 0, level = 0): [Node[], Edge[]] => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      const storedPosition = nodePositions[node.node._id];
      const newNode: Node = {
        id: node.node._id,
        data: { label: node.node.question },
        position: storedPosition || { x, y },
        style: {
          background: highlightedPath.includes(node.node._id)
            ? "#84d18a"
            : "#ffffff",
          border: "1px solid #000000",
          borderRadius: "5px",
          padding: "10px",
          fontSize: "12px",
        },
      };
      nodes.push(newNode);

      const childWidth = 200;
      const childSpacing = 100;
      const totalWidth = (node.childNodes.length - 1) * childSpacing;
      const startX = x - totalWidth / 2;

      node.childNodes.forEach((childNode, index) => {
        const childX = startX + index * (childWidth + childSpacing);
        const childY = y + 150;
        const [childNodes, childEdges] = processNodes(
          childNode,
          childX,
          childY,
          level + 1,
        );
        nodes.push(...childNodes);
        edges.push(...childEdges);
        edges.push({
          id: `${node.node._id}-${childNode.node._id}`,
          source: node.node._id,
          target: childNode.node._id,
          style: {
            stroke:
              highlightedPath.includes(node.node._id) &&
              highlightedPath.includes(childNode.node._id)
                ? "#84d18a"
                : "#000000",
          },
        });
      });

      return [nodes, edges];
    },
    [highlightedPath, nodePositions],
  );

  useMemo(() => {
    let allNodes: Node[] = [];
    let allEdges: Edge[] = [];
    roots.forEach((root, index) => {
      const [newNodes, newEdges] = processNodes(root, index * 300, 0);
      allNodes = [...allNodes, ...newNodes];
      allEdges = [...allEdges, ...newEdges];
    });
    setNodes(allNodes);
    setEdges(allEdges);
  }, [roots, processNodes, setNodes, setEdges]);

  const onNodeClickHandler = useCallback(
    (_, node) => {
      onNodeClick(node ? node.id : null);
    },
    [onNodeClick],
  );

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    setNodePositions((prev) => ({
      ...prev,
      [node.id]: node.position,
    }));
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        fitView
        onNodeDragStop={onNodeDragStop}
        onPaneClick={() => onNodeClickHandler(null, null)}
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
