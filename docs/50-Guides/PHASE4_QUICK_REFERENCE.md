# Phase 4 Quick Reference Guide

## 🎯 Core Features You Can Use NOW

### 1. Create Content with AI
**Path**: App → "Create Content" tab
- Talk to the AI strategist
- AI asks about your topic, platforms, content style, and tone
- AI generates platform-specific content
- AI automatically generates image and video prompts optimized for Gemini

### 2. Repurpose Long-Form Content
**Path**: App → "Repurpose" tab
- Paste blog post, article, or transcript
- Select 2-10 target platforms
- Generate 3-10 unique posts from the content
- Each post gets optimal post type for the platform

### 3. Generate Images and Videos
**From Post Card** (in Manage Posts):
- Write image prompt → Click "Generate Image"
- Write video prompt → Click "Generate Video"
- Gemini API automatically generates high-quality media
- Images display as PNG
- Videos process asynchronously (shows progress)

### 4. Preview in Exact Platform UI
**From Any Post**:
- Click "Preview" button
- See exact platform UI replica
- Switch between platforms to see different layouts
- View media in platform format

### 5. Manage Posts
**Path**: App → "Manage Posts" tab
- View all draft posts
- Edit content for each platform
- Generate media (images/videos)
- Request approval / Approve posts
- Move to "Ready to Publish"

### 6. Publish to All Platforms
**Path**: App → "Published" tab
- View posts ready to publish
- Schedule for later OR publish now
- Select publish time
- Post automatically publishes to all platforms
- Auto-archives to library when published

### 7. View Your Archive
**Path**: App → "Archive" tab
- See all published posts
- Search and filter by platform
- View statistics (total posts, with images, with videos)
- Export single post as JSON
- Export all posts as JSON
- Delete posts from archive

---

## 📊 What Each Component Does

### ContentStrategistView
```
User Input → AI Multi-turn Conversation → Platform-Specific Content + Image/Video Prompts
```
**Gemini Optimization**: Prompts include:
- Style keywords (cinematic, professional, high-resolution)
- Composition details (balanced, eye-catching)
- Technical specs (9:16 format, 30-45 seconds for video)

### ContentRepurposer
```
Long-form Content → Extract Key Points → Generate 3-10 Posts → Auto-select Post Types
```
**Gemini Optimization**: Each post gets:
- Platform-specific content
- Enhanced image prompt
- Enhanced video prompt

### PlatformTemplateRenderer
```
Platform + PostType → Select Template → Render Exact Platform UI
```
**Supported**:
- Instagram: feed, carousel, reel, story (4 types)
- Facebook: post, carousel, reel, story (4 types)
- Twitter: post (1 type)
- LinkedIn: post, carousel (2 types)
- TikTok: video, slideshow (2 types)
- YouTube: video, short (2 types)

### LibraryView
```
Published Posts → Filter → Display Grid → Export/Delete Options
```
**Features**:
- Search by topic
- Filter by platform
- View platform statistics
- Export single or all posts
- Delete from archive

---

## 🔄 Complete Post Lifecycle

```
1. CREATE
   ├─ ContentStrategistView → AI generates content + prompts
   └─ ContentRepurposer → AI repurposes existing content

2. GENERATE MEDIA
   ├─ Generate Image → Gemini API (gemini-2.5-flash-image)
   └─ Generate Video → Gemini API (veo-3.1-fast-generate-preview)

3. MANAGE
   ├─ Edit content per platform
   ├─ Preview in exact platform UI
   └─ Request/Grant approvals

4. READY FOR PUBLISHING
   ├─ Draft → Finalize → Ready to Publish
   └─ Move to "Published" section

5. PUBLISH
   ├─ Publish Now → All platforms + Archive
   ├─ Schedule → Auto-publish at scheduled time
   └─ Auto-archive to library

6. ARCHIVE
   ├─ View all published posts
   ├─ Search and filter
   ├─ Export as JSON
   └─ Delete if needed
```

---

## 💡 Pro Tips

### For Better AI Image Generation
- Include style keywords: "cinematic", "professional", "high-resolution", "4K"
- Mention composition: "balanced", "centered", "grid layout"
- Specify colors and mood: "vibrant", "professional blue", "energetic"
- Add detail: "close-up of...", "wide shot of...", "top-down view of..."

### For Better AI Video Generation
- Specify format: "9:16 vertical", "30-45 seconds"
- Mention pacing: "energetic", "cinematic", "fast-paced"
- Include visual style: "professional editing", "smooth transitions"
- Add elements: "text overlays", "music sync", "dynamic effects"

### For Multi-Platform Posting
- The AI automatically adapts content for each platform
- Character limits are enforced per platform
- Post types are automatically selected for optimal engagement
- Each platform sees exactly how the post will look

### For Archiving
- Export posts regularly as backup
- Use JSON format for future import
- View statistics to track publishing trends
- Filter by platform to see performance by channel

---

## 🚀 Next Steps

1. **Test Content Creation**: Use "Create Content" to generate a post
2. **Try Image Generation**: Generate an image using Gemini API
3. **Try Video Generation**: Generate a video (may take 1-2 minutes)
4. **Test Publishing**: Publish to one platform first
5. **Check Archive**: View published posts in archive
6. **Export Data**: Export a post as JSON backup

---

## 📋 Character Limits Reference

| Platform | Limit | Notes |
|----------|-------|-------|
| Twitter | 280 chars | Red warning if over limit |
| LinkedIn | 3000 chars | Professional audience |
| Facebook | 63206 chars | Most lenient |
| Instagram | 2200 chars | Character counter shown |
| TikTok | 150 chars | Concise captions |
| YouTube | 5000 chars | Description (title: 100) |

---

## 🎨 Post Types by Platform

| Platform | Post Types |
|----------|-----------|
| Instagram | feed, carousel, reel, story |
| Facebook | post, carousel, reel, story |
| Twitter | post |
| LinkedIn | post, carousel |
| TikTok | video, slideshow |
| YouTube | video, short |

---

## 🔗 Key API Integration Points

- **Gemini API**: Image/video generation, content strategy
- **Supabase**: Post storage, user data, archiving
- **Platform APIs**: Publishing to Twitter, LinkedIn, Facebook, Instagram, TikTok, YouTube
- **Media Library**: Auto-save generated images/videos

---

## ⚡ Performance Notes

- Image generation: ~10-30 seconds
- Video generation: ~1-3 minutes (async)
- Post publishing: <5 seconds per platform
- Archive loading: Instant (paginated for large datasets)

---

**Last Updated**: November 6, 2024
**Status**: Ready for Production Testing
