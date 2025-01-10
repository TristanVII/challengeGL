export interface GraphNode {
  _id: string;
  question: string;
  answer: string;
  children: string[];
  parent?: string | null;
}

export interface ProcessedGraphNode extends GraphNode {
  childNodes: ProcessedGraphNode[];
}

export function buildGraph(data: GraphNode[]): ProcessedGraphNode[] {
  const nodeMap = new Map<string, ProcessedGraphNode>();

  // Create a map of all nodes
  data.forEach((node) => {
    nodeMap.set(node._id, { ...node, childNodes: [] });
  });

  // Build the tree structure
  const roots: ProcessedGraphNode[] = [];
  data.forEach((node) => {
    if (node.parent && nodeMap.has(node.parent)) {
      const parent = nodeMap.get(node.parent);
      if (parent) {
        parent.childNodes.push(nodeMap.get(node._id)!);
      }
    } else {
      roots.push(nodeMap.get(node._id)!);
    }
  });

  return roots;
}

export function findNodeById(
  root: ProcessedGraphNode,
  _id: string
): ProcessedGraphNode | null {
  if (root._id === _id) return root;
  for (const child of root.childNodes) {
    const found = findNodeById(child, _id);
    if (found) return found;
  }
  return null;
}

export function getPathToNode(root: ProcessedGraphNode, _id: string): string[] {
  const path: string[] = [];

  function dfs(node: ProcessedGraphNode): boolean {
    path.push(node._id);
    if (node._id === _id) return true;
    for (const child of node.childNodes) {
      if (dfs(child)) return true;
    }
    path.pop();
    return false;
  }

  dfs(root);
  return path;
}
