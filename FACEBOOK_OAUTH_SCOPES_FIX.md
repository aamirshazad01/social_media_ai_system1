# Facebook OAuth "Invalid Scopes" Fix Guide

## Problem Summary

You received the error:
```
Invalid Scopes: pages_manage_posts, pages_read_user_content, read_insights.
```

This error occurs because your Facebook App is in **Development Mode** and is requesting **advanced permissions** that require **App Review**.

## Root Cause

Facebook has two categories of permissions:

### 1. Basic Permissions (Available Immediately)
These permissions are available in Development Mode without App Review:
- `pages_show_list` - List pages managed by user
- `pages_read_engagement` - Read comments, reactions, and engagement data
- `public_profile` - Basic profile access

### 2. Advanced Permissions (Require App Review)
These permissions require Facebook App Review approval:
- `pages_manage_posts` - Create posts on pages ⚠️
- `pages_read_user_content` - Access user-generated content on pages ⚠️
- `read_insights` - Get analytics (impressions, clicks, performance metrics) ⚠️

## Solution Overview

This fix provides a **two-tier scope system** that automatically adapts to your development stage:

### For Development/Testing
Use basic scopes that work immediately without App Review. Limited functionality but no setup required.

### For Production
Use advanced scopes after submitting your app for App Review. Full functionality.

## Implementation Changes

### 1. Scope Configuration Files
Two new scope sets have been defined in `src/lib/facebook/client.ts`:

**Development Scopes** (No App Review needed):
```typescript
FACEBOOK_DEVELOPMENT_SCOPES = [
  'pages_show_list',
  'pages_read_engagement',
  'public_profile',
]
```

**Production Scopes** (Requires App Review):
```typescript
FACEBOOK_PRODUCTION_SCOPES = [
  'pages_show_list',
  'pages_manage_posts',
  'pages_read_engagement',
  'pages_read_user_content',
  'read_insights',
  'public_profile',
]
```

### 2. Automatic Scope Selection

The new `getFacebookScopes()` function automatically selects scopes based on:
1. `FACEBOOK_USE_ADVANCED_SCOPES` environment variable (if set)
2. `NODE_ENV` environment variable (if not explicitly set)

```typescript
export function getFacebookScopes(useAdvancedScopes?: boolean): string[] {
  const forceAdvanced = useAdvancedScopes !== undefined
    ? useAdvancedScopes
    : process.env.FACEBOOK_USE_ADVANCED_SCOPES === 'true' || process.env.NODE_ENV === 'production';

  return forceAdvanced ? FACEBOOK_PRODUCTION_SCOPES : FACEBOOK_DEVELOPMENT_SCOPES;
}
```

### 3. Environment Variable Configuration

#### For Local Development (`.env.local`)
```env
FACEBOOK_USE_ADVANCED_SCOPES=false
```
This uses development scopes automatically.

#### For Production (`.env`)
```env
FACEBOOK_USE_ADVANCED_SCOPES=true
```
This uses production scopes (only if app is approved).

### 4. Debug Token Endpoint

A new diagnostic endpoint has been created:

**Endpoint:** `GET /api/facebook/debug-token?token={accessToken}`
**POST:** `/api/facebook/debug-token` (more secure)

**Response includes:**
- Token validity status
- Granted scopes
- Token expiration
- Recommendations for fixing issues

**Example:**
```bash
curl "http://localhost:3000/api/facebook/debug-token?token=YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "valid": true,
  "grantedScopes": ["pages_show_list", "pages_read_engagement", "public_profile"],
  "isExpired": false,
  "recommendation": "Missing advanced permissions: pages_manage_posts, pages_read_user_content, read_insights. These require Facebook App Review."
}
```

### 5. Enhanced Error Handling

The OAuth callback now specifically detects and handles "Invalid Scopes" errors with helpful feedback:

- Logs detailed error information
- Provides user-friendly redirect with error details
- Suggests actions to resolve the issue

## How to Fix Your Current Issue

### Immediate Fix (For Testing)

1. **Update `.env.local`:**
   ```env
   FACEBOOK_USE_ADVANCED_SCOPES=false
   ```

2. **Restart your development server:**
   ```bash
   npm run dev
   ```

3. **Try connecting Facebook again** - Should now use development scopes only

### For Production (Full Functionality)

1. **Submit your app for App Review:**
   - Go to: https://developers.facebook.com/docs/facebook-login/permissions
   - Add these permissions to your app review request:
     - `pages_manage_posts`
     - `pages_read_user_content`
     - `read_insights`

2. **Wait for approval** (typically 1-3 days)

3. **Once approved, update `.env`:**
   ```env
   FACEBOOK_USE_ADVANCED_SCOPES=true
   ```

4. **Deploy to production**

## Testing the Fix

### Option 1: Using Development Scopes
```bash
# Set in .env.local
FACEBOOK_USE_ADVANCED_SCOPES=false

# Restart dev server
npm run dev

# Try connecting Facebook - should work with limited features
```

**What will work:**
- List your Facebook pages
- See engagement metrics (comments, likes, shares)
- View basic profile info

**What won't work:**
- Creating posts
- Reading user-generated content
- Viewing detailed analytics

### Option 2: Debug Token
```bash
# After connecting with limited scopes, test the token
curl "http://localhost:3000/api/facebook/debug-token?token=YOUR_PAGE_ACCESS_TOKEN"
```

## File Changes Summary

### Modified Files:
1. **`src/lib/facebook/client.ts`**
   - Added `FACEBOOK_DEVELOPMENT_SCOPES`
   - Added `FACEBOOK_PRODUCTION_SCOPES`
   - Added `getFacebookScopes()` function
   - Backward compatible with existing `FACEBOOK_SCOPES` export

2. **`src/app/api/auth/oauth/[platform]/route.ts`**
   - Updated to use `getFacebookScopes()` instead of static scopes

3. **`.env.local`**
   - Added `FACEBOOK_USE_ADVANCED_SCOPES=false`

4. **`.env`**
   - Added `FACEBOOK_USE_ADVANCED_SCOPES=true`

5. **`src/app/api/auth/oauth/facebook/callback/route.ts`**
   - Enhanced error handling for "Invalid Scopes"
   - Added specific error detection and logging
   - User-friendly error redirect with suggestions

### New Files:
1. **`src/app/api/facebook/debug-token/route.ts`**
   - Token debugging endpoint
   - Scope verification
   - Token expiration checking

## App Setup Checklist

- [ ] Facebook App is created at https://developers.facebook.com
- [ ] App ID and App Secret are configured in `.env`
- [ ] Redirect URI is set to: `https://your-domain.com/api/auth/oauth/facebook/callback`
- [ ] Your account has admin/developer role in the Facebook App
- [ ] `FACEBOOK_USE_ADVANCED_SCOPES=false` in `.env.local` (for development)
- [ ] Try connecting - should work with development scopes
- [ ] Test token at `/api/facebook/debug-token`
- [ ] (Optional) Submit for App Review to use advanced permissions
- [ ] Set `FACEBOOK_USE_ADVANCED_SCOPES=true` in `.env` (after approval)

## Troubleshooting

### Still getting "Invalid Scopes" error?
1. Check `.env.local` has `FACEBOOK_USE_ADVANCED_SCOPES=false`
2. Restart dev server: `npm run dev`
3. Clear browser cookies and cache
4. Try connecting again

### Token shows as invalid?
1. Use `/api/facebook/debug-token` endpoint to verify
2. Token might be expired (60-day expiration)
3. Reconnect Facebook account to refresh token

### Can't list pages?
1. Ensure your account has admin role in the Facebook page
2. Use debug endpoint to check granted scopes
3. Check audit logs in settings for error details

## Advanced: Using App Review

When you're ready to submit for App Review:

1. **Go to Facebook App Dashboard:**
   https://developers.facebook.com/apps/YOUR_APP_ID/roles

2. **Submit for App Review:**
   - Click "App Review" → "Permissions and Features"
   - Select the advanced permissions:
     - `pages_manage_posts`
     - `pages_read_user_content`
     - `read_insights`
   - Provide required information about your app

3. **Wait for approval** (usually 1-3 days)

4. **Once approved:**
   - Update `.env` to set `FACEBOOK_USE_ADVANCED_SCOPES=true`
   - Deploy to production
   - Your app can now post, read content, and access analytics

## References

- [Facebook Login Permissions](https://developers.facebook.com/docs/facebook-login/permissions)
- [Facebook App Review](https://developers.facebook.com/docs/app-review)
- [Graph API Reference](https://developers.facebook.com/docs/graph-api)
- [OAuth Documentation](https://developers.facebook.com/docs/facebook-login)

## Support

If you encounter issues:
1. Check audit logs in app settings for detailed error messages
2. Use `/api/facebook/debug-token` to verify token status
3. Review server logs for technical details
4. Consult Facebook's official documentation

## Summary of Benefits

✅ **Immediate Testing** - Works with development scopes right away
✅ **Clear Migration Path** - Easy upgrade to full features after App Review
✅ **Better Error Messages** - Specific guidance on what's wrong and how to fix it
✅ **Token Debugging** - Easy token verification and scope checking
✅ **Backward Compatible** - Existing code continues to work
✅ **Flexible Configuration** - Environment-based scope selection
