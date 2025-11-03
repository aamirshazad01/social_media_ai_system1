# Environment Variables Setup Guide

Complete guide for setting up environment variables for the improved social media OS with secure credential management.

## Critical Security Configuration

### Master Encryption Key (REQUIRED)

```bash
# This is used to derive workspace-specific encryption keys
# Generate a secure random string (at least 32 characters)
ENCRYPTION_MASTER_KEY="your-very-secure-random-key-min-32-chars"
```

**How to generate:**
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows PowerShell
-join ((0..31) | ForEach-Object {'{0:x}' -f (Get-Random -Max 16)})
```

⚠️ **CRITICAL**:
- Store this securely in your `.env.local`
- Never commit to version control
- Use a secrets manager in production (AWS Secrets Manager, HashiCorp Vault, etc.)
- This key should be rotated periodically

---

## Database Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Setup Steps:**
1. Create a Supabase project at https://supabase.com
2. Go to Settings → API
3. Copy the URL and keys
4. Run migration: `npx supabase db push` (or paste SQL from `src/lib/supabase/migrations/001_improve_credentials.sql`)

---

## OAuth Configuration

### Twitter / X

```bash
# Twitter OAuth 2.0 Configuration
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret

# Optional: For direct API access (not stored in DB)
TWITTER_API_KEY=your-api-key
TWITTER_API_SECRET=your-api-secret
TWITTER_BEARER_TOKEN=your-bearer-token
```

**Setup:**
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create an app with OAuth 2.0 enabled
3. Set Callback URL: `https://yourdomain.com/api/auth/oauth/twitter/callback`
4. Under App Settings, set Authorization settings:
   - Callback URL: `https://yourdomain.com/api/auth/oauth/twitter/callback`
   - Website URL: `https://yourdomain.com`
   - Permissions: Read and Write
   - App Type: Confidential Client

---

### LinkedIn

```bash
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

**Setup:**
1. Go to https://www.linkedin.com/developers/apps
2. Create an app
3. Set Callback URL: `https://yourdomain.com/api/auth/oauth/linkedin/callback`
4. Under Auth tab, add Authorized redirect URLs:
   - `https://yourdomain.com/api/auth/oauth/linkedin/callback`
5. Request access to `w_member_social` and `r_basicprofile`

---

### Facebook & Instagram

```bash
# Facebook App Configuration
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Instagram uses Facebook's OAuth system
INSTAGRAM_APP_ID=your-instagram-app-id  # Can be same as Facebook
INSTAGRAM_APP_SECRET=your-instagram-app-secret  # Can be same as Facebook
```

**Setup:**
1. Go to https://developers.facebook.com/apps
2. Create or select an app
3. Add Facebook Login product
4. Set Callback URLs in Settings → Basic:
   - `https://yourdomain.com/api/auth/oauth/facebook/callback`
   - `https://yourdomain.com/api/auth/oauth/instagram/callback`
5. Set Valid OAuth Redirect URIs under Facebook Login → Settings:
   - `https://yourdomain.com/api/auth/oauth/facebook/callback`
   - `https://yourdomain.com/api/auth/oauth/instagram/callback`
6. Request permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `pages_manage_metadata` (for Instagram)

---

## Application Configuration

```bash
# Application URL (used for OAuth callbacks)
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Deployment
NODE_ENV=production
```

---

## Complete .env.local Example

```bash
# ===== ENCRYPTION (CRITICAL) =====
ENCRYPTION_MASTER_KEY="your-secure-encryption-key-min-32-chars"

# ===== DATABASE =====
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===== APPLICATION =====
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# ===== TWITTER =====
TWITTER_CLIENT_ID=your-client-id
TWITTER_CLIENT_SECRET=your-client-secret
TWITTER_API_KEY=your-api-key
TWITTER_API_SECRET=your-api-secret
TWITTER_BEARER_TOKEN=your-bearer-token

# ===== LINKEDIN =====
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret

# ===== FACEBOOK =====
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret

# ===== INSTAGRAM =====
INSTAGRAM_APP_ID=your-app-id
INSTAGRAM_APP_SECRET=your-app-secret

# ===== AI (Optional) =====
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

---

## Production Deployment Checklist

- [ ] Generate strong `ENCRYPTION_MASTER_KEY` using cryptographically secure method
- [ ] Store `ENCRYPTION_MASTER_KEY` in production secrets manager (NOT in .env file)
- [ ] Verify all OAuth callback URLs match exactly in platform settings
- [ ] Test OAuth flow for each platform
- [ ] Enable HTTPS for all endpoints
- [ ] Set up WAF (Web Application Firewall) rules
- [ ] Configure CORS properly
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Test token refresh functionality
- [ ] Verify RLS policies on Supabase tables
- [ ] Run migration to create new tables
- [ ] Test credentials encryption/decryption
- [ ] Set up audit log retention policy

---

## Testing OAuth Flows Locally

### Local Development with HTTPS

For local testing with OAuth, use a tool like ngrok:

```bash
# Terminal 1: Start your app
npm run dev

# Terminal 2: Tunnel to localhost:3000
ngrok http 3000

# You'll get a URL like: https://abc123.ngrok.io

# Set in .env.local:
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io

# Update OAuth callback URLs to use ngrok URL
```

---

## Environment Variable Validation

The app performs validation on startup. Check for these errors:

```bash
# Error: Missing ENCRYPTION_MASTER_KEY
Error: ENCRYPTION_MASTER_KEY environment variable not set

# Error: Missing OAuth config
Error: {PLATFORM} is not configured

# Error: Missing database config
Error: Supabase configuration not found
```

---

## Security Best Practices

### 1. Never commit .env files
```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Use environment-specific configs
```bash
.env.development.local    # Local development
.env.production.local     # Production (secrets manager)
.env.test.local           # Testing
```

### 3. Rotate keys periodically
- Change `ENCRYPTION_MASTER_KEY` every 90 days
- Rotate OAuth secrets quarterly
- Store old keys for decryption of historical data

### 4. Monitor access logs
- Review audit logs for suspicious activity
- Set up alerts for failed connection attempts
- Track token refresh patterns

### 5. Use secrets manager in production
```bash
# AWS Secrets Manager example
aws secretsmanager get-secret-value --secret-id prod/social-media-os/encryption-key

# Environment variable:
ENCRYPTION_MASTER_KEY=$(aws secretsmanager get-secret-value --secret-id prod/social-media-os/encryption-key --query SecretString --output text)
```

---

## Troubleshooting

### "Token exchange failed"
- Verify OAuth Client ID and Secret match platform settings
- Check callback URL matches exactly
- Ensure platform app is published/active
- Clear cookies and try again

### "State verification failed"
- Browser cookies may be disabled
- OAuth state may have expired (5-minute timeout)
- Clear browser cache and try again
- Check if running multiple tabs

### "Encryption key unavailable"
- Verify `ENCRYPTION_MASTER_KEY` is set
- Check environment variable is readable
- Ensure Node.js process has access to env vars
- Check for typos in variable name

### "No pages found" (Facebook/Instagram)
- Create a Facebook Page first
- Connect Instagram Business Account to Facebook Page
- Ensure user has admin access to page
- Check app permissions are correct

---

## Additional Resources

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [OAuth Configuration Details](./OAUTH_CALLBACK_URLS.md)
- [Twitter OAuth 2.0 Docs](https://developer.twitter.com/en/docs/authentication/oauth-2-0)
- [LinkedIn OAuth Docs](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)

---

## Questions or Issues?

Check the troubleshooting section or open an issue on GitHub.
