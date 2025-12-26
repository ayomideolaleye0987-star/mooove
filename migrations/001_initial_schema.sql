-- Initial schema for AvaxChronicles

-- profiles table: one row per wallet address
CREATE TABLE IF NOT EXISTS profiles (
  wallet text PRIMARY KEY,
  username text,
  bio text,
  twitter text,
  emoji_avatar text,
  points integer DEFAULT 0,
  badges jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  accused text NOT NULL,
  description text NOT NULL,
  evidence jsonb DEFAULT '[]'::jsonb,-- array of {type: 'tx'|'tweet'|'other', value: url, meta: {...}}
  submitted_by text REFERENCES profiles(wallet),
  anonymous boolean DEFAULT false,
  timestamp timestamptz DEFAULT now(),
  votes integer DEFAULT 0,
  status text DEFAULT 'pending',
  appeal_of uuid,
  FOREIGN KEY (appeal_of) REFERENCES cases(id)
);

-- votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  voter text REFERENCES profiles(wallet),
  created_at timestamptz DEFAULT now()
);

-- activities / logs table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet text REFERENCES profiles(wallet),
  type text,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet text REFERENCES profiles(wallet),
  message text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- public messages (support / about board)
CREATE TABLE IF NOT EXISTS public_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet text REFERENCES profiles(wallet),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- appeals table
CREATE TABLE IF NOT EXISTS appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  appellant text REFERENCES profiles(wallet),
  reason text,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

-- case messages (public chat per case)
CREATE TABLE IF NOT EXISTS case_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES cases(id) ON DELETE CASCADE,
  wallet text REFERENCES profiles(wallet),
  message text,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_votes ON cases(votes DESC);
