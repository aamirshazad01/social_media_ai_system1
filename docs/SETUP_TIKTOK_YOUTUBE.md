# TikTok & YouTube Integration Setup Guide

This guide walks you through setting up TikTok and YouTube authentication and posting for the Social Media OS platform.

## Table of Contents
1. [TikTok Setup](#tiktok-setup)
2. [YouTube Setup](#youtube-setup)
3. [Environment Variables](#environment-variables)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## TikTok Setup

### Prerequisites
- TikTok Creator account (not a personal account)
- TikTok Developer account

### Step 1: Create a TikTok Developer App

1. Go to [TikTok Developer Console](https://developer.tiktok.com/console/app)
2. Sign in with your TikTok account
3. Click "Create an app"
4. Fill in app details:
   - **App name**: Name your app (e.g., "Social Media OS")
   - **App category**: Select "Content Management Tool"
   - **App description**: Describe your app's purpose

### Step 2: Configure OAuth

1. In your app settings, go to **Permissions**
2. Request these permissions:
   - `user.info.basic` - Read basic user information
   - `video.upload` - Upload videos to TikTok
   - `video.publish` - Publish videos to the user's account

3. Go to **Settings** tab:
   - Note your **Client Key** (also called App Key)
   - Note your **Client Secret**
   - Set the **Redirect URI** to: `https://your-domain/api/auth/oauth/tiktok/callback`
     - For local development: `http://localhost:3000/api/auth/oauth/tiktok/callback`

### Step 3: Enable Content Posting API

1. In your app, navigate to **Products**
2. Request access to **Content Posting API**
3. Wait for TikTok to approve your request (usually 24-48 hours)

### Step 4: Add Environment Variables

In your `.env` file:

```env
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
```

### TikTok Video Requirements

- **Format**: MP4
- **Aspect Ratio**: 9:16 (vertical/portrait)
- **Duration**: 15-60 seconds
- **Max File Size**: 4 GB
- **Recommended Resolution**: 1080x1920 px
- **Codecs**:
  - Video: H.264
  - Audio: AAC

---

## YouTube Setup

### Prerequisites
- Google Account
- Google Cloud Project (free tier is sufficient)

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click "Select a Project" → "New Project"
   - Name it (e.g., "Social Media OS")
   - Click "Create"

### Step 2: Enable YouTube Data API v3

1. In the Google Cloud Console, search for **"YouTube Data API v3"**
2. Click on it and select **"Enable"**
3. Wait for the API to be enabled

### Step 3: Create OAuth 2.0 Credentials

1. Go to **Credentials** (left sidebar)
2. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. You may need to configure the OAuth consent screen first:
   - Click **"Configure Consent Screen"**
   - Choose **"External"** user type
   - Fill in required fields:
     - App name: "Social Media OS"
     - User support email: your@email.com
     - Developer contact: your@email.com
   - Click **"Save and Continue"**
   - On Scopes page, click **"Add or Remove Scopes"** and add:
     - `.../auth/youtube`
     - `.../auth/youtube.readonly`
   - Click **"Save and Continue"** through remaining pages

4. After consent screen is configured, create OAuth credentials:
   - Go back to **Credentials**
   - Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
   - Application type: **"Web application"**
   - Name: "Social Media OS Web Client"
   - Add Authorized redirect URIs:
     - `https://your-domain/api/auth/oauth/youtube/callback`
     - For local development: `http://localhost:3000/api/auth/oauth/youtube/callback`
   - Click **"Create"**
5. Copy the **Client ID** and **Client Secret**

### Step 4: Set API Quota Limits (Optional)

To avoid unexpected API usage costs:

1. Go to **Quotas** in the left sidebar
2. Search for "YouTube"
3. Set daily quotas if needed (default: 10,000 units/day)
4. Note: Video upload = 1,600 API units

### Step 5: Add Environment Variables

In your `.env` file:

```env
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
```

### YouTube Video Requirements

#### YouTube Shorts
- **Format**: MP4
- **Aspect Ratio**: 9:16 (vertical/portrait)
- **Duration**: 15-60 seconds
- **Max File Size**: 256 GB
- **Recommended Resolution**: 1080x1920 px

#### YouTube Standard Videos
- **Format**: MP4, WebM, MOV, etc.
- **Aspect Ratio**: 16:9 (landscape) or any ratio
- **Duration**: No strict limit
- **Max File Size**: 256 GB (128 GB for unverified accounts)
- **Recommended Resolution**: 1920x1080 px (minimum 426x240)

---

## Environment Variables

Update your `.env` file with the credentials obtained from the setup process:

```env
# TikTok Configuration
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# YouTube Configuration
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret

# Existing variables (should already be set)
NEXT_PUBLIC_APP_URL=https://your-domain.com
ENCRYPTION_MASTER_KEY=your_encryption_key
```

### Environment Variable Descriptions

| Variable | Type | Description |
|----------|------|-------------|
| `TIKTOK_CLIENT_KEY` | Secret | TikTok app client key (from Developer Console) |
| `TIKTOK_CLIENT_SECRET` | Secret | TikTok app client secret (from Developer Console) |
| `YOUTUBE_CLIENT_ID` | Secret | Google OAuth Client ID (from Cloud Console) |
| `YOUTUBE_CLIENT_SECRET` | Secret | Google OAuth Client Secret (from Cloud Console) |
| `NEXT_PUBLIC_APP_URL` | Public | Your application's base URL (required for OAuth callbacks) |

---

## Testing

### Testing TikTok Integration

1. **Connect Account**:
   - Navigate to Settings → Connected Accounts
   - Click "Connect TikTok"
   - You'll be redirected to TikTok's login page
   - Authorize the application
   - You should be redirected back with a success message

2. **Post a Video**:
   - Use the AI Content Strategist to generate content
   - Select TikTok as the platform
   - Generate a video
   - In the Manage Post section, post to TikTok
   - Check your TikTok profile for the posted video

3. **Test Video Specs**:
   ```bash
   # Create a test video (9:16 ratio, 15-60 seconds)
   ffmpeg -f lavfi -i testsrc=s=1080x1920:d=30 -f lavfi -i sine=f=1000:d=30 \
     -c:v libx264 -c:a aac output.mp4
   ```

### Testing YouTube Integration

1. **Connect Account**:
   - Navigate to Settings → Connected Accounts
   - Click "Connect YouTube"
   - You'll be redirected to Google's login page
   - Select your YouTube channel
   - Authorize the application
   - You should be redirected back with a success message

2. **Upload a Video**:
   - Use the AI Content Strategist to generate content
   - Select YouTube as the platform
   - Generate a video
   - In the Manage Post section, upload to YouTube
   - Check your YouTube channel for the uploaded video

3. **Test Video Specs**:
   ```bash
   # Create a test video (9:16 ratio for Shorts)
   ffmpeg -f lavfi -i testsrc=s=1080x1920:d=45 -f lavfi -i sine=f=1000:d=45 \
     -c:v libx264 -c:a aac -preset medium output_shorts.mp4

   # Create a test video (16:9 ratio for standard)
   ffmpeg -f lavfi -i testsrc=s=1920x1080:d=60 -f lavfi -i sine=f=1000:d=60 \
     -c:v libx264 -c:a aac -preset medium output_standard.mp4
   ```

---

## API Endpoints

### TikTok Endpoints

- **OAuth Initiation**: `POST /api/auth/oauth/tiktok`
- **OAuth Callback**: `GET /api/auth/oauth/tiktok/callback`
- **Post Video**: `POST /api/tiktok/post`
  - Body:
    ```json
    {
      "caption": "Your video caption (max 2200 chars)",
      "videoUrl": "https://publicly-accessible-video-url.mp4",
      "videoSize": 52428800
    }
    ```
- **Upload Media**: `POST /api/tiktok/upload-media`
- **Verify Connection**: `POST /api/tiktok/verify`

### YouTube Endpoints

- **OAuth Initiation**: `POST /api/auth/oauth/youtube`
- **OAuth Callback**: `GET /api/auth/oauth/youtube/callback`
- **Upload Video**: `POST /api/youtube/post`
  - Body:
    ```json
    {
      "title": "Video Title (max 100 chars)",
      "description": "Video description (max 5000 chars)",
      "videoBuffer": "base64-encoded-video-file",
      "tags": ["tag1", "tag2"],
      "privacyStatus": "private|public|unlisted"
    }
    ```
- **Upload Media**: `POST /api/youtube/upload-media`
- **Verify Connection**: `POST /api/youtube/verify`

---

## Troubleshooting

### TikTok OAuth Errors

**Error: "Invalid redirect URI"**
- Ensure the redirect URI in your TikTok app settings matches exactly:
  - `https://your-domain/api/auth/oauth/tiktok/callback`
  - No trailing slashes
  - Use HTTPS in production

**Error: "Permission denied"**
- Ensure you've requested the correct scopes in the TikTok Developer Console:
  - `user.info.basic`
  - `video.upload`
  - `video.publish`

**Error: "App not approved for Content Posting API"**
- The Content Posting API access must be approved by TikTok
- This typically takes 24-48 hours
- Check your developer console for approval status

### YouTube OAuth Errors

**Error: "Invalid client"**
- Verify your `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET` are correct
- Check that they're from an OAuth 2.0 credential, not a service account

**Error: "Redirect URI mismatch"**
- Ensure the redirect URI in Google Cloud Console matches exactly:
  - `https://your-domain/api/auth/oauth/youtube/callback`
  - No trailing slashes
  - Use HTTPS in production

**Error: "YouTube Data API not enabled"**
- Go to Google Cloud Console → APIs & Services → Library
- Search for "YouTube Data API v3" and click "Enable"

### Video Upload Errors

**Error: "Invalid video format"**
- Ensure video is MP4 with H.264 video codec and AAC audio codec
- Check aspect ratio requirements (9:16 for TikTok/Shorts, 16:9 for standard YouTube)
- Verify file size is within limits

**Error: "Video too long for TikTok"**
- TikTok videos must be 15-60 seconds
- Use FFmpeg to trim: `ffmpeg -i input.mp4 -ss 0 -t 60 output.mp4`

### Credential Errors

**Error: "Token expired"**
- Tokens are automatically refreshed
- Check that refresh tokens are being stored correctly
- Verify encryption keys are properly configured

**Error: "Credentials not found"**
- Ensure you've connected the platform account in Settings
- Check that credentials are properly encrypted in the database
- Verify workspace encryption keys are set up

---

## Support

For additional help:

1. **TikTok Developer Support**: https://developer.tiktok.com/support
2. **YouTube API Docs**: https://developers.google.com/youtube/v3
3. **Google Cloud Support**: https://cloud.google.com/support

---

## Changelog

### v1.0.0 (Initial Release)
- TikTok OAuth 2.0 integration
- TikTok video upload (9:16 vertical format)
- YouTube OAuth 2.0 integration
- YouTube video upload (9:16 Shorts and 16:9 standard)
- AI-powered content generation for both platforms
- Full credential management and encryption
- Comprehensive audit logging
