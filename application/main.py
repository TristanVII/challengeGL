from contextlib import asynccontextmanager
from fastapi import FastAPI
from mdb.db import MongoDB
from fastapi.middleware.cors import CORSMiddleware
from bson import json_util
from db_models.model import Question
from openai_service.main import OpenAIService


collections = {}
@asynccontextmanager
async def lifespan(app: FastAPI):
    mdb = MongoDB("mongodb://localhost:27017/")
    collections['question_bank'] = mdb.get_question_bank()
    yield
    print("CLOSED")

app= FastAPI(lifespan=lifespan)

origins = [
   "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return "hello word", 200

@app.get("/questions")
async def get_all_questions(id: str):
    question_bank = collections['question_bank']
    q = question_bank.get_all()
    for question in q:
        question['_id'] = str(question['_id'])
    return json_util.dumps(q)

@app.post("/question")
async def post_question(question: Question):
    open_AI_service = OpenAIService(collections['question_bank'])
    #TODO: API KEY
    answer = open_AI_service.ask_question(question.question, question.question_parent_id, '')

    question_bank = collections['question_bank']

    obj = {
        'question': question.question,
        'answer': answer
    }
    # new- is way for front-end to create a new node
    if hasattr(question, 'question_parent_id') and question.question_parent_id and not question.question_parent_id.startswith('new-'):
        print(obj)
        obj['parent'] = question.question_parent_id

    node_id = question_bank.push(obj)
    res = {
        'question': question.question,
        'answer': answer,
        'parent_id': question.question_parent_id,
        'node_id': str(node_id)
    }
    return res


@app.delete("/question/{id}", status_code=200)
async def delete_question(id: int | str):
    question_bank = collections['question_bank']
    deleted = question_bank.delete_from_id(str(id))
    return  200 if deleted else 404

