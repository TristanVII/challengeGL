import { API_URL } from "./Question";

export async function postFeedBack(
  feedback: {
    question1: string;
    question2: string;
    question3: string;
  },
  userId: string
) {
  const request = new Request(`${API_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      ...feedback,
    }),
  });
  return fetch(request);
}
