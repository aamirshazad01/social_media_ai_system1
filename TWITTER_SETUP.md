# Twitter API Setup Guide

Follow these steps to enable real Twitter posting in your Social Media OS.

## Step 1: Create Twitter Developer Account

1. Go to **https://developer.twitter.com/en/portal/dashboard**
2. Sign in with your Twitter account
3. Click **"Sign up for Free Account"** if you don't have developer access
4. Complete the application form:
   - Select **"Hobbyist" → "Making a bot"** (or appropriate category)
   - Provide app description: "Social media management tool for scheduling and posting content"
   - Agree to terms and submit

## Step 2: Create a Twitter App

1. Once approved, click **"+ Create App"** or **"+ Create Project"**
2. Name your app (e.g., "Social Media OS")
3. Save the **App ID** for reference

## Step 3: Configure App Settings

### User Authentication Settings
1. In your app dashboard, click **"Settings"**
2. Scroll to **"User authentication settings"**
3. Click **"Set up"**
4. Configure:
   - **App permissions**: Select **"Read and write"** (required for posting)
   - **Type of App**: Select **"Web App, Automated App or Bot"**
   - **Callback URL**: `http://localhost:3000/api/twitter/callback`
     - For production: `https://yourdomain.com/api/twitter/callback`
   - **Website URL**: `http://localhost:3000` (or your production URL)
5. Click **"Save"**

## Step 4: Get Your API Credentials

1. Go to **"Keys and tokens"** tab
2. You'll see:
   - **API Key** (also called Consumer Key)
   - **API Secret** (also called Consumer Secret)
3. Click **"Generate"** for **Access Token and Secret**
   - **Access Token**
   - **Access Token Secret**
4. **Important**: Copy these values immediately - you won't be able to see them again!

## Step 5: Add Credentials to Your App

1. Open your `.env` file in the project root
2. Replace the placeholder values with your actual credentials:

```env
# Twitter API Configuration
TWITTER_API_KEY=your_actual_api_key_here
TWITTER_API_SECRET=your_actual_api_secret_here
TWITTER_BEARER_TOKEN=your_actual_bearer_token_here
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
4. Click **"Connect"** on the Twitter card
5. You'll be redirected to Twitter to authorize the app
6. Click **"Authorize app"**
7. You'll be redirected back to your app
8. Twitter should now show as **Connected** ✅

## Step 7: Post Your First Tweet

1. Go to **"Create Content"**
2. Create a new post
3. Select **Twitter** as the platform
4. Write your content (max 280 characters)
5. Click through the workflow: Draft → Ready to Publish
6. Go to **"Published"** tab
7. Click **"Publish"** button
8. Check your Twitter account - the tweet should be live! 🎉

---

## Troubleshooting

### "Twitter API credentials not configured"
- Make sure you've added all credentials to `.env`
- Restart the dev server after adding credentials

### "Callback URL mismatch"
- Ensure the callback URL in Twitter Developer Portal matches:
  - Dev: `http://localhost:3000/api/twitter/callback`
  - Prod: `https://yourdomain.com/api/twitter/callback`

### "App permissions insufficient"
- Go to Twitter Developer Portal
- Check **User authentication settings**
- Ensure **"Read and write"** is selected
- You may need to regenerate access tokens after changing permissions

### "Tweet failed to post"
- Check that Twitter account is connected (green status)
- Verify tweet is under 280 characters
- Check browser console for error details
- Check Twitter rate limits (you may have exceeded free tier limits)

---

## Twitter API Rate Limits (Free Tier)

- **POST /2/tweets**: 50 requests per 24 hours
- **GET /2/users/me**: 75 requests per 15 minutes
- **Media upload**: 15 MB per file, 4 files per tweet

For higher limits, consider upgrading to Twitter API Basic ($100/month) or Pro plan.

---

## Production Deployment Notes

When deploying to production:

1. **Update Callback URL** in Twitter Developer Portal to your production domain
2. **Update `.env`** file with production callback URL:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. **Keep credentials secure**:
   - Never commit `.env` to git
   - Use environment variables in your hosting platform
   - Consider using a secrets management service

---

## Security Best Practices

✅ **DO**:
- Store credentials in environment variables
- Use HTTPS in production
- Implement rate limiting on your backend
- Log all Twitter API calls for debugging
- Handle expired/invalid tokens gracefully

❌ **DON'T**:
- Commit credentials to git
- Share API keys publicly
- Expose credentials in client-side code
- Skip OAuth - always use proper authentication flow

---

## Need Help?

- **Twitter API Docs**: https://developer.twitter.com/en/docs/twitter-api
- **Rate Limits**: https://developer.twitter.com/en/docs/rate-limits
- **OAuth 1.0a**: https://developer.twitter.com/en/docs/authentication/oauth-1-0a

---

**Ready to tweet!** 🐦 Once you've completed these steps, your Social Media OS can post directly to Twitter!
