-- Family Triage Assessment — a separate, lighter-weight entry point from the Seed Assessment for
-- families in acute difficulty ("Door 1" vs the Seed Assessment's "Door 2"). Deliberately a
-- separate table rather than new columns on `submissions`: that table's shape is specific to the
-- Seed Assessment's story/soil model and doesn't map onto triage's own question set.
create table triage_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  first_name text not null,
  email text not null,

  -- Q1 is the primary routing question — its answer determines the category below.
  q1_primary text not null,
  category text not null,              -- one of the seven triage categories (see triage-data.ts)

  q2_duration text,
  q3_who_affected text[],              -- multi-select
  q4_stress_response text,
  q5_better_looks_like text,
  q6_wellbeing text,

  -- Derived server-side at submit time (see /api/triage/submit), not trusted from the client.
  priority_flag boolean default false,      -- Q6 = "not okay" in any category
  clinical_referral_flag boolean default false, -- Behaviour or Transition category + Q6 = "not okay"
  resource_sent text,                  -- which matched-response email was sent

  -- Admin tracking — mirrors `submissions`, for whenever a triage admin view gets built.
  responded boolean default false,
  response_date timestamp with time zone
);

alter table triage_submissions enable row level security;

-- Only anon-writable path on this table: the public triage form inserting its own submission.
create policy "anon can insert triage_submissions"
  on triage_submissions for insert
  to anon
  with check (true);
