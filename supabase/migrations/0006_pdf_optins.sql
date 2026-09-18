-- Lead-magnet email capture for downloadable PDFs (e.g. the "Conversation You Keep Avoiding" post).
-- Deliberately generic (a `slug` column, not a one-off table per PDF) so any future blog post can
-- reuse the same opt-in flow just by passing a different slug/title into <PdfOptinForm>.
create table pdf_optins (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  email text not null,
  slug text not null,          -- which lead magnet (matches the blog post slug it's embedded on)
  source_path text              -- page path the opt-in was submitted from, for attribution
);

alter table pdf_optins enable row level security;

-- Only anon-writable path on this table: the public opt-in form inserting its own submission.
create policy "anon can insert pdf_optins"
  on pdf_optins for insert
  to anon
  with check (true);
