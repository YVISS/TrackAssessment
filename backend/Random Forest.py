import joblib

model = joblib.load("titanic_model.pkl")

print("✅ Model loaded successfully")
print(model)
