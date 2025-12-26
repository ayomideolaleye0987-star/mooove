-- RLS policies and constraints for AvaxChronicles

-- Ensure pgcrypto is available for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enforce unique votes per (case_id, voter)
CREATE UNIQUE INDEX IF NOT EXISTS ux_votes_case_voter ON votes (case_id, voter);

-- Function: allow posting once per 24 hours per wallet
CREATE OR REPLACE FUNCTION can_post_public_message(p_wallet text) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT (COUNT(*) = 0) FROM public_messages WHERE wallet = p_wallet AND created_at >= now() - interval '24 hours';
$$;

-- --------------------------
-- public_messages policies
-- --------------------------
ALTER TABLE public_messages ENABLE ROW LEVEL SECURITY;
-- Allow insert only when the `can_post_public_message` function returns true (WITH CHECK required for INSERT)
CREATE POLICY post_once_per_day ON public_messages FOR INSERT WITH CHECK (can_post_public_message(wallet));
-- Public selects allowed (USING expression)
CREATE POLICY public_messages_select ON public_messages FOR SELECT USING (true);

-- --------------------------
-- profiles policies
-- --------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Only the wallet owner may SELECT/UPDATE/DELETE their row
CREATE POLICY profiles_owner_access ON profiles FOR SELECT USING (auth.uid()::text = wallet);
CREATE POLICY profiles_owner_update ON profiles FOR UPDATE USING (auth.uid()::text = wallet) WITH CHECK (auth.uid()::text = wallet);
CREATE POLICY profiles_owner_delete ON profiles FOR DELETE USING (auth.uid()::text = wallet);
-- INSERT: ensure created profile's wallet matches the JWT uid
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (auth.uid()::text = wallet);

-- --------------------------
-- cases policies
-- --------------------------
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
-- INSERT: allow when JWT uid equals submitted_by OR when anonymous=true (only WITH CHECK allowed for INSERT)
CREATE POLICY cases_insert_policy ON cases FOR INSERT WITH CHECK (auth.uid()::text = submitted_by OR anonymous = true);
-- SELECT publicly
CREATE POLICY cases_select_public ON cases FOR SELECT USING (true);
-- UPDATE: only owner may update their case
CREATE POLICY cases_update_owner ON cases FOR UPDATE USING (auth.uid()::text = submitted_by) WITH CHECK (auth.uid()::text = submitted_by);
-- DELETE: only owner may delete
CREATE POLICY cases_delete_owner ON cases FOR DELETE USING (auth.uid()::text = submitted_by);

-- --------------------------
-- votes policies
-- --------------------------
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
-- INSERT: voter must match JWT uid (WITH CHECK for insert)
CREATE POLICY votes_insert ON votes FOR INSERT WITH CHECK (auth.uid()::text = voter);
-- SELECT publicly
CREATE POLICY votes_select ON votes FOR SELECT USING (true);

-- --------------------------
-- case_messages policies
-- --------------------------
ALTER TABLE case_messages ENABLE ROW LEVEL SECURITY;
-- INSERT: wallet must match JWT uid
CREATE POLICY case_messages_insert ON case_messages FOR INSERT WITH CHECK (auth.uid()::text = wallet);
-- SELECT publicly
CREATE POLICY case_messages_select ON case_messages FOR SELECT USING (true);

-- --------------------------
-- public_cases view
-- --------------------------
CREATE OR REPLACE VIEW public_cases AS
SELECT id, title, accused, description, evidence, CASE WHEN anonymous THEN NULL ELSE submitted_by END AS submitted_by, anonymous, timestamp, votes, status, appeal_of
FROM cases;

-- Notes:
-- * Use JWTs where auth.uid() is the wallet address (e.g., mint `sub` = wallet from your SIWE verification).
-- * Keep SUPABASE_SERVICE_KEY as a server-side secret; never expose it to clients.
-- * For admin/service operations, call Postgres using a server-side function authenticated with the service key.
