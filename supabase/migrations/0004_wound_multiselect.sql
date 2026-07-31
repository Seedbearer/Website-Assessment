-- Wound word (Winter scene) becomes multi-select (up to two). Convert existing single-value rows
-- into single-element arrays rather than losing the data.
alter table submissions
  alter column wound type text[] using (case when wound is null then null else array[wound] end);
