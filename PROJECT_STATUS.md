# Seedbearer Family — Project Status (handoff notes)

Read this first in any new session. It's not a spec — `Seedbearer_Claude_Code_Spec_v2.md` (parent
folder) is the original design doc, but real-world decisions have moved past it in places. This
file is the actual current state.

## Live site
- Production: https://seedbearerfamily.com (Netlify project `seedbearer`)
- Preview: https://seedbearer.netlify.app
- Repo: https://github.com/Seedbearer/Website-Assessment, branch `main`
- All credentials live in `.env.local` (gitignored, already on disk in this project folder —
  a new session can read it directly, no need to re-ask the user for keys already there)

## What's built — all 5 phases complete and live
1. **Website** — Next.js 14 App Router, Tailwind, brand design system in `tailwind.config.ts`
2. **Seed Assessment** — `/assessment/quiz`, scoring engine (`src/lib/scoring.ts`), Supabase
   storage, Cloudflare Turnstile, Resend completion-notification email. **Redesigned as a
   story-based narrative** (see "Story assessment redesign" below) — this replaced the original
   12-question quiz outright.
3. **Coach Dashboard + Blog** — `/admin/*` (magic-link auth, single admin email), TinaCMS blog
   at `/blog` with visual editor at `/tina-admin`
4. **Family Dashboard** — `/assessment/family` (create), `/assessment/join/[code]`, `/dashboard/family`
5. **Personal Member Dashboard** — `/dashboard`, `/dashboard/content/[seedType]`

## Story assessment redesign (replaced the original 12-question quiz)
The assessment is now a four-scene narrative (Winter → Thaw → Spring → Summer: a well, a wound-word
carved in its wall, an instinct that reveals Seed Type, a distant garden, choosing one of two
virtues each season) instead of a questionnaire. Full replacement, not a parallel mode — this was
an explicit user decision, not something to reconsider without asking again.
- **Data/content**: `src/lib/story-assessment-data.ts` (wound/instinct/virtue options + narrative
  copy), `src/components/assessment/Quiz.tsx` (the whole flow)
- **Scoring** (`src/lib/scoring.ts`, fully rewritten): two forced-choice signals now, not five —
  `instinctType` is primary, `wound` is the refiner. They map to Seed Type via
  `WOUND_TO_TYPE`/`INSTINCT_OPTIONS` in `story-assessment-data.ts`. Disagreement between the two
  sets `flagForReview = true` but instinct still wins (doesn't silently pick one without flagging).
- **The old Q7-Q11 soil/season questions are kept, appended after the narrative** — explicit user
  decision, so the admin Soil Snapshot, family dashboard Soil Synthesis/Season Map, and the results
  page's soil reflection keep working unchanged. Q9 (numb/heavy) is also still what drives
  `priorityResponse` — this solved the spec's flagged "no Q9 equivalent in the new flow" gap
  without inventing a new field, since Q9 was reinstated anyway.
- **New: an 8-virtue axis** (Courage/Clarity, Joy/Faithfulness, Wonder/Wisdom, Adventure/Beauty —
  one pair per season) is additive, not scored against Seed Type. Shown on the results page and
  persisted on the personal dashboard (`/dashboard`) as "yours to keep."
- **Migration `0003_story_assessment.sql`** adds the new columns (`wound`, `other_words`,
  `wound_cost`, `stand_virtue`, `reach_virtue`, `instinct_type`, `instinct_text`, `garden_virtue`,
  `walk_virtue`, `closing_text`). Old columns (`q1_open`, `q2_answer` through `q6_open`, `q12_open`)
  are untouched, left nullable, for historical submissions only — nothing new writes to them.
- **Admin submission detail view branches on `submission.wound` being set**: new story-flow
  submissions show the new breakdown (wound/instinct/virtues), old submissions still show the
  original Q1-Q6 breakdown. Both share the same Q7-Q11 soil snapshot section.
- **Follow-up revision (commit `e55aecb`), from live client review of the flow**:
  - Wound-word (Winter) is now **multi-select, up to two** — not single-choice. `wound` is
    `text[]` in the DB (migration `0004_wound_multiselect.sql` converted existing single values to
    single-element arrays). Scoring: confirmed if the instinct choice matches *any* selected
    wound's mapped type (`WOUND_TO_TYPE`).
  - The second Winter scene's "wound-echo" line now reflects all selected wounds *and* the
    "other words" free text, not just one word.
  - Several narrative passages were reworded after the client read through the live flow (post
    wound-cost reflection in Winter, all of Thaw, the Spring instinct scene, the Spring garden
    scene's closing paragraph, and Summer) — current wording lives in
    `story-assessment-data.ts`'s `STORY_SCENES`; treat that file as the source of truth, not this
    doc, if they diverge later.
  - Added an **explicit transition slide** between the story and the reinstated Q7-Q11 questions
    ("We are moving to the portion of the assessment where we try to understand your current
    situation") — `TRANSITION_MESSAGE` in `story-assessment-data.ts`.
  - **As of the last session this was pushed but not yet confirmed live** — verify
    `https://seedbearerfamily.com/assessment/quiz` actually shows the reworded copy and that
    multi-select wound picking works before assuming it's deployed.

## Key deviations from the original spec (read before assuming the spec is current)
- **Kit (ConvertKit) was never built.** Email is Resend (internal notification only) + Google
  Workspace (manual replies). Not GHL either, despite an earlier reference doc mentioning it.
- **TinaCMS editor lives at `/tina-admin`**, not `/admin/tina` — Tina's default `/admin` output
  path collides with the coach dashboard's own `/admin/*` routes.
- **Family code format**: 4 letters + 2 digits (not 3+2 as one early doc draft said).
- **RLS is minimal by design.** Anon can only INSERT into `submissions`. Everything else (admin
  reads/writes, family dashboard reads, personal dashboard reads) goes through server-side Route
  Handlers or Server Components using the **service-role key**, manually selecting only the
  public-safe columns in code — not through RLS policies. If asked to add a new authenticated
  read path, follow this same pattern rather than writing a new RLS policy.
- **Personal/family member auth is separate from admin auth.** `/login` (magic link, any
  submission email) vs `/admin/login` (magic link, restricted to `ADMIN_EMAIL`). Both go through
  `/auth/callback`. Both have **defense-in-depth**: the `middleware.ts` matcher protects
  `/admin/:path*`, `/api/admin/:path*`, `/dashboard/:path*`, but every protected layout
  (`src/app/admin/(dashboard)/layout.tsx`, `src/app/dashboard/layout.tsx`) *also* checks the
  session directly server-side. Keep both — see "Netlify middleware gotcha" below for why.

## Operational gotchas discovered the hard way — don't rediscover these
- **Netlify's Edge Middleware didn't reliably run at one point** — the admin dashboard was
  briefly served to unauthenticated visitors despite middleware being correctly written and
  tested locally. Root cause was never fully confirmed. The fix in place is the defense-in-depth
  layout checks above — **any new protected route needs both** the middleware matcher entry *and*
  a direct session check in its layout/page, don't rely on middleware alone.
- **`NEXT_PUBLIC_*` env vars are baked in at build time.** Adding/changing one in Netlify's
  dashboard requires **Trigger deploy → Clear cache and deploy site**, not just a normal redeploy,
  or the old (often empty) value stays baked into the bundle.
- **Fire-and-forget async work does not reliably complete in Netlify's serverless functions.**
  The Resend notification email silently failed in production (worked fine in local `next start`)
  because it wasn't awaited before the function returned and Netlify froze/killed the execution
  context. Fix applied: `await notifyAssessmentCompleted(...)` in the submit route. Apply the same
  pattern to any future background work in an API route — await it, don't fire-and-forget.
- **`tinacms build` needs `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` to even run locally** —
  `npm run build` alone won't pick up `.env.local` when invoked directly via a shell (only Next's
  own dev/build process auto-loads it); pass them explicitly as env vars for local testing:
  `NEXT_PUBLIC_TINA_CLIENT_ID=... TINA_TOKEN=... npm run build`.
- **Netlify OOM on build**: `tinacms build && next build` together can exceed the default Node
  heap. Fixed via `netlify.toml` setting `NODE_OPTIONS=--max-old-space-size=4096`. If build memory
  errors return, that's the first thing to check/raise further.
- **Tina Cloud branch indexing requires `tina/tina-lock.json` to be committed and pushed** (it's
  generated by running `tinacms dev` locally at least once). Without it, Tina Cloud shows
  "Branch is not on TinaCloud" indefinitely no matter how many times you retry the build.
- **Supabase free-tier projects pause after inactivity.** If DB calls suddenly fail with DNS
  errors (`ENOTFOUND <project-ref>.supabase.co`), that's the project paused, not a real outage —
  restore it from the Supabase dashboard (user action, not something fixable in code).
- **Local sandbox curl needs `--ssl-no-revoke`** (schannel/Windows cert-revocation-check quirk in
  this environment) and sometimes shows a Norton-intercepted certificate — that's a local-machine
  artifact, not a real production SSL problem. Don't chase it as a bug.
- **Node.js processes on Windows via git-bash**: `pkill -f "next dev"` frequently fails to kill
  the actual process. Use PowerShell's `Get-Process node | Stop-Process -Force` instead when a
  dev server needs restarting.

## Still outstanding / pending
- **`/reading`** — placeholder, waiting on `Seedbearer_Carrd_Website_Guide.docx` (Section 4 book
  list) — file not yet supplied.
- **`/honour-framework`** — placeholder, waiting on `Seedbearer_Honour_Framework.docx` — file not
  yet supplied.
- **Instagram link** — still a placeholder (`https://instagram.com`) in the footer, waiting on
  the real handle.
- **About page photo** — placeholder, waiting on the client's actual photo.
- **Footer disclaimer wording** — currently a reasonable default; no reference doc ever specified
  exact wording, worth confirming with the user if it matters.
- **Seed-type dashboard content** (`src/lib/seed-type-content.ts`) — placeholder practice/reflection
  text per type, written by Claude Code as structural filler. Real copy from the coach should
  replace it eventually; no code changes needed to swap it in.
- **Deploy verification pending** — commit `e55aecb` (multi-select wound + narrative rewording +
  transition slide, see above) was pushed at the end of the last session but not yet confirmed
  live. First thing to check in a new session: does
  `https://seedbearerfamily.com/assessment/quiz` show the reworded copy? If the deploy failed,
  check Netlify's deploy log first (recent history: OOM during `tinacms build`, handled via
  `netlify.toml`'s `NODE_OPTIONS`, and a Netlify usage-credits exhaustion that needed the user to
  add credits/upgrade — both already resolved once, but could recur).
- Supabase project was found paused once already this project (free-tier auto-pause after
  inactivity) and the user restored it — if DB calls fail with `ENOTFOUND <project-ref>.supabase.co`
  again, that's the same thing recurring, not a new bug (see gotcha above).

## Where to find things
- Spec/reference docs: parent folder (`Marketing/Website/`), several `.docx` files
- Full original spec: `Seedbearer_Claude_Code_Spec_v2.md` (same folder as this file's parent) —
  describes the original 12-question assessment; superseded by the story assessment above for
  Phase 2, still accurate for everything else
- Story assessment handoff spec: was supplied as a one-off doc, not stored in the repo — the
  actual current implementation is `story-assessment-data.ts` + `Quiz.tsx`, treat those as truth
- Migrations: `supabase/migrations/*.sql` — run manually in Supabase's SQL Editor, not via CLI (no
  `supabase` CLI link was ever set up for this project). All four (`0001`-`0004`) have been run
  against the live database as of the last session.
