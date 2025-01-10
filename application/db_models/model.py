from pydantic import BaseModel


class Question(BaseModel):
    user_id: str
    question: str
    question_parent_id: str
    model: str
    key: str
