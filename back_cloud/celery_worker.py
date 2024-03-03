#Cambios comentados
import os
import time
from celery import Celery
#from conversion_files import conversionWordODTTToPDF, conversionExcelToPDF, conversionPPTToPDF
#from entities import State
#import crud
#from database import SessionLocal
#import logging

celery_app = Celery('tasks', broker='redis://redis/0', backend='redis://redis/0')
#logging.basicConfig(level=logging.INFO)

@celery_app.task()
def transform_document(task_id, file):
#def transform_document(task_id, file_path):
    '''
    try:
        db = SessionLocal()

        task = crud.get_task(db, task_id)
        task.state = State.PROGRESS
        db.commit()

        if file_path.endswith((".docx", ".odt")):
            conversionWordODTTToPDF(file_path)
        elif file_path.endswith(".xlsx"):
            conversionExcelToPDF(file_path)
        elif file_path.endswith(".pptx"):
            conversionPPTToPDF(file_path)
        else:
            raise ValueError("Unsupported file format")

        converted_file_path = f"./files/converted_{os.path.basename(file_path)}.pdf"
        task.url = converted_file_path
        task.state = State.FINISH
        db.commit()

        return True
    except Exception as e:
        task.state = State.ERROR
        db.commit()
        return False
    finally:
        db.close()
'''
    return True