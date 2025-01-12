import type { Node } from "@xyflow/react";

export type QuestionNode = Node<
  {
    question: string;
    answer: string;
    label: string;
    parent?: string;
    pending_question?: string;
    func?: (question: QuestionNode) => Promise<Response>;
  },
  "question-node"
>;
export type AppNode = QuestionNode;
