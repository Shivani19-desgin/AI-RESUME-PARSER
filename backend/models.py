from sqlalchemy import Column, Integer, String
from database import Base, engine

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String)
    phone = Column(String)
    skills = Column(String)
    match_score = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)
