export type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram';

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
  imageSuggestion?: string;
  videoSuggestion?: string;
}

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
}