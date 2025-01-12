import openai
from mdb.db import QuestionBank
from collections import deque

class OpenAIService:
    def __init__(self, question_bank: QuestionBank, api_key=None):
        self.api_key = api_key
        self.question_bank = question_bank

    def ask_question(self, query, parent_id, api_key=None, model="gpt-3.5-turbo", max_tokens=150):
        try:
            key = api_key if api_key else self.api_key
            if not key:
                raise Exception('API key required')
            openai.api_key = key
            message = []
            if not parent_id.startswith('new-'):
                message = self.get_message_history(parent_id)
            message.append({"role": "user", "content": query})
        except Exception as e:
            return "ERRO"

        #####
        #DEBUG
        #####
        print("Asking question with message:\n")
        for msg in message:
            print(f'{msg}\n')
        try:
            response = openai.chat.completions.create(
                model=model,
                messages=list(message),
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"An error occurred: {e}"

    def get_message_history(self, parent_id):
        p_id = parent_id

        q = deque([])
        while p_id:
            parent = self.question_bank.get_from_id(p_id)
            if parent:
                q.appendleft({"role": "user", "content": parent['answer']})
                q.appendleft({"role": "assistant", "content": parent['question']})
                if hasattr(parent, 'parent') and parent['parent']:
                    p_id = parent['parent']
                else:
                    p_id = None
            else:
                p_id = None

        q.appendleft({"role": "system", "content": "You are a helpful assistant."})
        return q


