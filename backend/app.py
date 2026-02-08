from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text, parse_resume
from database import SessionLocal
from models import Resume

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    text = extract_text(file)
    result = parse_resume(text)

    # Save to DB
    db = SessionLocal()
    resume_row = Resume(
        email=result["email"],
        phone=result["phone"],
        skills=",".join(result["skills"]),
        match_score=None
    )
    db.add(resume_row)
    db.commit()
    db.refresh(resume_row)
    db.close()

    return result

@app.get("/resumes")
def get_resumes():
    db = SessionLocal()
    resumes = db.query(Resume).all()
    db.close()

    return [
        {
            "id": r.id,
            "email": r.email,
            "phone": r.phone,
            "skills": r.skills.split(",") if r.skills else [],
            "match_score": r.match_score,
        }
        for r in resumes
    ]
