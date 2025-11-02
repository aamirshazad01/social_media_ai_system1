# Instagram OAuth Setup Guide

## Prerequisites

1. **Facebook Business Account** - Required for Instagram API
2. **Facebook Page** - Must be created and connected to your Instagram Business account
3. **Instagram Business Account** - Your Instagram profile must be converted to a Business account
4. **Facebook App** - Create a Facebook App with Instagram permissions

## Step-by-Step Setup

### 1. Convert Instagram to Business Account
- Go to your Instagram profile
- Settings → Account → Switch to Professional Account
- Choose Business account (not Creator)
- Link it to your Facebook Page

### 2. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (Business type)
3. Add **Instagram Basic Display** product
4. Add **Instagram Graph API** product
5. Configure OAuth redirect URIs

### 3. Configure OAuth Redirect URIs

**IMPORTANT**: In your Facebook App settings, add these exact redirect URIs:

```
https://social-medias-os.vercel.app/api/instagram/callback
http://localhost:3000/api/instagram/callback
```

**Note**: Make sure there are NO trailing slashes and the URL exactly matches your `NEXT_PUBLIC_APP_URL`.

### 4. Set Environment Variables

Add these to your `.env.local` file:

```bash
# Facebook/Instagram App Credentials
INSTAGRAM_APP_ID=your_facebook_app_id
INSTAGRAM_APP_SECRET=your_facebook_app_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Important: URL should NOT have trailing slash
NEXT_PUBLIC_APP_URL=https://social-medias-os.vercel.app
```

### 5. Facebook App Permissions

Ensure your app has these permissions:
- `instagram_basic`
- `instagram_content_publish`
- `pages_show_list`
- `pages_read_engagement`

### 6. Facebook Business Verification

For production use, you need to:
1. Verify your business with Facebook
2. Submit your app for review
3. Request advanced access for Instagram permissions

## Common Issues & Solutions

### Issue 1: "Sorry! Something went wrong" with Cookie Consent Page

**Cause**: Facebook's cookie consent page is blocking the OAuth flow.

**Solutions**:

1. **Clear Browser Cookies**
   - Clear Facebook cookies in your browser
   - Try in incognito/private mode

2. **Accept Cookie Consent**
   - When redirected to the cookie consent page, accept the cookies
   - Then try the Instagram connection again

3. **Use Facebook's New Login Experience**
   - Facebook is transitioning to a new login system
   - Make sure your app is using the latest OAuth endpoints
   - Update to Graph API v18.0 or later

4. **Check App Domain Settings**
   - In Facebook App settings, add your domain: `social-medias-os.vercel.app`
   - Add to "App Domains" in Basic Settings

### Issue 2: Double Slash in Redirect URI (`//api/instagram/callback`)

**Cause**: `NEXT_PUBLIC_APP_URL` has a trailing slash.

**Solution**: Remove trailing slash from environment variable:
```bash
# ❌ Wrong
NEXT_PUBLIC_APP_URL=https://social-medias-os.vercel.app/

# ✅ Correct
NEXT_PUBLIC_APP_URL=https://social-medias-os.vercel.app
```

### Issue 3: "No Facebook Pages Found"

**Cause**: Your Facebook account doesn't have any Pages.

**Solution**: 
1. Create a Facebook Page
2. Connect it to your Instagram Business account
3. Make sure you're an admin of the Page

### Issue 4: "No Instagram Business Account Found"

**Cause**: Instagram account not connected to Facebook Page.

**Solution**:
1. Go to your Facebook Page settings
2. Instagram → Connect Account
3. Log in to your Instagram Business account
4. Authorize the connection

### Issue 5: Token Expiration

**Note**: Instagram tokens expire after 60 days.

**Solution**: The app automatically exchanges for long-lived tokens, but you may need to reconnect periodically.

## Testing the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Accounts section
3. Click "Connect Instagram"
4. You should be redirected to Facebook login
5. Accept permissions
6. You'll be redirected back with success

## Production Deployment Checklist

- [ ] Facebook App verified
- [ ] Business verification complete
- [ ] Instagram permissions approved by Facebook
- [ ] Redirect URIs configured correctly
- [ ] Environment variables set in Vercel
- [ ] App domains configured in Facebook App
- [ ] Test OAuth flow end-to-end
- [ ] Monitor token expiration and renewal

## Troubleshooting

### Enable Debug Mode

Set this in your `.env.local`:
```bash
NODE_ENV=development
```

### Check Console Logs

Look for errors in:
- Browser console (F12)
- Server logs (terminal where you run `npm run dev`)
- Vercel logs (for production)

### Verify API Responses

Use browser Network tab to check:
- `/api/instagram/auth` - Should return OAuth URL
- `/api/instagram/callback` - Should handle OAuth callback
- Check response status codes and error messages

## Additional Resources

- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/guides/advanced/business-login)
- [OAuth Best Practices](https://developers.facebook.com/docs/facebook-login/security)

## Support

If you continue to experience issues:
1. Check Facebook Developer Console for app-level errors
2. Verify your Instagram account is in Business mode
3. Ensure Facebook Page is properly linked to Instagram
4. Test with a different Facebook/Instagram account
