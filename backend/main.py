from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import threading
import time

from routers.predict import router as rule_predict_router, compute_group_options
from careers_mapping import STRAND_CAREERS
from supabase_client import (
    insert_prediction,
    upsert_prediction,
    get_all_results,
    insert_result,
    get_all_predictions,
    get_top_3_from_predictions,
    generate_result_id,
    normalize_strand,
    update_prediction,
)

app = FastAPI()
app.include_router(rule_predict_router)

model = joblib.load("model/track_recommender.pkl")

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
        "va_et",
        "st_lr",
    ]

    field_scores = [(field, scores[field]) for field in fields]
    field_scores.sort(key=lambda x: x[1], reverse=True)
    top_3 = field_scores[:3]

    top_fields = [field for field, _score in top_3]

    if "st_lr" in top_fields and "va_et" in top_fields:
        track = "STEM"
    elif "numerical_ability" in top_fields and "mechanical_ability" in top_fields:
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
    results = get_all_results()
    migrated_count = 0
    errors = []

    for row in results:
        try:
            verbal_ability = int(row.get("verbal_ability"))
            numerical_ability = int(row.get("numerical_ability"))
            science_test = int(row.get("science_test"))
            clerical_ability = int(row.get("clerical_ability"))
            interpersonal_skills_test = int(row.get("interpersonal_skills_test"))
            logical_reasoning = int(row.get("logical_reasoning"))
            entrepreneurship_test = int(row.get("entrepreneurship_test"))
            mechanical_ability = int(row.get("mechanical_ability"))

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

            rule_result = get_top_3_grades_and_track(scores)
            normalized_prediction = normalize_strand(rule_result["predicted_track"])

            group_result = compute_group_options(scores, threshold=85)
            group_codes = group_result.get("groups", [])
            group_value = ", ".join(group_codes) if group_codes else None
            career_value = ", ".join(
                STRAND_CAREERS.get(normalized_prediction, [])
            ) if normalized_prediction else None

            result_id = row.get("result_id") or row.get("id") or generate_result_id()
            record = {
                "id": result_id,
                "Strand": normalized_prediction,
                "track": get_track_from_strand(normalized_prediction),
                "group": group_value,
                "career": career_value,
                "verbal_ability": float(verbal_ability),
                "numerical_ability": float(numerical_ability),
                "science_test": float(science_test),
                "clerical_ability": float(clerical_ability),
                "interpersonal_skills_test": float(interpersonal_skills_test),
                "logical_reasoning": float(logical_reasoning),
                "entrepreneurship_test": float(entrepreneurship_test),
                "mechanical_ability": float(mechanical_ability),
                "va_et": float(va_et),
                "st_lr": float(st_lr),
            }

            upsert_prediction(record)
            migrated_count += 1
        except Exception as e:
            errors.append(f"Error processing row {row}: {str(e)}")

    return migrated_count, errors


@app.on_event("startup")
def startup_event():
    """Automatically migrate data from results to predictions on startup"""
    print("Starting automatic migration from results to predictions...")
    try:
        migrated_count, errors = sync_predictions_from_results()
        print(f"Migration complete: {migrated_count} records migrated, {len(errors)} errors")
        if errors:
            print("Errors:", errors)
        thread = threading.Thread(target=_background_sync, daemon=True)
        thread.start()
    except Exception as e:
        print(f"Startup migration failed: {str(e)}")


def _background_sync():
    while True:
        try:
            sync_predictions_from_results()
        except Exception as e:
            print(f"Background sync failed: {str(e)}")
        time.sleep(SYNC_INTERVAL_SECONDS)


class StudentData(BaseModel):
    verbal_ability: int
    numerical_ability: int
    science_test: int
    clerical_ability: int
    interpersonal_skills_test: int
    logical_reasoning: int
    entrepreneurship_test: int
    mechanical_ability: int


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
                career_value = ", ".join(
                    STRAND_CAREERS.get(strand_value, [])
                ) if strand_value else None

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
        return {"message": "Result inserted successfully", "result_id": result_id}
    except Exception as e:
        return {"error": str(e)}


@app.post("/migrate")
def migrate_data():
    try:
        migrated_count, errors = sync_predictions_from_results()
        return {
            "message": f"Successfully migrated {migrated_count} records from results to predictions",
            "errors": errors,
        }
    except Exception as e:
        return {"error": str(e)}


@app.post("/predict")
def predict_track(data: StudentData):
    try:
        va_et = (data.verbal_ability + data.entrepreneurship_test) / 2
        st_lr = (data.science_test + data.logical_reasoning) / 2

        scores = {
            "numerical_ability": data.numerical_ability,
            "clerical_ability": data.clerical_ability,
            "interpersonal_skills_test": data.interpersonal_skills_test,
            "mechanical_ability": data.mechanical_ability,
            "va_et": va_et,
            "st_lr": st_lr,
        }

        rule_result = get_top_3_grades_and_track(scores)
        normalized_prediction = normalize_strand(rule_result["predicted_track"])

        group_result = compute_group_options(scores, threshold=85)
        group_codes = group_result.get("groups", [])
        group_value = ", ".join(group_codes) if group_codes else None
        career_value = ", ".join(
            STRAND_CAREERS.get(normalized_prediction, [])
        ) if normalized_prediction else None

        features = [[
            data.verbal_ability,
            data.numerical_ability,
            data.science_test,
            data.clerical_ability,
            data.interpersonal_skills_test,
            data.logical_reasoning,
            data.entrepreneurship_test,
            data.mechanical_ability,
            va_et,
            st_lr,
        ]]

        ml_prediction = model.predict(features)[0]

        record = {
            "id": generate_result_id(),
            "Strand": normalized_prediction,
            "track": get_track_from_strand(normalized_prediction),
            "group": group_value,
            "career": career_value,
            "verbal_ability": float(data.verbal_ability),
            "numerical_ability": float(data.numerical_ability),
            "science_test": float(data.science_test),
            "clerical_ability": float(data.clerical_ability),
            "interpersonal_skills_test": float(data.interpersonal_skills_test),
            "logical_reasoning": float(data.logical_reasoning),
            "entrepreneurship_test": float(data.entrepreneurship_test),
            "mechanical_ability": float(data.mechanical_ability),
            "va_et": float(va_et),
            "st_lr": float(st_lr),
        }

        try:
            insert_prediction(record)
            db_status = "Inserted via REST ✅"
        except Exception as e:
            db_status = f"Insert failed ❌: {str(e)}"

        return {
            "rule_based_prediction": rule_result,
            "group_based_result": group_result,
            "ml_prediction": str(ml_prediction),
            "final_track": rule_result["predicted_track"],
            "db_status": db_status,
        }
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}