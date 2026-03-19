import requests, traceback

payload = {
    'question_id': 'VA999',
    'question': 'Test single table insert',
    'opt_a': 'A',
    'opt_b': 'B',
    'opt_c': 'C',
    'opt_d': 'D',
    'opt_e': 'E',
    'answer': 'A',
    'long_text': 'test',
    'created_by': 'admin'
}

try:
    r = requests.post('http://127.0.0.1:8000/questions?category=Verbal%20Ability', json=payload, timeout=10)
    print('STATUS', r.status_code)
    print(r.text)
except Exception:
    traceback.print_exc()
