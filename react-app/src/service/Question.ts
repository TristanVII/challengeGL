import { AppNode } from "../nodes/types";

export type Question = {
  _id: string;
  question: string;
  answer: string;
  parent?: string | null;
};

export enum Status {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
}

// TODO NO SERVER SIDE AUTH ATM
const API_URL = "http://127.0.0.1:8000";

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

export async function postQuestion(userId: string, question: AppNode) {
  const body = {
    user_id: userId,
    question: question.data.pending_question,
    question_parent_id: question.id,
    model: "",
    key: "",
  };

  console.log(body);

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
