# TikTok & Facebook Improvement Plan

## Executive Summary

**TikTok Status:** ⚠️ **67% Complete** - Backend exists, frontend missing
**Facebook Status:** ✅ **95% Complete** - Fully functional, minor improvements needed

---

## 🎯 TikTok - Critical Gaps to Fix

### **Problem Analysis**

#### ✅ What's Working:
- Backend API endpoint: `/api/tiktok/post` (fully implemented)
- OAuth flow: `/api/auth/oauth/tiktok/callback` (fully implemented)
- Database credentials storage (encrypted)
- UI connection button (visible in settings)

#### ❌ What's Missing:
1. **Frontend Service Layer** - `src/services/platforms/tiktokService.ts` doesn't exist
2. **Publishing Integration** - Not integrated in `publishingService.ts`
3. **Verify Endpoint** - No `/api/tiktok/verify` route

#### 💥 Impact:
- Users can connect TikTok account ✅
- Users CANNOT publish videos to TikTok ❌
- No way to verify connection status ❌

---

## 📋 TikTok - Step-by-Step Fix Plan

### **Phase 1: Create Frontend Service (2-3 hours)**

**Step 1.1: Create tiktokService.ts**
- **Location:** `src/services/platforms/tiktokService.ts`
- **Required Functions:**
  ```typescript
  1. startTikTokAuth() - Redirect to OAuth
  2. verifyTikTokCredentials() - Check connection status
  3. postToTikTok() - Publish video with caption
  4. uploadTikTokVideo() - Upload video to storage
  ```

**Step 1.2: Update publishingService.ts**
- **Location:** `src/services/publishingService.ts`
- **Required Changes:**
  - Import tiktokService
  - Add `case 'tiktok':` in switch statement (line 125)
  - Handle video upload + posting logic

**Step 1.3: Create Verify API Route**
- **Location:** `src/app/api/tiktok/verify/route.ts`
- **Purpose:** Check if TikTok credentials are valid
- **Pattern:** Copy from Facebook verify endpoint

---

### **Phase 2: Testing (1 hour)**

**Test Checklist:**
- [ ] OAuth connection works (open settings → connect TikTok)
- [ ] Verify shows "Connected" status
- [ ] Create post with TikTok selected
- [ ] Upload video
- [ ] Publish to TikTok
- [ ] Check post appears in history
- [ ] Verify video URL is accessible

---

## 📊 Facebook - Minor Improvements

### **Current Status**

#### ✅ What's Working Perfectly:
- All 6 API endpoints operational
- Frontend service complete (facebookService.ts)
- OAuth flow working
- Post publishing working
- Media upload working
- Verification working

#### 🟡 Minor Issues Found:

**1. Console Logging (Security Issue)**
- **File:** `src/services/platforms/facebookService.ts`
- **Lines:** 42, 77, 122, 160, 198
- **Issue:** 5 console.error() statements expose errors in production
- **Fix:** Replace with structured logging

**2. API Version Hardcoded**
- **File:** `src/services/platforms/facebookService.ts`
- **Line:** 8 - `const FACEBOOK_API_BASE = 'https://graph.facebook.com/v24.0'`
- **Issue:** v24.0 may become deprecated
- **Fix:** Move to environment variable

**3. Video Upload Not Implemented**
- **Function:** `uploadFacebookPhoto()` only handles images
- **Missing:** Video upload capability
- **Fix:** Add video upload support

---

## 🚀 Implementation Order (Recommended)

### **Priority 1: TikTok Service (URGENT)**
**Time:** 2-3 hours
**Impact:** Makes TikTok fully functional

**Files to Create/Modify:**
1. ✅ Create `src/services/platforms/tiktokService.ts` (NEW)
2. ✅ Update `src/services/publishingService.ts` (MODIFY)
3. ✅ Create `src/app/api/tiktok/verify/route.ts` (NEW)

---

### **Priority 2: Facebook Improvements (OPTIONAL)**
**Time:** 1-2 hours
**Impact:** Improves code quality and future-proofs

**Files to Modify:**
1. ✅ Update `src/services/platforms/facebookService.ts` (logging)
2. ✅ Add video upload support
3. ✅ Externalize API version

---

## 📝 Detailed Implementation Guide

### **TikTok Service Template**

```typescript
// src/services/platforms/tiktokService.ts
import { TikTokCredentials } from '@/types';

export interface TikTokPostOptions {
  caption: string;
  videoUrl: string;
  videoSize: number;
}

/**
 * Start TikTok OAuth flow
 */
export async function startTikTokAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth/oauth/tiktok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start TikTok authentication');
    }

    const { url } = await response.json();
    window.location.href = url; // Redirect to TikTok OAuth

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

/**
 * Verify TikTok credentials
 */
export async function verifyTikTokCredentials(credentials: TikTokCredentials): Promise<{
  success: boolean;
  username?: string;
  error?: string
}> {
  try {
    const response = await fetch('/api/tiktok/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Verification failed' };
    }

    const data = await response.json();
    return {
      success: data.connected,
      username: data.username
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Post video to TikTok
 */
export async function postToTikTok(
  credentials: TikTokCredentials,
  options: TikTokPostOptions
): Promise<{ success: boolean; videoId?: string; url?: string; error?: string }> {
  try {
    // Validate caption length
    if (!options.caption || options.caption.length > 2200) {
      return { success: false, error: 'Caption must be between 1-2200 characters' };
    }

    if (!options.videoUrl) {
      return { success: false, error: 'Video URL is required' };
    }

    // Call backend API
    const response = await fetch('/api/tiktok/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption: options.caption,
        videoUrl: options.videoUrl,
        videoSize: options.videoSize || 0
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to post to TikTok');
    }

    const data = await response.json();
    return {
      success: true,
      videoId: data.data.videoId,
      url: data.data.shareUrl
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post'
    };
  }
}

/**
 * Upload video to storage (returns public URL)
 */
export async function uploadTikTokVideo(
  credentials: TikTokCredentials,
  videoData: string  // base64 or blob URL
): Promise<{ success: boolean; videoUrl?: string; videoSize?: number; error?: string }> {
  try {
    // TODO: Implement video upload to Supabase Storage
    // For now, return the videoData as-is if it's already a URL
    if (videoData.startsWith('http')) {
      return {
        success: true,
        videoUrl: videoData,
        videoSize: 0
      };
    }

    // Upload to storage
    const response = await fetch('/api/tiktok/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoData })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload video');
    }

    const data = await response.json();
    return {
      success: true,
      videoUrl: data.videoUrl,
      videoSize: data.videoSize
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}
```

---

### **publishingService.ts Update**

**Add this case in the switch statement (after line 123):**

```typescript
case 'tiktok': {
  if (!mediaUrl) {
    return {
      platform,
      success: false,
      error: 'TikTok requires a video to post'
    };
  }

  // Upload video to get public URL
  const videoResult = await uploadTikTokVideo(emptyCredentials as TikTokCredentials, mediaUrl);
  if (!videoResult.success || !videoResult.videoUrl) {
    return {
      platform,
      success: false,
      error: videoResult.error || 'Failed to upload video'
    };
  }

  result = await postToTikTok(emptyCredentials as TikTokCredentials, {
    caption: content,
    videoUrl: videoResult.videoUrl,
    videoSize: videoResult.videoSize || 0
  });
  break;
}
```

**Add import at top of file:**
```typescript
import { postToTikTok, uploadTikTokVideo } from './platforms/tiktokService';
```

---

### **TikTok Verify API Template**

```typescript
// src/app/api/tiktok/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { CredentialService } from '@/services/database'
import { TikTokCredentials } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('workspace_id')
      .eq('id', user.id)
      .maybeSingle()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const workspaceId = (userData as any).workspace_id

    const credentialService = new CredentialService(supabase)
    const credentials = await credentialService.getPlatformCredentials(workspaceId, 'tiktok')

    if (!credentials) {
      return NextResponse.json({
        connected: false,
        error: 'TikTok not connected'
      })
    }

    const tikTokCreds = credentials as TikTokCredentials

    return NextResponse.json({
      connected: true,
      username: tikTokCreds.username,
      displayName: tikTokCreds.displayName,
      connectedAt: tikTokCreds.connectedAt
    })
  } catch (error) {
    return NextResponse.json(
      { connected: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
```

---

## ✅ Testing Checklist

### **TikTok Testing**
After implementation, test these workflows:

1. **OAuth Connection**
   - [ ] Go to Settings → Account Connections
   - [ ] Click "Connect TikTok"
   - [ ] Redirected to TikTok login
   - [ ] Authorize app
   - [ ] Redirected back with "Connected" status

2. **Post Creation**
   - [ ] Create new post
   - [ ] Select TikTok platform
   - [ ] Generate AI content
   - [ ] Generate video (if using AI video)
   - [ ] Click "Publish Now"
   - [ ] Verify success message
   - [ ] Check post appears in History

3. **Verification**
   - [ ] Settings shows "Connected" badge
   - [ ] Username displayed correctly
   - [ ] Can disconnect account
   - [ ] Can reconnect account

### **Facebook Regression Testing**
After any changes, verify Facebook still works:

1. [ ] OAuth connection works
2. [ ] Text-only post publishes
3. [ ] Image post publishes
4. [ ] Link preview works
5. [ ] Post appears in History
6. [ ] Settings shows correct page name

---

## 🎯 Success Criteria

### **TikTok Complete When:**
- ✅ Can connect TikTok account via OAuth
- ✅ Can verify connection status
- ✅ Can publish video with caption
- ✅ Published videos appear in History
- ✅ Video URLs are accessible and valid

### **Facebook Improved When:**
- ✅ Console logs replaced with structured logging
- ✅ API version externalized
- ✅ Video upload capability added
- ✅ All existing functionality still works

---

## 📊 Effort Estimation

| Task | Files | Lines | Time | Difficulty |
|------|-------|-------|------|------------|
| TikTok Service | 1 new | ~200 | 2 hrs | Medium |
| Publishing Update | 1 edit | ~25 | 30 min | Easy |
| Verify Endpoint | 1 new | ~50 | 1 hr | Easy |
| Facebook Logging | 1 edit | ~10 | 30 min | Easy |
| Facebook Video | 1 edit | ~50 | 1 hr | Medium |
| Testing | - | - | 2 hrs | - |
| **TOTAL** | **5 files** | **~335 lines** | **7 hours** | - |

---

## 🚨 Common Pitfalls to Avoid

### **TikTok:**
1. **Video URL accessibility** - Ensure uploaded videos are publicly accessible
2. **File size limits** - TikTok has max 287MB limit, validate before upload
3. **Token expiration** - Always call `verifyAndRefreshToken()` before posting
4. **Caption encoding** - Handle special characters and emojis correctly

### **Facebook:**
1. **Page vs Profile** - Ensure posting to Page, not personal profile
2. **Token permissions** - Verify `pages_manage_posts` permission granted
3. **Image format** - Facebook accepts JPEG, PNG, GIF (not all formats)

---

## 📚 Reference Documentation

- **TikTok API:** https://developers.tiktok.com/doc/content-posting-api-get-started
- **Facebook Graph API:** https://developers.facebook.com/docs/graph-api/
- **Supabase Storage:** https://supabase.com/docs/guides/storage
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## 🎉 Next Steps

**To start implementation:**

1. **Review this plan** - Understand all components
2. **Set up environment** - Ensure TikTok credentials in `.env`
3. **Create service file** - Start with `tiktokService.ts`
4. **Update publishing** - Integrate into `publishingService.ts`
5. **Create verify endpoint** - Add verification route
6. **Test thoroughly** - Follow testing checklist
7. **Deploy** - Push to production

**Ready to start? Let me know which component you'd like me to implement first!**
