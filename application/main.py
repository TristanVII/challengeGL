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
    "http://localhost:3000",
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
    open_AI_service = OpenAIService()
    answer = open_AI_service.ask_question(question.question, '')

    question_bank = collections['question_bank']
    node_id = question_bank.push({'question': question.question, 'answer': answer, 'parent': question.question_parent_id })
    res = {
        'question': question.question,
        'answer': answer,
        'parent_id': question.question_parent_id,
        'node_id': json_util.dumps(node_id)
    }
    return res

