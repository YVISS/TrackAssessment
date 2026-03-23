"""
Compare right answers from `msa_questions` (reference) with `Table_Questions.answer`.
Run from the project root with SUPABASE_URL and SUPABASE_SERVICE_KEY in the environment.
Example:
    cd backend
    & .\.venv\Scripts\Activate.ps1
    python check_rightanswers.py

Outputs a summary of mismatches to stdout and writes `rightanswers_mismatches.json`.
"""
import os
import re
import json
import requests
from supabase_client import SUPABASE_URL, SUPABASE_SERVICE_KEY, fetch_msa_categories, fetch_msa_questions

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Accept": "application/json",
}

def normalize_answer(a):
    if a is None:
        return None
    s = str(a).strip()
    if s == '':
        return None
    # numeric forms -> map 1->A, 2->B, 3->C, 4->D, 5->E
    if re.fullmatch(r"\d+", s):
        n = int(s)
        if 1 <= n <= 5:
            return chr(64 + n)
        if 0 <= n <= 4:
            return chr(65 + n)
    # opt_ or opt- prefixes
    m = re.search(r"([A-Ea-e])$", s)
    if m:
        return m.group(1).upper()
    # last resort: first letter
    if len(s) >= 1 and s[0].isalpha():
        return s[0].upper()
    return s.upper()


def main():
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("SUPABASE_URL or SUPABASE_SERVICE_KEY not configured in environment.")
        return

    print("Fetching msa_categories and msa_questions...")
    cats = fetch_msa_categories()
    qref = fetch_msa_questions()

    # build code->category_id map
    code_to_cat = { (c.get('code') or '').upper(): c.get('id') for c in cats }

    right_map = {}
    for r in qref:
        cat_id = r.get('category_id')
        qnum = r.get('question_number')
        right = normalize_answer(r.get('right_answer'))
        right_map[(cat_id, int(qnum))] = right

    print(f"Reference right answers loaded: {len(right_map)} entries")

    # fetch Table_Questions
    print("Fetching Table_Questions rows...")
    table_url = f"{SUPABASE_URL}/rest/v1/Table_Questions?select=question_id,answer"
    resp = requests.get(table_url, headers=HEADERS, timeout=30)
    if resp.status_code != 200:
        print(f"Failed to fetch Table_Questions: {resp.status_code} {resp.text}")
        return
    rows = resp.json()
    print(f"Table_Questions rows fetched: {len(rows)}")

    mismatches = []
    missing_ref = []
    total_checked = 0

    for r in rows:
        qid = (r.get('question_id') or '').strip()
        ans = normalize_answer(r.get('answer'))
        if not qid:
            continue
        m = re.match(r"^([A-Za-z]+)(\d+)$", qid)
        if not m:
            # can't parse question_id
            continue
        prefix = m.group(1).upper()
        num = int(m.group(2))
        cat_id = code_to_cat.get(prefix)
        if cat_id is None:
            missing_ref.append({ 'question_id': qid, 'reason': f'unknown prefix "{prefix}"' })
            continue
        key = (cat_id, num)
        ref = right_map.get(key)
        if ref is None:
            missing_ref.append({ 'question_id': qid, 'category_id': cat_id, 'question_number': num, 'table_answer': ans })
            continue
        total_checked += 1
        if ref != ans:
            mismatches.append({ 'question_id': qid, 'category_id': cat_id, 'question_number': num, 'table_answer': ans, 'reference_right_answer': ref })

    print('\nSummary:')
    print(f'  Total questions checked: {total_checked}')
    print(f'  Mismatches: {len(mismatches)}')
    print(f'  Missing reference entries: {len(missing_ref)}')

    out = { 'checked': total_checked, 'mismatches': mismatches, 'missing_reference': missing_ref }
    with open('rightanswers_mismatches.json', 'w', encoding='utf-8') as fh:
        json.dump(out, fh, indent=2)
    print('Wrote rightanswers_mismatches.json')

if __name__ == '__main__':
    main()
