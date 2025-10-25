from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict  # remove results for now

app = FastAPI(
    title="Track Recommendation API",
    description="AI-powered student track recommendation using Random Forest",
    version="1.0.0"
)

# Allow frontend (Next.js) to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routers
app.include_router(predict.router)

@app.get("/")
def root():
    return {"message": "Track Recommendation API is running 🚀"}

# ✅ Test route
@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Hello, {name}!"}
