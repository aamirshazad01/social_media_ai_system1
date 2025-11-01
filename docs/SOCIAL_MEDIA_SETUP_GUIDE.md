# Social Media Platform Integration Guide

This guide explains how to connect your social media accounts to the Social Media OS and set up production-ready integrations.

## Table of Contents
- [Overview](#overview)
- [Security Considerations](#security-considerations)
- [Twitter/X Setup](#twitterx-setup)
- [LinkedIn Setup](#linkedin-setup)
- [Facebook Setup](#facebook-setup)
- [Instagram Setup](#instagram-setup)
- [Backend Setup (Recommended for Production)](#backend-setup-recommended-for-production)
- [Testing Connections](#testing-connections)

---

## Overview

The Social Media OS now supports direct publishing to Twitter/X, LinkedIn, Facebook, and Instagram. To connect these platforms, you'll need to:

1. Create developer accounts on each platform
2. Register your application
3. Obtain API credentials (API keys, access tokens, etc.)
4. Enter credentials in the "Connected Accounts" section of the app

**Important:** Currently, credentials are stored in your browser's localStorage with basic obfuscation. For production use, implement a secure backend to store and manage credentials.

---

## Security Considerations

### Current Implementation (Development)
- Credentials are stored in browser localStorage with basic obfuscation
- Suitable for development and testing only
- **NOT recommended for production use**

### Production Recommendations
1. **Backend Server**: Set up a Node.js/Express backend to:
   - Store encrypted credentials in a database
   - Handle OAuth flows server-side
   - Proxy API requests to avoid exposing credentials
   - Implement rate limiting and error handling

2. **Environment Variables**: Store sensitive keys in environment variables
3. **HTTPS**: Always use HTTPS in production
4. **Token Refresh**: Implement automatic token refresh for OAuth tokens
5. **Encryption**: Use proper encryption (AES-256) for stored credentials

---

## Twitter/X Setup

### Step 1: Create a Twitter Developer Account
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign in with your Twitter account
3. Apply for a developer account (may require approval)

### Step 2: Create an App
1. Once approved, go to the Developer Portal
2. Click "Create App" or "Create Project"
3. Fill in app details:
   - **App Name**: Your Social Media OS
   - **Description**: Social media management tool
   - **Website URL**: Your website or localhost
   - **Callback URLs**: `http://localhost:3000/callback` (for OAuth)

### Step 3: Generate API Keys
1. Go to your app's "Keys and tokens" section
2. You'll need:
   - **API Key** (Consumer Key)
   - **API Secret** (Consumer Secret)
   - **Access Token**
   - **Access Token Secret**
3. Click "Generate" to create access tokens
4. **Important**: Save these credentials immediately - you won't be able to see them again

### Step 4: Set Permissions
1. In app settings, set permissions to "Read and Write"
2. Save changes

### Step 5: Connect in App
1. Go to "Connected Accounts" in Social Media OS
2. Click "Connect" for Twitter/X
3. Enter all four credentials
4. Click "Connect Account"

### API Limits
- Free tier: ~1,500 tweets per month
- Basic tier ($100/month): ~3,000 tweets per month
- Check [Twitter API pricing](https://developer.twitter.com/en/products/twitter-api) for current limits

---

## LinkedIn Setup

### Step 1: Create LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Sign in with your LinkedIn account
3. Click "Create App"
4. Fill in required information:
   - **App Name**: Your Social Media OS
   - **LinkedIn Page**: Associate with your company page
   - **Privacy Policy URL**: Your privacy policy
   - **App Logo**: Upload a logo

### Step 2: Request API Products
1. Go to "Products" tab in your app
2. Request access to:
   - **Share on LinkedIn**: For posting content
   - **Sign In with LinkedIn**: For authentication
3. Wait for approval (usually instant for Share on LinkedIn)

### Step 3: Get Credentials
1. Go to "Auth" tab
2. Copy your:
   - **Client ID**
   - **Client Secret**
3. Add redirect URL: `http://localhost:3000/callback`

### Step 4: Generate Access Token
LinkedIn uses OAuth 2.0. You have two options:

#### Option A: Use LinkedIn's OAuth Tool
1. Use [LinkedIn OAuth Test Tool](https://www.linkedin.com/developers/tools/oauth)
2. Follow the OAuth flow to get an access token

#### Option B: Implement OAuth Flow (Recommended for Production)
```javascript
// Redirect user to LinkedIn authorization
const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=w_member_social`;

// Exchange authorization code for access token
const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}`
});
```

### Step 5: Connect in App
1. Go to "Connected Accounts"
2. Click "Connect" for LinkedIn
3. Enter Client ID, Client Secret, and Access Token
4. Click "Connect Account"

### API Limits
- No hard limits for Share API
- Rate limiting applies (throttled requests)
- Check [LinkedIn API docs](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/rate-limits) for details

---

## Facebook Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Select "Business" as app type
4. Fill in app details

### Step 2: Add Products
1. In your app dashboard, add "Facebook Login"
2. Add "Pages" product for page management

### Step 3: Get App Credentials
1. Go to "Settings" → "Basic"
2. Copy your:
   - **App ID**
   - **App Secret**

### Step 4: Generate Page Access Token
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Select permissions:
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_show_list`
5. Copy the generated token

### Step 5: Get Long-Lived Token (Optional but Recommended)
```bash
# Exchange short-lived token for long-lived token (60 days)
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_LIVED_TOKEN}"
```

### Step 6: Get Page Access Token
```bash
# Get list of pages you manage
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token={USER_ACCESS_TOKEN}"

# Copy the page access token and page ID from the response
```

### Step 7: Connect in App
1. Go to "Connected Accounts"
2. Click "Connect" for Facebook
3. Enter App ID, App Secret, Page Access Token, and Page ID
4. Click "Connect Account"

### API Limits
- Rate limits vary by endpoint
- Check [Facebook Platform Rate Limits](https://developers.facebook.com/docs/graph-api/overview/rate-limiting) for details

---

## Instagram Setup

### Prerequisites
- Instagram Business Account (not personal account)
- Facebook Page connected to your Instagram account
- Facebook app with Instagram Graph API access

### Step 1: Convert to Business Account
1. In Instagram app, go to Settings
2. Select "Account"
3. Select "Switch to Professional Account"
4. Choose "Business"
5. Connect to your Facebook Page

### Step 2: Use Facebook App
1. Use the same Facebook app from previous section
2. Add "Instagram Graph API" product to your app

### Step 3: Get Instagram Account ID
```bash
# Get Instagram Business Account ID
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account&access_token={PAGE_ACCESS_TOKEN}"
```

### Step 4: Get Access Token
- Use the Page Access Token from Facebook setup
- This token works for both Facebook and Instagram APIs

### Step 5: Connect in App
1. Go to "Connected Accounts"
2. Click "Connect" for Instagram
3. Enter Access Token and User ID (optional)
4. Click "Connect Account"

### Publishing Requirements
- Instagram requires media (image or video) for all posts
- Images: JPG, PNG, max 8MB
- Videos: MP4, max 100MB, 3-60 seconds
- Aspect ratio: 1.91:1 to 4:5

### API Limits
- Content Publishing API: 25 posts per 24 hours per user
- Check [Instagram API limits](https://developers.facebook.com/docs/instagram-api/overview#rate-limiting) for details

---

## Backend Setup (Recommended for Production)

For production deployment, implement a secure backend to handle API credentials and OAuth flows.

### Option 1: Node.js/Express Backend

#### Install Dependencies
```bash
npm install express cors dotenv crypto
```

#### Create Backend Server (`server.js`)
```javascript
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Store credentials (in production, use a database)
const credentialsStore = new Map();

// Save credentials endpoint
app.post('/api/credentials', (req, res) => {
  const { platform, credentials } = req.body;
  const encrypted = encrypt(JSON.stringify(credentials));
  credentialsStore.set(platform, encrypted);
  res.json({ success: true });
});

// Get credentials endpoint
app.get('/api/credentials/:platform', (req, res) => {
  const { platform } = req.params;
  const encrypted = credentialsStore.get(platform);
  if (!encrypted) {
    return res.status(404).json({ error: 'Credentials not found' });
  }
  const decrypted = JSON.parse(decrypt(encrypted));
  res.json({ credentials: decrypted });
});

// Twitter post endpoint
app.post('/api/twitter/post', async (req, res) => {
  // Implement Twitter API call using OAuth 1.0a
  // Use libraries like 'twitter-api-v2'
  res.json({ success: true, tweetId: '123' });
});

// LinkedIn post endpoint
app.post('/api/linkedin/post', async (req, res) => {
  // Implement LinkedIn API call
  res.json({ success: true, postId: '456' });
});

// Facebook post endpoint
app.post('/api/facebook/post', async (req, res) => {
  // Implement Facebook Graph API call
  res.json({ success: true, postId: '789' });
});

// Instagram post endpoint
app.post('/api/instagram/post', async (req, res) => {
  // Implement Instagram Graph API call
  res.json({ success: true, postId: '101' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
```

#### Environment Variables (`.env`)
```env
ENCRYPTION_KEY=your-32-byte-encryption-key-here
PORT=5000
```

#### Update Frontend to Use Backend
Update the service files to call your backend instead of storing credentials locally.

### Option 2: Serverless Functions

Deploy serverless functions on Vercel, Netlify, or AWS Lambda to handle API calls securely.

---

## Testing Connections

### Test Publishing
1. Create a test post in the app
2. Select connected platforms
3. Click "Publish Now"
4. Check each platform to verify the post appeared

### Troubleshooting

#### Common Issues

**"Access token expired"**
- Regenerate access token on the platform
- Update credentials in the app
- Implement token refresh for OAuth tokens

**"Permission denied"**
- Check app permissions on developer portal
- Ensure you requested necessary scopes/permissions
- For Facebook/Instagram, verify page roles

**"Rate limit exceeded"**
- Wait for rate limit to reset
- Implement rate limiting in your backend
- Upgrade to higher API tier if available

**"CORS errors"**
- API calls must be made from backend, not frontend
- Implement backend proxy for API requests

---

## Next Steps

1. **Implement Backend**: Set up a secure backend server
2. **OAuth Flows**: Implement proper OAuth 2.0 flows for LinkedIn/Facebook/Instagram
3. **Token Management**: Auto-refresh expired tokens
4. **Error Handling**: Add comprehensive error handling
5. **Analytics**: Track publishing success/failure rates
6. **Scheduling**: Integrate with scheduling system for auto-publishing
7. **Webhooks**: Set up webhooks for post engagement notifications

---

## Resources

### Documentation
- [Twitter API v2 Docs](https://developer.twitter.com/en/docs/twitter-api)
- [LinkedIn Share API Docs](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin)
- [Facebook Graph API Docs](https://developers.facebook.com/docs/graph-api)
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)

### NPM Libraries
- `twitter-api-v2` - Twitter API client
- `linkedin-api` - LinkedIn API client
- `fb` - Facebook Graph API client
- `instagram-private-api` - Instagram API client

### Security
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

---

## Support

If you encounter issues:
1. Check platform status pages for API outages
2. Review API documentation for changes
3. Check developer console for detailed error messages
4. Test credentials using official API tools/explorers

---

**Last Updated**: November 2025
