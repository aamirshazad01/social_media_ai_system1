# Facebook OAuth Configuration Reference

## Environment Variables

### Local Development (.env.local)
```env
# Facebook App Credentials
FACEBOOK_CLIENT_ID="1376799513861125"
FACEBOOK_CLIENT_SECRET="c4558f76ca16766df8bd7475ec05989d"

# OAuth Scope Configuration
# false = Development scopes (no App Review needed)
# true = Production scopes (requires App Review)
FACEBOOK_USE_ADVANCED_SCOPES=false

# Application URL for OAuth callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (.env)
```env
# Facebook App Credentials (Production App)
FACEBOOK_CLIENT_ID="1564229384591025"
FACEBOOK_CLIENT_SECRET="a54a21174c211a9d98159751ea63d46b"

# Production uses advanced scopes (only if app is approved)
# Change to false if app review is denied
FACEBOOK_USE_ADVANCED_SCOPES=true

# Production Application URL
NEXT_PUBLIC_APP_URL=https://social-medias-os.vercel.app/
```

---

## Scope Configuration

### FACEBOOK_DEVELOPMENT_SCOPES
Available immediately without App Review:
```typescript
[
  'pages_show_list',          // List pages
  'pages_read_engagement',    // Read engagement data
  'public_profile',           // Basic profile info
]
```

**Use when:**
- In Development Mode
- Testing Facebook integration
- `FACEBOOK_USE_ADVANCED_SCOPES=false`
- `NODE_ENV=development`

### FACEBOOK_PRODUCTION_SCOPES
Requires App Review:
```typescript
[
  'pages_show_list',          // List pages
  'pages_manage_posts',       // Create posts ⚠️ App Review
  'pages_read_engagement',    // Read engagement
  'pages_read_user_content',  // Read user content ⚠️ App Review
  'read_insights',            // Analytics ⚠️ App Review
  'public_profile',           // Basic profile
]
```

**Use when:**
- App is approved for advanced permissions
- Production deployment
- `FACEBOOK_USE_ADVANCED_SCOPES=true`
- `NODE_ENV=production`

---

## Callback URLs

### Development
```
http://localhost:3000/api/auth/oauth/facebook/callback
```

### Production (Vercel)
```
https://social-medias-os.vercel.app/api/auth/oauth/facebook/callback
```

**Important:** Set these in Facebook App Settings → Facebook Login → Valid OAuth Redirect URIs

---

## OAuth Flow

### Request Scopes
```
GET https://www.facebook.com/v21.0/dialog/oauth?
  client_id={APP_ID}
  &redirect_uri={CALLBACK_URL}
  &response_type=code
  &state={CSRF_TOKEN}
  &scope=pages_show_list,pages_read_engagement,public_profile
```

### Token Exchange
```
GET https://graph.facebook.com/v21.0/oauth/access_token?
  client_id={APP_ID}
  &client_secret={APP_SECRET}
  &redirect_uri={CALLBACK_URL}
  &code={CODE}
```

### Get Long-Lived Token (60 days)
```
GET https://graph.facebook.com/v21.0/oauth/access_token?
  grant_type=fb_exchange_token
  &client_id={APP_ID}
  &client_secret={APP_SECRET}
  &fb_exchange_token={SHORT_LIVED_TOKEN}
```

### Fetch User Pages
```
GET https://graph.facebook.com/v21.0/me/accounts?
  access_token={USER_TOKEN}
```

---

## API Endpoints

### Debug Token
**Get token status and granted scopes**

```bash
# Query parameter method (less secure)
GET /api/facebook/debug-token?token={accessToken}

# POST method (recommended)
POST /api/facebook/debug-token
Content-Type: application/json

{
  "token": "{accessToken}",
  "appId": "{optional APP_ID}",
  "appSecret": "{optional APP_SECRET}"
}
```

**Response:**
```json
{
  "valid": true,
  "appId": "1564229384591025",
  "userId": "123456789",
  "expiresAt": "2024-12-03T15:30:00.000Z",
  "isExpired": false,
  "grantedScopes": [
    "pages_show_list",
    "pages_read_engagement",
    "public_profile"
  ],
  "recommendation": "Missing advanced permissions: pages_manage_posts, pages_read_user_content, read_insights. These require Facebook App Review."
}
```

---

## Facebook App Dashboard Settings

### Required Configuration

1. **App ID & Secret**
   - Dashboard → Settings → Basic
   - Copy `App ID` and `App Secret`

2. **Facebook Login**
   - Products → Add Product → Facebook Login
   - Configure → Settings
   - Valid OAuth Redirect URIs:
     ```
     http://localhost:3000/api/auth/oauth/facebook/callback
     https://social-medias-os.vercel.app/api/auth/oauth/facebook/callback
     ```

3. **API Version**
   - Set to v21.0 (latest)

4. **App Roles**
   - Settings → Roles → Add admin/developer/tester
   - Your development account should have a role

### For Advanced Permissions

1. **Submit for App Review**
   - App Review → Requested Permissions
   - Add: `pages_manage_posts`, `pages_read_user_content`, `read_insights`
   - Provide app description and use cases
   - Wait for approval (1-3 days)

---

## Common Issues & Solutions

### Invalid Scopes Error
**Cause:** Requesting scopes that require App Review while in Development Mode

**Solution:**
```env
FACEBOOK_USE_ADVANCED_SCOPES=false
```

### No Pages Found
**Cause:** User is not an admin of any Facebook page

**Solution:**
- Add your account as admin to a Facebook page
- Ensure page is properly configured

### Token Expired
**Cause:** Token is older than 60 days

**Solution:**
- Reconnect Facebook account
- New long-lived token will be generated

### CSRF Token Mismatch
**Cause:** Possible CSRF attack or browser cache issue

**Solution:**
1. Clear browser cache
2. Try OAuth flow again
3. Check network in browser dev tools

### Redirect URI Mismatch
**Cause:** Callback URL not configured in Facebook App

**Solution:**
1. Go to Facebook App Settings → Facebook Login → Settings
2. Add both dev and prod callback URLs
3. Make sure URL format matches exactly (with trailing slash if needed)

---

## API Graph Versions

All endpoints use **v21.0** (latest as of November 2024):
- `https://www.facebook.com/v21.0/dialog/oauth`
- `https://graph.facebook.com/v21.0/oauth/access_token`
- `https://graph.facebook.com/v21.0/*` (API endpoints)

**To update API version:**
1. Edit `src/lib/facebook/client.ts`
2. Change version in URLs
3. Test thoroughly (breaking changes possible)

---

## Switching Between Dev and Prod Apps

### Development App (1376799513861125)
```env
# .env.local
FACEBOOK_CLIENT_ID="1376799513861125"
FACEBOOK_CLIENT_SECRET="c4558f76ca16766df8bd7475ec05989d"
FACEBOOK_USE_ADVANCED_SCOPES=false
```

### Production App (1564229384591025)
```env
# .env
FACEBOOK_CLIENT_ID="1564229384591025"
FACEBOOK_CLIENT_SECRET="a54a21174c211a9d98159751ea63d46b"
FACEBOOK_USE_ADVANCED_SCOPES=true
```

**Key Differences:**
- Different App IDs and Secrets
- Different callback URLs
- Different scope requirements
- Production app is submitted for App Review

---

## Token Lifecycle

1. **Initial Request** (~1 hour validity)
   - User authorizes app
   - Short-lived token received

2. **Long-Lived Conversion** (~60 days validity)
   - Exchange short-lived token for long-lived token
   - Done automatically in callback

3. **Storage**
   - Encrypted in Supabase database
   - Associated with workspace and user

4. **Expiration**
   - Checked on each API call
   - User redirected to re-connect if expired

5. **Refresh**
   - User clicks "Connect Facebook" again
   - New token generated and stored

---

## Security Best Practices

1. **Never commit credentials**
   - Use `.env.local` (not in git)
   - Never log API keys
   - Use environment variables

2. **CSRF Protection**
   - State tokens validated
   - Generated per request
   - Stored in secure database

3. **HTTPS Only**
   - Production must use HTTPS
   - OAuth cookies are `secure` and `httpOnly`

4. **Scope Minimization**
   - Request only needed permissions
   - Use development scopes during testing
   - Submit only necessary permissions for App Review

5. **Token Encryption**
   - Tokens encrypted at rest in database
   - Workspace-specific encryption keys
   - Audit logs for all operations

---

## Monitoring & Debugging

### Logs to Check
1. **Server Console**
   - OAuth flow errors
   - Token exchange issues
   - API call failures

2. **Browser Console**
   - OAuth redirect issues
   - Frontend JavaScript errors

3. **Audit Logs**
   - Settings → Audit Logs
   - View all OAuth operations
   - Error tracking

### Debug Endpoint Usage
```bash
# Get token info
curl "http://localhost:3000/api/facebook/debug-token?token=YOUR_TOKEN"

# With credentials (more info)
curl -X POST http://localhost:3000/api/facebook/debug-token \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN", "appId": "YOUR_APP_ID", "appSecret": "YOUR_SECRET"}'
```

---

## Related Files

- `src/lib/facebook/client.ts` - OAuth client library
- `src/app/api/auth/oauth/[platform]/route.ts` - OAuth initiation
- `src/app/api/auth/oauth/facebook/callback/route.ts` - OAuth callback
- `src/app/api/facebook/debug-token/route.ts` - Token debugging
- `src/services/database/oauthStateService.ts` - CSRF tokens
- `src/services/database/credentialService.ts` - Token storage
