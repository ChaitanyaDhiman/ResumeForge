from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import tempfile
import re
from docx import Document
from pypdf import PdfReader

load_dotenv()
app = Flask(__name__)
CORS(app)

def extract_text_from_pdf(filepath):
    """Extracts text from a PDF file using pypdf."""
    try:
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        return f"Error extracting PDF text: {e}"

def extract_text_from_docx(filepath):
    """Extracts text from a DOCX file using python-docx."""
    try:
        document = Document(filepath)
        text = "\n".join([paragraph.text for paragraph in document.paragraphs])
        return text
    except Exception as e:
        return f"Error extracting DOCX text: {e}"

def clean_text(text):
    """Basic text cleaning to remove excessive whitespace and standardize format."""
    text = re.sub(r'\s+', ' ', text).strip()
    text = text.replace('\n', ' ')
    return text



@app.route('/', methods=['GET'])
def health_check():
    """Simple endpoint to confirm the Flask service is running."""
    return jsonify({
        "status": "success", 
        "message": "ResumeForge Parser Service is online and ready!"
    }), 200

@app.route('/extract-text', methods=['POST'])
def extract_text_route():
    """
    Receives a file, extracts its clean text, and returns it.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded with key 'file'"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = file.filename
    _, file_extension = os.path.splitext(filename.lower())
    
    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            file.save(temp_file.name)
            temp_filepath = temp_file.name
        
        raw_text = ""
        if file_extension == '.pdf':
            raw_text = extract_text_from_pdf(temp_filepath)
        elif file_extension == '.docx':
            raw_text = extract_text_from_docx(temp_filepath)
        else:
            return jsonify({"error": f"Unsupported file type: {file_extension}"}), 415

        if raw_text.startswith("Error"):
            return jsonify({"error": raw_text}), 500

        clean_text_output = clean_text(raw_text)

        return jsonify({
            "status": "success",
            "filename": filename,
            "clean_text": clean_text_output
        }), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error during processing: {e}"}), 500
    finally:
        if 'temp_filepath' in locals() and os.path.exists(temp_filepath):
            os.remove(temp_filepath)


if __name__ == '__main__':
    port = int(os.environ.get("FLASK_RUN_PORT", 5001))
    app.run(debug=True, port=port)