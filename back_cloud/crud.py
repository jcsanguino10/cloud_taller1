from sqlalchemy.orm import Session
import entities, schema

# User

def get_user(db: Session, user_id: int):
    return db.query(entities.User).filter(entities.User.id == user_id).first()

def get_user_by_name_and_pass(db: Session, name: str, password:str):
    return db.query(entities.User).filter(entities.User.name == name, entities.User.password == password).first()

def get_user_by_name(db: Session, name: str):
    return db.query(entities.User).filter(entities.User.name == name).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(entities.User).offset(skip).limit(limit).all()

def create_user(db: Session, name:str, password:str):
    db_user = entities.User(
        name = name,
        password = password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#Task

def get_task(db: Session, task_id: int):
    return db.query(entities.Task).filter(entities.Task.id == task_id).first()

def get_tasks_by_user(db: Session, user_id: int):
    return db.query(entities.Task).filter(entities.Task.user == user_id).all()
    
def update_task(db: Session, task: schema.Task):
    try:
        task_db =  db.query(entities.Task).filter(entities.Task.id == task.id).first()
        for field in task.__dict__:
            if field != "id" and hasattr(task, field):
                setattr(task_db, field, getattr(task, field))
        db.commit
        return True
    except:
        return False


def create_task(db: Session, task: schema.CreateTask):
    db_task = entities.Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task