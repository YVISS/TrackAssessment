from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import engine
from sqlalchemy import text
import joblib
import os

# 1️⃣ Load the trained model
model_path = os.path.join("model", "track_recommender.pkl")
model = joblib.load(model_path)

# 2️⃣ Define FastAPI app
app = FastAPI(
    title="Track Recommendation API",
    description="AI-powered student track recommendation using Random Forest",
    version="1.0.0"
)

# 3️⃣ Middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4️⃣ Pydantic model for input validation
class StudentData(BaseModel):
    math: float
    science: float
    arts: float
    sports: float
    business: float
    tech: float

# 5️⃣ Root route
@app.get("/")
def root():
    return {"message": "Track Recommendation API is running 🚀"}

# 6️⃣ Hello test route
@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Hello, {name}!"}

# 7️⃣ DB connection test
@app.get("/db-test")
async def db_test():
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            value = result.scalar()
        return {"status": "Connected to Supabase 🎉", "test_query_result": value}
    except Exception as e:
        return {"status": "Connection failed ❌", "error": str(e)}

# 8️⃣ Prediction endpoint
@app.post("/predict")
async def predict_track(data: StudentData):
    # Prepare features
    features = [[
        data.math, data.science, data.arts,
        data.sports, data.business, data.tech
    ]]
    
    # Make prediction
    prediction = model.predict(features)[0]

    # Save input + prediction to Supabase
    try:
        async with engine.begin() as conn:
            await conn.execute(
                text(
                    "INSERT INTO predictions (math, science, arts, sports, business, tech, predicted_track) "
                    "VALUES (:math, :science, :arts, :sports, :business, :tech, :track)"
                ),
                {
                    "math": data.math,
                    "science": data.science,
                    "arts": data.arts,
                    "sports": data.sports,
                    "business": data.business,
                    "tech": data.tech,
                    "track": prediction
                }
            )
        db_status = "Inserted successfully ✅"
    except Exception as e:
        return {"predicted_track": prediction, "db_status": f"Failed to insert: {str(e)}"}

    # Return prediction + inserted data
    return {
        "predicted_track": prediction,
        "db_status": db_status,
        "inserted_data": {
            "math": data.math,
            "science": data.science,
            "arts": data.arts,
            "sports": data.sports,
            "business": data.business,
            "tech": data.tech
        }
    }
