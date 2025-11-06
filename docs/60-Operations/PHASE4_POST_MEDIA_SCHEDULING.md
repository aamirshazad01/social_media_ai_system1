# Phase 4: Post Management, Media Library & Scheduling System

**Status**: 🚀 Ready to Implement
**Phases Completed**: 1-3 (Database, Auth, OAuth with 6 platforms)

---

## Overview

Phase 4 rebuilds three interconnected systems:
1. **Post Management** - Multi-platform content publishing
2. **Media Library** - Centralized asset management (currently client-side, needs server)
3. **Scheduling Engine** - Queue-based post publishing

---

## 1. Current State Analysis

### ✅ What Already Exists

#### Post Management (`src/services/database/postService.ts`)
- Basic CRUD operations (create, read, update, delete)
- Status tracking (draft, scheduled, published)
- Campaign association
- Engagement score tracking
- Activity logging

**Limitations**:
- ❌ No multi-platform publishing logic
- ❌ No platform-specific content adaptation
- ❌ No post versioning/history
- ❌ No approval workflow
- ❌ No scheduling queue integration

#### Media Library (`src/services/mediaService.ts`)
- **Problem**: Client-side IndexedDB storage
- ❌ No server-side persistence
- ❌ No workspace isolation
- ❌ No encryption for sensitive files
- ❌ No storage quota management
- ❌ No CDN/file upload integration

**Current Features**:
- IndexedDB storage with tags
- AI media auto-save
- Thumbnail generation
- File upload handling
- Usage tracking per post

#### Database Schema (Already Good)
- ✅ Posts table with all fields
- ✅ Media_assets table exists
- ✅ Post_platforms junction table (missing in code)
- ✅ Post_media junction table (missing in code)

---

## 2. Architecture Plan

### System Flow
```
┌─────────────────────────────────────────────────────────────┐
│                    User Creates Post                         │
├─────────────────────────────────────────────────────────────┤
│                           ↓                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PostManagementService                                 │  │
│  │  ├─ Create post (draft)                               │  │
│  │  ├─ Select platforms                                  │  │
│  │  ├─ Attach media                                      │  │
│  │  └─ Request approval                                  │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       ↓                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ApprovalWorkflow                                      │  │
│  │  ├─ Notify approvers                                  │  │
│  │  ├─ Review content                                    │  │
│  │  └─ Approve/Reject                                    │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       ↓ (Approved)                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  SchedulingEngine                                      │  │
│  │  ├─ Immediate: Queue for publishing                   │  │
│  │  ├─ Scheduled: Add to cron queue                      │  │
│  │  └─ Platform-specific: Adapt content                  │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       ↓                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PublishingQueue (Background Job)                      │  │
│  │  ├─ Get PlatformService for each platform             │  │
│  │  ├─ Adapt content (char limit, format)                │  │
│  │  ├─ Upload media to platform                          │  │
│  │  ├─ Publish post                                      │  │
│  │  ├─ Store platform post IDs                           │  │
│  │  └─ Update post status (published/failed)             │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       ↓                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  AnalyticsCollector (Hourly Cron)                      │  │
│  │  ├─ Get platform post IDs                             │  │
│  │  ├─ Fetch metrics from each platform                  │  │
│  │  ├─ Aggregate and store                               │  │
│  │  └─ Update engagement score                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Implementation Breakdown

### 3.1 Media Library System (Server-Side)

**File**: `src/services/database/mediaService.ts` (REWRITE)

#### Replace Client IndexedDB with Server Storage

```typescript
// New structure
export class MediaService {
  // 1. Upload media file
  static async uploadMedia(
    file: File,
    workspaceId: string,
    userId: string,
    tags?: string[]
  ): Promise<MediaAsset>

  // 2. Get workspace media
  static async getMediaByWorkspace(
    workspaceId: string,
    filters?: { type?, tags?, search? },
    pagination?: { limit, offset }
  ): Promise<{ items: MediaAsset[], total: number }>

  // 3. Get media by ID
  static async getMediaById(
    id: string,
    workspaceId: string
  ): Promise<MediaAsset | null>

  // 4. Update media metadata
  static async updateMedia(
    id: string,
    workspaceId: string,
    updates: { tags?, name? }
  ): Promise<MediaAsset>

  // 5. Delete media
  static async deleteMedia(
    id: string,
    workspaceId: string
  ): Promise<void>

  // 6. Get storage usage
  static async getStorageStats(
    workspaceId: string
  ): Promise<{ used: number, limit: number }>

  // 7. Search media
  static async searchMedia(
    workspaceId: string,
    query: string
  ): Promise<MediaAsset[]>
}
```

**Features**:
- ✅ Server-side persistent storage (Supabase)
- ✅ Workspace isolation
- ✅ File encryption at rest (optional)
- ✅ Tagging system
- ✅ Search and filtering
- ✅ Storage quota management
- ✅ File serving via CDN

**Database Integration**:
```sql
-- Media assets table already exists with fields:
-- id, workspace_id, name, type, url, size, tags, source, created_at, updated_at

-- New fields needed:
ALTER TABLE media_assets ADD COLUMN created_by UUID REFERENCES users(id);
ALTER TABLE media_assets ADD COLUMN file_path VARCHAR;  -- S3/storage path
ALTER TABLE media_assets ADD COLUMN mime_type VARCHAR;
ALTER TABLE media_assets ADD COLUMN is_public BOOLEAN DEFAULT false;
```

---

### 3.2 Post Management System (Enhanced)

**File**: `src/services/database/postService.ts` (EXTEND)

#### Add Multi-Platform Publishing

```typescript
export class PostService {
  // Existing methods...

  // NEW: Get post with all relationships
  static async getPostWithDetails(
    postId: string,
    workspaceId: string
  ): Promise<PostDetail | null>

  // NEW: Attach media to post
  static async attachMediaToPost(
    postId: string,
    mediaIds: string[],
    workspaceId: string
  ): Promise<void>

  // NEW: Get post media
  static async getPostMedia(
    postId: string,
    workspaceId: string
  ): Promise<MediaAsset[]>

  // NEW: Attach platforms to post
  static async attachPlatformsToPost(
    postId: string,
    platformIds: string[],
    workspaceId: string
  ): Promise<void>

  // NEW: Get post platforms
  static async getPostPlatforms(
    postId: string,
    workspaceId: string
  ): Promise<PlatformPost[]>

  // NEW: Duplicate post
  static async duplicatePost(
    postId: string,
    userId: string,
    workspaceId: string
  ): Promise<Post>

  // NEW: Get posts with filters
  static async getPostsWithFilters(
    workspaceId: string,
    filters: {
      status?: PostStatus[],
      platform?: string[],
      campaign?: string,
      dateFrom?: Date,
      dateTo?: Date,
      search?: string
    },
    pagination: { limit, offset }
  ): Promise<{ items: Post[], total: number }>
}
```

**New Database Tables**:
```sql
-- post_platforms junction table (many-to-many)
CREATE TABLE post_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  platform_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform_post_id VARCHAR,  -- Post ID on platform (for later analytics)
  published_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50),  -- published, failed, pending
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- post_media junction table (many-to-many)
CREATE TABLE post_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post versioning/history
CREATE TABLE post_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content JSONB,
  status post_status,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 3.3 Scheduling Engine

**File**: `src/services/SchedulingService.ts` (NEW)

```typescript
export class SchedulingService {
  // 1. Schedule post for publishing
  static async schedulePost(
    postId: string,
    platforms: string[],  // Platform IDs
    scheduledAt: Date,
    workspaceId: string
  ): Promise<ScheduledPost>

  // 2. Publish post immediately
  static async publishPostImmediately(
    postId: string,
    platforms: string[],
    workspaceId: string
  ): Promise<PublishResult>

  // 3. Get scheduled posts
  static async getScheduledPosts(
    workspaceId: string,
    filters?: { status?, platform? }
  ): Promise<ScheduledPost[]>

  // 4. Cancel scheduled post
  static async cancelScheduledPost(
    scheduledId: string,
    workspaceId: string
  ): Promise<void>

  // 5. Reschedule post
  static async reschedulePost(
    scheduledId: string,
    newTime: Date,
    workspaceId: string
  ): Promise<ScheduledPost>

  // 6. Get publishing queue status (for cron job)
  static async getReadyToPublish(): Promise<ScheduledPost[]>

  // 7. Process scheduled posts (cron job - runs every minute)
  static async processScheduledPosts(): Promise<{ published: number, failed: number }>
}
```

**Publishing Process**:
```typescript
// 1. Content Adaptation (platform-specific)
class ContentAdapter {
  static adaptForPlatform(
    content: string,
    platform: SupportedPlatform,
    maxChars: number
  ): string {
    // Twitter: 280 chars
    // LinkedIn: 3000 chars
    // Facebook: 63206 chars
    // Instagram: 2200 chars
    // TikTok: 150 chars
    // YouTube: 5000 chars

    if (content.length <= maxChars) return content;

    // Truncate with ellipsis or use platform-specific formatting
    return content.substring(0, maxChars - 3) + '...';
  }
}

// 2. Media Upload (platform-specific)
class MediaUploader {
  static async uploadTooltformformats
  static async uploadToFacebook(mediaId: string, token: string)
  static async uploadToInstagram(mediaId: string, token: string)
  static async uploadToTikTok(mediaId: string, token: string)
  static async uploadToTwitter(mediaId: string, token: string)
  static async uploadToLinkedIn(mediaId: string, token: string)
  static async uploadToYouTube(mediaId: string, token: string)
}

// 3. Publishing
class Publisher {
  static async publishToAllPlatforms(
    post: Post,
    media: MediaAsset[],
    accounts: SocialAccount[]
  ): Promise<PublishResult[]>
}
```

---

### 3.4 Approval Workflow

**File**: `src/services/database/approvalService.ts` (NEW)

```typescript
export class ApprovalService {
  // 1. Request approval
  static async requestApproval(
    postId: string,
    requestedBy: string,
    approverIds: string[],
    workspaceId: string
  ): Promise<Approval>

  // 2. Get pending approvals
  static async getPendingApprovals(
    workspaceId: string,
    userId?: string
  ): Promise<Approval[]>

  // 3. Approve post
  static async approvePost(
    approvalId: string,
    approvedBy: string,
    workspaceId: string,
    comments?: string
  ): Promise<Approval>

  // 4. Reject post
  static async rejectPost(
    approvalId: string,
    rejectedBy: string,
    workspaceId: string,
    reason: string
  ): Promise<Approval>

  // 5. Get approval history
  static async getApprovalHistory(
    postId: string,
    workspaceId: string
  ): Promise<Approval[]>
}
```

---

## 4. API Routes to Create

### Post Management
```
POST   /api/posts                  - Create post
GET    /api/posts                  - List posts (with filters)
GET    /api/posts/:id              - Get post details
PATCH  /api/posts/:id              - Update post
DELETE /api/posts/:id              - Delete post
POST   /api/posts/:id/duplicate    - Duplicate post
POST   /api/posts/:id/publish      - Publish immediately
POST   /api/posts/:id/schedule     - Schedule post
POST   /api/posts/:id/media        - Attach media
GET    /api/posts/:id/media        - Get post media
POST   /api/posts/:id/platforms    - Attach platforms
GET    /api/posts/:id/platforms    - Get platforms
POST   /api/posts/:id/request-approval - Request approval
```

### Media Library
```
POST   /api/media                  - Upload media
GET    /api/media                  - List media (with filters)
GET    /api/media/:id              - Get media details
PATCH  /api/media/:id              - Update media
DELETE /api/media/:id              - Delete media
GET    /api/media/search           - Search media
GET    /api/media/stats            - Get storage stats
```

### Scheduling
```
GET    /api/schedule               - Get scheduled posts
POST   /api/schedule/:id/cancel    - Cancel schedule
POST   /api/schedule/:id/reschedule - Reschedule
GET    /api/schedule/queue         - Get publishing queue
POST   /api/schedule/process       - Process (cron job)
```

### Approval
```
GET    /api/approvals              - Get pending approvals
POST   /api/approvals/:id/approve  - Approve
POST   /api/approvals/:id/reject   - Reject
GET    /api/posts/:id/approvals    - Get approval history
```

---

## 5. Implementation Order

### Step 1: Database Schema (Priority: HIGH)
- [ ] Create post_platforms junction table
- [ ] Create post_media junction table
- [ ] Create post_versions table
- [ ] Add indexes for performance
- [ ] Add approval table (if not exists)

**Time**: 1-2 hours

### Step 2: Media Library (Priority: HIGH)
- [ ] Rewrite mediaService.ts for server-side storage
- [ ] Create media upload API route
- [ ] Implement file handling (Supabase Storage)
- [ ] Add search and filtering
- [ ] Add storage quota management

**Time**: 3-4 hours

### Step 3: Post Management Service (Priority: HIGH)
- [ ] Extend PostService with multi-platform support
- [ ] Create post_platforms/post_media management
- [ ] Implement post detail retrieval with relationships
- [ ] Add post versioning support
- [ ] Add filtering and search

**Time**: 3-4 hours

### Step 4: Scheduling Engine (Priority: HIGH)
- [ ] Create SchedulingService
- [ ] Implement content adaptation per platform
- [ ] Create publishing logic
- [ ] Create cron endpoint for processing
- [ ] Implement error handling and retries

**Time**: 4-5 hours

### Step 5: Approval Workflow (Priority: MEDIUM)
- [ ] Create ApprovalService
- [ ] Implement approval requests
- [ ] Add notifications
- [ ] Create approval routes

**Time**: 2-3 hours

### Step 6: API Routes (Priority: HIGH)
- [ ] Create all post endpoints
- [ ] Create all media endpoints
- [ ] Create scheduling endpoints
- [ ] Create approval endpoints
- [ ] Add validation and error handling

**Time**: 4-5 hours

### Step 7: Testing & Documentation (Priority: MEDIUM)
- [ ] Test all endpoints
- [ ] Test multi-platform publishing
- [ ] Test scheduling
- [ ] Document API
- [ ] Create integration tests

**Time**: 3-4 hours

---

## 6. Key Features

### Multi-Platform Publishing
✅ Detect character limits per platform
✅ Truncate/adapt content
✅ Handle media upload per platform
✅ Store platform-specific post IDs
✅ Error handling per platform
✅ Retry failed platforms

### Media Management
✅ Server-side file storage
✅ Workspace isolation
✅ Tag-based organization
✅ Full-text search
✅ Storage quota management
✅ CDN serving

### Scheduling
✅ Immediate publishing
✅ Future scheduling
✅ Platform-specific scheduling
✅ Reschedule support
✅ Cancel scheduled posts
✅ Automatic processing via cron

### Approval Workflow
✅ Multi-person approval
✅ Comments and notes
✅ Audit trail
✅ Notifications
✅ Conditional publishing based on approval

---

## 7. Dependencies & Tools

- **Supabase Storage**: For file uploads
- **PostgreSQL**: Database operations (already set up)
- **Node Cron**: For background jobs (already available)
- **Platform Services**: TwitterService, FacebookService, etc. (from Phase 3)
- **Zod**: For validation (already set up)
- **TypeScript**: Type safety

---

## 8. Environment Variables (Needed)

```bash
# Supabase Storage
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=media-assets

# File size limits
MAX_MEDIA_SIZE=100000000  # 100MB
MAX_WORKSPACE_STORAGE=10737418240  # 10GB

# Publishing queue
PUBLISHING_QUEUE_BATCH_SIZE=10
PUBLISHING_QUEUE_RETRY_COUNT=3

# Scheduling
SCHEDULE_CHECK_INTERVAL=60000  # Check every minute

# Approval
APPROVAL_TIMEOUT_HOURS=48
```

---

## 9. Estimated Timeline

| Component | Effort | Time |
|-----------|--------|------|
| Database Schema | 1-2 hours | ⚡ Quick |
| Media Library | 3-4 hours | Medium |
| Post Management | 3-4 hours | Medium |
| Scheduling Engine | 4-5 hours | Heavy |
| Approval Workflow | 2-3 hours | Light |
| API Routes | 4-5 hours | Heavy |
| Testing | 3-4 hours | Medium |
| **TOTAL** | **20-27 hours** | **~3 days** |

---

## 10. Success Criteria

✅ Users can create posts with draft status
✅ Users can attach media to posts
✅ Users can select multiple platforms
✅ Users can request approval
✅ Admins can approve/reject posts
✅ Approved posts can be published immediately
✅ Posts can be scheduled for future publishing
✅ Cron job automatically publishes scheduled posts
✅ Content is adapted per platform (char limits, etc.)
✅ Media is uploaded to each platform
✅ Platform post IDs are stored for analytics
✅ Failed publishes are retried
✅ Media library works with server-side storage
✅ All operations are audit-logged

---

## Next Steps

1. Confirm order of implementation
2. Start with database schema updates
3. Proceed with media library server-side implementation
4. Continue with post management enhancements
5. Implement scheduling engine
6. Add approval workflow
7. Create and test all API routes

---

**Status**: Ready for implementation
**Phase Duration**: ~3 days (20-27 hours of development)
**Priority**: HIGH (core feature for multi-platform publishing)
