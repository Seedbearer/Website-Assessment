-- Needed so the admin dashboard can upsert all five value slots for a submission in one call
-- (ON CONFLICT (submission_id, value_order)) instead of five separate inserts/updates.
alter table personal_values
  add constraint personal_values_submission_order_unique unique (submission_id, value_order);
