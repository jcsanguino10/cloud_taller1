from pydantic import BaseModel
from fastapi import UploadFile, File
from typing import Optional
from datetime import date, datetime
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

class Task(BaseModel):
    id: int
    state : State = State.START
    url: str
    user : int
