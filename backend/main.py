from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import threading
import time
import os

from routers.predict import router as rule_predict_router, compute_group_options
from careers_mapping import GROUP_CAREERS
from supabase_client import (
    insert_prediction,
    upsert_prediction,
    upsert_student_submission,
    get_all_results,
    insert_result,
    get_all_predictions,
    get_top_3_from_predictions,
    generate_result_id,
    update_prediction,
    fetch_msa_categories,
    fetch_msa_questions,
    fetch_msa_answers,
    get_user_result,
    get_latest_student_submission,
)
import requests
from urllib.parse import quote

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

model = None
try:
    model = joblib.load("model/track_recommender.pkl")
except FileNotFoundError:
    print("Warning: model/track_recommender.pkl not found — continuing without RF model.")
except Exception as e:
    print(f"Warning: failed loading model: {e} — continuing without RF model.")

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


def get_model_prediction(data: "StudentData"):
    """Get prediction from Random Forest model"""
    try:
        if model is None:
            return None, None
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
        
        prediction = model.predict(features)[0]
       

        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features)[0]
            confidence = max(proba) * 100
            return prediction, confidence
       
        return prediction, None
    except Exception as e:
        print(f"Model prediction error: {e}")
        return None, None

# Track-related computation removed per user request.
# Track-related constants and compute functions were intentionally removed.

SYNC_INTERVAL_SECONDS = 5


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

            # Calculate derived scores required by group computation
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

            career_value = ", ".join([career for group in group_codes for career in GROUP_CAREERS.get(group, [])]) if group_codes else None

            # Build record matching student_submission schema (no Strand/track fields)
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

                career_value = ", ".join([
                    career for group in group_codes for career in GROUP_CAREERS.get(group, [])
                ]) if group_codes else None

                update_prediction(
                    prediction_id,
                    {
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
        # Compute group-based mapping
        group_result = compute_group_options(scores, threshold=85)
        group_codes = group_result.get("groups", [])
        group_value = ", ".join(group_codes) if group_codes else None

        # Get Random Forest model prediction (kept for compatibility)
        rf_prediction, rf_confidence = get_model_prediction(data)

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
        }

        try:
            insert_result(record)
            db_status = "Inserted via REST ✅"
        except Exception as e:
            db_status = f"Insert failed ❌: {str(e)}"

        return {
            "group_based_result": group_result,
            "rf_model_prediction": str(rf_prediction) if rf_prediction else None,
            "rf_confidence": round(rf_confidence, 2) if rf_confidence else None,
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


class ComputeFromSupabaseRequest(BaseModel):
    user_id: str


@app.post("/compute-from-supabase")
def compute_from_supabase(request: ComputeFromSupabaseRequest):
    """Fetch a user's MSA answers from Supabase, compute scores, and upsert into student_submission."""
    try:
        user_id = request.user_id

        # -- Fetch reference data --
        msa_categories = fetch_msa_categories()
        msa_questions = fetch_msa_questions()

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


        # -- Build and upsert record (abilities) --
        verbal_ability = ability_scores.get("verbal_ability", 0)
        numerical_ability = ability_scores.get("numerical_ability", 0)
        science_test = ability_scores.get("science_test", 0)
        clerical_ability = ability_scores.get("clerical_ability", 0)
        interpersonal_skills_test = ability_scores.get("interpersonal_skills_test", 0)
        entrepreneurship_test = ability_scores.get("entrepreneurship_test", 0)
        logical_reasoning = ability_scores.get("logical_reasoning", 0)
        mechanical_ability = ability_scores.get("mechanical_ability", 0)

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
    Returns MSA abilities and track score fields.
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


@app.get("/verbal-questions")
def get_verbal_questions():
    """Proxy endpoint that returns rows from the Supabase table "Verbal Ability".
    Uses SUPABASE_URL and SUPABASE_ANON_KEY environment variables.
    """
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        anon = os.getenv("SUPABASE_ANON_KEY")
        service_key = os.getenv("SUPABASE_SERVICE_KEY")
        if not supabase_url:
            return {"error": "Supabase URL not configured on server"}
        # Prefer anon key for public access; fall back to service key if anon missing
        key_to_use = anon or service_key
        if not key_to_use:
            return {"error": "Supabase anon or service key not configured on server"}

        # Try a few candidate table names (some projects use different table names)
        candidates = ['"Verbal Ability"', 'Questionnaire_verbal_ability', 'verbal_ability']
        headers = {
            "apikey": key_to_use,
            "Authorization": f"Bearer {key_to_use}",
            "Accept": "application/json",
        }

        last_err = None
        for cand in candidates:
            table = quote(cand)
            url = f"{supabase_url}/rest/v1/{table}?select=id,question_id,question,A,B,C,D,answer,created_at,created_by&order=question_id.asc"
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 200:
                return resp.json()
            last_err = {"status": resp.status_code, "text": resp.text}

        return {"error": "Supabase error: could not find table", "detail": last_err}
    except Exception as e:
        return {"error": str(e)}