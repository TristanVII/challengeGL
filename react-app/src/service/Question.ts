import { AppNode } from "../nodes/types";

export type Question = {
  _id: string;
  question: string;
  answer: string;
  parent_id?: string | null;
  user_id: string;
  position: { x: number; y: number };
};

export enum Status {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
}

// TODO NO SERVER SIDE AUTH ATM
export const API_URL = "http://localhost/api";

export async function fetchQuestions(userId: string): Promise<Question[]> {
  if (userId) {
    const res = await fetch(`${API_URL}/questions?id=${userId}`);
    if (!res.ok) {
      return [];
    }
    const response = await res.json();
    const data = JSON.parse(response);
    return data as Question[];
  }
  return [];
}

export async function postQuestion(
  userId: string,
  question: AppNode,
  debug_id?: string | null
) {
  console.log("question", question);
  const body = {
    id: question.id,
    user_id: userId,
    question: question.data.pending_question,
    question_parent_id: question.data.parent,
    position: question.position,
    model: "",
    key: "",
    debug_id: debug_id,
  };

  const request = new Request(`${API_URL}/question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return fetch(request);
}
export async function deleteQuestion(questionId: string) {
  const request = new Request(`${API_URL}/question/${questionId}`, {
    method: "DELETE",
  });
  return fetch(request);
}

function objectId() {
  return (
    hex(Date.now() / 1000) +
    " ".repeat(16).replace(/./g, () => hex(Math.random() * 16))
  );
}

function hex(value: number) {
  return Math.floor(value).toString(16);
}
export function mongodbObjectId() {
  return objectId();
}
