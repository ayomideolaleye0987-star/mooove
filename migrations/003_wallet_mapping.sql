-- Wallet to Supabase user mapping and helper functions

-- wallet_links: map wallet address to a Supabase auth user id
CREATE TABLE IF NOT EXISTS wallet_links (
  wallet text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Allow the authenticated user to insert a mapping for themselves only
ALTER TABLE wallet_links ENABLE ROW LEVEL SECURITY;
-- INSERT: only allow the authenticated user (auth.uid()) to link their own user_id; cast auth.uid() to uuid
CREATE POLICY wallet_links_insert ON wallet_links FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY wallet_links_select ON wallet_links FOR SELECT USING (true);

-- Function stub to verify a signed message from wallet (SIWE-like)
-- NOTE: Real verification requires a server-side endpoint that receives a signature and message and verifies
-- using Ethereum libraries (ethers.js/siwe). This is a placeholder indicating where to implement it.

-- Convenience view to expose the linked wallet for a user
CREATE OR REPLACE VIEW user_wallets AS
SELECT u.id AS user_id, wl.wallet, wl.created_at
FROM auth.users u
LEFT JOIN wallet_links wl ON wl.user_id = u.id;
