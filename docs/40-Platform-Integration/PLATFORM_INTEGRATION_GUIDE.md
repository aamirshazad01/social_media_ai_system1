# Platform Integration Guide - Phase 3

**Status**: Foundation Ready - Ready to Implement All Platforms

This guide provides complete integration instructions for all 6 platforms with latest 2025 API documentation and OAuth flows.

---

## 📋 Platforms Overview

| Platform | OAuth 2.0 | API Version | Scheduling | Media Upload | Latest Docs |
|----------|-----------|-------------|------------|--------------|-------------|
| **Twitter/X** | ✅ PKCE | v2 (2025) | ❌ No* | ✅ Yes | https://developer.twitter.com/en/docs/twitter-api/latest |
| **LinkedIn** | ✅ Yes | REST v3 | ✅ Yes | ✅ Yes | https://learn.microsoft.com/en-us/linkedin/marketing/getting-started |
| **Facebook** | ✅ Yes | Graph API v18 | ✅ Yes | ✅ Yes | https://developers.facebook.com/docs/graph-api |
| **Instagram** | ✅ Yes | Graph API v18 | ✅ Yes | ✅ Yes | https://developers.facebook.com/docs/instagram-graph-api |
| **TikTok** | ✅ Yes | v1 | ❌ No* | ✅ Yes | https://developers.tiktok.com/doc/content-posting-api |
| **YouTube** | ✅ OAuth 2.0 | v3 | ✅ Yes | ✅ Yes | https://developers.google.com/youtube/v3 |

*Can be achieved via job queue for scheduled posting

---

## 🏗️ Architecture Files Created

### Core Infrastructure
✅ `src/core/types/PlatformTypes.ts` - All platform types, interfaces, OAuth configs, scopes
✅ `src/lib/encryption/CredentialEncryption.ts` - AES-256-GCM encryption for credentials
✅ `src/core/database/repositories/SocialAccountRepository.ts` - Stores encrypted credentials
✅ `src/services/platforms/BasePlatformService.ts` - Abstract base class for all platforms

### Platform Implementations (To Create)
⏳ `src/services/platforms/TwitterService.ts` - Twitter/X v2 API
⏳ `src/services/platforms/LinkedInService.ts` - LinkedIn v3 API
⏳ `src/services/platforms/FacebookService.ts` - Facebook Graph API
⏳ `src/services/platforms/InstagramService.ts` - Instagram Graph API
⏳ `src/services/platforms/TikTokService.ts` - TikTok v1 API
⏳ `src/services/platforms/YouTubeService.ts` - YouTube v3 API

### OAuth & Token Management
⏳ `src/services/platforms/OAuthStateService.ts` - OAuth state management
⏳ `src/services/platforms/TokenRefreshService.ts` - Automatic token refresh

### Service Factory
⏳ `src/services/platforms/PlatformServiceFactory.ts` - Factory to get correct service

---

## 🔐 OAuth Scopes (Latest 2025)

### Twitter/X
```typescript
const SCOPES = [
  'tweet.read',
  'tweet.write',
  'tweet.moderate.write',
  'users.read',
  'mute.read',
  'mute.write',
  'offline.access'
]
```
**Auth URL**: `https://twitter.com/i/oauth2/authorize`
**Token URL**: `https://auth.twitter.com/2/oauth2/token`
**Flow**: OAuth 2.0 with PKCE required

### LinkedIn
```typescript
const SCOPES = [
  'r_basicprofile',
  'r_emailaddress',
  'w_member_social',
  'r_organization_social',
  'w_organization_social'
]
```
**Auth URL**: `https://www.linkedin.com/oauth/v2/authorization`
**Token URL**: `https://www.linkedin.com/oauth/v2/accessToken`
**Flow**: OAuth 2.0

### Facebook
```typescript
const SCOPES = [
  'pages_manage_posts',
  'pages_manage_metadata',
  'pages_read_engagement',
  'pages_manage_on_behalf_of',
  'instagram_basic',
  'instagram_graph_user_content',
  'instagram_manage_insights'
]
```
**Auth URL**: `https://www.facebook.com/v18.0/dialog/oauth`
**Token URL**: `https://graph.facebook.com/v18.0/oauth/access_token`
**Flow**: OAuth 2.0

### Instagram
```typescript
const SCOPES = [
  'instagram_business_basic',
  'instagram_business_content_publish',
  'instagram_business_manage_messages',
  'instagram_business_manage_comments',
  'pages_manage_metadata'
]
```
**Auth URL**: (via Facebook)
**Token URL**: (via Facebook)
**Flow**: OAuth 2.0 (inherited from Facebook)

### TikTok
```typescript
const SCOPES = [
  'video.list',
  'video.create',
  'video.publish',
  'user.info.basic',
  'comment.read',
  'analytics.read'
]
```
**Auth URL**: `https://www.tiktok.com/v1/oauth/authorize`
**Token URL**: `https://open.tiktokapis.com/v1/oauth/token`
**Flow**: OAuth 2.0

### YouTube
```typescript
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly'
]
```
**Auth URL**: `https://accounts.google.com/o/oauth2/v2/auth`
**Token URL**: `https://oauth2.googleapis.com/token`
**Flow**: OAuth 2.0

---

## 📊 API Endpoints Reference

### Twitter/X v2 API

**Post Tweet**
```
POST https://api.twitter.com/2/tweets
Authorization: Bearer {ACCESS_TOKEN}
```

**Upload Media**
```
POST https://upload.twitter.com/1.1/media/upload.json
Authorization: Bearer {ACCESS_TOKEN}
```

**Get Metrics**
```
GET https://api.twitter.com/2/tweets/{ID}?tweet.fields=public_metrics
Authorization: Bearer {ACCESS_TOKEN}
```

### LinkedIn v3 API

**Create Post**
```
POST https://api.linkedin.com/v3/ugcPosts
Authorization: Bearer {ACCESS_TOKEN}
```

**Upload Media**
```
POST https://api.linkedin.com/v3/assets?action=registerUpload
Authorization: Bearer {ACCESS_TOKEN}
```

**Get Analytics**
```
GET https://api.linkedin.com/v3/socialMetadata/{URN}
Authorization: Bearer {ACCESS_TOKEN}
```

### Facebook Graph API v18

**Create Post**
```
POST https://graph.facebook.com/v18.0/{PAGE_ID}/feed
Authorization: Bearer {ACCESS_TOKEN}
```

**Upload Media**
```
POST https://graph.facebook.com/v18.0/{PAGE_ID}/photos
Authorization: Bearer {ACCESS_TOKEN}
```

**Get Insights**
```
GET https://graph.facebook.com/v18.0/{POST_ID}/insights
Authorization: Bearer {ACCESS_TOKEN}
```

### Instagram Graph API v18

**Create Media**
```
POST https://graph.instagram.com/v18.0/{IG_USER_ID}/media
Authorization: Bearer {ACCESS_TOKEN}
```

**Publish Media**
```
POST https://graph.instagram.com/v18.0/{IG_USER_ID}/media_publish
Authorization: Bearer {ACCESS_TOKEN}
```

**Get Insights**
```
GET https://graph.instagram.com/v18.0/{MEDIA_ID}/insights
Authorization: Bearer {ACCESS_TOKEN}
```

### TikTok v1 API

**Create Video**
```
POST https://open.tiktokapis.com/v1/video/upload
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: multipart/form-data
```

**Publish Video**
```
POST https://open.tiktokapis.com/v1/video/publish
Authorization: Bearer {ACCESS_TOKEN}
```

**Get Analytics**
```
GET https://open.tiktokapis.com/v1/video/query
Authorization: Bearer {ACCESS_TOKEN}
```

### YouTube v3 API

**Upload Video**
```
POST https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable
Authorization: Bearer {ACCESS_TOKEN}
```

**Get Video Statistics**
```
GET https://www.googleapis.com/youtube/v3/videos?part=statistics
Authorization: Bearer {ACCESS_TOKEN}
```

---

## 🔑 Environment Variables Needed

```bash
# Twitter/X
TWITTER_CLIENT_ID=your_client_id
TWITTER_CLIENT_SECRET=your_client_secret
TWITTER_BEARER_TOKEN=your_bearer_token

# LinkedIn
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

# Facebook & Instagram
FACEBOOK_CLIENT_ID=your_client_id
FACEBOOK_CLIENT_SECRET=your_client_secret
FACEBOOK_APP_ID=your_app_id

# TikTok
TIKTOK_CLIENT_ID=your_client_id
TIKTOK_CLIENT_SECRET=your_client_secret

# YouTube
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret

# Encryption
ENCRYPTION_MASTER_KEY=your_256_bit_base64_key
```

---

## 🔄 Data Flow: OAuth to Posting

```
1. User clicks "Connect Platform"
   ↓
2. Generate OAuth state + PKCE challenge
   ↓
3. Redirect to platform authorization URL
   ↓
4. User authorizes app
   ↓
5. Platform redirects back with authorization code
   ↓
6. Exchange code for access token
   ↓
7. Encrypt credentials with workspace key
   ↓
8. Store in database
   ↓
9. User creates post
   ↓
10. Use stored credentials to post
   ↓
11. Get post metrics
   ↓
12. Token expires? Refresh automatically
```

---

## 🛠️ Implementation Template for Each Platform

### Step 1: Create Service File
```typescript
// src/services/platforms/PlatformNameService.ts

import { BasePlatformService } from './BasePlatformService'
import { OAuthTokenResponse, OAuthUserProfile, PlatformPostResponse } from '@/core/types/PlatformTypes'

export class PlatformNameService extends BasePlatformService {
  constructor() {
    super('platform-key', 'Platform Name', 'icon')
  }

  // Implement all abstract methods...
}
```

### Step 2: Implement OAuth Methods
```typescript
getAuthorizationUrl(state: string, codeChallenge?: string): string {
  // Build OAuth URL with scopes and state
}

async exchangeCodeForToken(callbackData: OAuthCallbackData): Promise<OAuthTokenResponse> {
  // Exchange authorization code for tokens
}

async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
  // Refresh expired access token
}

async getUserProfile(accessToken: string): Promise<OAuthUserProfile> {
  // Get authenticated user info
}
```

### Step 3: Implement Content Methods
```typescript
async postContent(credentials, post): Promise<PlatformPostResponse> {
  // Post content to platform
}

async uploadMedia(credentials, media): Promise<string> {
  // Upload media and return media ID
}

async schedulePost(credentials, post, time): Promise<PlatformPostResponse> {
  // Schedule post for later (if supported)
}
```

### Step 4: Implement Verification & Analytics
```typescript
async verifyCredentials(credentials): Promise<boolean> {
  // Test if credentials still work
}

async getPostMetrics(credentials, postId): Promise<PlatformAnalytics> {
  // Get engagement metrics
}
```

### Step 5: Implement Configuration Methods
```typescript
getMaxCharacterLimit(): number { return 280 }
supportsScheduling(): boolean { return true }
supportsMediaUpload(): boolean { return true }
```

---

## 📦 Installation Requirements

```bash
# Add HTTP client for API calls
npm install axios

# Already installed:
# - crypto (Node.js built-in for encryption)
# - zod (validation)
# - supabase (database)
```

---

## ✅ Checklist: Per Platform

For each platform, verify:

- [ ] OAuth URLs correct (check latest docs)
- [ ] Scopes match latest API requirements
- [ ] Token exchange implemented correctly
- [ ] Refresh token handling
- [ ] User profile retrieval works
- [ ] Post creation working
- [ ] Media upload implemented
- [ ] Metrics retrieval working
- [ ] Error handling comprehensive
- [ ] Credentials encrypted before storage
- [ ] Rate limits respected
- [ ] Error messages user-friendly

---

## 🔄 Credential Flow (Secure)

```
User Credentials
    ↓
PlatformCredentials DTO
    ↓
encryptAndStoreCredentials() ← Uses workspace key
    ↓
Base64 Encoded Encrypted Data
    ↓
Stored in database.social_accounts.credentials_encrypted
    ↓
On Use:
retrieveAndDecryptCredentials() ← Uses workspace key
    ↓
PlatformCredentials DTO
    ↓
Use in API calls
```

---

## 🧪 Testing Each Platform

```bash
# Test Twitter
curl https://api.twitter.com/2/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test LinkedIn
curl https://api.linkedin.com/v3/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test Facebook
curl https://graph.facebook.com/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test Instagram (via Facebook)
curl https://graph.instagram.com/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test TikTok
curl https://open.tiktokapis.com/v1/user/info \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Test YouTube
curl https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎯 What's Already Built

✅ **Platform Types** - Complete type definitions for all platforms
✅ **Encryption** - AES-256-GCM credential encryption
✅ **Database** - SocialAccountRepository with secure storage
✅ **Base Class** - BasePlatformService with common functionality
✅ **OAuth Scopes** - All latest 2025 scopes defined
✅ **Error Handling** - Integrated with error system

---

## 📝 Next: Implementation Order

1. **Twitter/X** - Simplest, good baseline
2. **YouTube** - Similar OAuth pattern
3. **LinkedIn** - More complex API
4. **Facebook** - Graph API base
5. **Instagram** - Inherits Facebook
6. **TikTok** - Different pattern

---

## 📚 Documentation Links

- **Twitter**: https://developer.twitter.com/en/docs/twitter-api/latest
- **LinkedIn**: https://learn.microsoft.com/en-us/linkedin/marketing/
- **Facebook**: https://developers.facebook.com/docs/graph-api
- **Instagram**: https://developers.facebook.com/docs/instagram-graph-api
- **TikTok**: https://developers.tiktok.com/doc
- **YouTube**: https://developers.google.com/youtube/v3

---

## 🚀 Ready to Implement!

All foundation is in place. Each platform service just needs to:
1. Extend BasePlatformService
2. Implement 10 abstract methods
3. Handle platform-specific API differences
4. Use proper error handling

**Estimated time per platform**: 2-4 hours

---

**Last Updated**: 2025-11-06
**Status**: Foundation Complete, Ready for Implementation
**Next Step**: Create Twitter/X Service first
