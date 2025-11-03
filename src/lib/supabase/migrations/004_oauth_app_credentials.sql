-- ============================================
-- OAUTH APP CREDENTIALS TABLE MIGRATION
-- ============================================
-- This migration creates a table for managing OAuth app credentials
-- Allows workspace admins to configure OAuth credentials per workspace
-- Credentials are encrypted at rest using Supabase encryption
-- Created: 2025-01-01
-- Purpose: Enable dynamic OAuth app configuration per workspace

-- ============================================
-- CREATE OAUTH_APP_CREDENTIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.oauth_app_credentials (
    -- Unique identifier for each credential entry
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Which workspace this credential belongs to
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

    -- Which platform (twitter, linkedin, facebook, instagram)
    platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'facebook', 'instagram')),

    -- OAuth App ID / Client ID (encrypted)
    app_id TEXT,
    client_id TEXT,

    -- OAuth App Secret / Client Secret (encrypted)
    -- NOTE: This should be encrypted at the application level before storage
    app_secret TEXT,
    client_secret TEXT,

    -- OAuth Callback URLs (can be overridden per workspace)
    callback_url TEXT,

    -- Redirect URL for OAuth authorization
    redirect_url TEXT,

    -- Additional configuration as JSON
    config JSONB DEFAULT '{}',

    -- Who created this configuration
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- When this configuration was created
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Who last updated this configuration
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- When this configuration was last updated
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Unique constraint: one credential per platform per workspace
    UNIQUE (workspace_id, platform)
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
-- Index to find credentials by workspace
CREATE INDEX idx_oauth_creds_workspace ON public.oauth_app_credentials(workspace_id);

-- Index to find credentials by platform
CREATE INDEX idx_oauth_creds_platform ON public.oauth_app_credentials(platform);

-- Index for workspace + platform lookups (common query)
CREATE INDEX idx_oauth_creds_workspace_platform ON public.oauth_app_credentials(workspace_id, platform);

-- Index for created_at to find recent changes
CREATE INDEX idx_oauth_creds_created_at ON public.oauth_app_credentials(created_at DESC);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.oauth_app_credentials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- Policy: Admins can view their workspace's OAuth credentials
CREATE POLICY "Admins can view workspace oauth credentials"
ON public.oauth_app_credentials
FOR SELECT
USING (
    workspace_id IN (
        SELECT workspace_id FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Policy: Admins can insert OAuth credentials
CREATE POLICY "Admins can insert oauth credentials"
ON public.oauth_app_credentials
FOR INSERT
WITH CHECK (
    workspace_id IN (
        SELECT workspace_id FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Policy: Admins can update OAuth credentials
CREATE POLICY "Admins can update oauth credentials"
ON public.oauth_app_credentials
FOR UPDATE
USING (
    workspace_id IN (
        SELECT workspace_id FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
)
WITH CHECK (
    workspace_id IN (
        SELECT workspace_id FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Policy: Admins can delete OAuth credentials
CREATE POLICY "Admins can delete oauth credentials"
ON public.oauth_app_credentials
FOR DELETE
USING (
    workspace_id IN (
        SELECT workspace_id FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ============================================
-- CREATE AUDIT LOG TRIGGER
-- ============================================
-- Create trigger to log changes to oauth_app_credentials
CREATE OR REPLACE FUNCTION public.log_oauth_credentials_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        workspace_id,
        user_id,
        action,
        resource_type,
        resource_id,
        changes,
        ip_address,
        created_at
    ) VALUES (
        COALESCE(NEW.workspace_id, OLD.workspace_id),
        auth.uid(),
        CASE
            WHEN TG_OP = 'INSERT' THEN 'oauth_credentials_created'
            WHEN TG_OP = 'UPDATE' THEN 'oauth_credentials_updated'
            WHEN TG_OP = 'DELETE' THEN 'oauth_credentials_deleted'
        END,
        'oauth_app_credentials',
        COALESCE(NEW.id, OLD.id),
        jsonb_build_object(
            'platform', COALESCE(NEW.platform, OLD.platform),
            'old_values', CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
            'new_values', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
        ),
        NULL,
        NOW()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_oauth_credentials_audit ON public.oauth_app_credentials;
CREATE TRIGGER trigger_oauth_credentials_audit
AFTER INSERT OR UPDATE OR DELETE ON public.oauth_app_credentials
FOR EACH ROW
EXECUTE FUNCTION public.log_oauth_credentials_change();
