from pydantic import BaseModel
from typing import Optional


class Question(BaseModel):
    user_id: str
    question: str
    question_parent_id: str
    model: str
    key: str
    debug_id: Optional[str] = None

class Feedback(BaseModel):
    user_id: str
    question1: str
    question2: str
    question3: str