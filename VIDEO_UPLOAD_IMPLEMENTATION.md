# Video Upload Support - Implementation Guide

## ✅ Current Status

### Twitter
- ✅ **ALREADY IMPLEMENTED** - Video upload fully supported
- Endpoint: `POST /api/twitter/upload-media`
- Accepts: `mediaType: 'image' | 'video'`
- Max size: 512MB
- Format: MP4

### LinkedIn  
- ✅ **IMPLEMENTED** - Video upload added
- Endpoint: `POST /api/linkedin/upload-media`
- Accepts: `mediaType: 'image' | 'video'`
- Max size: 200MB for video, 10MB for image
- Format: MP4
- Process: Initialize → Upload binary

### Instagram
- ⏳ **PARTIAL** - Needs video container support
- Current: Image-only (2-step process)
- Needed: Video container creation
- Max size: 100MB
- Format: MP4
- Process: Create video container → Publish

### Facebook
- ⏳ **PARTIAL** - Needs video upload API
- Current: Photo posting supported
- Needed: Video upload endpoint
- Max size: 1GB
- Format: MP4, MOV
- Process: Upload video → Post

---

## 🔧 Implementation Details

### 1. Twitter (Already Working)

```typescript
// src/app/api/twitter/upload-media/route.ts
const mediaId = await twitterClient.v1.uploadMedia(buffer, {
  mimeType: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
})
```

**Usage:**
```typescript
const result = await uploadTwitterMedia(credentials, videoData, 'video');
```

---

### 2. LinkedIn (Just Implemented)

**Client Functions Added:**
```typescript
// src/lib/linkedin/client.ts
- initializeVideoUpload()  // Register video upload
- uploadVideoBinary()      // Upload video data
```

**API Endpoint Updated:**
```typescript
// src/app/api/linkedin/upload-media/route.ts
if (mediaType === 'video') {
  const { uploadUrl, asset } = await initializeVideoUpload(...);
  await uploadVideoBinary(uploadUrl, buffer, accessToken);
}
```

**Usage:**
```typescript
const result = await uploadLinkedInMedia(credentials, videoData, 'video');
```

---

### 3. Instagram (Needs Implementation)

**Required Changes:**

#### A. Update Instagram Client
```typescript
// src/lib/instagram/client.ts

/**
 * Create Instagram video container
 */
export async function createVideoContainer(
  igUserId: string,
  accessToken: string,
  videoUrl: string,
  caption: string
): Promise<{ id: string }> {
  const params = new URLSearchParams({
    media_type: 'VIDEO',
    video_url: videoUrl,
    caption: caption,
    access_token: accessToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${igUserId}/media`,
    {
      method: 'POST',
      body: params,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create video container');
  }

  return response.json();
}
```

#### B. Update Instagram Post Endpoint
```typescript
// src/app/api/instagram/post/route.ts

// Check if it's a video
const isVideo = imageUrl.includes('.mp4') || imageUrl.includes('video');

if (isVideo) {
  // Create video container
  const container = await createVideoContainer(
    instagramCreds.userId!,
    instagramCreds.accessToken,
    imageUrl,
    caption
  );
} else {
  // Create image container (existing code)
  const container = await createMediaContainer(...);
}
```

---

### 4. Facebook (Needs Implementation)

**Required Changes:**

#### A. Update Facebook Client
```typescript
// src/lib/facebook/client.ts

/**
 * Upload video to Facebook Page
 */
export async function uploadVideoToFacebookPage(
  pageId: string,
  pageAccessToken: string,
  videoUrl: string,
  description: string
): Promise<{ id: string }> {
  const params = new URLSearchParams({
    file_url: videoUrl,
    description: description,
    access_token: pageAccessToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${pageId}/videos`,
    {
      method: 'POST',
      body: params,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload video');
  }

  return response.json();
}
```

#### B. Update Facebook Post Endpoint
```typescript
// src/app/api/facebook/post/route.ts

// Check if it's a video
if (imageUrl && imageUrl.includes('.mp4')) {
  // Upload video
  result = await uploadVideoToFacebookPage(
    facebookCreds.pageId!,
    facebookCreds.accessToken,
    imageUrl,
    message
  );
} else if (imageUrl) {
  // Upload photo (existing code)
  result = await postPhotoToFacebookPage(...);
}
```

---

## 📝 Service Layer Updates

### Update Service Interfaces

```typescript
// src/services/platforms/linkedinService.ts
export async function uploadLinkedInMedia(
  credentials: LinkedInCredentials,
  mediaData: string,
  mediaType: 'image' | 'video' = 'image'  // Add mediaType parameter
): Promise<{ success: boolean; mediaUrn?: string; error?: string }> {
  const response = await fetch('/api/linkedin/upload-media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mediaData,
      mediaType  // Pass mediaType
    })
  });
  // ... rest of code
}
```

Similar updates needed for:
- `instagramService.ts`
- `facebookService.ts`

---

## 🎨 UI Updates

### Update Publishing Service

```typescript
// src/services/publishingService.ts

export async function publishToSinglePlatform(
  platform: Platform,
  content: string,
  mediaUrl?: string,
  mediaType?: 'image' | 'video'  // Add mediaType parameter
): Promise<PublishResult> {
  
  switch (platform) {
    case 'twitter': {
      if (mediaUrl) {
        const mediaResult = await uploadTwitterMedia(
          credentials,
          mediaUrl,
          mediaType || 'image'  // Pass mediaType
        );
      }
      break;
    }
    
    case 'linkedin': {
      if (mediaUrl) {
        const mediaResult = await uploadLinkedInMedia(
          credentials,
          mediaUrl,
          mediaType || 'image'  // Pass mediaType
        );
      }
      break;
    }
    
    // Similar for Instagram and Facebook
  }
}
```

### Update Post Type

```typescript
// src/types/index.ts

export interface Post {
  // ... existing fields
  generatedImage?: string;
  generatedVideoUrl?: string;
  mediaType?: 'image' | 'video';  // Add this field
}
```

---

## 🧪 Testing Checklist

### For Each Platform:

#### Twitter
- [ ] Upload video (< 512MB)
- [ ] Post tweet with video
- [ ] Verify video plays on Twitter

#### LinkedIn
- [ ] Upload video (< 200MB)
- [ ] Post update with video
- [ ] Verify video plays on LinkedIn

#### Instagram
- [ ] Upload video (< 100MB)
- [ ] Post with video
- [ ] Verify video plays on Instagram

#### Facebook
- [ ] Upload video (< 1GB)
- [ ] Post with video
- [ ] Verify video plays on Facebook Page

---

## 📊 Video Specifications

| Platform | Max Size | Formats | Max Duration | Aspect Ratio |
|----------|----------|---------|--------------|--------------|
| **Twitter** | 512MB | MP4, MOV | 2:20 | 1:1 to 16:9 |
| **LinkedIn** | 200MB | MP4 | 10 min | 1:2.4 to 2.4:1 |
| **Instagram** | 100MB | MP4, MOV | 60 sec | 4:5 to 16:9 |
| **Facebook** | 1GB | MP4, MOV | 240 min | 9:16 to 16:9 |

---

## ⚠️ Important Notes

### 1. Video Processing Time
- Videos take longer to process than images
- Instagram/Facebook may need 30-60 seconds to process
- Implement status checking for video processing

### 2. Storage Considerations
- Videos are much larger than images
- Supabase free tier: 1GB storage
- Consider video compression before upload
- Or use external video hosting (YouTube, Vimeo)

### 3. Rate Limits
- Video uploads count toward API rate limits
- May need to implement queue system for multiple videos

---

## 🚀 Quick Implementation Priority

### Phase 1 (Done)
- ✅ Twitter video support (already working)
- ✅ LinkedIn video support (just implemented)

### Phase 2 (Next)
- ⏳ Instagram video containers
- ⏳ Facebook video upload

### Phase 3 (Future)
- ⏳ Video compression
- ⏳ Video thumbnail generation
- ⏳ Processing status checks
- ⏳ Video preview in UI

---

## 💡 Usage Example

```typescript
// Upload and post video to LinkedIn
const videoData = "data:video/mp4;base64,...";

// 1. Upload video
const uploadResult = await uploadLinkedInMedia(
  credentials,
  videoData,
  'video'  // Specify video type
);

// 2. Post with video
if (uploadResult.success) {
  const postResult = await postToLinkedIn(credentials, {
    text: "Check out this video!",
    visibility: 'PUBLIC',
    mediaUrn: uploadResult.mediaUrn
  });
}
```

---

## 📚 API Documentation

- **Twitter**: https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media
- **LinkedIn**: https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/video-posts
- **Instagram**: https://developers.facebook.com/docs/instagram-api/guides/content-publishing#video-posts
- **Facebook**: https://developers.facebook.com/docs/video-api/guides/publishing

---

## ✅ Summary

**Current Status:**
- ✅ Twitter: Video fully supported
- ✅ LinkedIn: Video just implemented
- ⏳ Instagram: Needs video container support
- ⏳ Facebook: Needs video upload API

**To Complete:**
1. Add Instagram video container creation
2. Add Facebook video upload endpoint
3. Update service layers with mediaType parameter
4. Update UI to detect and pass video type
5. Add video-specific validation

**Estimated Time:**
- Instagram video: 1-2 hours
- Facebook video: 1-2 hours
- Testing: 1 hour
- **Total: 3-5 hours**

---

**Video support is 50% complete (2/4 platforms)! Twitter and LinkedIn are ready to post videos! 🎥**
