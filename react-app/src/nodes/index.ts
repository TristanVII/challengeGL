import type { Edge, NodeTypes } from "@xyflow/react";

import { AppNode } from "./types";
import { postQuestion, Question } from "../service/Question";
import QuestionNodeComponent from "./QuestionNode";
import DebugNodeComponent from "./DebugNode";

export const initialNodes: AppNode[] = [];

const makeAppNodeFromQuestion = (
  question: Question,
  userId: string
): AppNode => {
  return {
    id: question._id,
    type: "question-node",
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    data: {
      label: question.question,
      answer: question.answer,
      question: question.question,
      parent: question.parent || undefined,
      func: (question: AppNode) => postQuestion(userId, question),
    },
  };
};

const makeEdgeFromQuestion = (question: Question): Edge => {
  return {
    id: question._id,
    source: question?.parent || "",
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
    if (question.parent) {
      edges.push(makeEdgeFromQuestion(question));
    }
  });

  return { appNodes, edges };
}

export const nodeTypes = {
  "question-node": QuestionNodeComponent,
  "debug-node": DebugNodeComponent,
} satisfies NodeTypes;
