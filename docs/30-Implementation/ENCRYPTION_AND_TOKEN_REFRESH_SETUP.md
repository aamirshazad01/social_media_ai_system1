# Encryption & Token Refresh Setup Guide

## Part 1: Encryption System ✅ (Already Configured)

Your system is **already properly secured** with:

### How It Works

```
ENCRYPTION_MASTER_KEY (.env)
          ↓
PBKDF2 Derivation (100,000 iterations)
          ↓
Workspace-specific key (unique per workspace)
          ↓
AES-256-GCM Encryption (authenticated)
          ↓
Stored in database (encrypted_credentials)
```

### Key Features

| Feature | Implementation | Status |
|---------|---|---|
| Master Key | `ENCRYPTION_MASTER_KEY` from `.env` | ✅ |
| Key Derivation | PBKDF2 with workspace ID salt | ✅ |
| Encryption Algorithm | AES-256-GCM (authenticated) | ✅ |
| Key Strength | 256-bit (32 bytes) | ✅ |
| IV Randomness | 12-byte random IV per encryption | ✅ |
| Auth Tag | 16-byte authentication tag | ✅ |
| Encoding | Base64 (IV + AuthTag + Ciphertext) | ✅ |

### Code Location
- **Encryption Manager**: `src/lib/auth/encryptionManager.ts`
- **Credential Service**: `src/services/database/credentialService.ts`
- **Master Key**: `.env` - `ENCRYPTION_MASTER_KEY`

---

## Part 2: Token Refresh System ✅

### How Refresh Works

Your `TokenRefreshService` **only refreshes when approaching expiration**:

```typescript
// Platform-specific refresh thresholds
Platform      | Token Lifetime | Refresh Threshold | When Refresh Happens
--------------|---|---|---
Facebook      | 60 days        | 30 days before    | Between day 30-60
Instagram     | 60 days        | 30 days before    | Between day 30-60
Twitter       | ~2 hours       | 1 day before*     | Immediately (always refresh)
TikTok        | 24 hours       | 1 day before*     | Immediately (always refresh)
YouTube       | ~1 hour        | 1 day before*     | Immediately (always refresh)
LinkedIn      | 60 days        | NEVER             | Manual reauthentication only
```

*Note: For short-lived tokens, "1 day before" means refresh is triggered on every hourly check

### Refresh Process

```
1. Hourly cron job calls /api/cron/token-refresh
   ↓
2. For each platform credential:
   - Check if approaching expiration threshold
   - If YES → proceed to step 3
   - If NO → skip
   ↓
3. Retrieve decrypted credential from database
   ↓
4. Call platform's token refresh endpoint:
   - Facebook: fb_extend_token grant
   - YouTube: refresh_token grant
   - Twitter: refresh_token grant
   - TikTok: refresh_token grant
   ↓
5. Update credentials in database:
   - New accessToken
   - New expiresAt
   - Clear refresh error count
   ↓
6. Log success in audit trail
```

### Error Handling

```
Refresh Failure
   ↓
Increment refresh_error_count
   ↓
If error_count >= maxRetries (3)
   → Mark account as is_active = false
   → Send alert to admin
   ↓
Else
   → Keep account active
   → Retry on next hourly check
```

---

## Part 3: Cron Job Setup (Manual Step Required)

You need to **activate the cron job**. Choose one option:

### Option 1: Vercel Crons (RECOMMENDED - Already Configured)

**File**: `vercel.json` (already created)

```json
{
  "crons": [
    {
      "path": "/api/cron/token-refresh",
      "schedule": "0 * * * *"  // Every hour at :00 minutes
    }
  ]
}
```

**Setup**:
1. Deploy to Vercel
2. Cron will automatically run every hour
3. Add `.env.production`: `CRON_SECRET="your-secure-random-string"`

**Verify**: Check Vercel dashboard → Function logs → look for "Starting hourly token refresh job"

### Option 2: External Service (EasyCron, GitHub Actions)

**Setup HTTP GET request** to call hourly:

```
https://yourdomain.com/api/cron/token-refresh?secret=YOUR_CRON_SECRET
```

**GitHub Actions Example** (`.github/workflows/token-refresh.yml`):

```yaml
name: Token Refresh Cron
on:
  schedule:
    - cron: '0 * * * *'  # Every hour

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Refresh Tokens
        run: |
          curl -X GET "https://yourdomain.com/api/cron/token-refresh?secret=${{ secrets.CRON_SECRET }}"
```

### Option 3: Self-Hosted (Node.js)

**Install**:
```bash
npm install node-cron
```

**Create** `scripts/cron-server.js`:

```javascript
import cron from 'node-cron'

cron.schedule('0 * * * *', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/cron/token-refresh', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` }
    })
    const data = await response.json()
    console.log('✅ Token refresh completed:', data)
  } catch (error) {
    console.error('❌ Cron error:', error)
  }
})
```

**Run**:
```bash
node scripts/cron-server.js
```

---

## Part 4: Configuration Checklist

### Environment Variables (.env)

```bash
# ✅ Already set
ENCRYPTION_MASTER_KEY="a7f8e3c9d2b4a1f6..."

# ⚠️ Must configure
CRON_SECRET="your-secure-random-string"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# ✅ Already set (from previous setup)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# ✅ Already set (for each platform)
TWITTER_CLIENT_ID=...
FACEBOOK_CLIENT_ID=...
INSTAGRAM_CLIENT_ID=...
LINKEDIN_CLIENT_ID=...
TIKTOK_CLIENT_ID=...
YOUTUBE_CLIENT_ID=...
```

### Setup Steps

1. **Generate secure CRON_SECRET**:
   ```bash
   openssl rand -hex 32
   # Output: a1b2c3d4e5f6...
   ```

2. **Get Supabase Service Role Key**:
   - Go to: https://app.supabase.com/project/[your-project]/settings/api
   - Copy "Service Role" key
   - Add to `.env`: `SUPABASE_SERVICE_ROLE_KEY="..."`

3. **Update `.env.production`** (for Vercel):
   ```bash
   ENCRYPTION_MASTER_KEY="a7f8e3c9d2b4a1f6..."
   CRON_SECRET="generated-random-string"
   SUPABASE_SERVICE_ROLE_KEY="service-role-key"
   ```

4. **Test locally**:
   ```bash
   curl http://localhost:3000/api/cron/token-refresh
   # Should return: { success: true, tasks: {...} }
   ```

5. **Deploy to Vercel**:
   ```bash
   git push
   # Vercel will use vercel.json crons configuration
   ```

---

## Part 5: Monitoring & Debugging

### Check Cron Job Status

**Vercel Dashboard**:
- Go to: Functions → token-refresh → Logs
- Should see hourly logs like: "Starting hourly token refresh job..."

**Database Queries**:

```sql
-- Check last refresh for each platform
SELECT
  platform,
  username,
  expires_at,
  last_refreshed_at,
  refresh_error_count,
  is_active
FROM social_accounts
ORDER BY platform;

-- Check OAuth state cleanup
SELECT COUNT(*) FROM oauth_states WHERE expires_at < NOW();

-- Check audit log
SELECT
  action,
  status,
  platform,
  created_at
FROM audit_logs
WHERE action LIKE 'token%'
ORDER BY created_at DESC
LIMIT 20;
```

### Common Issues

**Issue**: Cron not running
- ✅ Check Vercel dashboard for logs
- ✅ Verify `.env.production` has `CRON_SECRET`
- ✅ Check `vercel.json` is in root directory

**Issue**: Token refresh failing
- ✅ Check `SUPABASE_SERVICE_ROLE_KEY` is set
- ✅ Check `ENCRYPTION_MASTER_KEY` matches production
- ✅ Check platform credentials are not expired

**Issue**: Decryption errors
- ✅ Ensure `ENCRYPTION_MASTER_KEY` hasn't changed
- ✅ Verify database has credentials_encrypted field
- ✅ Check workspace_id is correct

---

## Part 6: Security Checklist

✅ **Encryption**
- [ ] `ENCRYPTION_MASTER_KEY` is 64+ character random string
- [ ] Master key never logged or exposed
- [ ] Credentials never stored in plaintext
- [ ] AES-256-GCM provides authenticated encryption

✅ **Token Refresh**
- [ ] Only refreshes when necessary (not every request)
- [ ] Error count limits prevent infinite retries
- [ ] Failed accounts marked inactive
- [ ] Old OAuth states cleaned up hourly

✅ **Cron Job**
- [ ] `CRON_SECRET` protected endpoint
- [ ] Cron only callable with valid secret
- [ ] Logs include timestamp and result
- [ ] Errors are captured and logged

✅ **PKCE**
- [ ] All platforms use PKCE code challenge
- [ ] Verifier stored in secure httpOnly cookie
- [ ] Verifier cleared after token exchange

✅ **CSRF**
- [ ] OAuth state tokens with 5-minute expiration
- [ ] State marked as used (prevents replay)
- [ ] Admin-only OAuth connections

---

## Summary

| Component | Status | Details |
|---|---|---|
| **Encryption** | ✅ Active | AES-256-GCM with workspace-specific keys |
| **Token Refresh** | ✅ Ready | Smart threshold-based refresh |
| **Cron Job** | ⚠️ Needs Setup | Add `vercel.json` + `.env` variables |
| **PKCE** | ✅ Active | All platforms supported |
| **CSRF Protection** | ✅ Active | State tokens with expiration |
| **Audit Logging** | ✅ Active | All OAuth events logged |

**Next Steps**:
1. Set `CRON_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`
2. Deploy to Vercel (cron will activate automatically)
3. Verify logs show hourly token refresh running
