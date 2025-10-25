from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/predict", tags=["Prediction"])

class StudentInput(BaseModel):
    math: int = Field(0, description="Your rating in Math (1–5)")
    science: int = Field(0, description="Your rating in Science (1–5)")
    arts: int = Field(0, description="Your rating in Arts (1–5)")
    sports: int = Field(0, description="Your rating in Sports (1–5)")
    business: int = Field(0, description="Your rating in Business (1–5)")
    tech: int = Field(0, description="Your rating in Tech (1–5)")
    social: int = Field(0, description="Your rating in Social Studies / Communication (1–5)")
    home: int = Field(0, description="Your rating in Home Economics (1–5)")
    industrial: int = Field(0, description="Your rating in Industrial / Practical Skills (1–5)")
    agri: int = Field(0, description="Your rating in Agriculture / Fisheries (1–5)")

@router.post("/")
def predict_track(data: StudentInput):
    scores = data.dict()

    # Determine the student's strongest area
    top_skill = max(scores, key=scores.get)

    # Map top skill to strand
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

    recommended_track = mapping.get(top_skill, "GAS")

    return {
        "highest_skill": top_skill,
        "recommended_track": recommended_track,
        "scores": scores
    }
