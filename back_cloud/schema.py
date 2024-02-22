from pydantic import BaseModel
from typing import Optional
from entities import State

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id_user: int | None = None

class UserData(BaseModel):
    id: int
    name : str
    password : str

class CreateTask(BaseModel):
    state : State = State.START
    name: str
    user : int

class Task(CreateTask):
    id: int
    url: Optional[str]
    class Config:
        orm_mode = True