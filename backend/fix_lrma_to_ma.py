"""Fix questions accidentally created with `LRMA...` ids by importing MA groups
under the Logical Reasoning category. This script will find questions whose
`question_id` starts with `LRMA` and update them to remove the leading `LR`,
placing them under the `mechanical ability` category.

Usage:
  python fix_lrma_to_ma.py --backend http://127.0.0.1:8000 [--dry-run] [--verbose]

The script uses the backend `/questions` endpoints (GET and PATCH).
"""

import argparse
import requests
from urllib.parse import quote_plus, quote
import sys


def find_lrma(backend_url: str):
    url = f"{backend_url.rstrip('/')}/questions?category={quote_plus('logical reasoning')}"
    resp = requests.get(url, timeout=20)
    resp.raise_for_status()
    data = resp.json()
    # data expected to be a list of question dicts
    results = []
    for item in data:
        qid = item.get('question_id') or item.get('questionId') or item.get('questionID')
        if not qid:
            continue
        if str(qid).upper().startswith('LRMA'):
            results.append({'question_id': qid, 'row': item})
    return results


def patch_to_ma(backend_url: str, qid: str, target_qid: str, dry_run: bool = True, verbose: bool = False):
    patch_url = f"{backend_url.rstrip('/')}/questions/{quote(qid)}?category={quote_plus('mechanical ability')}"
    payload = {'question_id': target_qid}
    if verbose or dry_run:
        print(f"PATCH {patch_url} -> payload={payload}")
    if dry_run:
        return {'status': 'dry-run'}
    resp = requests.patch(patch_url, json=payload, timeout=20)
    try:
        resp.raise_for_status()
        return {'status': 'ok', 'code': resp.status_code, 'resp': resp.text}
    except Exception as e:
        return {'status': 'error', 'error': str(e), 'code': getattr(resp, 'status_code', None), 'resp': getattr(resp, 'text', None)}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--backend', default='http://127.0.0.1:8000')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--verbose', action='store_true')
    args = parser.parse_args()

    try:
        items = find_lrma(args.backend)
    except Exception as e:
        print('Failed to fetch questions from backend:', e)
        sys.exit(1)

    if not items:
        print('No LRMA entries found.')
        return

    print(f'Found {len(items)} LRMA entries to fix.')
    failures = []
    successes = []
    for it in items:
        qid = it['question_id']
        target = qid[2:]  # strip leading 'LR'
        print(f'Will change {qid} -> {target}')
        res = patch_to_ma(args.backend, qid, target, dry_run=args.dry_run, verbose=args.verbose)
        if res.get('status') == 'ok' or res.get('status') == 'dry-run':
            successes.append({'from': qid, 'to': target, 'res': res})
        else:
            failures.append({'from': qid, 'to': target, 'res': res})

    print('\nSummary:')
    print('  successes:', len(successes))
    print('  failures:', len(failures))
    if failures:
        print('Failures details:')
        for f in failures:
            print(' ', f)


if __name__ == '__main__':
    main()
