# Quick Start Guide - Secure Credentials System

## 🚀 Fast Track to Deployment

### 1️⃣ Pre-Deployment (30 minutes)

```bash
# Step 1: Generate encryption key
openssl rand -hex 32
# Output: abc123def456... (copy this)

# Step 2: Set environment variable
export ENCRYPTION_MASTER_KEY="your-key-from-step1"

# Step 3: Create .env.local
cat > .env.local << 'ENVFILE'
ENCRYPTION_MASTER_KEY=your-key-from-step1
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
INSTAGRAM_APP_ID=...
INSTAGRAM_APP_SECRET=...
ENVFILE

# Step 4: Verify environment
echo $ENCRYPTION_MASTER_KEY
```

### 2️⃣ Database Migration (10 minutes)

```bash
# Option 1: Using Supabase CLI
supabase db push

# Option 2: Manual in Supabase Dashboard
# 1. Open Supabase → SQL Editor
# 2. Create new query
# 3. Paste: src/lib/supabase/migrations/001_improve_credentials.sql
# 4. Click "Run"

# Verify
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('oauth_states', 'credential_audit_log', 'token_refresh_queue');
```

### 3️⃣ Test Locally (5 minutes)

```bash
# Build and run
npm run build
npm run dev

# Test OAuth flow
# 1. Go to http://localhost:3000/dashboard
# 2. Click "Connect Twitter"
# 3. Should redirect to twitter.com
# 4. Return with oauth_success=twitter in URL
# 5. Credentials should be saved encrypted in database
```

### 4️⃣ Deploy to Production (Varies)

```bash
# Verify staging first
git push origin staging
# Wait for Vercel build... verify it works

# Then deploy to production
git push origin main
# Monitor deployment

# Post-deployment verification
# 1. Check error rates (should be 0)
# 2. Test OAuth flow manually
# 3. Check database for new audit logs
# 4. Monitor for 24 hours
```

---

## 📋 Deployment Checklist

- [ ] ENCRYPTION_MASTER_KEY generated
- [ ] Environment variables set
- [ ] Database migration run
- [ ] OAuth credentials verified
- [ ] Callback URLs updated on platforms
- [ ] Staging tests passed
- [ ] Team notified
- [ ] Rollback plan documented
- [ ] Monitoring set up
- [ ] Production deployment completed

---

## ✅ Verification Steps

### After Deployment, verify:

```bash
# 1. Check deployment successful
curl https://yourdomain.com/api/credentials/status
# Should return: {"twitter": {"isConnected": false}, ...}

# 2. Try OAuth flow
# Go to /dashboard → Click Connect → Authorize → Return

# 3. Check database
# In Supabase: SELECT * FROM credential_audit_log ORDER BY created_at DESC;

# 4. Check for errors
# Monitor Vercel logs for errors
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "ENCRYPTION_MASTER_KEY not set" | Run: `export ENCRYPTION_MASTER_KEY="..."` |
| "State verification failed" | Clear browser cookies, try again |
| "OAuth config missing" | Verify env vars in .env.local |
| "Database error" | Run migration again, check Supabase |

---

## 📚 Full Documentation

- **Environment Setup**: `docs/ENVIRONMENT_SETUP.md`
- **Migration Guide**: `docs/MIGRATION_DEPLOYMENT_GUIDE.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`
- **Checklist**: `IMPLEMENTATION_CHECKLIST.md`

---

## 🎯 Success Indicators

✅ OAuth flow works for all 4 platforms
✅ No errors in browser console
✅ Credentials visible in database (encrypted)
✅ Audit logs being created
✅ User can see connection status
✅ Token expiration shown

---

**Ready? Let's go! 🚀**

See `docs/MIGRATION_DEPLOYMENT_GUIDE.md` for detailed step-by-step process.
