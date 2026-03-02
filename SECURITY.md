# Security Policy

## Secrets and Environment Variables

**Never commit `.env` files or any file containing real credentials, API keys, or passwords.**

All secret values must be kept in local `.env` files that are listed in `.gitignore`.

### Setting up local environment

1. Copy the example template:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Fill in the real values in `backend/.env`.
3. Confirm the file is ignored before committing:
   ```bash
   git check-ignore -v backend/.env
   ```

### Reporting a vulnerability

If you discover exposed secrets or a security vulnerability, please open a private security advisory on GitHub or contact the repository maintainers directly.

---

## Purging Exposed Secrets from Git History

`backend/.env` was previously committed to this repository and must be removed from history.
The steps below must be performed **by a maintainer with write access** after this PR is merged.

> ⚠️ History rewrite changes all commit SHAs. All collaborators must re-clone after this is done.

### Option A — git-filter-repo (recommended)

```bash
# 1. Install git-filter-repo
pip install git-filter-repo        # or: brew install git-filter-repo

# 2. Clone a fresh copy (do NOT do this on a working clone you care about)
git clone --mirror https://github.com/YVISS/TrackAssessment.git TrackAssessment-mirror
cd TrackAssessment-mirror

# 3. Remove the file from all history
git filter-repo --path backend/.env --invert-paths

# 4. Force-push all refs
git push --force --all
git push --force --tags
```

### Option B — BFG Repo-Cleaner

```bash
# 1. Download BFG jar from https://rtyley.github.io/bfg-repo-cleaner/

# 2. Clone a fresh mirror
git clone --mirror https://github.com/YVISS/TrackAssessment.git

# 3. Run BFG to delete the file from history
java -jar bfg.jar --delete-files .env TrackAssessment.git

# 4. Clean and force-push
cd TrackAssessment.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

### After the history rewrite — instructions for collaborators

Every collaborator must discard their local clone because local branches still point to the old (pre-rewrite) commits:

```bash
# Option 1: re-clone (simplest)
cd ..
rm -rf TrackAssessment
git clone https://github.com/YVISS/TrackAssessment.git

# Option 2: reset in place
git fetch origin
git reset --hard origin/main   # replace 'main' with your branch name
git gc --prune=now
```

### Rotating the exposed credentials

Even after the history rewrite, the credentials that were exposed should be considered compromised. Please:

1. **Supabase Service Role Key** — go to your Supabase project → Settings → API → regenerate the `service_role` key.
2. Update your production deployment environment variables with the new key.
