from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import io, os
import logging
from typing import Annotated
import crud, entities, schema
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from database import SessionLocal, engine
from jose import JWTError, jwt


SECRET_KEY = "e495fd6722159e05be44f58d6ce255046dcd45725f9a858bb2f875905651dc78"
ALGORITHM = "HS256"
ACCESS_TOKEN_DATE_MINUTES = 120

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="userlogin")

entities.Base.metadata.drop_all(bind=engine)
entities.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = SessionLocal()

# Security

credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def create_access_token(data: dict) -> str:
    """
    Generate a JWT access token
    :param data: Dictionary containing user data
    :return: JWT access token
    """
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, key=SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    """
    Get the currently authenticated user based on the provided access token.

    Parameters:
        token (str): The access token provided by the user.

    Returns:
        schema.UserData: The currently authenticated user.

    Raises:
        HTTPException: If the provided access token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, key=SECRET_KEY)
        username= int(payload.get("sub"))
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials 1",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token_data = schema.TokenData(id_user=username)
    except JWTError as err:
        print(err)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials 2",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_user(db, token_data.id_user)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials 3",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def validate_user(user_id: int, user_id2: int) -> None:
    """
    Check if the current user is authorized to perform an operation on a given resource.

    Parameters:
        user_id (int): The ID of the user making the request.
        user_id2 (int): The ID of the resource being accessed or modified.

    Raises:
        HTTPException: If the current user is not authorized to perform the operation.
    """
    if user_id!= user_id2:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This user can not do this operation",
            headers={"WWW-Authenticate": "Bearer"},
        )

"""
This function serves as the root endpoint for the API.

:return: A JSON object with a single key-value pair, where the key is "Welcome", and the value is "Welcome to task API".
"""
@app.get("/")
def read_root():
    return {"Welcome" : "Welcome to task API"}

# User

"""
Login for access token

Parameters:
    form_data (OAuth2PasswordRequestForm): Form data containing username and password

Returns:
    Token: Access token

Raises:
    HTTPException: Incorrect username or password
"""
@app.post("/userlogin")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> schema.Token:
    user = crud.get_user_by_name_and_pass(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    return schema.Token(access_token=access_token, token_type="bearer")

async def get_info_user(user: Annotated[schema.UserData, Depends(get_current_user)]):
    """
    Get the information of the currently authenticated user.

    Parameters:
        user (schema.UserData): The currently authenticated user.

    Returns:
        schema.UserData: The information of the currently authenticated user.
    """
    return user

async def create_user(name: str, password: str):
    """
    Create a new user.

    Parameters:
        name (str): The username of the new user.
        password (str): The password of the new user.

    Returns:
        schema.User: The newly created user.

    Raises:
        HTTPException: If the user already exists.
    """
    db_user = crud.get_user_by_name(db, name)
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    else:
        try:
            db_user = crud.create_user(db, name, password)
        except Exception as exp:
            raise HTTPException(status_code=400, detail=str(exp))
    return db_user

async def get_task_id(task_id: int, current_user: Annotated[schema.UserData, Depends(get_current_user)]):
    """
    Get a task by its ID.

    Parameters:
        task_id (int): The ID of the task to retrieve.
        current_user (schema.UserData): The currently authenticated user.

    Returns:
        schema.Task: The task with the specified ID, or an error if the task does not exist.

    Raises:
        HTTPException: If the current user is not authorized to access the task.
    """
    db_task = crud.get_task(db, task_id)
    validate_user(current_user.id, db_task.user)
    if not db_task:
        raise HTTPException(status_code=400, detail="Task not exists")
    return db_task

logging.basicConfig(level=logging.INFO)
# Task
# ,name: str = Form(...),
"""
Create a new task.

:param current_user: The currently authenticated user.
:param file: The file to be uploaded.
:return: The newly created task.
"""
@app.post("/task")
async def create_task(current_user: schema.UserData = Depends(get_current_user), file: UploadFile = File(...)):
    try:
        db_task = crud.create_task(db, schema.CreateTask(user=current_user.id, name=file.filename, state=entities.State.START), file=file)
        #Creo una tarea nueva y veo su estado y url
        logging.info(f"Tarea creada - ID: {db_task.id}, Usuario: {current_user.id}, Nombre: {file.filename}, Estado: {db_task.state}, URL: {db_task.url}")
        return {"task": db_task}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

"""
Update a task.

:param task_id: The ID of the task to update.
:param task: The updated task information.
:param current_user: The currently authenticated user.
:return: The updated task.
"""
@app.put("/task/{task_id}")
async def update_task(
    task_id: str, task: schema.Task, current_user: schema.UserData = Depends()
):
    validate_user(task.user, current_user.id)
    db_task = crud.get_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=400, detail="Task not exists")
    else:
        db_task = crud.update_task(db, task)
    return db_task


@app.get("/tasks/user/{user_id}")
def get_task_user(user_id: str, user: str = Depends(get_current_user)):
    """
    Get all tasks of a user.

    Parameters:
        user_id (str): The ID of the user.
        user (str): The currently authenticated user.

    Returns:
        List[schema.Task]: A list of tasks of the specified user.

    Raises:
        HTTPException: If the current user is not authorized to access the tasks.
    """
    validate_user(user_id, str(user.id))
    db_tasks = crud.get_tasks_by_user(db, user.id)
    return db_tasks


@app.delete("/task/{task_id}")
async def del_task(
    task_id: int, current_user: schema.UserData = Depends(get_current_user)
):
    """
    Delete a task.

    Parameters:
        task_id (int): The ID of the task to delete.
        current_user (schema.UserData): The currently authenticated user.

    Returns:
        str: A message indicating whether the task was deleted or not.

    Raises:
        HTTPException: If the task does not exist or the current user is not authorized to delete it.
    """
    task = crud.get_task(db, task_id)
    validate_user(task.user, current_user.id)
    answer = crud.delete_task(db, task_id)
    if not answer:
        raise HTTPException(status_code=400, detail="Task not exists")
    return "Task deleted!"

#Descarga
async def download_converted_file(file_name: str):
    """
    This function serves as the endpoint for downloading a converted PDF file.

    Parameters:
        file_name (str): The name of the file to be downloaded, including its extension.

    Returns:
        FileResponse: A response containing the requested file.

    Raises:
        HTTPException: If an error occurs while attempting to retrieve or download the file.
    """
    try:
        file_path = os.path.join("home/app_back/files", f"converted/{file_name.split('.')[0]}.pdf")
        return FileResponse(file_path, media_type="application/pdf", filename=file_name)
    except Exception as e:
        return {"error": str(e)}