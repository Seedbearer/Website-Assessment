-- Seedbearer Family — initial schema. See Section 03 of the Claude Code spec.

create table submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  first_name text not null,
  email text not null,
  family_code text,                    -- links to families table

  -- Open text answers (read manually)
  q1_open text,                        -- When most fully yourself
  q6_open text,                        -- The longing (most important)
  q12_open text,                       -- Why they are here

  -- Scored answers
  q2_answer text,                      -- How you give (primary anchor)
  q3_answers text[],                   -- Energy source (multi-select, max 2)
  q4_answer text,                      -- The wound
  q5_answer text,                      -- Under pressure

  -- Soil answers (tags only, no score)
  q7_relational text,                  -- Relational soil condition
  q8_relational_need text,             -- What relational soil needs
  q9_internal text,                    -- Internal soil condition
  q10_longing text[],                  -- Internal longing (multi-select, max 2)
  q11_season text,                     -- Season (winter/thaw/spring/summer)

  -- Scoring results
  seed_type_algorithm text,            -- Algorithm result
  seed_type_coach text,                -- Your manual read (set in admin) — takes precedence everywhere it's set
  seed_score integer,                  -- Raw score total (reserved; not populated by the current scoring engine)
  flag_for_review boolean default false,
  priority_response boolean default false,  -- Q9 = Numb or Heavy, or a Q12 urgent-keyword match

  -- Admin tracking
  responded boolean default false,
  response_date timestamp with time zone,
  pipeline_stage text default 'assessment_complete',
  coach_notes text,

  -- Reserved for future Kit integration — not used until the email-automation phase
  kit_subscriber_id text
);

create table families (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  family_code text unique not null,    -- 6-char code e.g. SEED42
  family_name text,                    -- Optional display name
  created_by_email text,               -- First member who created the code
  coach_notes text,                    -- Your overall family notes
  pipeline_stage text default 'active'
);

create table family_members (
  id uuid default gen_random_uuid() primary key,
  family_code text references families(family_code),
  submission_id uuid references submissions(id),
  member_name text,
  member_role text,                    -- parent / youth / child
  added_at timestamp with time zone default now()
);

-- Five values per person with definitions — core coaching anchor alongside seed type data.
create table personal_values (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references submissions(id),
  family_code text,
  value_order integer check (value_order between 1 and 5),
  value_name text not null,
  value_definition text,               -- Their own words for what this means
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table coaching_notes (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references submissions(id),
  family_code text,
  note_type text,                      -- observation / pattern / session / followup
  content text not null,
  created_at timestamp with time zone default now()
);

-- Pattern library built from real submissions over time — improves assessment accuracy and coaching quality.
create table knowledge_base (
  id uuid default gen_random_uuid() primary key,
  submission_id uuid references submissions(id),
  algorithm_type text,
  coach_type text,
  overridden boolean default false,
  override_signal text,                -- Which open-text answer revealed true type
  wound_pattern text,
  soil_pattern text,
  insight text,                        -- What you noticed that the algorithm missed
  created_at timestamp with time zone default now()
);

-- Row Level Security — default-deny on every table, per Section 03 of the spec.
alter table submissions enable row level security;
alter table families enable row level security;
alter table family_members enable row level security;
alter table personal_values enable row level security;
alter table coaching_notes enable row level security;
alter table knowledge_base enable row level security;

-- Only anon-writable path in the whole schema: the public assessment form inserting its own submission.
create policy "anon can insert submissions"
  on submissions for insert
  to anon
  with check (true);

-- Authenticated users may read their own submission (email match) — used by the Phase 5 personal dashboard.
create policy "users can select own submission"
  on submissions for select
  to authenticated
  using (auth.email() = email);

-- Authenticated users may read their own personal_values row (via the linked submission's email).
create policy "users can select own personal_values"
  on personal_values for select
  to authenticated
  using (
    exists (
      select 1 from submissions
      where submissions.id = personal_values.submission_id
        and submissions.email = auth.email()
    )
  );

-- No anon or authenticated-user policies are defined on families, family_members, coaching_notes, or
-- knowledge_base beyond RLS enabling default-deny. The admin dashboard (Phase 3) and the Phase 4/5
-- family and personal dashboards read through server-side Route Handlers using the service role key,
-- which bypasses RLS — see supabase-admin.ts. Phase 4's family-scoped policy is added when that
-- phase's schema needs (a family_members.user_id link) are implemented.
