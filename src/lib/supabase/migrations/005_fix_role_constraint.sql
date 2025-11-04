-- ============================================
-- Migration: Fix Role Constraint Issue
-- ============================================
-- Removes DEFAULT 'editor' from users.role
-- Adds audit trigger to log role changes
-- This prevents admin roles from being overwritten

BEGIN;

-- Step 1: Remove DEFAULT constraint on role column
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

-- Step 2: Ensure all existing users have explicit roles
-- Set any NULL roles to 'admin' if they created their workspace
UPDATE users u
SET role = 'admin'
WHERE role IS NULL;

-- Step 3: Create audit function for role changes
CREATE OR REPLACE FUNCTION log_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO activity_logs (
      workspace_id,
      user_id,
      action,
      resource_type,
      resource_id,
      details
    ) VALUES (
      NEW.workspace_id,
      COALESCE(auth.uid(), NEW.id),
      'role_changed',
      'user',
      NEW.id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_by', auth.uid(),
        'timestamp', NOW()
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create trigger for role change auditing
DROP TRIGGER IF EXISTS audit_role_changes ON users;
CREATE TRIGGER audit_role_changes
AFTER UPDATE ON users
FOR EACH ROW
WHEN (OLD.role IS DISTINCT FROM NEW.role)
EXECUTE FUNCTION log_role_changes();

COMMIT;
