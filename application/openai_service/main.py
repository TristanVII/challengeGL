import openai

class OpenAIService:
    def __init__(self, api_key=None):
        self.api_key = api_key

    def ask_question(self, query, api_key=None, model="gpt-3.5-turbo", max_tokens=150):
        # TODO NEED A WAY TO GO THROUGH THE GRAPH AND GET ALL QUESTIONS
        key = api_key if api_key else self.api_key
        if not key:
            raise Exception('API key required')
        openai.api_key = key
        try:
            response = openai.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": query}
                ],
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"An error occurred: {e}"
