import os.path
import logging
# Word - ODT
from docx import Document
import pypandoc

# Excel
from openpyxl import load_workbook
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table

# PPT
import aspose.slides as slides


logging.basicConfig(level=logging.DEBUG)#Dejo esto por si hay que revisar algo

def conversionWordODTTToPDF(inputfile: str):
    """
    Función para convertir .docx y .odt a .pdf

    Args:
        inputfile (str): Ruta del archivo de entrada
    """
    try:
        file_path = os.path.join(os.path.dirname(os.path.abspath(inputfile)),inputfile.split("/")[-1] )
        nameSaveFile = file_path.replace("uploaded", "converted").replace("docx", "pdf") if file_path.endswith("docx") else file_path.replace("uploaded", "converted").replace("odt", "pdf")

        if file_path.endswith('.docx'):
            doc = Document(file_path)
            doc.save(nameSaveFile)
        elif file_path.endswith('.odt'):
            pypandoc.convert_file(file_path, 'pdf', outputfile=nameSaveFile)
        else:
            return {"error": "Formato de archivo no compatible"}

        return nameSaveFile
    except Exception as e:
        print(e)
        raise Exception ("Error converting file")
def conversionExcelToPDF(inputfile: str):
    """
    Parameters: 
    -----------
        Función para convertir .xlsx en .pdf

    Args:
    -----
        inputfile (str): Ruta del archivo de entrada
    """
    file_path = os.path.join(os.path.dirname(os.path.abspath(inputfile)),inputfile.split("/")[-1] )
    nameSaveFile = file_path.replace("uploaded", "converted").replace("xlsx", "pdf")
    
    wb = load_workbook(filename=file_path)
    ws = wb.active  

    data = [[cell.value for cell in row] for row in ws.iter_rows()]

    pdf_table = Table(data)

    pdf = SimpleDocTemplate(nameSaveFile, pagesize=letter)
    pdf.build([pdf_table])
    return nameSaveFile

def conversionPPTToPDF(inputfile: str):
    """
    Parameters: 
    -----------
        Función para convertir de .ppt a .pdf

    Args:
    -----
        inputfile (str): Ruta del archivo de entrada
    """
    file_path = os.path.join(os.path.dirname(os.path.abspath(inputfile)),inputfile.split("/")[-1] )
    nameSaveFile = file_path.replace("uploaded", "converted").replace("pptx", "pdf")
    presentation = slides.Presentation(inputfile)

    presentation.save(nameSaveFile, slides.export.SaveFormat.PDF)
    return nameSaveFile