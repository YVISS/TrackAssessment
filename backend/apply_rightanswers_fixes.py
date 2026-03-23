"""
Apply fixes: set Table_Questions.answer to match msa_questions.right_answer.
This script performs changes immediately and writes a CSV backup `rightanswers_fixes_applied.csv`.
Use with caution — it will PATCH rows in Supabase using SUPABASE_SERVICE_KEY.
"""
import os, re, csv, json
import requests
from supabase_client import SUPABASE_URL, SUPABASE_SERVICE_KEY, fetch_msa_categories, fetch_msa_questions

HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

def normalize_answer(a):
    if a is None:
        return None
    s = str(a).strip()
    if s == '':
        return None
    if re.fullmatch(r"\d+", s):
        n = int(s)
        if 1 <= n <= 5:
            return chr(64 + n)
        if 0 <= n <= 4:
            return chr(65 + n)
    m = re.search(r"([A-Ea-e])$", s)
    if m:
        return m.group(1).upper()
    if len(s) >= 1 and s[0].isalpha():
        return s[0].upper()
    return s.upper()


def main():
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("Supabase config missing in environment.")
        return

    print('Fetching reference and table rows...')
    cats = fetch_msa_categories()
    qref = fetch_msa_questions()
    code_to_cat = { (c.get('code') or '').upper(): c.get('id') for c in cats }

    right_map = {}
    for r in qref:
        cat_id = r.get('category_id')
        qnum = r.get('question_number')
        right = normalize_answer(r.get('right_answer'))
        right_map[(cat_id, int(qnum))] = right

    tbl_url = f"{SUPABASE_URL}/rest/v1/Table_Questions?select=id,question_id,answer"
    resp = requests.get(tbl_url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    rows = resp.json()

    to_fix = []
    for r in rows:
        qid = (r.get('question_id') or '').strip()
        ans = normalize_answer(r.get('answer'))
        if not qid:
            continue
        m = re.match(r"^([A-Za-z]+)(\d+)$", qid)
        if not m:
            continue
        prefix = m.group(1).upper()
        num = int(m.group(2))
        cat_id = code_to_cat.get(prefix)
        if cat_id is None:
            continue
        key = (cat_id, num)
        ref = right_map.get(key)
        if ref is None:
            continue
        if ref != ans:
            to_fix.append({'id': r['id'], 'question_id': qid, 'old': ans, 'new': ref})

    print(f'Planned fixes: {len(to_fix)}')
    if not to_fix:
        print('No fixes needed.')
        return

    applied = []
    for item in to_fix:
        row_id = item['id']
        newval = item['new']
        patch_url = f"{SUPABASE_URL}/rest/v1/Table_Questions?id=eq.{row_id}"
        body = { 'answer': newval }
        r = requests.patch(patch_url, json=body, headers=HEADERS, timeout=15)
        success = (r.status_code in (200,204))
        resp_text = r.text
        print(f"PATCH id={row_id} qid={item['question_id']} -> {newval} status={r.status_code}")
        applied.append({ 'id': row_id, 'question_id': item['question_id'], 'old': item['old'], 'new': newval, 'status': r.status_code, 'response': resp_text })

    # write CSV
    fn = 'rightanswers_fixes_applied.csv'
    with open(fn, 'w', newline='', encoding='utf-8') as fh:
        w = csv.DictWriter(fh, fieldnames=['id','question_id','old','new','status','response'])
        w.writeheader()
        for a in applied:
            w.writerow(a)
    print(f'Applied {len(applied)} fixes. Backup CSV: {fn}')

if __name__ == '__main__':
    main()
