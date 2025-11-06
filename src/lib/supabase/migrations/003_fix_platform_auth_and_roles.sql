-- ============================================
-- Migration: Fix Platform Auth and User Roles
-- Purpose: Correct database schema related to platform authentication,
-- user roles, and post statuses that were incorrectly changed
-- ============================================

-- ============================================
-- PART 1: FIX PLATFORM ENUM - Add TikTok and YouTube
-- ============================================

-- Add 'tiktok' and 'youtube' to the platform enum
ALTER TYPE platform ADD VALUE 'tiktok' AFTER 'instagram';
ALTER TYPE platform ADD VALUE 'youtube' AFTER 'tiktok';

-- ============================================
-- PART 2: CREATE OAUTH STATES TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS public.oauth_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    platform platform NOT NULL,
    state TEXT NOT NULL UNIQUE,
    code_challenge TEXT,
    code_challenge_method TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() + '00:05:00'::interval),
    used BOOLEAN NOT NULL DEFAULT false,
    used_at TIMESTAMP WITHOUT TIME ZONE,
    ip_address inet,
    user_agent TEXT,

    CONSTRAINT oauth_states_pkey PRIMARY KEY (id),
    CONSTRAINT oauth_states_workspace_id_fkey FOREIGN KEY (workspace_id)
        REFERENCES public.workspaces(id) ON DELETE CASCADE,
    CONSTRAINT oauth_states_state_length CHECK (char_length(state) >= 32)
);

-- Add constraints separately to handle if they already exist
ALTER TABLE public.oauth_states
    ADD CONSTRAINT oauth_states_state_unique UNIQUE (state)
    ON CONFLICT DO NOTHING;

-- Create indexes for oauth_states
CREATE INDEX IF NOT EXISTS idx_oauth_states_workspace ON public.oauth_states(workspace_id);
CREATE INDEX IF NOT EXISTS idx_oauth_states_platform ON public.oauth_states(platform);
CREATE INDEX IF NOT EXISTS idx_oauth_states_expires_at ON public.oauth_states(expires_at);

-- Enable RLS on oauth_states if not already enabled
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view oauth states in their workspace
CREATE POLICY IF NOT EXISTS "Users can view oauth states in their workspace"
    ON public.oauth_states FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY IF NOT EXISTS "System can manage oauth states"
    ON public.oauth_states FOR ALL
    WITH CHECK (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

-- ============================================
-- PART 3: CREATE CREDENTIAL AUDIT LOG TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS public.credential_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    user_id UUID NOT NULL,
    platform TEXT NOT NULL,
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    error_message TEXT,
    error_code TEXT,
    ip_address inet,
    user_agent TEXT,
    request_path TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT credential_audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT credential_audit_log_workspace_id_fkey FOREIGN KEY (workspace_id)
        REFERENCES public.workspaces(id) ON DELETE CASCADE,
    CONSTRAINT credential_audit_log_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for credential_audit_log
CREATE INDEX IF NOT EXISTS idx_credential_audit_log_workspace
    ON public.credential_audit_log(workspace_id);
CREATE INDEX IF NOT EXISTS idx_credential_audit_log_user
    ON public.credential_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_credential_audit_log_platform
    ON public.credential_audit_log(platform);
CREATE INDEX IF NOT EXISTS idx_credential_audit_log_created_at
    ON public.credential_audit_log(created_at DESC);

-- Enable RLS on credential_audit_log
ALTER TABLE public.credential_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view audit logs in their workspace
CREATE POLICY IF NOT EXISTS "Users can view credential audit logs in their workspace"
    ON public.credential_audit_log FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

-- ============================================
-- PART 4: FIX SOCIAL ACCOUNTS TABLE
-- ============================================

-- Ensure social_accounts platform column uses the platform enum
-- If it's using TEXT, convert it to the enum type
DO $$
BEGIN
    -- Check if column exists and is not already the enum type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'social_accounts'
        AND column_name = 'platform'
        AND data_type = 'character varying'
    ) THEN
        -- Convert TEXT column to platform enum
        ALTER TABLE public.social_accounts
        ALTER COLUMN platform TYPE platform USING platform::platform;
    END IF;
END $$;

-- Add missing columns to social_accounts if they don't exist
ALTER TABLE public.social_accounts
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITHOUT TIME ZONE,
    ADD COLUMN IF NOT EXISTS last_refreshed_at TIMESTAMP WITHOUT TIME ZONE,
    ADD COLUMN IF NOT EXISTS refresh_token_encrypted TEXT,
    ADD COLUMN IF NOT EXISTS page_id TEXT,
    ADD COLUMN IF NOT EXISTS page_name TEXT,
    ADD COLUMN IF NOT EXISTS is_auto_refreshed BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS refresh_error_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_error_message TEXT;

-- Create unique constraint for workspace + platform (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'social_accounts'
        AND constraint_name = 'social_accounts_workspace_platform_unique'
    ) THEN
        ALTER TABLE public.social_accounts
        ADD CONSTRAINT social_accounts_workspace_platform_unique
        UNIQUE (workspace_id, platform);
    END IF;
END $$;

-- ============================================
-- PART 5: FIX TOKEN REFRESH QUEUE TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS public.token_refresh_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    platform TEXT NOT NULL,
    should_refresh_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    last_attempt_at TIMESTAMP WITHOUT TIME ZONE,
    attempts_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT token_refresh_queue_pkey PRIMARY KEY (id),
    CONSTRAINT token_refresh_queue_workspace_id_fkey FOREIGN KEY (workspace_id)
        REFERENCES public.workspaces(id) ON DELETE CASCADE
);

-- Create indexes for token_refresh_queue
CREATE INDEX IF NOT EXISTS idx_token_refresh_queue_workspace
    ON public.token_refresh_queue(workspace_id);
CREATE INDEX IF NOT EXISTS idx_token_refresh_queue_platform
    ON public.token_refresh_queue(platform);
CREATE INDEX IF NOT EXISTS idx_token_refresh_queue_status
    ON public.token_refresh_queue(status);
CREATE INDEX IF NOT EXISTS idx_token_refresh_queue_should_refresh_at
    ON public.token_refresh_queue(should_refresh_at);

-- Create trigger for updated_at on token_refresh_queue if function exists
CREATE TRIGGER IF NOT EXISTS update_token_refresh_queue_updated_at
    BEFORE UPDATE ON public.token_refresh_queue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 6: VERIFY USERS TABLE ROLE COLUMN
-- ============================================

-- Ensure users.role uses user_role enum (not TEXT)
DO $$
BEGIN
    -- Check if column exists and is not already the enum type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'role'
        AND (data_type = 'character varying' OR data_type = 'text')
    ) THEN
        -- Convert TEXT column to user_role enum
        ALTER TABLE public.users
        ALTER COLUMN role TYPE user_role USING role::user_role;
    END IF;
END $$;

-- Add NOT NULL constraint to users.role if needed
DO $$
BEGIN
    -- Check if role column allows NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'role'
        AND is_nullable = 'YES'
    ) THEN
        -- Set default role for existing nulls
        UPDATE public.users SET role = 'viewer' WHERE role IS NULL;

        -- Add NOT NULL constraint
        ALTER TABLE public.users
        ALTER COLUMN role SET NOT NULL;
    END IF;
END $$;

-- ============================================
-- PART 7: VERIFY WORKSPACE INVITES TABLE ROLES
-- ============================================

-- Create workspace_invites table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.workspace_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    email TEXT,
    role TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    invited_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    used_at TIMESTAMP WITH TIME ZONE,
    used_by UUID,

    CONSTRAINT workspace_invites_pkey PRIMARY KEY (id),
    CONSTRAINT workspace_invites_workspace_id_fkey FOREIGN KEY (workspace_id)
        REFERENCES public.workspaces(id) ON DELETE CASCADE,
    CONSTRAINT workspace_invites_invited_by_fkey FOREIGN KEY (invited_by)
        REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT workspace_invites_used_by_fkey FOREIGN KEY (used_by)
        REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT workspace_invites_role_check
        CHECK (role IN ('admin', 'editor', 'viewer'))
);

-- Create indexes for workspace_invites
CREATE INDEX IF NOT EXISTS idx_workspace_invites_workspace
    ON public.workspace_invites(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_token
    ON public.workspace_invites(token);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_email
    ON public.workspace_invites(email);

-- Enable RLS on workspace_invites
ALTER TABLE public.workspace_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspace_invites
CREATE POLICY IF NOT EXISTS "Users can view invites for their workspace"
    ON public.workspace_invites FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY IF NOT EXISTS "Admins can create invites"
    ON public.workspace_invites FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- PART 8: ADD WORKSPACE ENCRYPTION KEYS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.workspace_encryption_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL UNIQUE,
    key_salt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    CONSTRAINT workspace_encryption_keys_pkey PRIMARY KEY (id),
    CONSTRAINT workspace_encryption_keys_workspace_id_fkey FOREIGN KEY (workspace_id)
        REFERENCES public.workspaces(id) ON DELETE CASCADE
);

-- Create trigger for updated_at on workspace_encryption_keys
CREATE TRIGGER IF NOT EXISTS update_workspace_encryption_keys_updated_at
    BEFORE UPDATE ON public.workspace_encryption_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUMMARY OF CHANGES
-- ============================================
-- 1. Added 'tiktok' and 'youtube' to platform enum
-- 2. Created oauth_states table with proper platform enum type
-- 3. Created credential_audit_log table for audit trail
-- 4. Enhanced social_accounts table with new columns
-- 5. Created token_refresh_queue table for background token refresh
-- 6. Verified users.role uses user_role enum (not TEXT)
-- 7. Created workspace_invites table with proper role validation
-- 8. Created workspace_encryption_keys table
-- 9. Added RLS policies and indexes for security and performance
-- 10. All foreign keys properly configured with CASCADE deletes where appropriate

-- ============================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================
-- Note: PostgreSQL does not allow rolling back ENUM type additions.
-- If you need to remove 'tiktok' and 'youtube', you would need to:
-- 1. Create a new enum without these values
-- 2. Update all columns to use the new enum
-- 3. Drop the old enum
-- See migration rollback procedures in your deployment documentation.

-- ============================================
-- Migration Complete
-- ============================================
