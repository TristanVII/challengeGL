import type { Node } from "@xyflow/react";

export type QuestionNode = Node<
  {
    question: string;
    answer: string;
    label: string;
    parent?: string;
  },
  "function-node"
>;
export type AppNode = QuestionNode;
