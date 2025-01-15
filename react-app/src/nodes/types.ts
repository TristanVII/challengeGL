import type { Node } from "@xyflow/react";
import { DebugUtils } from "../utils/debugUtils";

export type QuestionNode = Node<
  {
    question: string;
    answer: string;
    label: string;
    parent?: string;
    pending_question?: string;
    isRoot?: boolean;
    func?: (
      question: QuestionNode,
      debug_id?: string | null
    ) => Promise<Response>;
  },
  "question-node"
>;
export type DebugNode = Node<
  {
    label: string;
    func?: () => void;
    debugUtils?: DebugUtils;
  },
  "debug-node"
>;
export type AppNode = QuestionNode;
