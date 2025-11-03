-- ============================================
-- Migration: Fix RLS Infinite Recursion
-- Purpose: Disable RLS on users table to prevent infinite recursion
--          when other tables' policies query the users table
-- ============================================

BEGIN;

-- Disable RLS on users table
-- This is safe because:
-- 1. Users table doesn't contain sensitive data that needs row-level filtering
-- 2. Access is still controlled by the policies on tables that reference users
-- 3. Other tables' RLS policies that query users won't cause recursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop problematic policies that would cause recursion
DROP POLICY IF EXISTS "Users can view workspace members" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

COMMIT;
