# LinkedIn OAuth Setup Guide

## Overview

LinkedIn has migrated to **OpenID Connect (OIDC)** which is built on top of OAuth 2.0. This guide covers setting up LinkedIn OAuth authentication for the Social Media OS application.

## Common Error: "Bummer, something went wrong"

If you see this error when trying to connect LinkedIn, it usually indicates one of these issues:

1. **Incorrect scopes configuration** - Mismatch between what's configured in the code vs. what's enabled in LinkedIn Developer Portal
2. **ShareOnLinkedIn product not enabled** - If you want to post, this product must be enabled
3. **Wrong scopes for the enabled products** - Each product requires specific scopes

## Step 1: Create/Access LinkedIn Developer App

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Click "Create app"
3. Fill in the required information:
   - App name: (e.g., "Social Media OS")
   - LinkedIn Page: Select or create a page associated with your app
   - App logo: Upload a logo
   - Legal agreement: Accept terms

## Step 2: Enable Required Products

In your LinkedIn app dashboard:

1. Go to the **"Products"** tab
2. **Request access** to these products:
   - ✅ **Sign in with LinkedIn using OpenID Connect** (REQUIRED for basic login)
   - ✅ **Share on LinkedIn** (OPTIONAL - only if you want to post to LinkedIn)

### If you only want user authentication (NO posting):
- Enable: "Sign in with LinkedIn using OpenID Connect"
- Use scopes: `openid profile email`

### If you want both authentication AND posting:
- Enable: "Sign in with LinkedIn using OpenID Connect"
- Enable: "Share on LinkedIn"
- Use scopes: `openid profile email w_member_social`

## Step 3: Configure OAuth Settings

1. Go to the **"Auth"** tab in your LinkedIn app
2. Under "Authorized redirect URLs", add:
   ```
   https://your-domain.com/api/auth/oauth/linkedin/callback
   ```
   For development:
   ```
   http://localhost:3000/api/auth/oauth/linkedin/callback
   ```
3. Under "Client secret", click "Generate"
4. Copy your **Client ID** and **Client secret**

## Step 4: Set Environment Variables

In your `.env` file:

```bash
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=https://your-domain.com  # or http://localhost:3000 for dev
```

## Step 5: Verify Scopes Configuration

Check that the scopes in `src/lib/linkedin/client.ts` match what you enabled:

```typescript
export const LINKEDIN_SCOPES = [
  'openid',      // Required for OpenID Connect
  'profile',     // Get user profile info
  'email',       // Get user email
  'w_member_social', // Only if ShareOnLinkedIn is enabled
];
```

**Important**: If `w_member_social` is in the code but the product isn't enabled, you'll get the "Bummer, something went wrong" error.

## Step 6: Test the OAuth Flow

1. Start your development server
2. Go to Settings → Accounts → Connect LinkedIn
3. You should be redirected to LinkedIn
4. After authorization, you should be redirected back to your app

## Troubleshooting

### Error: "Bummer, something went wrong" on LinkedIn OAuth page

**Solutions:**
1. Verify the products you enabled match the scopes in code
2. If you removed `w_member_social` from code, you may need to wait 5-10 minutes for LinkedIn to update
3. Try clearing browser cookies and retrying
4. Check browser console for any error messages

### Error: "invalid_scope" after OAuth

This means LinkedIn doesn't recognize one or more of the scopes.

**Solutions:**
1. Ensure the products are enabled in LinkedIn Developer Portal
2. Check spelling of scope names exactly (case-sensitive)
3. Valid scopes are: `openid`, `profile`, `email`, `w_member_social`
4. If posting, ensure "Share on LinkedIn" product is enabled

### Token exchange fails but user didn't deny permission

Check the server logs for detailed error messages. Look for:
- "Token exchange error"
- "No access token in response"
- "Failed to fetch LinkedIn profile"

These indicate server-side issues, not user authorization issues.

### Tokens working but profile endpoint returns 401

This means the access token is invalid or has expired.

**Solutions:**
1. Clear stored credentials in database
2. Reconnect the account
3. Check that your app still has access to the product (sometimes access is revoked)

## API Endpoints Used

The application uses these LinkedIn endpoints:

### Authentication
- **Token endpoint**: `https://www.linkedin.com/oauth/v2/accessToken`
- **Authorization endpoint**: `https://www.linkedin.com/oauth/v2/authorization`

### User Info (OpenID Connect)
- **Userinfo endpoint**: `https://api.linkedin.com/v2/userinfo`
- **Me endpoint**: `https://api.linkedin.com/v2/me` (fallback, for older apps)

### Posting (requires ShareOnLinkedIn)
- **Create post**: `https://api.linkedin.com/v2/ugcPosts`
- **Upload media**: `https://api.linkedin.com/v2/assets?action=registerUpload`
- **Get insights**: `https://api.linkedin.com/v2/{id}/insights`

## Security Considerations

1. **Never store Client Secret in frontend** - Always keep it in environment variables on the server
2. **Always verify state parameter** - Protects against CSRF attacks
3. **Use HTTPS in production** - Required by LinkedIn
4. **Refresh tokens regularly** - Access tokens expire after 60 days
5. **Encrypt credentials in database** - The app uses Supabase encryption for this

## Reference Documentation

- [LinkedIn OAuth 2.0 Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [OpenID Connect Discovery Endpoint](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication?context=linkedin/consumer/context)
- [Permission Scopes and Roles](https://learn.microsoft.com/en-us/linkedin/shared/references/reference-v2/permissions)

## Notes

- LinkedIn access tokens expire in 60 days
- Refresh tokens are also available and should be used to obtain new access tokens
- New apps created in the LinkedIn Developer Portal use OIDC by default
- Older legacy OAuth is no longer supported for new apps
- The OpenID Connect `sub` claim is used as the user identifier
