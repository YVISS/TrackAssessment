import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv
from routers.predict import compute_group_options
from careers_mapping import STRAND_CAREERS


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json"
}

def normalize_strand(strand):
    """Normalize strand labels to uppercase with GAS abbreviation."""
    if strand is None:
        return strand
    value = str(strand).strip().upper()
    aliases = {
        "BUSINESS ADMINISTRATION": "ABM",
        "BUSINESS MANAGEMENT": "ABM",
        "ACCOUNTANCY": "ABM",
        "INDUSTRIAL TECHNOLOGY": "IA",
        "INDUSTRIAL ARTS": "IA",
        "GENERAL": "GAS",
        "GAS": "GAS",
        "GENERAL ACADEMIC STRAND": "GAS",
    }
    if value in aliases:
        return aliases[value]
    if value in ["GAS", "GENERAL", "GENERAL ACADEMIC STRAND"]:
        return "GAS"
    return value

def get_track_from_strand(strand):
    """Map strand to track"""
    normalized = normalize_strand(strand)
    academic_strands = ["STEM", "ABM", "HUMSS", "GAS"]
    
    if normalized in academic_strands:
        return "ACADEMIC TRACK"
    elif normalized == "ARTS AND DESIGN":
        return "ARTS AND DESIGN TRACK"
    elif normalized == "SPORTS":
        return "SPORTS TRACK"
    elif normalized in ["TVL", "IA", "ICT", "HE", "AFA"]:
        return "TECHNICAL VOCATIONAL-LIVELIHOOD (TVL) TRACK"
    else:
        return "UNKNOWN TRACK"

def generate_result_id():
    """Generate result_id in yyyymmddhhmmssffffff format (no slashes)."""
    return datetime.now().strftime("%Y%m%d%H%M%S%f")

def insert_prediction(data: dict):
    url = f"{SUPABASE_URL}/rest/v1/predictions"
    
    # Remove the delete logic - allow multiple predictions with same strand
    # Each result should have its own prediction record
    
    # Keep original keys with spaces - Supabase will handle them
    payload = dict(data)
    if "result_id" in payload and "id" not in payload:
        payload["id"] = payload["result_id"]
        payload.pop("result_id", None)

    response = requests.post(url, json=payload, headers=HEADERS)
    
    if response.status_code not in [200, 201]:
        print(f"Supabase Error: {response.status_code}")
        print(f"Response: {response.text}")
        print(f"Payload: {payload}")
    
    response.raise_for_status()
    return response.json() if response.text else {}


def upsert_prediction(data: dict, conflict_column: str = "id"):
    url = f"{SUPABASE_URL}/rest/v1/predictions?on_conflict={conflict_column}"
    payload = dict(data)
    if "result_id" in payload and "id" not in payload:
        payload["id"] = payload["result_id"]
        payload.pop("result_id", None)

    headers = dict(HEADERS)
    headers["Prefer"] = "resolution=merge-duplicates,return=representation"

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code not in [200, 201]:
        print(f"Supabase Error: {response.status_code}")
        print(f"Response: {response.text}")
        print(f"Payload: {payload}")
        response.raise_for_status()

    return response.json() if response.text else {}

def insert_result(data: dict):
    result_id = data.get("result_id") or generate_result_id()

    url = f"{SUPABASE_URL}/rest/v1/results"

    allowed_fields = [
        "verbal_ability",
        "numerical_ability",
        "science_test",
        "clerical_ability",
        "interpersonal_skills_test",
        "logical_reasoning",
        "entrepreneurship_test",
        "mechanical_ability",
    ]
    result_payload = {
        "id": result_id,
    }
    for field in allowed_fields:
        if field not in data or data[field] is None:
            raise ValueError(f"Missing required field: {field}")
        result_payload[field] = float(data[field])
    
    response = requests.post(url, json=result_payload, headers=HEADERS)
    if response.status_code == 400 and "result_id" in data:
        print("Supabase Error: results table may not have result_id column. Retrying without result_id.")
        response = requests.post(url, json=result_payload, headers=HEADERS)
    
    if response.status_code not in [200, 201]:
        print(f"Supabase Error: {response.status_code}")
        print(f"Response: {response.text}")
        print(f"Payload: {data}")
        raise ValueError(f"Supabase Error {response.status_code}: {response.text}")
    
    response.raise_for_status()
    
    # After successful insert to results, immediately predict and insert to predictions
    try:
        # Import model here to avoid circular import
        import joblib
        model = joblib.load("model/track_recommender.pkl")
        
        # Extract abilities
        verbal_ability = int(data["verbal_ability"])
        numerical_ability = int(data["numerical_ability"])
        science_test = int(data["science_test"])
        clerical_ability = int(data["clerical_ability"])
        interpersonal_skills_test = int(data["interpersonal_skills_test"])
        logical_reasoning = int(data["logical_reasoning"])
        entrepreneurship_test = int(data["entrepreneurship_test"])
        mechanical_ability = int(data["mechanical_ability"])
        
        # Calculate va_et and st_lr
        va_et = (verbal_ability + entrepreneurship_test) / 2
        st_lr = (science_test + logical_reasoning) / 2
        
        # Create scores for rule-based prediction
        scores = {
            'numerical_ability': numerical_ability,
            'clerical_ability': clerical_ability,
            'interpersonal_skills_test': interpersonal_skills_test,
            'mechanical_ability': mechanical_ability,
            'va_et': va_et,
            'st_lr': st_lr
        }

        group_result = compute_group_options(scores, threshold=85)
        group_codes = group_result.get("groups", [])
        group_value = ", ".join(group_codes) if group_codes else None
        
        # Get top 3 and determine track
        fields = [
            'numerical_ability', 'clerical_ability', 'interpersonal_skills_test',
            'mechanical_ability', 'va_et', 'st_lr'
        ]
        field_scores = [(field, scores[field]) for field in fields]
        field_scores.sort(key=lambda x: x[1], reverse=True)
        top_fields = [field for field, score in field_scores[:3]]
        
        # Track determination (customize this based on your rules)
        if 'st_lr' in top_fields and 'va_et' in top_fields:
            prediction = "STEM"
        elif 'numerical_ability' in top_fields and 'mechanical_ability' in top_fields:
            prediction = "Industrial Technology"
        elif 'clerical_ability' in top_fields and 'interpersonal_skills_test' in top_fields:
            prediction = "Business Administration"
        else:
            prediction = "General"
        
        # Prepare prediction record
        normalized_prediction = normalize_strand(prediction)
        career_value = ", ".join(
            STRAND_CAREERS.get(normalized_prediction, [])
        ) if normalized_prediction else None
        pred_record = {
            "result_id": result_id,
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
            "st_lr": float(st_lr)
        }
        
        # Upsert prediction
        upsert_prediction(pred_record)
        print(f"Auto-predicted and inserted: {prediction}")
        
    except Exception as e:
        print(f"Auto-prediction failed: {str(e)}")
    
    return response.json() if response.text else {}

def get_all_results():
    url = f"{SUPABASE_URL}/rest/v1/results"
    
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code != 200:
        print(f"Supabase Error: {response.status_code}")
        print(f"Response: {response.text}")
        response.raise_for_status()
    
    return response.json()

def get_all_predictions():
    url = f"{SUPABASE_URL}/rest/v1/predictions"
    
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code != 200:
        print(f"Supabase Error: {response.status_code}")
        print(f"Response: {response.text}")
        response.raise_for_status()
    
    return response.json()


def update_prediction(prediction_id: str, data: dict):
    url = f"{SUPABASE_URL}/rest/v1/predictions?id=eq.{prediction_id}"

    payload = dict(data)
    response = requests.patch(url, json=payload, headers=HEADERS)

    if response.status_code not in [200, 204]:
        print(f"Supabase Error: {response.status_code}")
        print(f"Response: {response.text}")
        print(f"Payload: {payload}")
        response.raise_for_status()

    return response.json() if response.text else {}

def get_top_3_from_predictions():
    """Get top 3 highest average grades from predictions table"""
    predictions = get_all_predictions()
    
    if not predictions:
        return {"error": "No predictions found"}
    
    # Fields to analyze
    fields = [
        'numerical_ability',
        'clerical_ability', 
        'interpersonal_skills_test',
        'mechanical_ability',
        'va_et',
        'st_lr'
    ]
    
    # Calculate averages
    averages = {}
    for field in fields:
        values = [float(row.get(field, 0)) for row in predictions if row.get(field) is not None]
        if values:
            averages[field] = sum(values) / len(values)
        else:
            averages[field] = 0
    
    # Sort by average descending
    sorted_averages = sorted(averages.items(), key=lambda x: x[1], reverse=True)
    top_3 = sorted_averages[:3]
    
    # Determine most suited track based on top 3
    top_fields = [field for field, score in top_3]
    
    if 'st_lr' in top_fields and 'va_et' in top_fields:
        track = "STEM"
    elif 'numerical_ability' in top_fields and 'mechanical_ability' in top_fields:
        track = "Industrial Technology"
    elif 'clerical_ability' in top_fields and 'interpersonal_skills_test' in top_fields:
        track = "Business Administration"
    else:
        track = "General"
    
    return {
        "total_predictions": len(predictions),
        "average_scores": averages,
        "top_3_grades": top_3,
        "most_suited_track": track
    }