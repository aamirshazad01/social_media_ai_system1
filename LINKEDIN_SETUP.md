# LinkedIn API Setup Guide

Follow these steps to enable real LinkedIn posting in your Social Media OS.

## Step 1: Create LinkedIn Developer Account

1. Go to **https://www.linkedin.com/developers**
2. Sign in with your LinkedIn account
3. Click **"Create app"**
4. Fill out the application form:
   - **App name**: Social Media OS (or your preferred name)
   - **LinkedIn Page**: Select your company page (you must have a LinkedIn page)
   - **Privacy policy URL**: Your privacy policy URL
   - **App logo**: Upload a logo (optional but recommended)
   - Accept terms and create the app

## Step 2: Configure App Permissions

1. In your app dashboard, go to the **"Products"** tab
2. Request access to these products:
   - ✅ **"Sign In with LinkedIn using OpenID Connect"** - For user authentication
   - ✅ **"Share on LinkedIn"** - For posting content
3. Click **"Request access"** for each product
4. Wait for approval (usually instant for Sign In, may take time for Share)

## Step 3: Get Your API Credentials

1. Go to **"Auth"** tab in your app
2. You'll see:
   - **Client ID** - Your application identifier
   - **Client Secret** - Your application secret (click "Show" to reveal)
3. **Important**: Copy these values immediately and store them securely!

## Step 4: Configure OAuth 2.0 Settings

### Redirect URLs
1. In the **"Auth"** tab, find **"OAuth 2.0 settings"**
2. Add these redirect URLs:
   - **Development**: `http://localhost:3000/api/linkedin/callback`
   - **Production**: `https://yourdomain.com/api/linkedin/callback`
3. Click **"Update"**

### Scope Permissions
Make sure these scopes are enabled (should be automatic with products):
- `openid` - Basic profile access
- `profile` - Full profile access
- `email` - Email access
- `w_member_social` - Share content on LinkedIn

## Step 5: Add Credentials to Your App

1. Open your `.env` file in the project root
2. Add your LinkedIn credentials:

```env
# LinkedIn API Configuration
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   # Start it again
   npm run dev
   ```

## Step 6: Test the Integration

1. Open **http://localhost:3000**
2. Sign in to your app
3. Go to **"Accounts"** section
4. Click **"Connect"** on the LinkedIn card
5. You'll be redirected to LinkedIn to authorize the app
6. Click **"Allow"** to grant permissions
7. You'll be redirected back to your app
8. LinkedIn should now show as **Connected** ✅

## Step 7: Post Your First LinkedIn Update

1. Go to **"Create Content"**
2. Create a new post
3. Select **LinkedIn** as the platform
4. Write your content (max 3000 characters)
5. Optionally add an image
6. Click through the workflow: Draft → Ready to Publish
7. Go to **"Published"** tab
8. Click **"Publish"** button
9. Check your LinkedIn profile - the post should be live! 🎉

---

## Troubleshooting

### "LinkedIn API credentials not configured"
- Make sure you've added both `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` to `.env`
- Restart the dev server after adding credentials

### "Redirect URL mismatch"
- Ensure the redirect URL in LinkedIn Developer Portal matches exactly:
  - Dev: `http://localhost:3000/api/linkedin/callback`
  - Prod: `https://yourdomain.com/api/linkedin/callback`
- No trailing slashes!

### "Products not approved"
- Check the **"Products"** tab in your LinkedIn app
- "Sign In with LinkedIn" should be approved instantly
- "Share on LinkedIn" may require manual review (usually within 24 hours)
- You can still test authentication without "Share" approval, but posting won't work

### "Invalid scope"
- Make sure you've requested access to both products
- Wait for approval before testing posting functionality

### "Post failed to publish"
- Check that LinkedIn account is connected (green status)
- Verify post is under 3000 characters
- Check browser console for error details
- Ensure you have "Share on LinkedIn" product approved

### "Access token expired"
- LinkedIn tokens expire after 60 days
- Click "Disconnect" and "Connect" again to get a new token
- Future update will implement automatic token refresh

---

## LinkedIn API Rate Limits

### Free Tier (Community Management)
- **POST /ugcPosts**: 100 posts per day per user
- **GET /userinfo**: 500 requests per day
- Rate limits reset at midnight UTC

### Important Notes
- Rate limits are per authenticated user, not per app
- Excessive failures may result in temporary rate limit reduction
- For higher limits, apply for LinkedIn Marketing Developer Platform

---

## Production Deployment Notes

When deploying to production:

1. **Update Redirect URL** in LinkedIn Developer Portal to your production domain
2. **Update `.env`** file with production callback URL:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. **Keep credentials secure**:
   - Never commit `.env` to git
   - Use environment variables in your hosting platform (Vercel, Netlify, etc.)
   - Consider using a secrets management service (AWS Secrets Manager, HashiCorp Vault)

4. **Verify products are approved**:
   - Both "Sign In" and "Share on LinkedIn" must be approved for production
   - LinkedIn may require additional verification for production apps

---

## Security Best Practices

✅ **DO**:
- Store credentials in environment variables
- Use HTTPS in production (required by LinkedIn)
- Implement token refresh mechanism
- Log all LinkedIn API calls for debugging
- Handle expired tokens gracefully
- Validate user permissions before posting

❌ **DON'T**:
- Commit credentials to git
- Share API keys publicly
- Expose credentials in client-side code
- Skip OAuth - always use proper authentication flow
- Store access tokens in localStorage (we encrypt and store in database)

---

## Credential Storage

Unlike Twitter (OAuth 1.0a), LinkedIn uses OAuth 2.0:
- **Access tokens** expire after 60 days
- **Refresh tokens** can be used to get new access tokens (not yet implemented)
- Tokens are encrypted and stored in Supabase database
- User encryption key is derived from user ID

---

## LinkedIn API Documentation

- **Developer Portal**: https://www.linkedin.com/developers
- **OAuth 2.0 Docs**: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication
- **Share API**: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
- **Rate Limits**: https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/rate-limits

---

## Differences from Twitter Integration

| Feature | Twitter | LinkedIn |
|---------|---------|----------|
| OAuth Version | OAuth 1.0a | OAuth 2.0 |
| Token Expiration | None | 60 days |
| Character Limit | 280 | 3000 |
| Media Upload | Separate upload | Integrated (2-step) |
| Refresh Token | Not needed | Available (not yet implemented) |
| Rate Limits | 50 posts/day | 100 posts/day |

---

## Next Steps

After completing setup:

1. ✅ Test authentication flow
2. ✅ Test posting text-only updates
3. ✅ Test posting with images
4. 🔄 Implement automatic token refresh (coming soon)
5. 🔄 Add support for video uploads (coming soon)
6. 🔄 Add support for article sharing (coming soon)

---

**Ready to share professionally!** 💼 Once you've completed these steps, your Social Media OS can post directly to LinkedIn!
