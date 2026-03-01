from supabase_client import get_all_predictions, update_prediction, normalize_strand, get_track_from_strand
from routers.predict import compute_group_options
from careers_mapping import STRAND_CAREERS

predictions = get_all_predictions()
updated = 0

for row in predictions:
    prediction_id = row.get("id")
    if not prediction_id:
        continue

    scores = {
        "numerical_ability": float(row.get("numerical_ability") or 0),
        "clerical_ability": float(row.get("clerical_ability") or 0),
        "interpersonal_skills_test": float(row.get("interpersonal_skills_test") or 0),
        "mechanical_ability": float(row.get("mechanical_ability") or 0),
        "va_et": float(row.get("va_et") or 0),
        "st_lr": float(row.get("st_lr") or 0),
    }

    group_result = compute_group_options(scores, threshold=85)
    group_codes = group_result.get("groups", [])
    group_value = ", ".join(group_codes) if group_codes else None

    strand_value = normalize_strand(row.get("Strand"))
    track_value = get_track_from_strand(strand_value)
    career_value = ", ".join(STRAND_CAREERS.get(strand_value, [])) if strand_value else None

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

print({"updated": updated})
