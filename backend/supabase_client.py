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


def upsert_student_submission(data: dict, conflict_column: str = "id"):
    """Upsert into student_submission table instead of predictions."""
    url = f"{SUPABASE_URL}/rest/v1/student_submission?on_conflict={conflict_column}"
    payload = dict(data)
    # Do not set the primary `id` from a generated result_id (bigint overflow risk).
    # If caller included a `result_id` for traceability, drop it so DB generates `id`.
    if "result_id" in payload:
        payload.pop("result_id", None)

    # Only keep columns that exist in the student_submission table schema
    allowed_columns = {
        "id",
        "user_id",
        "submitted_at",
        "name",
        "verbal_ability",
        "numerical_ability",
        "science_test",
        "clerical_ability",
        "interpersonal_skills_test",
        "entrepreneurship_test",
        "mechanical_ability",
        "logical_reasoning",
        "realistic",
        "investigative",
        "artistic",
        "social",
        "enterprising",
        "conventional",
        "TVL",
        "STEM",
        "ABM",
        "HUMSS",
        "Arts",
        "Sports",
    }

    filtered_payload = {k: v for k, v in payload.items() if k in allowed_columns}
    dropped = set(payload.keys()) - set(filtered_payload.keys())
    # do not spam logs when dropping columns; keep behavior silent
    payload = filtered_payload

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
    # New behavior: insert into `student_submission` instead of `results`.
    result_id = data.get("result_id") or generate_result_id()

    # Validate required MSA fields
    required = [
        "verbal_ability",
        "numerical_ability",
        "science_test",
        "clerical_ability",
        "interpersonal_skills_test",
        "logical_reasoning",
        "entrepreneurship_test",
        "mechanical_ability",
    ]
    for field in required:
        if field not in data or data[field] is None:
            raise ValueError(f"Missing required field: {field}")

    # Extract abilities
    verbal_ability = float(data.get("verbal_ability", 0))
    numerical_ability = float(data.get("numerical_ability", 0))
    science_test = float(data.get("science_test", 0))
    clerical_ability = float(data.get("clerical_ability", 0))
    interpersonal_skills_test = float(data.get("interpersonal_skills_test", 0))
    logical_reasoning = float(data.get("logical_reasoning", 0))
    entrepreneurship_test = float(data.get("entrepreneurship_test", 0))
    mechanical_ability = float(data.get("mechanical_ability", 0))

    # RIASEC raw scores (derive if not provided)
    realistic = float(data.get("realistic", mechanical_ability * 5))
    investigative = float(data.get("investigative", ((science_test + logical_reasoning) / 2) * 5))
    artistic = float(data.get("artistic", verbal_ability * 5))
    social = float(data.get("social", interpersonal_skills_test * 5))
    enterprising = float(data.get("enterprising", entrepreneurship_test * 5))
    conventional = float(data.get("conventional", clerical_ability * 5))

    # Helpers: convert to percentage
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

    # Build the student_submission record
    student_record = {
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

    # Upsert into student_submission
    response = upsert_student_submission(student_record, conflict_column="id")
    print(f"Upserted student_submission for generated id (response): {response}")
    return response

def get_all_results():
    """Get all student submissions from student_submission table"""
    url = f"{SUPABASE_URL}/rest/v1/student_submission"

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
    """Get top 3 highest average grades from student_submission table"""
    submissions = get_all_results()

    if not submissions:
        return {"error": "No submissions found"}

    # MSA ability fields (out of 5)
    msa_fields = [
        'verbal_ability',
        'numerical_ability',
        'science_test',
        'clerical_ability',
        'interpersonal_skills_test',
        'logical_reasoning',
        'entrepreneurship_test',
        'mechanical_ability',
    ]

    # RIASEC score fields (out of 25)
    riasec_fields = [
        'realistic',
        'investigative',
        'artistic',
        'social',
        'enterprising',
        'conventional',
    ]

    # Track score fields (out of 100)
    track_fields = ['TVL', 'STEM', 'ABM', 'HUMSS', 'Arts', 'Sports']

    def calc_averages(fields):
        averages = {}
        for field in fields:
            values = [float(row.get(field)) for row in submissions if row.get(field) is not None]
            averages[field] = sum(values) / len(values) if values else 0
        return averages

    msa_averages = calc_averages(msa_fields)
    riasec_averages = calc_averages(riasec_fields)
    track_averages = calc_averages(track_fields)

    # Top 3 tracks by average score
    sorted_tracks = sorted(track_averages.items(), key=lambda x: x[1], reverse=True)
    top_3_tracks = sorted_tracks[:3]

    # Top 3 MSA abilities by average score
    sorted_msa = sorted(msa_averages.items(), key=lambda x: x[1], reverse=True)
    top_3_msa = sorted_msa[:3]

    # Top 3 RIASEC scores by average
    sorted_riasec = sorted(riasec_averages.items(), key=lambda x: x[1], reverse=True)
    top_3_riasec = sorted_riasec[:3]

    return {
        "total_submissions": len(submissions),
        "msa_averages": msa_averages,
        "riasec_averages": riasec_averages,
        "track_averages": track_averages,
        "top_3_tracks": top_3_tracks,
        "top_3_msa": top_3_msa,
        "top_3_riasec": top_3_riasec,
    }


def fetch_msa_categories():
    """Fetch all MSA categories (id, code) from msa_categories table."""
    url = f"{SUPABASE_URL}/rest/v1/msa_categories?select=id,code"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Supabase Error: {response.status_code} - {response.text}")
        response.raise_for_status()
    return response.json()


def fetch_msa_questions():
    """Fetch all MSA questions (category_id, question_number, right_answer) from msa_questions table."""
    url = f"{SUPABASE_URL}/rest/v1/msa_questions?select=category_id,question_number,right_answer"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Supabase Error: {response.status_code} - {response.text}")
        response.raise_for_status()
    return response.json()


def fetch_msa_answers(user_id: str):
    """Fetch all MSA answers for a user from msa_answers table."""
    url = f"{SUPABASE_URL}/rest/v1/msa_answers?user_id=eq.{user_id}&select=category_id,question_number,answer"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Supabase Error: {response.status_code} - {response.text}")
        response.raise_for_status()
    return response.json()


def fetch_riasec_categories():
    """Fetch all RIASEC categories (id, code) from riasec_categories table."""
    url = f"{SUPABASE_URL}/rest/v1/riasec_categories?select=id,code"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Supabase Error: {response.status_code} - {response.text}")
        response.raise_for_status()
    return response.json()


def fetch_riasec_answers(user_id: str):
    """Fetch all RIASEC answers for a user from riasec_answers table."""
    url = f"{SUPABASE_URL}/rest/v1/riasec_answers?user_id=eq.{user_id}&select=category_id,question_number,answer"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Supabase Error: {response.status_code} - {response.text}")
        response.raise_for_status()
    return response.json()


def get_user_result(user_id: str):
    """Fetch the student_submission record for a given user_id."""
    url = f"{SUPABASE_URL}/rest/v1/student_submission?user_id=eq.{user_id}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Supabase Error: {response.status_code} - {response.text}")
        response.raise_for_status()
    rows = response.json()
    return rows[0] if rows else None


def get_latest_student_submission(user_id: str):
    """Fetch the most recent student_submission record for a user."""
    url = f"{SUPABASE_URL}/rest/v1/student_submission?user_id=eq.{user_id}&order=submitted_at.desc&limit=1"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        print(f"Supabase Error: {response.status_code} - {response.text}")
        return None
    data = response.json()
    return data[0] if data else None
