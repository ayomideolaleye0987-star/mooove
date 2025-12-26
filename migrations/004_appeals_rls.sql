-- Enable RLS for appeals and add policies
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;

-- Allow a wallet to insert an appeal only when the JWT uid matches the appellant
CREATE POLICY appeals_insert ON appeals FOR INSERT WITH CHECK (auth.uid()::text = appellant);

-- Allow public selects on appeals
CREATE POLICY appeals_select ON appeals FOR SELECT USING (true);

-- Optionally, only allow status updates by a privileged role (not implemented here - use service role or functions)
-- CREATE POLICY appeals_update_status ON appeals FOR UPDATE USING (auth.role() = 'service_role') WITH CHECK (true);
