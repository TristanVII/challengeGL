import type { Edge, NodeTypes } from "@xyflow/react";

import { AppNode } from "./types";
import { postQuestion, Question } from "../service/Question";
import QuestionNodeComponent from "./QuestionNode";
import DebugNodeComponent from "./DebugNode";
import { getFavoriteNodes } from "../utils/localStorage";

export const initialNodes: AppNode[] = [];

const makeAppNodeFromQuestion = (
  question: Question,
  userId: string
): AppNode => {
  return {
    id: question._id,
    type: "question-node",
    position: question.position,
    data: {
      label: question.question,
      answer: question.answer,
      isRoot: question.parent_id === null,
      question: question.question,
      parent: question.parent_id || undefined,
      func: (question: AppNode, debug_id?: string | null) =>
        postQuestion(userId, question, debug_id),
    },
  };
};

const makeEdgeFromQuestion = (question: Question): Edge => {
  return {
    id: question._id,
    source: question?.parent_id || "",
    target: question._id,
    animated: true,
  };
};

export function formatQuestionsToNode(
  questions: Question[],
  userId: string
): {
  appNodes: AppNode[];
  edges: Edge[];
} {
  const appNodes: AppNode[] = [];
  const edges: Edge[] = [];

  questions.forEach((question) => {
    appNodes.push(makeAppNodeFromQuestion(question, userId));
    if (question.parent_id) {
      edges.push(makeEdgeFromQuestion(question));
    }
  });

  return { appNodes, edges };
}

export const nodeTypes = {
  "question-node": QuestionNodeComponent,
  "debug-node": DebugNodeComponent,
} satisfies NodeTypes;
