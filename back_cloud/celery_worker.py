#Cambios comentados
import os
import time
from datetime import timedelta
from celery import Celery
from conversion_files import conversionWordODTTToPDF, conversionExcelToPDF, conversionPPTToPDF
from entities import State
import crud
from database import SessionLocal
import logging

celery_app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')
logging.basicConfig(level=logging.INFO)

celery_app.conf.beat_schedule = {
    'convert-uploaded-files-every-30-minutes': {
        'task': 'transform_all_documents',
        'schedule': timedelta(seconds=10)
    },
}

celery_app.autodiscover_tasks()

"""
This function is used to convert all uploaded files to PDF format.

Args:
    self (obj): The Celery task instance.

Returns:
    (dict): A dictionary containing the status of the task.

"""
@celery_app.task(name="transform_all_documents", bind=True)
def transform_all_documents(self):
    db = SessionLocal()
    uploaded_tasks = crud.get_task_uploaded_state(db=db)
    for task in uploaded_tasks:
        try:
            task = crud.get_task(db, task.id)
            filename = task.url
            task.state = State.PROGRESS
            db.commit()
            
            pdf_dir = os.path.dirname(filename.replace('uploaded', 'converted'))
            if not os.path.exists(pdf_dir):
                os.makedirs(pdf_dir)
            if filename.endswith((".docx", ".odt")):
                fileSaved = conversionWordODTTToPDF(filename)
            elif filename.endswith(".xlsx"):
                fileSaved = conversionExcelToPDF(filename)
            elif filename.endswith(".pptx"):
                fileSaved = conversionPPTToPDF(filename)
            else:
                raise ValueError("Unsupported file format")

            task.url = fileSaved
            task.state = State.FINISH
            db.commit()

            return {"task": "File Converted Successfully"}
        except Exception as e:
            print(e)
            task.state = State.ERROR
            db.commit()
            return False
        finally:
            db.close()