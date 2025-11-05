import { TikTokCredentials } from '@/types';

/**
 * TikTok API Service
 * Client-side wrapper for TikTok backend API endpoints
 * Credentials are managed server-side for security
 * Follows the same pattern as facebookService.ts
 */

export interface TikTokPostOptions {
  caption: string;
  videoUrl: string;
  videoSize: number;
}

/**
 * Start TikTok OAuth flow
 * Redirects to TikTok authentication via backend OAuth endpoint
 */
export async function startTikTokAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    // Call backend to start OAuth flow
    const response = await fetch('/api/auth/oauth/tiktok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.code || 'Failed to start TikTok authentication');
    }

    const { redirectUrl } = await response.json();

    // Redirect to TikTok auth
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
 * Verify TikTok credentials by calling backend
 */
export async function verifyTikTokCredentials(credentials: TikTokCredentials): Promise<{
  success: boolean;
  username?: string;
  displayName?: string;
  error?: string
}> {
  try {
    // Call backend to verify credentials
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
      username: data.username,
      displayName: data.displayName
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Post video to TikTok via backend API
 */
export async function postToTikTok(
  credentials: TikTokCredentials,
  options: TikTokPostOptions
): Promise<{ success: boolean; videoId?: string; url?: string; error?: string }> {
  try {
    // Caption length validation - useful for UX feedback
    if (!options.caption || options.caption.length > 2200) {
      return { success: false, error: 'Caption must be between 1-2200 characters' };
    }

    if (!options.videoUrl || typeof options.videoUrl !== 'string') {
      return { success: false, error: 'Valid video URL is required' };
    }

    if (!options.videoSize || typeof options.videoSize !== 'number') {
      return { success: false, error: 'Video size is required' };
    }

    // Call backend to post video - backend will validate credentials from database
    const response = await fetch('/api/tiktok/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption: options.caption,
        videoUrl: options.videoUrl,
        videoSize: options.videoSize
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to post to TikTok');
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
      error: error instanceof Error ? error.message : 'Failed to post to TikTok'
    };
  }
}

/**
 * Upload video to storage (returns public URL)
 * Backend endpoint: /api/tiktok/upload-media
 * Returns public URL for use in TikTok API
 */
export async function uploadTikTokVideo(
  credentials: TikTokCredentials,
  videoData: string  // base64 or public URL
): Promise<{ success: boolean; videoUrl?: string; videoSize?: number; error?: string }> {
  try {
    // If it's already a public URL, return it directly
    if (videoData.startsWith('http')) {
      return {
        success: true,
        videoUrl: videoData,
        videoSize: 0
      };
    }

    // Upload to storage via backend
    const response = await fetch('/api/tiktok/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoData })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to upload video');
    }

    const data = await response.json();

    return {
      success: true,
      videoUrl: data.videoUrl,
      videoSize: data.videoSize || 0
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Get TikTok account info via backend API
 */
export async function getTikTokAccountInfo(
  credentials: TikTokCredentials
): Promise<{ success: boolean; accountInfo?: any; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'TikTok account not connected' };
    }

    // Call backend to get account info
    const response = await fetch('/api/tiktok/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch account info');
    }

    const data = await response.json();

    return {
      success: true,
      accountInfo: {
        username: data.username,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        connectedAt: data.connectedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch account info'
    };
  }
}
