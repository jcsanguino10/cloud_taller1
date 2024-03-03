import os.path
import logging

# Word - ODT
import aspose.words as aw

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
        logging.info(f"Iniciando conversión de {inputfile} a PDF")
        
        name = os.path.splitext(os.path.basename(inputfile))[0]
        nameSaveFile = f"./files/converted_{name}.pdf"
        
        logging.info(f"Archivo de entrada: {inputfile}")
        logging.info(f"Archivo de salida: {nameSaveFile}")
        
        doc = aw.Document(inputfile)
        doc.save(nameSaveFile)
        
        logging.info("Conversión completada con éxito")
    except Exception as e:
        logging.error(f"Error durante la conversión: {e}")

def conversionExcelToPDF(inputfile: str):
    """
    Parameters: 
    -----------
        Función para convertir .xlsx en .pdf

    Args:
    -----
        inputfile (str): Ruta del archivo de entrada
    """
    name = os.path.splitext(os.path.basename(inputfile))[0]
    nameSaveFile = f"./files/converted_{name}.pdf"

    wb = load_workbook(filename=inputfile)
    ws = wb.active

    data = [[cell.value for cell in row] for row in ws.iter_rows()]

    pdf_table = Table(data)

    pdf = SimpleDocTemplate(nameSaveFile, pagesize=letter)
    pdf.build([pdf_table])

def conversionPPTToPDF(inputfile: str):
    """
    Parameters: 
    -----------
        Función para convertir de .ppt a .pdf

    Args:
    -----
        inputfile (str): Ruta del archivo de entrada
    """
    name = os.path.splitext(os.path.basename(inputfile))[0]
    nameSaveFile = f"./files/converted_{name}.pdf"

    presentation = slides.Presentation(inputfile)

    presentation.save(nameSaveFile, slides.export.SaveFormat.PDF)