import re
import fitz  # PyMuPDF
from docx import Document
import spacy
from skills import SKILLS

nlp = spacy.load("en_core_web_sm")

def extract_text(file):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        pdf = fitz.open(stream=file.file.read(), filetype="pdf")
        text = ""
        for page in pdf:
            text += page.get_text()
        return text

    elif filename.endswith(".docx"):
        doc = Document(file.file)
        return "\n".join([p.text for p in doc.paragraphs])

    else:
        return ""

def extract_email(text):
    match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return match.group() if match else ""

def extract_phone(text):
    match = re.search(r"\+?\d[\d\s\-]{8,15}", text)
    return match.group() if match else ""

def extract_skills(text):
    text = text.lower()
    found = []
    for skill in SKILLS:
        if skill.lower() in text:
            found.append(skill)
    return list(set(found))

def parse_resume(text):
    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills(text)

    return {
        "email": email,
        "phone": phone,
        "skills": skills
    }
