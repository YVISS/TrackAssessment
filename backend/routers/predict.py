from fastapi import APIRouter
from pydantic import BaseModel, Field
import joblib
import numpy as np

router = APIRouter(prefix="/predict", tags=["Prediction"])

# Load the trained model
model = joblib.load("model/track_recommender.pkl")

# Define expected input data with default examples
class StudentInput(BaseModel):
    math: int = Field(5, description="Your rating in Math (1-5)")
    science: int = Field(4, description="Your rating in Science (1-5)")
    arts: int = Field(2, description="Your rating in Arts (1-5)")
    sports: int = Field(1, description="Your rating in Sports (1-5)")
    business: int = Field(3, description="Your rating in Business (1-5)")
    tech: int = Field(4, description="Your rating in Tech (1-5)")

@router.post("/")
def predict_track(data: StudentInput):
    # Convert input to numpy array
    X = np.array([[data.math, data.science, data.arts, data.sports, data.business, data.tech]])
    
    # Predict track
    prediction = model.predict(X)[0]
    
    return {"recommended_track": prediction}
