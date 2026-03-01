from sklearn.ensemble import RandomForestClassifier
import numpy as np
import joblib
import os

# Ability order (MUST match FastAPI input order)
# [verbal_ability, numerical_ability, science_test, clerical_ability, interpersonal_skills_test,
#  logical_reasoning, entrepreneurship_test, mechanical_ability, va_et, st_lr]

X = np.array([
    # STEM-oriented
    [5, 5, 5, 2, 1, 5, 2, 3, 5, 5],
    [4, 5, 5, 1, 1, 5, 1, 4, 4, 5],

    # ABM
    [3, 3, 2, 4, 2, 3, 5, 2, 3, 2],
    [2, 4, 2, 5, 2, 3, 5, 1, 2, 2],

    # HUMSS
    [5, 2, 2, 3, 5, 3, 3, 1, 5, 2],

    # ARTS & DESIGN
    [4, 1, 1, 2, 4, 2, 2, 2, 4, 1],

    # SPORTS
    [2, 1, 2, 2, 3, 2, 2, 3, 2, 2],

    # ICT
    [3, 5, 4, 3, 2, 5, 2, 4, 3, 4],

    # HE
    [2, 3, 4, 2, 3, 3, 3, 2, 2, 4],

    # IA
    [1, 2, 1, 2, 1, 3, 1, 5, 1, 1],

    # AFA
    [1, 1, 1, 1, 1, 1, 1, 2, 1, 1],

    # GAS (balanced)
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
])

y = np.array([
    "STEM",
    "STEM",
    "ABM",
    "ABM",
    "HUMSS",
    "ARTS AND DESIGN",
    "SPORTS",
    "ICT",
    "HE",
    "IA",
    "AFA",
    "GAS"
])

# Train model
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)
model.fit(X, y)

# Save model
os.makedirs("model", exist_ok=True)
joblib.dump(model, "model/track_recommender.pkl")

print("✅ Model retrained with 10 abilities and saved successfully")
