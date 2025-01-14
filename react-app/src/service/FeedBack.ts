export async function postFeedBack(
  feedback: {
    question1: string;
    question2: string;
    question3: string;
  },
  userId: string
) {
  const { question1, question2, question3 } = feedback;
  const options = {
    method: "POST",
    headers: {
      Authorization: "Bearer d29179267b414180b0327f337f2c6399",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: "zYao6FvV5OfhLHoKrTiDV2GNn2F3",
      saved_item_id: "kG9HMkyFxzuzeZHvNrTT6m",
      pipeline_inputs: [
        { input_name: "name", value: userId },
        { input_name: "question3", value: question3 },
        { input_name: "question2", value: question2 },
        { input_name: "question1", value: question1 },
      ],
    }),
  };

  return fetch("https://api.gumloop.com/api/v1/start_pipeline", options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
}
