import os
import joblib
from backend.stub_model import StubModel

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "track_recommender.pkl")


if __name__ == "__main__":
    os.makedirs(MODEL_DIR, exist_ok=True)
    model = StubModel()
    joblib.dump(model, MODEL_PATH)
    print(f"Wrote stub model to: {MODEL_PATH}")
