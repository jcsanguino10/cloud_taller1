from sqlalchemy.orm import Session
import entities, schema
import os
import shutil
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


def get_task_uploaded_state(db: Session):
    return db.query(entities.Task).filter(entities.Task.state == entities.State.START).all()

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
    
def delete_task(db: Session, task_id: schema.Task):
    try:
        task = db.query(entities.Task).get(task_id)
        db.delete(task)
        db.commit()
        return True
    except:
        return False

def create_task(db: Session, task: schema.CreateTask, file ):
    
    if file and file.filename: 
        extension = file.filename.rsplit('.', 1)[1].lower()
        directorio_archivos = 'files/uploaded/'
        if extension in ['docx', 'xlsx', 'ppt', 'odt']:
            ruta_archivo = os.path.join(directorio_archivos, file.filename)
            task_dict = task.dict()
            try:
                task_dict["url"] = ruta_archivo
                with open(ruta_archivo, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
            except Exception as e:
                print(e)
                raise Exception ("Error saving file")
    db_task = entities.Task(**task_dict)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task