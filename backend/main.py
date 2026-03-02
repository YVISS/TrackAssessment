from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import threading
import time
import os

from routers.predict import router as rule_predict_router, compute_group_options
from careers_mapping import STRAND_CAREERS, GROUP_CAREERS
from supabase_client import (
    insert_prediction,
    upsert_prediction,
    upsert_student_submission,
    get_all_results,
    insert_result,
    get_all_predictions,
    get_top_3_from_predictions,
    generate_result_id,
    normalize_strand,
    update_prediction,
    fetch_msa_categories,
    fetch_msa_questions,
    fetch_msa_answers,
    fetch_riasec_categories,
    fetch_riasec_answers,
    get_user_result,
    get_latest_student_submission,
)

app = FastAPI()
app.include_router(rule_predict_router)

# CORS — allow the frontend dev server and any origins configured via env
_extra_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
_cors_origins = ["http://localhost:3000", "http://127.0.0.1:3000"] + _extra_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model/track_recommender.pkl")

# Feature columns for the Random Forest model (must match training order)
MODEL_FEATURES = [
    "verbal_ability",
    "numerical_ability",
    "science_test",
    "clerical_ability",
    "interpersonal_skills_test",
    "logical_reasoning",
    "entrepreneurship_test",
    "mechanical_ability"
]


class StudentData(BaseModel):
    verbal_ability: int
    numerical_ability: int
    science_test: int
    clerical_ability: int
    interpersonal_skills_test: int
    logical_reasoning: int
    entrepreneurship_test: int
    mechanical_ability: int
    realistic: int = 0
    investigative: int = 0
    artistic: int = 0
    social: int = 0
    enterprising: int = 0
    conventional: int = 0


def get_model_prediction(data: "StudentData"):
    """Get prediction from Random Forest model"""
    try:
        # Prepare features in the correct order
        features = [[
            data.verbal_ability,
            data.numerical_ability,
            data.science_test,
            data.clerical_ability,
            data.interpersonal_skills_test,
            data.logical_reasoning,
            data.entrepreneurship_test,
            data.mechanical_ability
        ]]
       
        # Get prediction from model
        prediction = model.predict(features)[0]
       
        # If model returns probabilities, get the class with highest probability
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features)[0]
            confidence = max(proba) * 100
            return prediction, confidence
       
        return prediction, None
    except Exception as e:
        print(f"Model prediction error: {e}")
        return None, None

# RIASEC Interest Mappings (assuming raw scores out of 25)
RIASEC_MAPPING = {
    "Realistic": "mechanical_ability",
    "Investigative": "st_lr",  # (science_test + logical_reasoning) / 2
    "Artistic": "verbal_ability",
    "Social": "interpersonal_skills_test",
    "Enterprising": "entrepreneurship_test",
    "Conventional": "clerical_ability"
}

# MSA Ability Mappings (assuming raw scores out of 5)
MSA_MAPPING = {
    "Logical": "logical_reasoning",
    "Science": "science_test",
    "Numerical": "numerical_ability",
    "Entrepreneurship": "entrepreneurship_test",
    "Clerical": "clerical_ability",
    "Verbal": "verbal_ability",
    "Interpersonal": "interpersonal_skills_test",
    "Creative": "verbal_ability",  # Assuming creative is verbal
    "Mechanical": "mechanical_ability",
    "Physical": "mechanical_ability"  # Assuming physical is mechanical
}

# Track Mappings
TRACK_MAPPING = {
    "TVL": {"interest": "Realistic", "abilities": ["Mechanical"]},
    "STEM": {"interest": "Investigative", "abilities": ["Logical", "Science", "Numerical"]},
    "ABM": {"interest": "Enterprising", "abilities": ["Entrepreneurship", "Clerical", "Numerical"]},
    "HUMSS": {"interest": "Social", "abilities": ["Verbal", "Interpersonal"]},
    "Arts": {"interest": "Artistic", "abilities": ["Creative"]},
    "Sports": {"interest": "Realistic", "abilities": ["Physical", "Mechanical"]}
}

def compute_track_score(data, track):
    """Compute track score using combined RIASEC and ability formulas.

    Returns a percentage (0-100) according to the formulas provided by the user.
    """
    # Derive RIASEC scores if not present (predict endpoint derives them by multiplying by 5)
    realistic = getattr(data, "realistic", None)
    investigative = getattr(data, "investigative", None)
    artistic = getattr(data, "artistic", None)
    social = getattr(data, "social", None)
    enterprising = getattr(data, "enterprising", None)
    conventional = getattr(data, "conventional", None)

    if realistic is None:
        realistic = data.mechanical_ability * 5
    if investigative is None:
        investigative = ((data.science_test + data.logical_reasoning) / 2) * 5
    if artistic is None:
        artistic = data.verbal_ability * 5
    if social is None:
        social = data.interpersonal_skills_test * 5
    if enterprising is None:
        enterprising = data.entrepreneurship_test * 5
    if conventional is None:
        conventional = data.clerical_ability * 5

    # Ability raw values (out of 5)
    logical = getattr(data, "logical_reasoning", 0)
    science = getattr(data, "science_test", 0)
    numerical = getattr(data, "numerical_ability", 0)
    entrepreneurship = getattr(data, "entrepreneurship_test", 0)
    clerical = getattr(data, "clerical_ability", 0)
    verbal = getattr(data, "verbal_ability", 0)
    interpersonal = getattr(data, "interpersonal_skills_test", 0)
    mechanical = getattr(data, "mechanical_ability", 0)

    # Normalize to percentages
    def pct_from_riasec(value):
        return (value / 25) * 100

    def pct_from_ability(value):
        return (value / 5) * 100

    p_realistic = pct_from_riasec(realistic)
    p_investigative = pct_from_riasec(investigative)
    p_artistic = pct_from_riasec(artistic)
    p_social = pct_from_riasec(social)
    p_enterprising = pct_from_riasec(enterprising)
    p_conventional = pct_from_riasec(conventional)

    p_logical = pct_from_ability(logical)
    p_science = pct_from_ability(science)
    p_numerical = pct_from_ability(numerical)
    p_entrepreneurship = pct_from_ability(entrepreneurship)
    p_clerical = pct_from_ability(clerical)
    p_verbal = pct_from_ability(verbal)
    p_interpersonal = pct_from_ability(interpersonal)
    p_mechanical = pct_from_ability(mechanical)

    # Apply user-defined formulas
    if track == "TVL":
        score = (p_realistic + p_mechanical) / 2
    elif track == "STEM":
        score = (p_investigative + ((p_logical + p_science + p_numerical) / 3)) / 2
    elif track == "ABM":
        part1 = (p_enterprising + p_conventional) / 2
        part2 = (p_entrepreneurship + p_clerical + p_numerical) / 3
        score = (part1 + part2) / 2
    elif track == "HUMSS":
        score = (p_social + ((p_verbal + p_interpersonal) / 2)) / 2
    elif track == "Arts":
        score = (p_artistic + ((p_verbal + p_interpersonal) / 2)) / 2
    elif track == "Sports":
        score = (((p_realistic + p_social) / 2) + ((p_mechanical + p_interpersonal) / 2)) / 2
    else:
        score = 0

    return score

SYNC_INTERVAL_SECONDS = 5


def get_track_from_strand(strand):
    """Map strand to track"""
    normalized = normalize_strand(strand)
    academic_strands = ["STEM", "ABM", "HUMSS", "GAS"]

    if normalized in academic_strands:
        return "ACADEMIC TRACK"
    if normalized == "ARTS AND DESIGN":
        return "ARTS AND DESIGN TRACK"
    if normalized == "SPORTS":
        return "SPORTS TRACK"
    if normalized in ["TVL", "IA", "ICT", "HE", "AFA"]:
        return "TECHNICAL VOCATIONAL-LIVELIHOOD (TVL) TRACK"
    return "UNKNOWN TRACK"


def get_top_3_grades_and_track(scores):
    """Identify top 3 highest grades and determine most suited track."""
    fields = [
        "numerical_ability",
        "clerical_ability",
        "interpersonal_skills_test",
        "mechanical_ability",
    ]

    field_scores = [(field, scores[field]) for field in fields]
    field_scores.sort(key=lambda x: x[1], reverse=True)
    top_3 = field_scores[:3]

    top_fields = [field for field, _score in top_3]

    if "numerical_ability" in top_fields and "mechanical_ability" in top_fields:
        track = "Industrial Technology"
    elif "clerical_ability" in top_fields and "interpersonal_skills_test" in top_fields:
        track = "Business Administration"
    else:
        track = "General"

    return {
        "top_3_grades": top_3,
        "predicted_track": track,
    }


def sync_predictions_from_results():
    """Sync predictions from student_submission table using new column names"""
    results = get_all_results()
    migrated_count = 0
    errors = []

    for row in results:
        try:
            # Map new column names from student_submission table
            verbal_ability = int(row.get("VerbalAbility", 0))
            numerical_ability = int(row.get("NumericalAbility", 0))
            science_test = int(row.get("ScienceTest", 0))
            clerical_ability = int(row.get("ClericalAbility", 0))
            interpersonal_skills_test = int(row.get("InterpersonalSkillsTest", 0))
            logical_reasoning = int(row.get("LogicalReasoning", 0))
            entrepreneurship_test = int(row.get("EntrepreneurshipTest", 0))
            mechanical_ability = int(row.get("MechanicalAbility", 0))

            # RIASEC scores (out of 25)
            realistic = int(row.get("Realistic", 0))
            investigative = int(row.get("Investigative", 0))
            artistic = int(row.get("Artistic", 0))
            social = int(row.get("Social", 0))
            enterprising = int(row.get("Enterprising", 0))
            conventional = int(row.get("Conventional", 0))

            # Calculate derived scores
            va_et = (verbal_ability + entrepreneurship_test) / 2
            st_lr = (science_test + logical_reasoning) / 2

            scores = {
                "numerical_ability": numerical_ability,
                "clerical_ability": clerical_ability,
                "interpersonal_skills_test": interpersonal_skills_test,
                "mechanical_ability": mechanical_ability,
                "va_et": va_et,
                "st_lr": st_lr,
            }

            group_result = compute_group_options(scores, threshold=85)
            group_codes = group_result.get("groups", [])
            group_value = ", ".join(group_codes) if group_codes else None

            # Normalize to percentages
            def pct_riasec(v):
                return (v / 25) * 100

            def pct_ability(v):
                return (v / 5) * 100

            p_realistic = pct_riasec(realistic)
            p_investigative = pct_riasec(investigative)
            p_artistic = pct_riasec(artistic)
            p_social = pct_riasec(social)
            p_enterprising = pct_riasec(enterprising)
            p_conventional = pct_riasec(conventional)

            p_logical = pct_ability(logical_reasoning)
            p_science = pct_ability(science_test)
            p_numerical = pct_ability(numerical_ability)
            p_entrepreneurship = pct_ability(entrepreneurship_test)
            p_clerical = pct_ability(clerical_ability)
            p_verbal = pct_ability(verbal_ability)
            p_interpersonal = pct_ability(interpersonal_skills_test)
            p_mechanical = pct_ability(mechanical_ability)

            # Compute track scores per provided formulas
            tvl_score = (p_realistic + p_mechanical) / 2
            stem_score = (p_investigative + ((p_logical + p_science + p_numerical) / 3)) / 2
            abm_part1 = (p_enterprising + p_conventional) / 2
            abm_part2 = (p_entrepreneurship + p_clerical + p_numerical) / 3
            abm_score = (abm_part1 + abm_part2) / 2
            humss_score = (p_social + ((p_verbal + p_interpersonal) / 2)) / 2
            arts_score = (p_artistic + ((p_verbal + p_interpersonal) / 2)) / 2
            sports_score = (((p_realistic + p_social) / 2) + ((p_mechanical + p_interpersonal) / 2)) / 2

            track_scores = {
                "TVL": tvl_score,
                "STEM": stem_score,
                "ABM": abm_score,
                "HUMSS": humss_score,
                "Arts": arts_score,
                "Sports": sports_score,
            }

            top_track = max(track_scores, key=track_scores.get)
            normalized_prediction = normalize_strand(top_track)
            career_value = ", ".join([career for group in group_codes for career in GROUP_CAREERS.get(group, [])]) if group_codes else None

            # Build record matching student_submission schema (no Strand/track/id)
            record = {
                "group": group_value,
                "verbal_ability": float(verbal_ability),
                "numerical_ability": float(numerical_ability),
                "science_test": float(science_test),
                "clerical_ability": float(clerical_ability),
                "interpersonal_skills_test": float(interpersonal_skills_test),
                "logical_reasoning": float(logical_reasoning),
                "entrepreneurship_test": float(entrepreneurship_test),
                "mechanical_ability": float(mechanical_ability),
                # Add RIASEC scores
                "realistic": float(realistic),
                "investigative": float(investigative),
                "artistic": float(artistic),
                "social": float(social),
                "enterprising": float(enterprising),
                "conventional": float(conventional),
                # Track percentage fields
                "TVL": float(tvl_score),
                "STEM": float(stem_score),
                "ABM": float(abm_score),
                "HUMSS": float(humss_score),
                "Arts": float(arts_score),
                "Sports": float(sports_score),
            }

            upsert_student_submission(record)
            migrated_count += 1
        except Exception as e:
            errors.append(f"Error processing row {row}: {str(e)}")

    return migrated_count, errors


@app.on_event("startup")
def startup_event():
    """Startup event. Automatic migration is disabled."""
    print("Startup: automatic migration from results to student_submission is disabled.")


def _background_sync():
    while True:
        try:
            sync_predictions_from_results()
        except Exception as e:
            print(f"Background sync failed: {str(e)}")
        time.sleep(SYNC_INTERVAL_SECONDS)


@app.get("/")
def root():
    return {"message": "API running 🚀"}


@app.get("/predictions")
def get_predictions():
    try:
        predictions = get_all_predictions()
        if not predictions:
            sync_predictions_from_results()
            predictions = get_all_predictions()
        return {"predictions": predictions}
    except Exception as e:
        return {"error": str(e)}


@app.post("/recompute-predictions")
def recompute_predictions():
    try:
        predictions = get_all_predictions()
        updated = 0
        errors = []

        for row in predictions:
            try:
                prediction_id = row.get("id")
                if not prediction_id:
                    continue

                numerical_ability = float(row.get("numerical_ability") or 0)
                clerical_ability = float(row.get("clerical_ability") or 0)
                interpersonal_skills_test = float(row.get("interpersonal_skills_test") or 0)
                mechanical_ability = float(row.get("mechanical_ability") or 0)
                va_et = float(row.get("va_et") or 0)
                st_lr = float(row.get("st_lr") or 0)

                scores = {
                    "numerical_ability": numerical_ability,
                    "clerical_ability": clerical_ability,
                    "interpersonal_skills_test": interpersonal_skills_test,
                    "mechanical_ability": mechanical_ability,
                    "va_et": va_et,
                    "st_lr": st_lr,
                }

                group_result = compute_group_options(scores, threshold=85)
                group_codes = group_result.get("groups", [])
                group_value = ", ".join(group_codes) if group_codes else None

                strand_value = normalize_strand(row.get("Strand"))
                track_value = get_track_from_strand(strand_value)
                career_value = ", ".join([
                    career for group in group_codes for career in GROUP_CAREERS.get(group, [])
                ]) if group_codes else None

                update_prediction(
                    prediction_id,
                    {
                        "Strand": strand_value,
                        "track": track_value,
                        "group": group_value,
                        "career": career_value,
                    },
                )
                updated += 1
            except Exception as e:
                errors.append(str(e))

        return {"updated": updated, "errors": errors}
    except Exception as e:
        return {"error": str(e)}


@app.get("/top-3-analysis")
def get_top_3_analysis():
    try:
        analysis = get_top_3_from_predictions()
        return analysis
    except Exception as e:
        return {"error": str(e)}


@app.post("/insert-result")
def insert_result_endpoint(data: StudentData):
    try:
        result_id = generate_result_id()
        record = {
            "id": result_id,
            "verbal_ability": data.verbal_ability,
            "numerical_ability": data.numerical_ability,
            "science_test": data.science_test,
            "clerical_ability": data.clerical_ability,
            "interpersonal_skills_test": data.interpersonal_skills_test,
            "logical_reasoning": data.logical_reasoning,
            "entrepreneurship_test": data.entrepreneurship_test,
            "mechanical_ability": data.mechanical_ability,
        }

        insert_result(record)
        return {"message": "Submission inserted successfully", "result_id": result_id}
    except Exception as e:
        return {"error": str(e)}


@app.post("/migrate")
def migrate_data():
    try:
        migrated_count, errors = sync_predictions_from_results()
        return {
            "message": f"Successfully migrated {migrated_count} records from results to student_submission",
            "errors": errors,
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/predict")
def predict_track(data: StudentData):
    try:
        scores = {
            "numerical_ability": data.numerical_ability,
            "clerical_ability": data.clerical_ability,
            "interpersonal_skills_test": data.interpersonal_skills_test,
            "mechanical_ability": data.mechanical_ability,
        }

        rule_result = get_top_3_grades_and_track(scores)
        normalized_prediction = normalize_strand(rule_result["predicted_track"])

        group_result = compute_group_options(scores, threshold=85)
        group_codes = group_result.get("groups", [])
        group_value = ", ".join(group_codes) if group_codes else None

        # Compute track scores using RIASEC and MSA percentages
        track_scores = {}
        for track in TRACK_MAPPING.keys():
            track_scores[track] = compute_track_score(data, track)

        # Get Random Forest model prediction
        rf_prediction, rf_confidence = get_model_prediction(data)

        # Select the track with the highest score
        ml_prediction = max(track_scores, key=track_scores.get)

        # Use ml_prediction for the record
        normalized_prediction = normalize_strand(ml_prediction)

        # Calculate RIASEC scores (assuming MSA scores out of 5, RIASEC out of 25)
        realistic = data.mechanical_ability * 5
        investigative = ((data.science_test + data.logical_reasoning) / 2) * 5
        artistic = data.verbal_ability * 5
        social = data.interpersonal_skills_test * 5
        enterprising = data.entrepreneurship_test * 5
        conventional = data.clerical_ability * 5

        record = {
            "id": generate_result_id(),
            "verbal_ability": data.verbal_ability,
            "numerical_ability": data.numerical_ability,
            "science_test": data.science_test,
            "clerical_ability": data.clerical_ability,
            "interpersonal_skills_test": data.interpersonal_skills_test,
            "logical_reasoning": data.logical_reasoning,
            "entrepreneurship_test": data.entrepreneurship_test,
            "mechanical_ability": data.mechanical_ability,
            "realistic": float(realistic),
            "investigative": float(investigative),
            "artistic": float(artistic),
            "social": float(social),
            "enterprising": float(enterprising),
            "conventional": float(conventional),
        }

        try:
            insert_result(record)
            db_status = "Inserted via REST ✅"
        except Exception as e:
            db_status = f"Insert failed ❌: {str(e)}"

        return {
            "rule_based_prediction": rule_result,
            "group_based_result": group_result,
            "rf_model_prediction": str(rf_prediction) if rf_prediction else None,
            "rf_confidence": round(rf_confidence, 2) if rf_confidence else None,
            "scoring_based_prediction": str(ml_prediction),
            "track_scores": track_scores,
            "riasec_scores": {
                "realistic": float(realistic),
                "investigative": float(investigative),
                "artistic": float(artistic),
                "social": float(social),
                "enterprising": float(enterprising),
                "conventional": float(conventional),
            },
            "final_track": ml_prediction,
            "db_status": db_status,
        }
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}


# ---------------------------------------------------------------------------
# MSA category code → student_submission column name
# ---------------------------------------------------------------------------
MSA_CODE_TO_FIELD = {
    "VA": "verbal_ability",
    "NA": "numerical_ability",
    "ST": "science_test",
    "CA": "clerical_ability",
    "IST": "interpersonal_skills_test",
    "ET": "entrepreneurship_test",
    "LR": "logical_reasoning",
    "MA": "mechanical_ability",
}

# RIASEC category code → student_submission column name
RIASEC_CODE_TO_FIELD = {
    "R": "realistic",
    "I": "investigative",
    "A": "artistic",
    "S": "social",
    "E": "enterprising",
    "C": "conventional",
}


class ComputeFromSupabaseRequest(BaseModel):
    user_id: str


@app.post("/compute-from-supabase")
def compute_from_supabase(request: ComputeFromSupabaseRequest):
    """Fetch a user's MSA + RIASEC answers from Supabase, compute scores, and upsert into student_submission."""
    try:
        user_id = request.user_id

        # -- Fetch reference data --
        msa_categories = fetch_msa_categories()
        msa_questions = fetch_msa_questions()
        riasec_categories = fetch_riasec_categories()

        # Build lookup maps
        # right_answer keyed by (category_id, question_number)
        right_answers = {
            (q["category_id"], q["question_number"]): q["right_answer"]
            for q in msa_questions
        }
        # total questions per category for normalisation
        questions_per_msa_cat: dict = {}
        for q in msa_questions:
            cat_id = q["category_id"]
            questions_per_msa_cat[cat_id] = questions_per_msa_cat.get(cat_id, 0) + 1

        # -- Grade MSA answers --
        msa_answers = fetch_msa_answers(user_id)
        correct_per_cat: dict = {}
        for ans in msa_answers:
            cat_id = ans["category_id"]
            q_num = ans["question_number"]
            correct = right_answers.get((cat_id, q_num))
            if correct is not None and ans["answer"] == correct:
                correct_per_cat[cat_id] = correct_per_cat.get(cat_id, 0) + 1

        # Compute ability score (0–5 scale: correct / total * 5)
        ability_scores: dict = {}
        for cat in msa_categories:
            cat_id = cat["id"]
            code = cat["code"]
            field = MSA_CODE_TO_FIELD.get(code)
            if field is None:
                continue
            total = questions_per_msa_cat.get(cat_id, 0)
            if total == 0:
                ability_scores[field] = 0.0
                continue
            correct = correct_per_cat.get(cat_id, 0)
            ability_scores[field] = (correct / total) * 5

        # -- Aggregate RIASEC answers --
        riasec_answers = fetch_riasec_answers(user_id)
        riasec_sums: dict = {}
        for ans in riasec_answers:
            cat_id = ans["category_id"]
            riasec_sums[cat_id] = riasec_sums.get(cat_id, 0) + int(ans["answer"])

        riasec_scores: dict = {}
        for cat in riasec_categories:
            cat_id = cat["id"]
            code = cat["code"]
            field = RIASEC_CODE_TO_FIELD.get(code)
            if field is None:
                continue
            riasec_scores[field] = float(riasec_sums.get(cat_id, 0))

        # -- Compute track percentages using existing formulas --
        # RIASEC_MAX: max possible raw score per RIASEC category (5 questions × 5-point Likert scale)
        RIASEC_MAX = 25

        def pct_ability(v):
            return (v / 5) * 100

        def pct_riasec(v):
            return (v / RIASEC_MAX) * 100

        verbal_ability = ability_scores.get("verbal_ability", 0)
        numerical_ability = ability_scores.get("numerical_ability", 0)
        science_test = ability_scores.get("science_test", 0)
        clerical_ability = ability_scores.get("clerical_ability", 0)
        interpersonal_skills_test = ability_scores.get("interpersonal_skills_test", 0)
        entrepreneurship_test = ability_scores.get("entrepreneurship_test", 0)
        logical_reasoning = ability_scores.get("logical_reasoning", 0)
        mechanical_ability = ability_scores.get("mechanical_ability", 0)

        realistic = riasec_scores.get("realistic", 0)
        investigative = riasec_scores.get("investigative", 0)
        artistic = riasec_scores.get("artistic", 0)
        social = riasec_scores.get("social", 0)
        enterprising = riasec_scores.get("enterprising", 0)
        conventional = riasec_scores.get("conventional", 0)

        p_verbal = pct_ability(verbal_ability)
        p_numerical = pct_ability(numerical_ability)
        p_science = pct_ability(science_test)
        p_clerical = pct_ability(clerical_ability)
        p_interpersonal = pct_ability(interpersonal_skills_test)
        p_entrepreneurship = pct_ability(entrepreneurship_test)
        p_logical = pct_ability(logical_reasoning)
        p_mechanical = pct_ability(mechanical_ability)

        p_realistic = pct_riasec(realistic)
        p_investigative = pct_riasec(investigative)
        p_artistic = pct_riasec(artistic)
        p_social = pct_riasec(social)
        p_enterprising = pct_riasec(enterprising)
        p_conventional = pct_riasec(conventional)

        tvl_score = (p_realistic + p_mechanical) / 2
        stem_score = (p_investigative + ((p_logical + p_science + p_numerical) / 3)) / 2
        abm_part1 = (p_enterprising + p_conventional) / 2
        abm_part2 = (p_entrepreneurship + p_clerical + p_numerical) / 3
        abm_score = (abm_part1 + abm_part2) / 2
        humss_score = (p_social + ((p_verbal + p_interpersonal) / 2)) / 2
        arts_score = (p_artistic + ((p_verbal + p_interpersonal) / 2)) / 2
        sports_score = (((p_realistic + p_social) / 2) + ((p_mechanical + p_interpersonal) / 2)) / 2

        # -- Build and upsert record --
        record = {
            "user_id": user_id,
            "verbal_ability": float(verbal_ability),
            "numerical_ability": float(numerical_ability),
            "science_test": float(science_test),
            "clerical_ability": float(clerical_ability),
            "interpersonal_skills_test": float(interpersonal_skills_test),
            "logical_reasoning": float(logical_reasoning),
            "entrepreneurship_test": float(entrepreneurship_test),
            "mechanical_ability": float(mechanical_ability),
            "realistic": float(realistic),
            "investigative": float(investigative),
            "artistic": float(artistic),
            "social": float(social),
            "enterprising": float(enterprising),
            "conventional": float(conventional),
            "TVL": float(tvl_score),
            "STEM": float(stem_score),
            "ABM": float(abm_score),
            "HUMSS": float(humss_score),
            "Arts": float(arts_score),
            "Sports": float(sports_score),
        }

        try:
            upsert_student_submission(record, conflict_column="user_id")
        except Exception as upsert_err:
            raise RuntimeError(f"Failed to upsert student_submission for user_id={user_id}: {upsert_err}") from upsert_err

        return {"message": "Computed and upserted successfully", "result": record}
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}


@app.get("/user-result/{user_id}")
def get_user_result_endpoint(user_id: str):
    """Fetch the student_submission record for a given user_id."""
    try:
        result = get_user_result(user_id)
        if result is None:
            raise HTTPException(status_code=404, detail=f"No result found for user_id: {user_id}")
        return {"result": result}
    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}


@app.get("/student-result/{user_id}")
def get_student_result(user_id: str):
    """
    Get the latest assessment result for a specific user from student_submission table.
    Returns all scores: MSA abilities, RIASEC scores, track scores.
    """
    try:
        result = get_latest_student_submission(user_id)
        if result is None:
            raise HTTPException(status_code=404, detail=f"No result found for user_id: {user_id}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e)}