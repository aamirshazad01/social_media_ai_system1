-- ============================================
-- OAuth and Credential Management Tables
-- Run this in your Supabase SQL Editor
-- ============================================

-- OAuth States (CSRF protection and PKCE)
CREATE TABLE IF NOT EXISTS oauth_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    state TEXT NOT NULL UNIQUE,
    code_challenge TEXT,
    code_challenge_method TEXT,
    ip_address TEXT,
    user_agent TEXT,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs (for OAuth and credential operations)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    platform TEXT,
    action TEXT NOT NULL,
    status TEXT,
    error_code TEXT,
    error_message TEXT,
    ip_address TEXT,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace Encryption Keys (for credential encryption)
CREATE TABLE IF NOT EXISTS workspace_encryption_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
    key_salt TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Additional fields for social_accounts (if not already present)
ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS last_refreshed_at TIMESTAMPTZ;
ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS refresh_token_encrypted TEXT;
ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS page_id TEXT;
ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS page_name TEXT;
ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS refresh_error_count INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_oauth_states_workspace ON oauth_states(workspace_id);
CREATE INDEX IF NOT EXISTS idx_oauth_states_state ON oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires ON oauth_states(expires_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace ON audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- Enable RLS on new tables
ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_encryption_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view audit logs in their workspace" ON audit_logs;
DROP POLICY IF EXISTS "Users can view their workspace encryption keys" ON workspace_encryption_keys;
DROP POLICY IF EXISTS "Admins can manage workspace encryption keys" ON workspace_encryption_keys;

-- RLS Policy: Users can view audit logs in their workspace
CREATE POLICY "Users can view audit logs in their workspace"
    ON audit_logs FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

-- RLS Policy: Users can view their workspace encryption keys
CREATE POLICY "Users can view their workspace encryption keys"
    ON workspace_encryption_keys FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

-- RLS Policy: Admins can manage workspace encryption keys
CREATE POLICY "Admins can manage workspace encryption keys"
    ON workspace_encryption_keys FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Update trigger for workspace_encryption_keys
DROP TRIGGER IF EXISTS update_workspace_encryption_keys_updated_at ON workspace_encryption_keys;
CREATE TRIGGER update_workspace_encryption_keys_updated_at BEFORE UPDATE ON workspace_encryption_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETE!
-- ============================================
-- All OAuth and credential management tables have been created.
-- Your platform connections should now work properly!
