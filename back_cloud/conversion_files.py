import os.path

# Word - ODT
import aspose.words as aw

# Excel
from openpyxl import load_workbook
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table

# PPT
import aspose.slides as slides

name = None
nameSaveFile = None

# =============================================================
# Funciones de conversión de los archivos
# =============================================================

def conversionWordODTTToPDF(inputfile: str):
    """
    Parameters: 
    -----------
        Función para convertir .docx y .odt a .pdf

    Args:
    -----
        inputfile (str): Nombre con extensión del archivo 
    """
    name =  os.path.splitext(inputfile)[0]
    nameSaveFile = "./files/converted{}.pdf".format(name)
    doc = aw.Document('./files/' + inputfile)
    doc.save(nameSaveFile)

def conversionExcelToPDF(inputfile: str):
    """
    Parameters: 
    -----------
        Función para convertir .xlsx en .pdf

    Args:
    -----
        inputfile (str): Nombre con extensión del archivo 
    """
    name =  os.path.splitext(inputfile)[0]
    nameSaveFile = "./files/converted{}.pdf".format(name)
    
    wb = load_workbook(filename='./files/' + inputfile)
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
        inputfile (str): Nombre con extensión del archivo 
    """
    name =  os.path.splitext(inputfile)[0]
    nameSaveFile = "./files/converted{}.pdf".format(name)

    presentation = slides.Presentation('./files/' + inputfile)

    presentation.save(nameSaveFile, slides.export.SaveFormat.PDF)
    
file = 'word.docx'

conversionWordODTTToPDF(file)
