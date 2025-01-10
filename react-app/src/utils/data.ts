export interface Question {
  _id: string;
  question: string;
  answer: string;
  children: string[]; // _id of children
  user_id: string
  parent: string | null | undefined;
}

export function formatQuestionResponse(parsedResponse: any, user_id: string): Question {
  const expectedData: Question = {
    _id: "",
    question: "",
    answer: "",
    children: [],
    user_id: "",
    parent: null,
  };
  Object.keys(parsedResponse).forEach(key => {
    expectedData[key as keyof Question] = parsedResponse[key];
  })
  expectedData['user_id'] = user_id;
  return expectedData;
}
