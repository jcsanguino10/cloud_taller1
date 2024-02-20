from sqlalchemy import Column, Integer, String, Date , ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class State(enum.Enum):
    START = "start"
    PROGRESS = "progress"
    FINISH = "finish"
    
class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    password = Column(String)
    tasks = relationship('Task', cascade='all, delete, delete-orphan')

class Task(Base):
    __tablename__ = 'task'
    id = Column(Integer, primary_key=True)
    state = Column(Enum(State), default=State.START)
    user = Column(Integer, ForeignKey('user.id'))
