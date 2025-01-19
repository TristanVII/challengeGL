from contextlib import asynccontextmanager
from fastapi import FastAPI
from mdb.db import MongoDB
from fastapi.middleware.cors import CORSMiddleware
from typing import Union
from bson import json_util
from db_models.model import Question, Feedback
from openai_service.main import OpenAIService
from logger.log import load_log_conf
import os
import re
from bson.objectid import ObjectId
import time

logger = load_log_conf('./log_conf.yml')
LOG_FILE = "/tmp/gum-logs/logs.log"

collections = {}
@asynccontextmanager
async def lifespan(app: FastAPI):
    mdb = MongoDB(os.getenv('MONGODB_URI'))
    collections['question_bank'] = mdb.get_question_bank()
    collections['feedback_bank'] = mdb.get_feedback_bank()
    yield
    print("CLOSED")

app= FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return "hello word", 200

@app.get("/questions")
async def get_all_questions(id: str):
    question_bank = collections['question_bank']
    q = question_bank.get_all(id)
    for question in q:
        question['_id'] = str(question['_id'])
    return json_util.dumps(q)

@app.get("/question/{id}")
async def get_question(id: str):
    question_bank = collections['question_bank']
    q = question_bank.get_from_id(id)
    q['_id'] = str(q['_id'])
    return q

@app.post("/question")
async def post_question(question: Question):
    debug_id = None
    if question.debug_id:
        debug_id = question.debug_id
    
    if debug_id:
        logger.info(f"REQUEST: /question Received for debug_id: {debug_id}")

    open_AI_service = OpenAIService(collections['question_bank'], None, None)
    # answer = open_AI_service.ask_question(question.question, question.question_parent_id)
    answer = "test"
    time.sleep(5)
    if debug_id:
        logger.info(f"RESPONSE: OpenAI Received {json_util.dumps(answer)} for debug_id: {debug_id}")

    question_bank = collections['question_bank']

    obj = {
        '_id': ObjectId(question.id),
        'user_id': question.user_id,
        'question': question.question,
        'answer': answer,
        'position': question.position,
        'parent_id': question.question_parent_id
    }

    node_id = question_bank.push(obj)
    if debug_id:
        logger.info(f"RESPONSE: Updated MongoDB for {json_util.dumps(obj)} for debug_id: {debug_id}")

    res = {
        'user_id': question.user_id,
        'question': question.question,
        'answer': answer,
        'parent_id': question.question_parent_id,
        'node_id': str(node_id)
    }
    if debug_id:
        logger.info(f"RESPONSE: Returned for /question {json_util.dumps(res)} for debug_id: {debug_id}")

    return res


@app.delete("/question/{id}", status_code=200)
async def delete_question(id: Union[int, str]):
    question_bank = collections['question_bank']
    deleted = question_bank.delete_from_id(str(id))
    return  200 if deleted else 404


# deprecated - using gumloop webhook for now
@app.post("/feedback")
async def post_feedback(feedback: Feedback):
    return 404
    # feedback_bank = collections['feedback_bank']
    #
    # open_AI_service = OpenAIService(None, collections['question_bank'])
    # answer = open_AI_service.validate_feedback(feedback)
    # if answer.strip() == '1' or answer == 1:
    #     feedback_bank.push(feedback.model_dump())
    #     return 200
    # else:
    #     return {"message": "Feedback is not helpful or has no value"}


@app.get("/debug/{id}")
async def get_debug_id_logs(id: str):
    if not os.path.exists(LOG_FILE):
        return 404
    matching_logs = []

    debug_id_pattern = re.compile(r'debug_id: (\S+)')
    if not os.path.exists(LOG_FILE):
        print('NO LOGS')
        return 404
    with open(LOG_FILE, 'r') as file:
        for line in file:
            match = debug_id_pattern.search(line)
            if match:
                current_debug_id = match.group(1)
                if current_debug_id == id:
                    matching_logs.append(line.strip())


    return matching_logs
