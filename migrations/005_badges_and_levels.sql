-- Badges and Levels: tables, functions, triggers

-- badges table (seedable)
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  min_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- achievements (explicit grants for special actions)
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet text REFERENCES profiles(wallet),
  key text NOT NULL,
  name text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- seed a few starter badges (idempotent insert)
INSERT INTO badges (key, name, description, min_points)
SELECT 'newcomer','Newcomer','Joined and made first contribution',0
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE key='newcomer');

INSERT INTO badges (key, name, description, min_points)
SELECT 'investigator','Investigator','Earned 100 points',100
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE key='investigator');

INSERT INTO badges (key, name, description, min_points)
SELECT 'detective','Detective','Earned 500 points',500
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE key='detective');

INSERT INTO badges (key, name, description, min_points)
SELECT 'veteran','Veteran','Earned 1000 points',1000
WHERE NOT EXISTS (SELECT 1 FROM badges WHERE key='veteran');

-- Function to compute level from points (example: 1 level per 100 points)
CREATE OR REPLACE FUNCTION compute_level(p_points integer) RETURNS integer LANGUAGE sql STABLE AS $$
  SELECT COALESCE(FLOOR(p_points::numeric / 100)::integer, 0);
$$;

-- Function to refresh badges for a wallet (writes JSONB array of badge keys to profiles.badges)
CREATE OR REPLACE FUNCTION refresh_badges_for_wallet(p_wallet text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  user_points integer;
  eligible text[];
BEGIN
  SELECT points INTO user_points FROM profiles WHERE wallet = p_wallet;
  IF NOT FOUND THEN
    RAISE NOTICE 'refresh_badges_for_wallet: wallet % not found', p_wallet;
    RETURN;
  END IF;

  SELECT array_agg(key) INTO eligible FROM badges WHERE min_points <= COALESCE(user_points,0);
  IF eligible IS NULL THEN
    eligible := ARRAY[]::text[];
  END IF;

  UPDATE profiles SET badges = to_jsonb(coalesce(eligible, ARRAY[]::text[])) WHERE wallet = p_wallet;
END;
$$;

-- Trigger: when profile points update, refresh badges
CREATE OR REPLACE FUNCTION trg_refresh_badges_after_points_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.points IS DISTINCT FROM OLD.points THEN
    PERFORM refresh_badges_for_wallet(NEW.wallet);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS refresh_badges_trigger ON profiles;
CREATE TRIGGER refresh_badges_trigger AFTER UPDATE OF points ON profiles
FOR EACH ROW EXECUTE FUNCTION trg_refresh_badges_after_points_update();

-- Trigger: on profile insert, refresh badges (so new users get initial badges)
CREATE OR REPLACE FUNCTION trg_refresh_badges_after_insert() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM refresh_badges_for_wallet(NEW.wallet);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS refresh_badges_after_insert ON profiles;
CREATE TRIGGER refresh_badges_after_insert AFTER INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION trg_refresh_badges_after_insert();

-- View: profiles with computed level and progress
CREATE OR REPLACE VIEW profiles_with_levels AS
SELECT p.*, compute_level(p.points) AS level, (p.points % 100) AS progress_to_next_level
FROM profiles p;

-- Grants: allow public select on badges and profiles_with_levels
CREATE POLICY badges_select ON badges FOR SELECT USING (true);
CREATE POLICY achievements_select ON achievements FOR SELECT USING (true);
