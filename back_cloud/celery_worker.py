import os
import time
from celery import Celery

celery_app = Celery('tasks', broker='redis://redis/0', backend='redis://redis/0')

@celery_app.task()
def transform_document(task_id, file):
    # time.sleep(10000)
    return True
    
