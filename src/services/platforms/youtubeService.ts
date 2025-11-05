import { YouTubeCredentials } from '@/types';

/**
 * YouTube API Service
 * Client-side wrapper for YouTube backend API endpoints
 * Credentials are managed server-side for security
 * Follows the same pattern as facebookService.ts and tiktokService.ts
 */

export interface YouTubePostOptions {
  title: string;
  description: string;
  videoBuffer: string; // base64 encoded
  tags?: string[];
  privacyStatus?: 'public' | 'private' | 'unlisted';
}

/**
 * Start YouTube OAuth flow
 * Redirects to YouTube/Google authentication via backend OAuth endpoint
 */
export async function startYouTubeAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    // Call backend to start OAuth flow
    const response = await fetch('/api/auth/oauth/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.code || 'Failed to start YouTube authentication');
    }

    const { redirectUrl } = await response.json();

    // Redirect to YouTube auth
    window.location.href = redirectUrl;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start authentication'
    };
  }
}

/**
 * Verify YouTube credentials by calling backend
 */
export async function verifyYouTubeCredentials(credentials: YouTubeCredentials): Promise<{
  success: boolean;
  channelTitle?: string;
  channelId?: string;
  error?: string
}> {
  try {
    // Call backend to verify credentials
    const response = await fetch('/api/youtube/verify', {
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
      channelTitle: data.channelTitle,
      channelId: data.channelId
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Upload video to YouTube via backend API
 */
export async function uploadToYouTube(
  credentials: YouTubeCredentials,
  options: YouTubePostOptions
): Promise<{ success: boolean; videoId?: string; url?: string; error?: string }> {
  try {
    // Title length validation - useful for UX feedback
    if (!options.title || options.title.length > 100) {
      return { success: false, error: 'Title must be between 1-100 characters' };
    }

    if (!options.description || options.description.length > 5000) {
      return { success: false, error: 'Description must be between 1-5000 characters' };
    }

    if (!options.videoBuffer || typeof options.videoBuffer !== 'string') {
      return { success: false, error: 'Valid video buffer is required' };
    }

    // Call backend to upload video - backend will validate credentials from database
    const response = await fetch('/api/youtube/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: options.title,
        description: options.description,
        videoBuffer: options.videoBuffer,
        tags: options.tags || [],
        privacyStatus: options.privacyStatus || 'private'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to upload to YouTube');
    }

    const data = await response.json();

    return {
      success: true,
      videoId: data.data.videoId,
      url: data.data.videoUrl
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload to YouTube'
    };
  }
}

/**
 * Get YouTube channel info via backend API
 */
export async function getYouTubeChannelInfo(
  credentials: YouTubeCredentials
): Promise<{ success: boolean; channelInfo?: any; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'YouTube account not connected' };
    }

    // Call backend to get channel info
    const response = await fetch('/api/youtube/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch channel info');
    }

    const data = await response.json();

    return {
      success: true,
      channelInfo: {
        channelId: data.channelId,
        channelTitle: data.channelTitle,
        channelThumbnail: data.channelThumbnail,
        connectedAt: data.connectedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch channel info'
    };
  }
}
