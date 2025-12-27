-- Table to store nonces for SIWE sign-in flow
CREATE TABLE IF NOT EXISTS siwe_nonces (
  nonce text PRIMARY KEY,
  wallet text,
  used boolean DEFAULT false,
  expires_at timestamptz DEFAULT (now() + interval '5 minutes'),
  created_at timestamptz DEFAULT now()
);

-- Index to quickly find valid nonces
CREATE INDEX IF NOT EXISTS idx_siwe_nonces_expires ON siwe_nonces (expires_at);
