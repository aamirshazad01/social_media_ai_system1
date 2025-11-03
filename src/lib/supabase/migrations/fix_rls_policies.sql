-- ============================================
-- Fix RLS Policies for OAuth and Credential Tables
-- Run this in your Supabase SQL Editor
-- ============================================

-- First, let's check and remove any existing problematic policies
DROP POLICY IF EXISTS "Allow authenticated users to insert oauth states" ON oauth_states;
DROP POLICY IF EXISTS "Allow authenticated users to read oauth states" ON oauth_states;
DROP POLICY IF EXISTS "Allow authenticated users to update oauth states" ON oauth_states;

-- For oauth_states table - Allow authenticated users to manage their own workspace's states
CREATE POLICY "Authenticated users can insert oauth states for their workspace"
    ON oauth_states FOR INSERT
    WITH CHECK (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Authenticated users can read oauth states for their workspace"
    ON oauth_states FOR SELECT
    USING (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Authenticated users can update oauth states for their workspace"
    ON oauth_states FOR UPDATE
    USING (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
    );

-- For audit_logs table - Allow authenticated users to insert logs for their workspace
DROP POLICY IF EXISTS "Allow authenticated users to insert audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Allow authenticated users to read audit logs" ON audit_logs;

CREATE POLICY "Authenticated users can insert audit logs for their workspace"
    ON audit_logs FOR INSERT
    WITH CHECK (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Authenticated users can read audit logs for their workspace"
    ON audit_logs FOR SELECT
    USING (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
    );

-- For credential_audit_log table - Allow authenticated users to insert/read logs
DROP POLICY IF EXISTS "Allow authenticated users to insert credential audit logs" ON credential_audit_log;
DROP POLICY IF EXISTS "Allow authenticated users to read credential audit logs" ON credential_audit_log;

CREATE POLICY "Authenticated users can insert credential audit logs for their workspace"
    ON credential_audit_log FOR INSERT
    WITH CHECK (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Authenticated users can read credential audit logs for their workspace"
    ON credential_audit_log FOR SELECT
    USING (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
    );

-- For workspace_encryption_keys - Allow authenticated users to access their workspace keys
DROP POLICY IF EXISTS "Allow users to read their workspace encryption keys" ON workspace_encryption_keys;
DROP POLICY IF EXISTS "Allow admins to manage workspace encryption keys" ON workspace_encryption_keys;

CREATE POLICY "Authenticated users can read their workspace encryption keys"
    ON workspace_encryption_keys FOR SELECT
    USING (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Admins can insert workspace encryption keys"
    ON workspace_encryption_keys FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update workspace encryption keys"
    ON workspace_encryption_keys FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================
-- COMPLETE!
-- ============================================
-- All RLS policies have been fixed.
-- OAuth connections should now work!
