# The Ban Appeal Judge (Tool #4)

A viral tool where admins paste user ban appeals, and AI "Judges" them for sincerity/lies.

## Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Backend:** Next.js API Routes + Supabase
- **AI:** Google Gemini 2.0 Flash

## Getting Started

1.  **Environment Setup**
    Create a `.env.local` file in the root directory:

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_gemini_api_key
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Open Browser**
    Navigate to `http://localhost:3010` (or `3000` if not configured otherwise).

## Database Schema (Supabase)

Run this SQL in your Supabase SQL Editor:

```sql
create table judgments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ban_reason text,
  appeal_text text,
  verdict text,
  bs_score integer,
  detected_lie text,
  full_response jsonb
);

-- Enable RLS
alter table judgments enable row level security;

-- Allow public insert (since this is a public tool)
create policy "Enable insert for everyone" on judgments for insert with check (true);
```
