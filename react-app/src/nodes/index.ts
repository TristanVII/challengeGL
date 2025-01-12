import type { Edge, NodeTypes } from "@xyflow/react";

import { AppNode } from "./types";
import { Question } from "../service/fetchQuestions";

export const initialNodes: AppNode[] = [];

const makeAppNodeFromQuestion = (question: Question): AppNode => {
  return {
    id: question._id,
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    data: {
      label: question.question,
      answer: question.answer,
      question: question.question,
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

export function formatQuestionsToNode(questions: Question[]): {
  appNodes: AppNode[];
  edges: Edge[];
} {
  const appNodes: AppNode[] = [];
  const edges: Edge[] = [];

  questions.forEach((question) => {
    appNodes.push(makeAppNodeFromQuestion(question));
    if (question.parent) {
      edges.push(makeEdgeFromQuestion(question));
    }
  });

  return { appNodes, edges };
}

export const nodeTypes = {
  // Add any of your custom nodes here!
} satisfies NodeTypes;
