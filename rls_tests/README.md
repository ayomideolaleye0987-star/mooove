RLS test instructions

These are manual test steps you can run against a test Supabase DB to validate RLS policies and constraints.

1) Prepare a test database and set DATABASE_URL env var.
2) Run migrations: `npm run migrate`
3) As a 'admin' (DB superuser) try to insert a public_messages row as different wallets and verify the `can_post_public_message` function prevents >1 per 24h per wallet.
4) To test wallet_links insertion, either use Supabase Auth to log in and then insert into the wallet_links table via the authenticated session. The policy allows only the authenticated user id to insert their mapping.

Automated tests can be implemented using a service account token and calling PostgREST with custom JWTs that simulate different auth.uid() claims. See Supabase docs for constructing JWT for testing.
