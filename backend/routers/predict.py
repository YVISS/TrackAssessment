from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from itertools import combinations

router = APIRouter(prefix="/rule-predict", tags=["Rule-Based Prediction"])

class StudentInput(BaseModel):
    numerical_ability: float = Field(..., description="0–100 (N)")
    clerical_ability: float = Field(..., description="0–100 (C)")
    interpersonal_skills_test: float = Field(..., description="0–100 (I)")
    mechanical_ability: float = Field(..., description="0–100 (M)")
    st_lr: float | None = Field(None, description="0–100 (L). If missing, computed from science_test + logical_reasoning")
    va_et: float | None = Field(None, description="0–100 (E). If missing, computed from verbal_ability + entrepreneurship_test")

    science_test: float | None = Field(None, description="0–100 (for L computation)")
    logical_reasoning: float | None = Field(None, description="0–100 (for L computation)")
    verbal_ability: float | None = Field(None, description="0–100 (for E computation)")
    entrepreneurship_test: float | None = Field(None, description="0–100 (for E computation)")

ABILITY_LETTERS = {
    "numerical_ability": "N",
    "clerical_ability": "C",
    "interpersonal_skills_test": "I",
    "st_lr": "L",
    "va_et": "E",
    "mechanical_ability": "M",
}

LETTER_PRIORITY = ["C", "I", "E", "L", "N", "M"]

GROUP_CAREERS = {
    "E": [
        "Advertising Account Executive",
        "Advertising Copywriter",
        "Advertising Manager",
        "Advertising Sales Representative",
        "Automobile Salesperson",
        "Bakery Manager",
        "Bank Cashier",
        "Commercial Broker",
        "Customer Service Representative / Call Center Agent",
        "Farm Manager",
        "Front-Office Hotel Manager",
        "High-School Principal",
        "Hotel Manager",
        "Insurance Agent",
        "Jeweler",
        "Pawnbroker",
        "Public Relations Representative",
        "Real Estate Agent",
        "Sales Manager",
        "Stockbroker",
        "Wholesaler",
    ],
    "CE": [
        "Bank Cashier",
        "Bus Station Manager",
        "Executive Secretary",
        "Fire Inspector",
        "Hotel Bell Captain",
        "Legal Assistant",
        "Pawnbroker",
        "Postmaster",
        "Secretary",
        "Travel Agent",
        "Warehouse Manager",
    ],
    "CLE": [
        "Accountant",
        "Book Editor",
        "Certified Public Accountant",
        "Executive Secretary",
        "Head Nurse",
        "Librarian",
    ],
    "CEM": [
        "Building Inspector",
        "Certified Public Accountant",
        "Fire Inspector",
    ],
    "NCE": [
        "Accountant",
        "Accounting Clerk",
        "Auditor",
        "Bank Cashier",
        "Economist",
        "Real Estate Agent",
    ],
    "CIE": [
        "Advertising Copywriter",
        "Airline-Lounge Receptionist",
        "Executive Secretary",
        "Head Nurse",
        "Legal Assistant",
        "Reception Clerk",
        "Secondary-School Teacher",
    ],
    "LE": [
        "Bank Credit Analyst",
        "Bank Lending Officer",
        "Book Editor",
        "Branch Bank Operations Officer",
        "Business Analyst",
        "Foreign Correspondent",
        "Hospital Administrator",
        "Immigration Lawyer",
        "Loan Officer",
        "Newspaper Editor",
    ],
    "LEM": [
        "Architect",
        "Art Director",
        "Building Contractor",
        "City Planning Engineer",
        "Industrial Engineer",
        "Landscape Architect",
    ],
    "NLE": [
        "Accountant",
        "Bank Credit Analyst",
        "Bank Lending Officer",
        "Certified Public Accountant",
        "City Planning Engineer",
        "Economist",
        "Financial Analyst",
        "Financial Planner",
        "Industrial Engineer",
        "Loan Officer",
        "Purchasing Manager",
        "Tax Attorney",
    ],
    "ILE": [
        "Advertising Manager",
        "Branch Bank Operations Officer",
        "Business Consultant",
        "Head Nurse",
        "Immigration Lawyer",
        "Lawyer",
        "Occupational Therapist",
    ],
    "EM": [
        "Apartment / Condominium Superintendent",
        "Arcade Attendant",
        "Barber / Stylist",
        "Broadcasting Announcer",
        "Broadcasting / TV Director",
        "Chef",
        "Clothing Designer",
        "Commercial Photographer",
        "Fashion Coordinator",
        "Fashion Designer",
        "Interior Designer",
        "Jeweler",
    ],
    "NEM": [
        "Architect",
        "Architectural Graphic Designer",
        "Building Contractor",
        "Cabinetmaker",
        "City Planning Engineer",
        "Chief Petroleum Engineer",
        "Landscape Architect",
        "Project Engineer",
    ],
    "IEM": [
        "Advertising Manager",
        "Television Director",
    ],
    "NE": [
        "Advertising Sales Representative",
        "Appraiser",
        "Bank Manager",
        "Caterer",
        "Food and Beverage Manager",
        "International Banker",
        "Stockbroker",
        "Tax Attorney",
    ],
    "NIE": [
        "Branch-Bank Operations Officer",
        "Business Agent",
        "Tax Attorney",
    ],
    "IE": [
        "Advertising Account Executive",
        "Advertising Copywriter",
        "Advertising Manager",
        "high-School Principal",
        "Secondary-School Teacher",
        "Wedding Consultant",
    ],
    "C": [
        "Aircraft Inspector",
        "Airline Dispatcher",
        "Airline Lounge Receptionist",
        "Bank Teller",
        "Billing Typist",
        "Blood Bank Technologist",
        "Customs Inspector",
        "Directory Assistance Operator",
        "File Clerk",
        "Information Clerk",
        "Legal Assistant",
        "Office Clerk",
        "Postal Clerk",
        "Proofreader",
        "Receptionist",
        "Secretary",
    ],
    "CL": [
        "Agricultural Microbiologist",
        "Bacteriologist",
        "Computer Programmer",
        "Historian",
        "Legal Assistant",
        "Librarian",
        "Microbiologist",
        "Newspaper Columnist",
    ],
    "CLM": [
        "Drafter / Draftsman",
        "Electronics Technician",
        "Laboratory Assistant",
    ],
    "NCL": [
        "Computer Programmer",
        "Economist",
        "Internal Revenue Agent",
        "Laboratory Assistant",
        "Medical Technologist",
        "Pharmacist",
        "Production Planning Supervisor",
    ],
    "NCI": [
        "Audit Accounting Aide",
        "Tax Attorney",
    ],
    "CIL": [
        "Dietitian",
        "Guidance Counselor",
        "Legal Assistant",
        "Medical Assistant",
        "News Reporter",
    ],
    "CI": [
        "Airline Flight Attendant",
        "Airline-Lounge Receptionist",
        "Medical Assistant",
        "Nurse",
        "Nurse Aide",
        "Police Inspector",
        "Receptionist",
        "Teacher Aide",
    ],
    "CM": [
        "Aircraft Inspector",
        "Animator",
        "Book Designer",
        "Building Inspector",
        "Construction Inspector",
        "Electronics Technician",
        "News Photographer",
    ],
    "NCM": [
        "Construction Materials Supervisor",
        "Laboratory Assistant",
        "Land Surveyor",
    ],
    "CIM": [
        "Art Teacher",
        "Dental Assistant",
        "Physical Therapist",
    ],
    "NC": [
        "Accounting Clerk",
        "Auditor",
        "Bank Teller",
        "Bookkeeper",
        "Production Planning Supervisor",
        "Proofreader",
    ],
    "L": [
        "Agricultural Microbiologist",
        "Agronomist",
        "Bacteriologist",
        "Biologist",
        "Botanist",
        "Computer Programmer",
        "Criminologist",
        "Database Manager",
        "Marine Biologist",
        "Microbiologist",
        "Veterinarian",
        "Zoologist",
    ],
    "LM": [
        "Agricultural Engineer",
        "Air-Conditioning Technician",
        "Airline Pilot",
        "Architectural Graphic Designer",
        "Automobile Mechanic",
        "Design Engineer",
        "Diagnostic X-Ray Technologist",
        "Electrician",
        "Film Director",
        "Graphic Designer",
        "Neurosurgeon",
        "Photojournalist",
    ],
    "NLM": [
        "Aeronautical Engineer",
        "Anesthesiologist",
        "Chemical Engineer",
        "Civil Engineer",
        "Computer Applications Engineer",
        "Design Engineer",
        "Drafter / Draftsman",
        "Electrical Engineer",
        "Electronics Engineer",
        "Geologist",
        "Industrial Engineer",
        "Naval Architect",
        "Mechanical Engineer",
        "Metallurgical Engineer",
        "Mining Engineer",
        "Ophthalmologist",
        "Plastic Surgeon",
        "Seismologist",
    ],
    "ILM": [
        "Cartoonist",
        "Chiropractor",
        "Dentist",
        "Gynecologist",
        "Neurosurgeon",
        "Physical Therapist",
        "Surgeon",
    ],
    "NL": [
        "Biochemist",
        "Chemist",
        "Computer Systems Analyst",
        "Database Manager",
        "Pharmacist",
        "Quality Control Engineer",
        "Systems Analyst",
        "Zoologist",
    ],
    "NIL": [
        "Cardiologist",
        "Cardiovascular Physician",
        "Mathematics Teacher",
        "Pediatrician",
        "Physician",
        "Psychiatrist",
    ],
    "IL": [
        "Animal Technician",
        "Athletic Trainer",
        "Biology Teacher",
        "Cardiologist",
        "Cardiovascular Physician",
        "Child Psychologist",
        "Counseling Psychologist",
        "Dermatologist",
        "Elementary-School Teacher",
        "Guidance Counselor",
        "Gynecologist",
        "Judge",
        "Lawyer",
        "Neurologist",
        "Occupational Therapist",
        "Parole Officer",
        "Pediatrician",
        "Physician",
        "Police Officer",
        "Psychiatrist",
        "Sociologist",
        "Veterinarian",
    ],
    "M": [
        "Air-Conditioning Mechanic",
        "Animator",
        "Artificial Eye Maker",
        "Art Teacher",
        "Audio Technician",
        "Audiovisual Technician",
        "Automobile Mechanic",
        "Book Jacket Designer",
        "Cabinetmaker",
        "Construction Electrician",
        "Costume Designer",
        "Diagnostic X-Ray Technologist",
        "Goldsmith",
        "Museum Ceramic Restorer",
        "News Photographer",
    ],
    "NM": [
        "Drafter / Draftsman",
        "Electroplater",
        "Video Operator",
    ],
    "NIM": [
        "Anesthesiologist",
        "Dentist",
        "Dialysis Technician",
    ],
    "IM": [
        "Art Teacher",
        "Cartoonist",
        "Dental Assistant",
        "Dialysis Technician",
    ],
    "N": [
        "Accounting Clerk",
        "Computer Applications Engineer",
        "Statistician",
    ],
    "NI": [
        "Mathematics Teacher",
        "Tax Attorney",
    ],
    "I": [
        "Elementary-School Teacher",
        "Kindergarten Teacher",
        "Nurse",
        "Nurse Aide",
        "Occupational Therapist",
        "Parole Officer",
        "Secondary-School Teacher",
    ],
}


def _compute_st_lr(data: StudentInput) -> float | None:
    if data.st_lr is not None:
        return data.st_lr
    if data.science_test is None or data.logical_reasoning is None:
        return None
    return (data.science_test + data.logical_reasoning) / 2


def _compute_va_et(data: StudentInput) -> float | None:
    if data.va_et is not None:
        return data.va_et
    if data.verbal_ability is None or data.entrepreneurship_test is None:
        return None
    return (data.verbal_ability + data.entrepreneurship_test) / 2


def _sort_key(item: tuple[str, float]) -> tuple[float, int]:
    letter = ABILITY_LETTERS[item[0]]
    return (-item[1], LETTER_PRIORITY.index(letter))


def _find_group_by_letters(letters: list[str]) -> tuple[str, list[str]]:
    if not letters:
        return "", []

    sorted_letters = "".join(sorted(letters))
    for key, careers in GROUP_CAREERS.items():
        if len(key) == len(letters) and "".join(sorted(key)) == sorted_letters:
            return key, careers

    return "", []


def compute_group_options(scores: dict[str, float], threshold: float = 85) -> dict:
    max_score = max(scores.values()) if scores else 0
    scaled_scores = scores
    if max_score <= 5:
        scaled_scores = {k: (v * 15) + 25 for k, v in scores.items()}

    candidates = [(k, v) for k, v in scaled_scores.items() if v >= threshold]

    candidates.sort(key=_sort_key)

    group_options = []
    top_abilities = [
        {"ability": k, "letter": ABILITY_LETTERS[k], "score": v} for k, v in candidates
    ]

    if len(candidates) == 0:
        return {
            "group_options": [],
            "groups": [],
            "top_abilities": [],
            "threshold": threshold,
            "scaled_scores": scaled_scores,
        }

    if len(candidates) <= 3:
        top_letters = [ABILITY_LETTERS[k] for k, _ in candidates]
        group_code, careers = _find_group_by_letters(top_letters)
        if not group_code:
            if len(top_letters) >= 2:
                group_code, careers = _find_group_by_letters(top_letters[:2])
            if not group_code:
                group_code, careers = _find_group_by_letters(top_letters[:1])
        group_options.append({"group_code": group_code, "careers": careers})
    else:
        highest = candidates[0]
        remaining = candidates[1:]
        highest_letter = ABILITY_LETTERS[highest[0]]

        pair_indices = [(i, i + 1) for i in range(len(remaining) - 1)]
        for i in range(len(remaining)):
            for j in range(i + 1, len(remaining)):
                if (i, j) not in pair_indices:
                    pair_indices.append((i, j))

        seen = set()
        for i, j in pair_indices:
            a = remaining[i]
            b = remaining[j]
            letters = [highest_letter, ABILITY_LETTERS[a[0]], ABILITY_LETTERS[b[0]]]
            group_code, careers = _find_group_by_letters(letters)
            if not group_code or group_code in seen:
                continue
            seen.add(group_code)
            group_options.append({"group_code": group_code, "careers": careers})
            if len(group_options) >= 3:
                break
    return {
        "group_options": group_options,
        "groups": [g["group_code"] for g in group_options],
        "top_abilities": top_abilities,
        "threshold": threshold,
        "scaled_scores": scaled_scores,
    }


@router.post("/")
def rule_predict(data: StudentInput):
    st_lr = _compute_st_lr(data)
    va_et = _compute_va_et(data)

    if st_lr is None or va_et is None:
        raise HTTPException(
            status_code=400,
            detail="Missing st_lr or va_et. Provide st_lr/va_et or the source fields for their averages.",
        )

    scores = {
        "numerical_ability": data.numerical_ability,
        "clerical_ability": data.clerical_ability,
        "interpersonal_skills_test": data.interpersonal_skills_test,
        "st_lr": st_lr,
        "va_et": va_et,
        "mechanical_ability": data.mechanical_ability,
    }

    result = compute_group_options(scores, threshold=85)
    result["all_scores"] = scores
    return result
