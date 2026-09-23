-- Supabase is removing default Data API grants for new/reset tables on 30 Oct 2026 — any table
-- without an explicit GRANT becomes unreachable via the Data API (PostgREST), independent of RLS
-- policies (a grant is checked before RLS is ever evaluated). These 7 tables predate that change
-- and have only worked because Supabase auto-applied default grants at creation time — grants that
-- won't be replayed on a local `supabase db reset`, a new preview branch, or a fresh project after
-- that date. This migration makes the grants explicit so those environments keep working.
--
-- Grants only widen WHO CAN ATTEMPT an operation — actual row access is still fully governed by
-- each table's RLS policies (see 0001_init.sql, 0005_triage_assessment.sql), so this changes no
-- production behavior today. Any future migration that creates a new table needs its own grants
-- added here too, in the same migration — see the Supabase notice this was written from.

-- submissions: anon inserts its own row (existing policy); authenticated reads its own row by email.
grant insert on public.submissions to anon;
grant select on public.submissions to authenticated;
grant select, insert, update, delete on public.submissions to service_role;

-- personal_values: authenticated reads its own rows (via the linked submission's email).
grant select on public.personal_values to authenticated;
grant select, insert, update, delete on public.personal_values to service_role;

-- triage_submissions: anon inserts its own row (existing policy).
grant insert on public.triage_submissions to anon;
grant select, insert, update, delete on public.triage_submissions to service_role;

-- families, family_members, coaching_notes, knowledge_base: no anon/authenticated RLS policies —
-- accessed only server-side via the service role key (see supabase-admin.ts), including from the
-- member-facing dashboard pages, which gate access at the app layer rather than via RLS.
grant select, insert, update, delete on public.families to service_role;
grant select, insert, update, delete on public.family_members to service_role;
grant select, insert, update, delete on public.coaching_notes to service_role;
grant select, insert, update, delete on public.knowledge_base to service_role;
