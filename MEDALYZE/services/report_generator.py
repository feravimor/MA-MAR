import io
import csv
from fpdf import FPDF

def generate_csv(data):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(data[0].keys())  # Write headers
    for row in data:
        writer.writerow(row.values())
    output.seek(0)
    return output

def generate_pdf(data):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    for row in data:
        line = ", ".join(f"{key}: {value}" for key, value in row.items())
        pdf.cell(200, 10, txt=line, ln=True)
    output = io.BytesIO()
    pdf.output(output)
    output.seek(0)
    return output
