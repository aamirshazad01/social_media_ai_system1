-- ============================================
-- Migration: Improve Credentials & OAuth Security
-- Purpose: Add new tables and columns for secure OAuth and credential management
-- ============================================

BEGIN;

-- ============================================
-- Table: oauth_states
-- Purpose: CSRF protection + PKCE storage
-- ============================================
CREATE TABLE IF NOT EXISTS oauth_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'facebook', 'instagram')),
  state TEXT NOT NULL UNIQUE,
  code_challenge TEXT,
  code_challenge_method TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes'),
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_at TIMESTAMP,
  ip_address INET,
  user_agent TEXT,

  CONSTRAINT valid_state_length CHECK (char_length(state) >= 32)
);

CREATE INDEX IF NOT EXISTS idx_oauth_states_workspace_platform
  ON oauth_states(workspace_id, platform);
CREATE INDEX IF NOT EXISTS idx_oauth_states_state
  ON oauth_states(state);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at
  ON oauth_states(expires_at)
  WHERE used = FALSE;

ALTER TABLE oauth_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their workspace's oauth states" ON oauth_states;
CREATE POLICY "Users can only access their workspace's oauth states"
  ON oauth_states
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- ============================================
-- Table: credential_audit_log
-- Purpose: Compliance & debugging
-- ============================================
CREATE TABLE IF NOT EXISTS credential_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  error_code TEXT,
  ip_address INET,
  user_agent TEXT,
  request_path TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_audit_log_workspace_platform
  ON credential_audit_log(workspace_id, platform);
CREATE INDEX IF NOT EXISTS idx_audit_log_action
  ON credential_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at
  ON credential_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id
  ON credential_audit_log(user_id);

ALTER TABLE credential_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their workspace's audit logs" ON credential_audit_log;
CREATE POLICY "Users can view their workspace's audit logs"
  ON credential_audit_log
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

-- ============================================
-- Table: token_refresh_queue
-- Purpose: Background token refresh scheduling
-- ============================================
CREATE TABLE IF NOT EXISTS token_refresh_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  should_refresh_at TIMESTAMP NOT NULL,
  last_attempt_at TIMESTAMP,
  attempts_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  UNIQUE(workspace_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_refresh_queue_status
  ON token_refresh_queue(status);
CREATE INDEX IF NOT EXISTS idx_refresh_queue_should_refresh_at
  ON token_refresh_queue(should_refresh_at)
  WHERE status = 'pending';

-- ============================================
-- ENHANCED: social_accounts table
-- ============================================
ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;

ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS last_refreshed_at TIMESTAMP;

ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS refresh_token_encrypted TEXT;

ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS page_id TEXT;

ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS page_name TEXT;

ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS is_auto_refreshed BOOLEAN DEFAULT TRUE;

ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS refresh_error_count INTEGER DEFAULT 0;

ALTER TABLE social_accounts
ADD COLUMN IF NOT EXISTS last_error_message TEXT;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_social_accounts_expires_at
  ON social_accounts(expires_at)
  WHERE is_connected = TRUE;

CREATE INDEX IF NOT EXISTS idx_social_accounts_platform_expires
  ON social_accounts(platform, expires_at)
  WHERE is_connected = TRUE;

-- ============================================
-- Ensure RLS is enabled on social_accounts
-- ============================================
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their workspace's accounts" ON social_accounts;
CREATE POLICY "Users can only access their workspace's accounts"
  ON social_accounts
  FOR ALL
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id FROM users WHERE id = auth.uid()
    )
  );

COMMIT;
