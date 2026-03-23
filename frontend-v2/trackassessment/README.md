This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### 1. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Key variables:
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL (default: `http://127.0.0.1:8000`) |

### 2. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing the MSA → Backend Compute Flow

After completing an MSA assessment, the frontend automatically calls `POST /compute-from-supabase` on the backend to score the submission and upsert results into `student_submission`.

To verify end-to-end:

1. **Start the backend** (from `backend/`):
   ```bash
   uvicorn main:app --reload
   ```
2. **Start the frontend** (from `frontend-v2/trackassessment/`):
   ```bash
   npm run dev
   ```
3. **Complete the MSA flow** in the browser (answer all questions in each category and submit the final one).
4. **Verify** that:
   - The browser Network tab shows a `POST http://127.0.0.1:8000/compute-from-supabase` request with status `200`.
   - A row exists in the `student_submission` Supabase table for the current authenticated user.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

> **Production note:** Set `NEXT_PUBLIC_BACKEND_URL` to your production backend URL. For local development you can use `http://127.0.0.1:8000` and set `ALLOWED_ORIGINS` on the backend to include `http://localhost:3000` (or `http://127.0.0.1:3000`). For production add your deployed frontend origins.

