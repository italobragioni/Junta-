-- Store the account email on each purchase intent so the Cakto webhook can
-- bind a payment to the right account by matching the customer email to a
-- pending intent (when the provider does not echo our opaque reference).
alter table public.purchase_intents
  add column if not exists email text;
