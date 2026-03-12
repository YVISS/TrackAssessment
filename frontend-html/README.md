Verbal Ability frontend (frontend-html)

This is a tiny static frontend that fetches and displays questions from the Supabase table named "Verbal Ability".

Setup

1. Open `index.html` and replace the placeholders at the top with your Supabase project values:

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

2. Serve the file or open it in a browser. For CORS and correct headers, ensure your Supabase table is readable by anon (public) or configure Row Level Security/non-public access appropriately.

Local quick start (PowerShell)

```powershell
# from frontend-html folder
python -m http.server 5173
# then open http://localhost:5173 in your browser
```

Notes

- The table name contains a space; the frontend encodes it as `"Verbal Ability"` for the REST path.
- The script fetches columns: `id,question_id,question,A,B,C,D,answer,created_at,created_by` and orders by `question_id`.
- If you need server-side access to a non-public table, implement a small backend API that proxies requests using a service role key (keep secrets on server only).