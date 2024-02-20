from celery import Celery
        
celery_app = Celery('tasks', broker='redis://redis/0', backend='redis://redis/0')

@celery_app.task()
def transform_document(filename, content):
    file_extension = filename.split('.')[-1].lower()
    doc = Document()
    if file_extension == 'docx':
        doc = Document()
    elif file_extension == 'pptx':
        # Handle PPTX conversion
        doc = Presentation()
    elif file_extension == 'xlsx':
        # Handle XLSX conversion
        doc = Workbook()
    elif file_extension == 'odt':
        # Handle ODT conversion
        doc = Document()
    else:
        raise ValueError("Unsupported file format")
    doc.LoadFromStream(content, file_extension)
    doc.SaveToFile("output/ToPDF.pdf", FileFormat.PDF)
