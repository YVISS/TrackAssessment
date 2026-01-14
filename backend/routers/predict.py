from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/predict", tags=["Prediction"])

class StudentInput(BaseModel):
    math: int = Field(3, description="Your rating in Math (1–5)")
    science: int = Field(5, description="Your rating in Science (1–5)")
    arts: int = Field(5, description="Your rating in Arts (1–5)")
    sports: int = Field(2, description="Your rating in Sports (1–5)")
    business: int = Field(3, description="Your rating in Business (1–5)")
    tech: int = Field(4, description="Your rating in Tech (1–5)")
    social: int = Field(3, description="Your rating in Social Studies / Communication (1–5)")
    home: int = Field(5, description="Your rating in Home Economics (1–5)")
    industrial: int = Field(2, description="Your rating in Industrial / Practical Skills (1–5)")
    agri: int = Field(1, description="Your rating in Agriculture / Fisheries (1–5)")

@router.post("/")
def predict_track(data: StudentInput):
    scores = data.dict()

    # 1️⃣ Find the highest score(s)
    max_score = max(scores.values())
    top_skills = [skill for skill, value in scores.items() if value == max_score]

    # 2️⃣ Define track mapping
    mapping = {
        "math": "STEM",
        "science": "STEM",
        "business": "ABM",
        "social": "HUMSS",
        "arts": "ARTS AND DESIGN",
        "sports": "SPORTS",
        "tech": "ICT",
        "home": "HE",
        "industrial": "IA",
        "agri": "AFA",
    }

    # 3️⃣ If multiple skills have the same top score, combine tracks
    recommended_tracks = list({mapping.get(skill, "GAS") for skill in top_skills})

    return {
        "top_skills": top_skills,
        "max_rating": max_score,
        "recommended_tracks": recommended_tracks,
        "scores": scores
    }
