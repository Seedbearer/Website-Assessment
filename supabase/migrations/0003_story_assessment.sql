-- Story-based assessment redesign. Old columns (q1_open, q2_answer, q3_answers, q4_answer,
-- q5_answer, q6_open, q12_open) are left in place, untouched, for historical submissions — the
-- new story flow no longer writes to them. q7_relational, q8_relational_need, q9_internal,
-- q10_longing, and q11_season are unchanged and still used (soil/season questions kept as-is,
-- appended after the narrative).

alter table submissions
  add column wound text,                    -- Winter: wound-word, one of seven fixed strings
  add column other_words text,               -- Winter: free text, other words on the wall
  add column wound_cost text,                -- Winter: free text, "when has that cost you the most"
  add column stand_virtue text,              -- Winter close: Courage | Clarity
  add column reach_virtue text,              -- Thaw: Joy | Faithfulness
  add column instinct_type text,             -- Spring: primary Seed Type signal
  add column instinct_text text,             -- Spring: matched instinct phrase, for display
  add column garden_virtue text,             -- Spring close: Wonder | Wisdom
  add column walk_virtue text,               -- Summer: Adventure | Beauty
  add column closing_text text;              -- Close: free text, "what do you want to carry..."
