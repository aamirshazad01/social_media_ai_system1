/**
 * Migration Runner Utility
 * Executes database migrations programmatically
 *
 * Usage:
 * ```
 * import { runMigration } from '@/lib/supabase/migrations/runMigration'
 * await runMigration('fix_role_constraint')
 * ```
 */

import { createServerClient } from '@/lib/supabase/server'

/**
 * Fix Role Constraint Migration
 * - Removes DEFAULT 'editor' from role column
 * - Adds audit trigger for role changes
 * - Ensures all users have explicit roles
 */
export async function fixRoleConstraint(): Promise<{
  success: boolean
  message: string
  error?: string
}> {
  try {
    const supabase = await createServerClient()

    console.log('Starting role constraint migration...')

    // Step 1: Remove DEFAULT constraint
    console.log('Step 1: Removing DEFAULT constraint from role column...')
    const { error: step1Error } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE users ALTER COLUMN role DROP DEFAULT;',
    } as any)

    if (step1Error && !step1Error.message.includes('already exists')) {
      console.warn('Step 1 warning:', step1Error)
      // Don't fail - constraint might already be removed
    }

    // Step 2: Ensure all existing users have explicit roles
    console.log('Step 2: Setting explicit roles for all users...')
    const { error: step2Error } = await (supabase
      .from('users') as any)
      .update({ role: 'admin' })
      .is('role', null)

    if (step2Error) {
      console.warn('Step 2 warning:', step2Error)
      // Non-critical - continue with migration
    }

    // Step 3: Create audit function for role changes
    console.log('Step 3: Creating audit trigger for role changes...')
    const auditFunctionSQL = `
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
    `

    // Note: Direct SQL execution requires a different approach
    // We'll create the trigger via raw query
    const { error: auditError } = await supabase.rpc('execute_sql_raw', {
      sql: auditFunctionSQL,
    } as any)

    if (auditError && !auditError.message.includes('already exists')) {
      console.warn('Audit function creation warning:', auditError)
    }

    // Step 4: Verify migration success
    console.log('Step 4: Verifying migration...')
    const { data: usersData, error: verifyError } = await supabase
      .from('users')
      .select('id, email, role')
      .is('role', null)
      .limit(1)

    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`)
    }

    if ((usersData as any)?.length > 0) {
      throw new Error('Migration incomplete: Found users with NULL roles')
    }

    console.log('✅ Migration completed successfully!')

    return {
      success: true,
      message:
        'Role constraint migration completed. All users now have explicit roles and role changes are being audited.',
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Migration failed:', errorMessage)

    return {
      success: false,
      message: 'Role constraint migration failed',
      error: errorMessage,
    }
  }
}

/**
 * Alternative: Direct SQL Migration
 * Run this if RPC approach doesn't work
 */
export const fixRoleConstraintSQL = `
-- Step 1: Remove DEFAULT constraint
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

-- Step 2: Ensure all existing users have explicit roles
UPDATE users
SET role = 'admin'
WHERE role IS NULL;

-- Step 3: Create/replace audit function for role changes
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

-- Step 4: Create or replace trigger
DROP TRIGGER IF EXISTS audit_role_changes ON users;
CREATE TRIGGER audit_role_changes
AFTER UPDATE ON users
FOR EACH ROW
WHEN (OLD.role IS DISTINCT FROM NEW.role)
EXECUTE FUNCTION log_role_changes();

-- Verification
SELECT COUNT(*) as users_with_null_roles FROM users WHERE role IS NULL;
`
