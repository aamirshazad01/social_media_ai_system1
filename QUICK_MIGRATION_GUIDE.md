# 🚀 Quick Migration Guide - Update Database Role Constraint

## Three Ways to Update Your Existing Database

Your new migration is ready! Choose one method below:

---

## **Option 1: CLI Script (Recommended)** ⭐

Easiest way - runs migration programmatically.

```bash
# Make sure app is running first
npm run dev

# In another terminal, run:
npm run migrate:fix-role
```

**Output:**
```
✅ Migration Result:
   - Success: true
   - Message: Role constraint migration completed successfully
   - Users Fixed: 0
   - Steps Done: 4
```

---

## **Option 2: API Endpoint (Quick Check)**

Test the migration status and run it via HTTP:

```bash
# Check status first
curl http://localhost:3000/api/admin/migrations/fix-role

# Run migration
curl -X POST http://localhost:3000/api/admin/migrations/fix-role
```

**Response:**
```json
{
  "success": true,
  "message": "Role constraint migration completed successfully",
  "details": {
    "stepsDone": 4,
    "usersFixed": 0,
    "timestamp": "2025-11-04T10:30:00.000Z",
    "migratedBy": "admin@example.com"
  }
}
```

---

## **Option 3: Manual SQL (Direct Database Access)**

Run SQL directly in Supabase dashboard.

1. Go to: https://supabase.com → Select project → SQL Editor
2. Click "New Query"
3. Copy this SQL:

```sql
BEGIN;

-- Remove DEFAULT constraint
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

-- Set all NULL roles to 'admin'
UPDATE users SET role = 'admin' WHERE role IS NULL;

-- Create audit trigger
CREATE OR REPLACE FUNCTION log_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO activity_logs (workspace_id, user_id, action, resource_type, resource_id, details)
    VALUES (NEW.workspace_id, COALESCE(auth.uid(), NEW.id), 'role_changed', 'user', NEW.id,
            jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role, 'changed_by', auth.uid(), 'timestamp', NOW()));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS audit_role_changes ON users;
CREATE TRIGGER audit_role_changes AFTER UPDATE ON users FOR EACH ROW
WHEN (OLD.role IS DISTINCT FROM NEW.role)
EXECUTE FUNCTION log_role_changes();

-- Verify success
SELECT COUNT(*) as users_with_null_roles FROM users WHERE role IS NULL;

COMMIT;
```

4. Click "Run"
5. Last result should show: `users_with_null_roles: 0`

---

## 🎯 What This Migration Does

| Step | Action |
|------|--------|
| 1 | Removes `DEFAULT 'editor'` from role column |
| 2 | Sets all `NULL` roles to `'admin'` |
| 3 | Creates audit trigger for tracking role changes |
| 4 | Verifies all users have explicit roles |

---

## ✅ Verification

After migration, verify success:

```sql
-- Check no NULL roles remain
SELECT COUNT(*) FROM users WHERE role IS NULL;
-- Should return: 0

-- Check all users have roles
SELECT COUNT(*) as total_users, COUNT(CASE WHEN role IS NOT NULL THEN 1 END) as users_with_roles FROM users;
-- Should return same count for both

-- Check audit logging works (insert a test role change)
UPDATE users SET role = 'admin' WHERE id = 'YOUR_USER_ID' LIMIT 1;

-- Check activity log was created
SELECT * FROM activity_logs WHERE action = 'role_changed' ORDER BY created_at DESC LIMIT 1;
-- Should show your role change logged
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` first |
| 401 Unauthorized | Login to app first, then try again |
| 403 Forbidden | Only admins can run migrations |
| "Already exists" errors | Normal - safe to ignore |
| App not running | Start with `npm run dev` first |

---

## 📋 Files Created

- `src/lib/supabase/migrations/005_fix_role_constraint.sql` - SQL migration file
- `src/lib/supabase/migrations/runMigration.ts` - TypeScript migration function
- `src/app/api/admin/migrations/fix-role/route.ts` - API endpoint for migration
- `scripts/migrate-fix-role.js` - CLI script to run migration
- `scripts/MIGRATION_INSTRUCTIONS.md` - Detailed documentation

---

## ⏰ Time Required

- **Option 1 (CLI)**: 30 seconds - 2 minutes
- **Option 2 (API)**: 1 minute
- **Option 3 (SQL)**: 5 minutes

---

## 🎉 Benefits After Migration

✅ Admin role **stays permanent** (won't change to editor)
✅ All role changes are **automatically logged**
✅ **Audit trail** for compliance/debugging
✅ **No more accidental role overwrites**
✅ **All users have explicit roles**

---

**Next Steps:**
1. Choose a migration method above
2. Run the migration
3. Verify success with SQL check
4. Test that admin role stays after refresh

Questions? See `scripts/MIGRATION_INSTRUCTIONS.md` for detailed guide.
