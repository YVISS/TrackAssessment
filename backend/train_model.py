from sklearn.ensemble import RandomForestClassifier
import numpy as np
import joblib

# 🧠 Example training data (you will later replace this with your database data)
# Each list = student's ratings for subjects/skills [math, science, arts, sports, business, tech]
X = np.array([
    [5, 5, 2, 1, 3, 4],  # Strong in math & science → STEM
    [4, 4, 1, 2, 3, 4],  # Still STEM
    [2, 1, 5, 5, 3, 2],  # Strong in arts & sports → Arts/Design
    [1, 2, 1, 5, 1, 3],  # Sports oriented → Sports
    [3, 3, 4, 2, 5, 2],  # Business-minded → ABM
    [2, 3, 5, 1, 3, 3],  # Arts focus → Arts/Design
    [3, 3, 2, 3, 3, 3],  # Balanced → GAS
])

# Corresponding tracks for each student above
y = np.array([
    "STEM",
    "STEM",
    "ARTS AND DESIGN",
    "SPORTS",
    "ABM",
    "ARTS AND DESIGN",
    "GAS"
])

# 🧮 Train the Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# 💾 Save the model
import os
os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/track_recommender.pkl")

print("✅ Model trained and saved as 'model/track_recommender.pkl'")
