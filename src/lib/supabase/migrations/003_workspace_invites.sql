-- ============================================
-- WORKSPACE INVITES TABLE MIGRATION
-- ============================================
-- This migration creates a table for managing workspace invitations
-- Supports both email-based and shareable link invitations
-- Created: 2025-01-01
-- Purpose: Enable multi-user workspace collaboration with role-based access

-- ============================================
-- CREATE WORKSPACE_INVITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workspace_invites (
    -- Unique identifier for each invitation
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Which workspace this invite is for
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

    -- Email address of invitee (NULL for shareable links)
    email TEXT,

    -- Role the user will get when they accept (admin, editor, viewer)
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),

    -- Unique token for the invitation link (URL-safe base64)
    token TEXT NOT NULL UNIQUE,

    -- When this invite expires (NULL = never expires)
    expires_at TIMESTAMPTZ,

    -- Who created this invitation (tracks admin)
    invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- When invitation was created
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- When invitation was used (NULL = not yet used)
    used_at TIMESTAMPTZ,

    -- Who used the invitation (NULL = not yet used)
    used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
-- Index to quickly find invites by token (used when user clicks invite link)
CREATE INDEX idx_invites_token ON public.workspace_invites(token);

-- Index to find invites for a specific workspace (admin viewing pending invites)
CREATE INDEX idx_invites_workspace ON public.workspace_invites(workspace_id);

-- Index to find invites by email (checking for existing invites)
CREATE INDEX idx_invites_email ON public.workspace_invites(email);

-- Index for finding unused invites efficiently
CREATE INDEX idx_invites_pending ON public.workspace_invites(workspace_id, used_at)
WHERE used_at IS NULL;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.workspace_invites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR SECURITY
-- ============================================

-- Policy 1: Users can view invites for their workspace (admins see their pending invites)
CREATE POLICY "Users can view invites for their workspace"
    ON public.workspace_invites
    FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM public.users WHERE id = auth.uid()
        )
    );

-- Policy 2: Admins can create invites for their workspace
-- Only users with admin role in their workspace can create invitations
CREATE POLICY "Admins can create invites"
    ON public.workspace_invites
    FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy 3: Admins can delete (revoke) invites for their workspace
-- Prevents editors/viewers from canceling other people's invites
CREATE POLICY "Admins can delete invites"
    ON public.workspace_invites
    FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- FUNCTION TO CLEANUP EXPIRED INVITES
-- ============================================
-- This function removes expired unused invitations automatically
-- Call this periodically to clean up old data
CREATE OR REPLACE FUNCTION public.cleanup_expired_invites()
RETURNS void AS $$
BEGIN
    DELETE FROM public.workspace_invites
    WHERE expires_at IS NOT NULL
    AND expires_at < NOW()
    AND used_at IS NULL;

    RAISE NOTICE 'Cleanup completed: expired unused invites removed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE public.workspace_invites IS 'Stores workspace invitation tokens for both email and shareable link invitations';
COMMENT ON COLUMN public.workspace_invites.id IS 'Unique identifier for the invitation';
COMMENT ON COLUMN public.workspace_invites.token IS 'Cryptographically secure random token for the invitation link';
COMMENT ON COLUMN public.workspace_invites.email IS 'Email for email invitations; NULL for shareable links';
COMMENT ON COLUMN public.workspace_invites.expires_at IS 'Expiration timestamp; NULL means never expires';
COMMENT ON COLUMN public.workspace_invites.used_at IS 'Timestamp when invitation was accepted; NULL if not yet used';
