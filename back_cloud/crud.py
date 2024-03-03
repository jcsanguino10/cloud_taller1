from sqlalchemy.orm import Session
import entities, schema
import os
import shutil
# User

def get_user(db: Session, user_id: int) -> entities.User:
    """Get a user by their ID.

    Args:
        db (Session): The database session.
        user_id (int): The user ID.

    Returns:
        entities.User: The user with the matching ID, or None if no user was found.
    """
    return db.query(entities.User).filter(entities.User.id == user_id).first()

def get_user_by_name_and_pass(db: Session, name: str, password:str) -> entities.User:
    """Get a user by their name and password.

    Args:
        db (Session): The database session.
        name (str): The user name.
        password (str): The user password.

    Returns:
        entities.User: The user with the matching name and password, or None if no user was found.
    """
    return db.query(entities.User).filter(entities.User.name == name, entities.User.password == password).first()

def get_user_by_name(db: Session, name: str) -> entities.User:
    """Get a user by their name.

    Args:
        db (Session): The database session.
        name (str): The user name.

    Returns:
        entities.User: The user with the matching name, or None if no user was found.
    """
    return db.query(entities.User).filter(entities.User.name == name).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Get a list of users.

    Args:
        db (Session): The database session.
        skip (int, optional): The number of users to skip. Defaults to 0.
        limit (int, optional): The maximum number of users to return. Defaults to 100.

    Returns:
        List[entities.User]: A list of users.
    """
    return db.query(entities.User).offset(skip).limit(limit).all()

def create_user(db: Session, name: str, password: str) -> entities.User:
    """Create a new user.

    Args:
        db (Session): The database session.
        name (str): The user's name.
        password (str): The user's password.

    Returns:
        entities.User: The newly created user.
    """
    db_user = entities.User(name=name, password=password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#Task

def get_task(db: Session, task_id: int) -> entities.Task:
    """Get a task by its ID.

    Args:
        db (Session): The database session.
        task_id (int): The task ID.

    Returns:
        entities.Task: The task with the matching ID, or None if no task was found.
    """
    return db.query(entities.Task).filter(entities.Task.id == task_id).first()


def get_task_uploaded_state(db: Session):
    """Get all tasks in the UPLOADED state.

    Args:
        db (Session): The database session.

    Returns:
        List[entities.Task]: A list of tasks in the UPLOADED state.
    """
    return db.query(entities.Task).filter(entities.Task.state == entities.State.START).all()

def get_tasks_by_user(db: Session, user_id: int):
    """Get all tasks for a given user.

    Args:
        db (Session): The database session.
        user_id (int): The user ID.

    Returns:
        List[entities.Task]: A list of tasks for the given user.
    """
    return db.query(entities.Task).filter(entities.Task.user == user_id).all()
    
def update_task(db: Session, task: schema.Task):
    """Update a task in the database.

    Args:
        db (Session): The database session.
        task (schema.Task): The task to update.

    Returns:
        bool: True if the task was updated, False otherwise.
    """
    try:
        task_db =  db.query(entities.Task).filter(entities.Task.id == task.id).first()
        for field in task.__dict__:
            if field!= "id" and hasattr(task, field):
                setattr(task_db, field, getattr(task, field))
        db.commit()
        return True
    except:
        return False
    
def delete_task(db: Session, task_id: schema.Task):
    """Deletes a task from the database.

    Args:
        db (Session): The database session.
        task_id (int): The ID of the task to delete.

    Returns:
        bool: True if the task was deleted, False otherwise.
    """
    try:
        task = db.query(entities.Task).get(task_id)
        db.delete(task)
        db.commit()
        return True
    except:
        return False

def create_task(db: Session, task: schema.CreateTask, file):
    """
    Create a new task.

    Args:
        db (Session): The database session.
        task (schema.CreateTask): The task to create.
        file (FileStorage): The uploaded file.

    Returns:
        entities.Task: The created task.
    """
    if file and file.filename:
        extension = file.filename.rsplit(".", 1)[1].lower()
        directory_for_files = "files/uploaded/"
        if extension in ["docx", "xlsx", "ppt", "odt"]:
            file_path = os.path.join(directory_for_files, file.filename)
            task_dict = task.dict()
            try:
                task_dict["url"] = file_path
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
            except Exception as e:
                print(e)
                raise Exception("Error saving file")
    db_task = entities.Task(**task_dict)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task