"""
Import images from Supabase Storage bucket and create rows in Table_Questions.

Usage:
  python import_images_to_questions.py --bucket msa-images --category "logical reasoning" --backend http://127.0.0.1:8000

Behavior:
- Groups objects by top-level folder (e.g., LR-TEST-1/...).
- Detects question image (filename contains "question") -> sets `image_url`.
- Detects option images with names containing OPT-A/OPT-B/OPT-C/OPT-D/OPT-E or opt-a etc.
- Posts a payload to the backend `/questions` endpoint with the given `category`.

Notes:
- Requires the backend (FastAPI) to be running if using `--backend` target.
- Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in environment if listing the bucket.
- The script will not attempt to automatically determine the correct `answer` unless
  filenames encode the correct letter. Admin can later update answers via the UI.
"""

import os
import requests
import argparse
from urllib.parse import quote_plus, quote

try:
    from supabase_client import SUPABASE_URL, SUPABASE_SERVICE_KEY
except Exception:
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

HEADERS = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
}

STORAGE_LIST_ENDPOINT = lambda bucket: f"{SUPABASE_URL}/storage/v1/object/list/{bucket}"
# preserve slashes in the path when encoding so folder prefixes remain intact
PUBLIC_OBJECT_URL = lambda bucket, path: f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{quote(path, safe='/')}"

OPT_KEYS = [
    ('opt_a', ['opt-a', 'opt_a', 'opta', 'opt_a']),
    ('opt_b', ['opt-b', 'opt_b', 'optb', 'opt_b']),
    ('opt_c', ['opt-c', 'opt_c', 'optc', 'opt_c']),
    ('opt_d', ['opt-d', 'opt_d', 'optd', 'opt_d']),
    ('opt_e', ['opt-e', 'opt_e', 'opte', 'opt_e']),
]


def list_objects(bucket: str, prefix: str = ""):
    url = STORAGE_LIST_ENDPOINT(bucket)
    # Supabase Storage list endpoint expects a POST with JSON body like {"prefix":"","limit":100}
    body = {"prefix": prefix or "", "limit": 2000}
    resp = requests.post(url, headers={**HEADERS, 'Content-Type': 'application/json'}, json=body, timeout=20)
    try:
        resp.raise_for_status()
    except Exception as e:
        # include response body for easier debugging
        txt = resp.text if hasattr(resp, 'text') else '<no body>'
        raise RuntimeError(f"Supabase storage list failed: {resp.status_code} {txt}") from e
    return resp.json()


def group_by_folder(objects):
    groups = {}
    for obj in objects:
        name = obj.get('name') or obj.get('path') or obj.get('Key') or ''
        # normalize
        if not name:
            continue
        parts = name.split('/')
        # use the first path segment as the group name even for top-level entries
        top = parts[0]
        groups.setdefault(top, []).append({'name': name, 'meta': obj})
    return groups


def detect_assets(items, bucket):
    payload = {}
    # find question image (prefer filenames containing 'question')
    question_candidate = None
    for it in items:
        nm = it['name'].lower()
        if 'question' in nm:
            question_candidate = it
            break
    # fallback: first image file in the folder
    if not question_candidate:
        for it in items:
            nm = it['name'].lower()
            if nm.endswith('.webp') or nm.endswith('.png') or nm.endswith('.jpg') or nm.endswith('.jpeg'):
                question_candidate = it
                break
    if question_candidate:
        # set both question (public URL used as question text) and image_url
        path = question_candidate['name']
        public = PUBLIC_OBJECT_URL(bucket, path)
        payload['question'] = public
        payload['image_url'] = public
    # detect options
    # detect options by pattern or by suffix letter A..E in filename
    for key, patterns in OPT_KEYS:
        for it in items:
            nm = it['name'].lower()
            # direct pattern match
            if any(p in nm for p in patterns):
                path = it['name']
                payload[key] = PUBLIC_OBJECT_URL(bucket, path)
                break
            # fallback: filenames that end with -a.webp, _a.jpg, or have _A before extension
            import re
            m = re.search(r'[-_ ]([a-e])\.(webp|png|jpg|jpeg)$', nm)
            if m:
                letter = m.group(1)
                target_key = f"opt_{letter}"
                if target_key == key:
                    payload[key] = PUBLIC_OBJECT_URL(bucket, it['name'])
                    break
    # detect right-answer file (filenames containing 'right' or 'answer')
    for it in items:
        nm = it['name'].lower()
        if 'right' in nm or 'correct' in nm or 'answer' in nm:
            # try to extract letter (a-e) from filename e.g. LR-Right-A.webp or LR-right-opt-a
            import re
            m = re.search(r'([a-e])(?=\.(webp|png|jpg|jpeg)$)', nm)
            if not m:
                m = re.search(r'[-_ ]([a-e])[-_\.]', nm)
            if m:
                payload['answer'] = m.group(1).upper()
            else:
                payload['answer'] = PUBLIC_OBJECT_URL(bucket, it['name'])
            break
    return payload


def import_bucket(bucket: str, category: str, backend_url: str, dry_run: bool = False, verbose: bool = False, group_filter: str = None):
    print(f"Listing objects in bucket: {bucket}")
    objs = list_objects(bucket)
    print(f"Found {len(objs)} objects")
    if verbose:
        print('Object list from Supabase:')
        for o in objs[:50]:
            # print a representative key/name for each object
            name = o.get('name') or o.get('path') or o.get('Key') or str(o)
            print('  -', name)
    groups = group_by_folder(objs)
    print(f"Detected {len(groups)} groups (folders).")

    created = 0
    errors = []
    for group_name, items in groups.items():
        # if a single-group filter is provided, skip other groups
        if group_filter and group_name != group_filter:
            continue
        if group_name == '__root__':
            # skip root-level files unless user wants them
            continue
        # If the storage API returned folder placeholders (no files), fetch files under the folder prefix
        # Detect folder placeholder: item name equals the folder name (no slash) or items have no file extensions
        need_fetch_children = False
        if items:
            # if the only item(s) are the folder name itself
            only_folder_names = all((not it['name'].count('/')) for it in items)
            # or if none of the items look like files (no image extensions)
            none_look_like_files = all(not any(it['name'].lower().endswith(ext) for ext in ('.webp','.png','.jpg','.jpeg')) for it in items)
            if only_folder_names or none_look_like_files:
                need_fetch_children = True
        if need_fetch_children:
            if verbose:
                print(f"Fetching children for folder {group_name}/")
            try:
                child_objs = list_objects(bucket, prefix=f"{group_name}/")
                # child_objs is a list of objects; convert to same item format
                # normalize returned child object names — some Supabase responses return only the basename
                normalized = []
                for o in child_objs:
                    name = o.get('name') or o.get('path') or o.get('Key') or ''
                    if name and not name.startswith(f"{group_name}/"):
                        name = f"{group_name}/{name}"
                    normalized.append({'name': name, 'meta': o})
                    # replace group's items in the groups dict so downstream sees updated items
                    groups[group_name] = normalized
                    # update local items reference so downstream processing uses the fetched children
                    items = normalized
            except Exception as e:
                if verbose:
                    print(f"Failed to fetch children for {group_name}: {e}")
        if verbose:
            print(f"Processing group: {group_name}")
            for it in items:
                print('   item:', it['name'])
        assets = detect_assets(items, bucket)
        if not assets:
            print(f"Skipping group {group_name}: no recognizable assets")
            print('  group items:')
            for it in items:
                print('   -', it['name'])
            continue
        # build payload - include question text empty if image-based
        # compute question_id from folder name: prefix letters + zero-padded number
        import re
        m_pref = re.match(r'([A-Za-z]+)', group_name)
        prefix = m_pref.group(1).upper() if m_pref else group_name[:2].upper()
        m_num = re.search(r'(\d+)(?!.*\d)', group_name)
        num = int(m_num.group(1)) if m_num else 1
        question_id = f"{prefix}{str(num).zfill(2)}"

        payload = {
            'question_id': question_id,
            'question': assets.get('question', ''),
            'long_text': None,
            'opt_a': assets.get('opt_a'),
            'opt_b': assets.get('opt_b'),
            'opt_c': assets.get('opt_c'),
            'opt_d': assets.get('opt_d'),
            'opt_e': assets.get('opt_e'),
            'image_url': assets.get('image_url'),
            'answer': assets.get('answer'),
            # created_by left blank; admin can set later
            'created_by': 'import-script',
        }
        # remove None values
        payload = {k: v for k, v in payload.items() if v is not None}
        # show payload when verbose or dry-run
        if verbose or dry_run:
            print(f"Group {group_name} payload: {payload}")

        if dry_run:
            # count as not actually created but report
            print(f"Dry-run: would create question for group {group_name}")
            continue

        try:
            # call backend create_question endpoint
            url = f"{backend_url.rstrip('/')}/questions?category={quote_plus(category)}"
            print(f"Creating question for group {group_name} -> POST {url} payload keys={list(payload.keys())}")
            resp = requests.post(url, json=payload, timeout=20)
            if resp.status_code in (200, 201):
                print(f"Created: {group_name} -> {resp.status_code}")
                created += 1
            else:
                txt = resp.text if hasattr(resp, 'text') else '<no body>'
                print(f"Failed to create {group_name}: {resp.status_code} {txt}")
                errors.append({'group': group_name, 'status': resp.status_code, 'body': txt})
        except Exception as e:
            print(f"Error creating {group_name}: {e}")
            errors.append({'group': group_name, 'error': str(e)})

    return {'created': created, 'errors': errors}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Import images from Supabase Storage into Table_Questions via backend')
    parser.add_argument('--bucket', '-b', required=True, help='Supabase bucket name (e.g., msa-images)')
    parser.add_argument('--category', '-c', required=True, help='Human-friendly category name (e.g., "logical reasoning")')
    parser.add_argument('--backend', default='http://127.0.0.1:8000', help='Backend base URL')
    parser.add_argument('--dry-run', action='store_true', help='Do not POST to backend; just show what would be created')
    parser.add_argument('--verbose', action='store_true', help='Print verbose debug output')
    parser.add_argument('--group', '-g', help='Only process this group/folder name (e.g., LR-Test-1)')

    args = parser.parse_args()

    result = import_bucket(args.bucket, args.category, args.backend, dry_run=args.dry_run, verbose=args.verbose, group_filter=args.group)
    print('Import result:', result)
