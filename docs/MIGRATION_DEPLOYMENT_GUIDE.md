# Migration & Deployment Guide

Step-by-step guide to migrate from old credential system to the improved secure system with zero downtime.

---

## Phase Overview

| Phase | Duration | Risk | Actions | User Impact |
|-------|----------|------|---------|-------------|
| **Phase 1: Infrastructure** | 1-2 days | LOW | DB tables, encryption | None |
| **Phase 2: Services** | 1-2 days | LOW | Backend services | None |
| **Phase 3: APIs** | 2-3 days | MEDIUM | New routes alongside old | None |
| **Phase 4: Frontend** | 2-3 days | MEDIUM | A/B testing | Gradual rollout |
| **Phase 5: Cleanup** | 1 day | MEDIUM | Remove old code | Possible interruption |
| **Total** | 1-2 weeks | MEDIUM | - | Minimal |

---

## Pre-Migration Checklist

- [ ] Backup production database
- [ ] Notify users of planned changes
- [ ] Test migration in staging environment
- [ ] Prepare rollback plan
- [ ] Set up monitoring and alerting
- [ ] Brief support team on changes
- [ ] Create incident response procedure
- [ ] Ensure team availability during migration
- [ ] Document any custom integrations
- [ ] Test all OAuth flows in staging

---

## Phase 1: Infrastructure Setup (NO USER IMPACT)

### Step 1.1: Set Environment Variables

```bash
# .env.production
ENCRYPTION_MASTER_KEY="<generate-secure-key>"
# See docs/ENVIRONMENT_SETUP.md for how to generate

# Verify it's set
echo $ENCRYPTION_MASTER_KEY
```

### Step 1.2: Run Database Migration

```bash
# Option 1: Using Supabase CLI
supabase db push

# Option 2: Manually in Supabase SQL Editor
# 1. Open Supabase Dashboard → SQL Editor
# 2. Create new query
# 3. Paste content from: src/lib/supabase/migrations/001_improve_credentials.sql
# 4. Click "Run"
```

**Expected Output:**
```
✓ Created table: oauth_states
✓ Created table: credential_audit_log
✓ Created table: token_refresh_queue
✓ Added columns to social_accounts
✓ Enabled RLS policies
```

### Step 1.3: Verify Migration Success

```bash
# Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

# Should include: oauth_states, credential_audit_log, token_refresh_queue, social_accounts
```

### Step 1.4: Backup Existing Credentials (Optional)

```bash
# Export all existing credentials for backup
SELECT * FROM social_accounts INTO OUTFILE 'backup.csv';

# Archive in secure location
```

---

## Phase 2: Deploy Backend Services (NO USER IMPACT)

### Step 2.1: Deploy New Service Files

```bash
# 1. Create new service files
cp src/lib/auth/encryptionManager.ts src/lib/auth/
cp src/lib/auth/stateGenerator.ts src/lib/auth/
cp src/services/database/auditLogService.ts src/services/database/
cp src/services/database/oauthStateService.ts src/services/database/

# 2. Update credential service (new version)
# This file replaces the old credentialService.ts
cp src/services/database/credentialService.ts src/services/database/

# 3. Deploy to staging
git add .
git commit -m "feat: add new backend services for secure credentials"
git push origin staging
```

### Step 2.2: Test in Staging

```bash
# 1. Run unit tests
npm run test:unit

# 2. Verify encryption works
npm run test:encryption

# 3. Check service startup
npm run build
npm run dev

# 4. Test in browser
# - Go to /dashboard
# - Verify no errors in console
```

### Step 2.3: Deploy to Production

```bash
# When ready:
git push origin main

# Monitor deployment
# 1. Check Vercel deployment status
# 2. Monitor error rates (should be 0)
# 3. Check server logs
```

---

## Phase 3: Deploy New API Routes (NEW ROUTES ALONGSIDE OLD)

### Step 3.1: Deploy OAuth Routes

```bash
# 1. Create new OAuth routes
cp src/app/api/auth/oauth/[platform]/route.ts src/app/api/auth/oauth/
cp src/app/api/auth/oauth/*/callback/route.ts src/app/api/auth/oauth/*/

# 2. Keep old routes active (don't delete yet)
# src/app/api/twitter/callback/route.ts  ← Keep for now
# src/app/api/facebook/callback/route.ts ← Keep for now
# src/app/api/instagram/callback/route.ts ← Keep for now
# src/app/api/linkedin/callback/route.ts ← Keep for now

git add .
git commit -m "feat: add unified OAuth routes (Phase 3)"
git push origin main
```

### Step 3.2: Deploy Credential Endpoints

```bash
# 1. Create credential endpoints
mkdir -p src/app/api/credentials/{status,health-check}
cp src/app/api/credentials/status/route.ts src/app/api/credentials/status/
cp src/app/api/credentials/\[platform\]/disconnect/route.ts src/app/api/credentials/
cp src/app/api/credentials/health-check/route.ts src/app/api/credentials/health-check/

# 2. Test all new endpoints
curl http://localhost:3000/api/credentials/status
curl http://localhost:3000/api/credentials/health-check
curl -X DELETE http://localhost:3000/api/credentials/twitter/disconnect

git add .
git commit -m "feat: add credential management endpoints (Phase 3)"
git push origin main
```

### Step 3.3: Verify New Routes Work

```bash
# In Staging:
# 1. Try OAuth flow with new route
#    - Should see new PKCE parameters
#    - Should verify state from database
#    - Should save credentials with new encryption

# 2. Check audit logs
SELECT * FROM credential_audit_log ORDER BY created_at DESC LIMIT 5;

# 3. Verify OAuth state cleanup
SELECT COUNT(*) FROM oauth_states WHERE expires_at < NOW();
```

---

## Phase 4: Update Frontend (A/B Testing)

### Step 4.1: Deploy Updated Component

```bash
# 1. Update component
cp src/components/accounts/ConnectedAccountsView.tsx src/components/accounts/

git add .
git commit -m "feat: update ConnectedAccountsView with new error handling (Phase 4)"
git push origin main
```

### Step 4.2: A/B Testing (Optional)

```typescript
// Use feature flag to control rollout percentage
// src/lib/featureFlags.ts
export function shouldUseNewOAuth(userId: string): boolean {
  // Roll out to 50% of users first
  const hash = userId.charCodeAt(0) % 100;
  return hash < 50; // First 50% get new UI
}
```

### Step 4.3: Gradual Rollout

```
Day 1: 25% of users
Day 2: 50% of users
Day 3: 75% of users
Day 4: 100% of users
```

### Step 4.4: Monitor Metrics

```typescript
// Track in analytics
analytics.track('oauth_connection', {
  platform: 'twitter',
  success: true,
  duration_ms: 3500,
  using_new_flow: true,
  user_id: userId,
});
```

**Metrics to Monitor:**
- Connection success rate (should be >= 95%)
- Average connection time
- Error rates per platform
- Token refresh success rate

---

## Phase 5: Cleanup (POTENTIAL DOWNTIME)

### Step 5.1: Monitor New System (3-5 days)

```bash
# Check error rates
SELECT action, status, COUNT(*)
FROM credential_audit_log
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY action, status;

# Check for any issues
SELECT * FROM credential_audit_log
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Step 5.2: Run State Cleanup Job

```typescript
// src/app/api/maintenance/cleanup/route.ts
import { cleanupExpiredStates } from '@/services/database/oauthStateService'

export async function POST(req: NextRequest) {
  const deleted = await cleanupExpiredStates()
  console.log(`Cleaned up ${deleted} expired OAuth states`)
  return NextResponse.json({ deleted })
}
```

### Step 5.3: Remove Old Routes (CAREFULLY)

```bash
# Only after confirming new routes work for 3+ days

# 1. Delete old routes
rm src/app/api/twitter/callback/route.ts
rm src/app/api/facebook/callback/route.ts
rm src/app/api/instagram/callback/route.ts
rm src/app/api/linkedin/callback/route.ts

# 2. Delete old credential service
rm src/services/credentialService.ts

# 3. Test thoroughly
npm run build
npm run test

# 4. Deploy
git add .
git commit -m "chore: remove legacy OAuth routes (Phase 5)"
git push origin main
```

### Step 5.4: Update OAuth Callback URLs (FINAL)

```bash
# Update platform settings to use new URLs (optional)
# Only if you changed callback URL paths

# Twitter: https://yourdomain.com/api/auth/oauth/twitter/callback
# LinkedIn: https://yourdomain.com/api/auth/oauth/linkedin/callback
# Facebook: https://yourdomain.com/api/auth/oauth/facebook/callback
# Instagram: https://yourdomain.com/api/auth/oauth/instagram/callback
```

---

## Rollback Plan

If something goes wrong:

### Immediate Rollback (5 minutes)

```bash
# 1. Revert to previous commit
git revert HEAD
git push origin main

# 2. Vercel will auto-deploy
# Monitor: Deployments page shows new version

# 3. Verify old routes work
# Test OAuth flow manually
```

### If Database is Affected

```sql
-- Restore from backup
-- In Supabase Dashboard → Backups → Restore

-- Or manually restore tables
DROP TABLE IF EXISTS oauth_states;
DROP TABLE IF EXISTS credential_audit_log;
DROP TABLE IF EXISTS token_refresh_queue;

-- Remove added columns
ALTER TABLE social_accounts
DROP COLUMN IF EXISTS expires_at;
-- ... etc
```

### Communication

```markdown
## Incident Report

1. Issue detected: [Description]
2. Affected users: [Count]
3. Time to detect: [X minutes]
4. Time to fix: [Y minutes]
5. Root cause: [Analysis]
6. Prevention: [Action items]
```

---

## Post-Migration Verification

### Day 1
- [ ] Zero errors in logs
- [ ] Connection success rate >= 95%
- [ ] No increase in support tickets
- [ ] Database performance normal

### Day 3
- [ ] All platforms working
- [ ] Token refresh working
- [ ] Audit logs populated
- [ ] No memory leaks

### Day 7
- [ ] Sustained success rate >= 98%
- [ ] User feedback positive
- [ ] Documentation updated
- [ ] Team trained

---

## Maintenance Tasks

### Daily (Automated)
```typescript
// src/app/api/cron/daily/route.ts
// - Clean up expired OAuth states
// - Refresh tokens expiring in 3 days
// - Generate audit reports
```

### Weekly
```bash
# Check audit logs for anomalies
SELECT DATE(created_at), status, COUNT(*)
FROM credential_audit_log
GROUP BY DATE(created_at), status;

# Verify encryption is working
SELECT COUNT(*) FROM social_accounts
WHERE credentials_encrypted IS NOT NULL;
```

### Monthly
- Rotate encryption key (optional)
- Review audit logs for security
- Test disaster recovery
- Update documentation

---

## Success Criteria

✅ **Migration is successful when:**
- All 4 platforms connect successfully
- Credentials are encrypted in database
- Audit logs record all events
- No data loss occurred
- Users experience no downtime
- Support tickets are normal
- Performance is unchanged or improved

---

## Timeline Example

```
Monday:   Phase 1 & 2 (deploy services)
Tuesday:  Phase 3 (deploy new routes)
Wednesday: Phase 4 (update UI, 25% rollout)
Thursday: Phase 4 (50-75% rollout)
Friday:   Phase 4 (100% rollout)
Monday:   Phase 5 (cleanup after 3-day monitoring)
```

---

## Questions?

1. Check logs: `npm run logs:production`
2. Review error: Check specific error code in code
3. Test manually: Use /api/auth/oauth/[platform] endpoints
4. Check database: Query Supabase dashboard
5. Ask team: Slack #engineering-critical-ops

---

## Additional Resources

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Architecture Decisions](./ARCHITECTURE.md)
