import openai
from mdb.db import QuestionBank, FeedbackBank
from collections import deque

# TODO: Make children classes that extends OpenAIService, with each own collection
class OpenAIService:
    def __init__(self, question_bank: QuestionBank, feedback_bank: FeedbackBank, api_key=None):
        self.api_key = api_key or ''
        self.question_bank = question_bank
        self.feedback_bank = feedback_bank

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
            return "ERROR"

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
                if 'parent' in parent and parent['parent']:
                    p_id = parent['parent']
                else:
                    p_id = None
            else:
                p_id = None

        q.appendleft({"role": "system", "content": "You are a helpful assistant."})
        return q
    
    # TODO: Make feedback array instead
    def validate_feedback(self, feedback):
        key = self.api_key
        if not key:
            raise Exception('API key required')
        openai.api_key = key
        question = f'''
        #### IMPORTANT: Only answer with number 0 or 1
        #### IMPORTANT: IF THE FOLLOWING IS TRUE, ANSWER WITH 1, ELSE ANSWER WITH 0

        QUESTION: Given 3 questions that ask about UI/UX feedback. Determine wether the feedback is legitimate or not. If the feedback has no value or makes no sense or is not helpful, answer with 0. If the feedback is helpful and has value, answer with 1.
        
        Feedback1: {feedback.question1}
        Feedback2: {feedback.question2}
        Feedback3: {feedback.question3}


        #### IMPORTANT: Only answer with number 0 or 1
        '''
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant, who can only answer with 0 or 1. 0 for False, 1 for True"},
                {"role": "user", "content": question},
            ],
            max_tokens=1500,
        )
        return response.choices[0].message.content



