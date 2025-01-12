export type Question = {
  _id: string;
  question: string;
  answer: string;
  parent?: string | null;
};

export async function fetchQuestions(userId: string): Promise<Question[]> {
  if (userId) {
    const res = await fetch(`http://127.0.0.1:8000/questions?id=${userId}`);
    if (!res.ok) {
      return [];
    }
    const response = await res.json();
    const data = JSON.parse(response);
    return data as Question[];
  }
  return [];
}
