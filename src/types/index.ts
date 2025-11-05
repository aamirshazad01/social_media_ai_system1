export type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export type PostStatus = 'draft' | 'needs approval' | 'approved' | 'ready to publish' | 'scheduled' | 'published';

export const TONES = ['professional', 'casual', 'humorous', 'inspirational', 'urgent', 'friendly'] as const;
export type Tone = typeof TONES[number];

export const CONTENT_TYPES = ['engaging', 'educational', 'promotional', 'storytelling'] as const;
export type ContentType = typeof CONTENT_TYPES[number];

export interface PostContent {
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: {
    title?: string;
    description?: string;
    tags?: string[];
    privacyStatus?: 'public' | 'private' | 'unlisted';
  };
  imageSuggestion?: string;
  videoSuggestion?: string;
}

// Enhanced Post interface with new features
export interface Post {
  id: string;
  topic: string;
  platforms: Platform[];
  content: PostContent;
  status: PostStatus;
  createdAt: string; // ISO string
  scheduledAt?: string; // ISO string
  publishedAt?: string; // ISO string
  generatedImage?: string; // base64 data URL
  generatedVideoUrl?: string; // URL to blob/mp4
  isGeneratingImage: boolean;
  isGeneratingVideo: boolean;
  videoGenerationStatus: string;
  videoOperation?: any;
  // New fields
  campaignId?: string;
  queueId?: string;
  comments?: Comment[];
  engagementScore?: number;
  engagementSuggestions?: string[];
  isVariant?: boolean;
  originalPostId?: string; // For A/B testing variants
  variantType?: string; // e.g., 'A', 'B'
  recurrence?: RecurrencePattern;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  color: string; // For visual distinction
  startDate: string;
  endDate?: string;
  goals?: string[];
  createdAt: string;
}

// Media Library types
export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string; // blob URL or base64
  thumbnailUrl?: string;
  size: number; // bytes
  width?: number;
  height?: number;
  tags: string[];
  createdAt: string;
  source: 'ai-generated' | 'uploaded';
  usedInPosts: string[]; // Array of post IDs
}

// Queue types
export interface ContentQueue {
  id: string;
  name: string;
  description?: string;
  schedule: QueueSchedule;
  postIds: string[]; // Ordered list of posts
  isActive: boolean;
  createdAt: string;
}

export interface QueueSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  timeOfDay: string; // HH:mm format
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  dayOfMonth?: number; // 1-31
  customCron?: string; // For advanced users
}

// Recurring post types
export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // e.g., every 2 weeks = interval: 2
  endDate?: string;
  occurrences?: number; // Stop after N occurrences
}

// Comment types
export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  resolved: boolean;
  mentions?: string[]; // @username
}

// Notification types
export type NotificationType =
  | 'video_complete'
  | 'image_complete'
  | 'post_scheduled'
  | 'post_published'
  | 'approval_needed'
  | 'comment_added'
  | 'insight_available'
  | 'queue_published'
  | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  postId?: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Analytics Insight types
export interface AIInsight {
  id: string;
  type: 'engagement' | 'timing' | 'content' | 'platform';
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  dataPoints?: Record<string, any>;
  createdAt: string;
}

// Social Media Platform Credentials
export type PlatformCredentials = Partial<
  Record<
    Platform,
    TwitterCredentials | LinkedInCredentials | FacebookCredentials | InstagramCredentials | TikTokCredentials | YouTubeCredentials
  >
>

export interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessTokenSecret: string;
  isConnected: boolean;
  username?: string;
  connectedAt?: string;
}

export interface LinkedInCredentials {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  isConnected: boolean;
  profileId?: string;
  profileName?: string;
  connectedAt?: string;
}

export interface FacebookCredentials {
  appId: string;
  appSecret: string;
  accessToken: string;
  pageId?: string;
  pageName?: string;
  expiresAt?: string;
  isConnected: boolean;
  connectedAt?: string;
}

export interface InstagramCredentials {
  accessToken: string;
  userId?: string;
  username?: string;
  expiresAt?: string;
  isConnected: boolean;
  connectedAt?: string;
}

export interface TikTokCredentials {
  accessToken: string;
  refreshToken?: string;
  openId?: string;
  expiresAt?: string;
  isConnected: boolean;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  connectedAt?: string;
}

export interface YouTubeCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  isConnected: boolean;
  channelId?: string;
  channelTitle?: string;
  channelThumbnail?: string;
  connectedAt?: string;
}

export interface AccountConnection {
  platform: Platform;
  isConnected: boolean;
  username?: string;
  lastVerified?: string;
  error?: string;
}
