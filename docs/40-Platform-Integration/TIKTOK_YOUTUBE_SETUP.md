# TikTok and YouTube Platform Setup Guide

This guide will walk you through obtaining the necessary credentials for TikTok and YouTube OAuth authentication.

## TikTok Setup

### Step 1: Create a TikTok Developer Account
1. Go to [TikTok Developer Console](https://developer.tiktok.com/console/app)
2. Click "Create an app"
3. Fill in the app name and select the app type (choose "Web app" or "Desktop app")
4. Accept the terms and create the app

### Step 2: Configure OAuth Settings
1. In your app dashboard, go to **Settings** → **Redirect URIs**
2. Add your callback URL: `https://your-domain.com/api/auth/oauth/tiktok/callback`
   - For local development: `http://localhost:3000/api/auth/oauth/tiktok/callback`
3. Save the settings

### Step 3: Get Your Credentials
1. Go to **Settings** → **Basic Information**
2. Copy your **Client Key** and **Client Secret**
3. Update `.env` file with:
   ```env
   TIKTOK_CLIENT_KEY="your-client-key-here"
   TIKTOK_CLIENT_SECRET="your-client-secret-here"
   ```

### Step 4: Enable Content Posting API
1. In your app dashboard, go to **Products**
2. Look for "Content Posting API"
3. Click "Add" or enable it
4. This allows your app to post videos on behalf of users

### Step 5: Request Access (if needed)
- Some features may require sending a request to TikTok
- Fill out the access request form with details about your use case
- Wait for TikTok to approve (usually 1-3 business days)

---

## YouTube Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select "New Project"
3. Enter a project name (e.g., "Social Media OS") and click "Create"
4. Wait for the project to be created

### Step 2: Enable YouTube Data API v3
1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "YouTube Data API v3"
3. Click on it and click the **Enable** button
4. Wait for the API to be enabled

### Step 3: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If you haven't configured the OAuth consent screen, you'll be prompted to do so:
   - Select **External** as the user type
   - Click **Create**
4. Fill in the OAuth consent screen:
   - App name: "Social Media OS" (or your app name)
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
5. Add required scopes:
   - Click **Add or Remove Scopes**
   - Search for and select:
     - `https://www.googleapis.com/auth/youtube.upload`
     - `https://www.googleapis.com/auth/youtube.readonly`
     - `https://www.googleapis.com/auth/userinfo.profile`
   - Click **Update**
6. Back to credentials creation, select **Web application** as the application type
7. Add Authorized redirect URIs:
   - Click **Add URI**
   - Add: `https://your-domain.com/api/auth/oauth/youtube/callback`
   - For local development: `http://localhost:3000/api/auth/oauth/youtube/callback`
8. Click **Create** to generate your credentials

### Step 4: Get Your Credentials
1. Copy your **Client ID** and **Client Secret**
2. Update `.env` file with:
   ```env
   YOUTUBE_CLIENT_ID="your-client-id-here"
   YOUTUBE_CLIENT_SECRET="your-client-secret-here"
   ```

### Step 5: Test OAuth Flow (Optional)
1. Add your personal Google account to the test users:
   - Go to **APIs & Services** → **OAuth consent screen**
   - Click **Add Users** in the "Test users" section
   - Add your Google account email

---

## Environment Variables Setup

Update your `.env` file with the actual credentials:

```env
# TikTok OAuth Configuration
TIKTOK_CLIENT_KEY="your-actual-tiktok-client-key"
TIKTOK_CLIENT_SECRET="your-actual-tiktok-client-secret"

# YouTube OAuth Configuration
YOUTUBE_CLIENT_ID="your-actual-youtube-client-id"
YOUTUBE_CLIENT_SECRET="your-actual-youtube-client-secret"

# Application URL (make sure this is correct)
NEXT_PUBLIC_APP_URL="https://your-domain.com"  # or http://localhost:3000 for development
```

---

## Testing the Integration

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to Settings
- Go to http://localhost:3000/settings (or your domain)
- Click on the "Connected Accounts" tab

### 3. Test TikTok Connection
1. Click the "Connect" button for TikTok
2. You'll be redirected to TikTok's OAuth page
3. Log in with your TikTok account
4. Authorize the app to access your account
5. You should be redirected back to the settings page with a "Connected" status

### 4. Test YouTube Connection
1. Click the "Connect" button for YouTube
2. You'll be redirected to Google's OAuth page
3. Log in with your Google account
4. Grant the requested permissions
5. You should be redirected back with a "Connected" status

---

## Troubleshooting

### "Platform is not configured" Error
- **Cause**: Environment variables are missing or have placeholder values
- **Solution**: Make sure you've set the actual credentials in `.env` and restarted the dev server

### OAuth Redirect URI Mismatch
- **Cause**: The redirect URI in your developer app doesn't match the application URL
- **Solution**:
  - Verify `NEXT_PUBLIC_APP_URL` in `.env` matches what you configured in the developer console
  - Make sure it includes the exact path: `/api/auth/oauth/[platform]/callback`

### "Invalid scope" Error
- **Cause**: The app doesn't have permission to request certain scopes
- **Solution**:
  - For TikTok: Make sure "Content Posting API" is enabled in your app
  - For YouTube: Make sure the scopes are added to your OAuth consent screen

### Cannot Access Credentials
- **Cause**: You're not logged in or don't have admin role
- **Solution**:
  - Make sure you're logged in to your account
  - Only workspace admins can connect accounts

---

## API Endpoints

### TikTok
- **OAuth Initiation**: `POST /api/auth/oauth/tiktok`
- **OAuth Callback**: `GET /api/auth/oauth/tiktok/callback`
- **Post Video**: `POST /api/tiktok/post`

### YouTube
- **OAuth Initiation**: `POST /api/auth/oauth/youtube`
- **OAuth Callback**: `GET /api/auth/oauth/youtube/callback`
- **Upload Video**: `POST /api/youtube/post`

---

## Video Format Requirements

### TikTok
- **Format**: MP4
- **Aspect Ratio**: 9:16 (vertical)
- **Duration**: 3 seconds to 10 minutes
- **Max File Size**: 2.5GB
- **Resolution**: 720x1280 or 1080x1920

### YouTube
- **Format**: MP4, MOV, AVI, etc.
- **Aspect Ratio**: 16:9 (landscape) or 9:16 (Shorts)
- **Duration**: Unlimited (for regular uploads), up to 60 seconds (for Shorts)
- **Max File Size**: 256GB
- **Resolution**: Minimum 1280x720 (720p), recommended 1920x1080 (1080p)

---

## Security Notes

- Store credentials securely using environment variables
- Never commit `.env` files to version control
- Use HTTPS for production deployments
- Regularly rotate OAuth tokens
- Review connected app permissions periodically

