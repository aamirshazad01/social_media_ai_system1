import { TwitterCredentials } from '@/types';

/**
 * Twitter/X API Service
 * Now uses real backend API endpoints for Twitter integration
 */

export interface TwitterPostOptions {
  text: string;
  mediaIds?: string[];
}

/**
 * Start Twitter OAuth flow
 * Opens popup window for Twitter authentication
 */
export async function startTwitterAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    // Call backend to start OAuth flow
    const response = await fetch('/api/twitter/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start Twitter authentication');
    }

    const { url } = await response.json();

    // Open Twitter auth in current window
    window.location.href = url;

    return { success: true };
  } catch (error) {
    console.error('Twitter auth start error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start authentication'
    };
  }
}

/**
 * Verify Twitter credentials by calling backend
 */
export async function verifyTwitterCredentials(credentials: TwitterCredentials): Promise<{
  success: boolean;
  username?: string;
  error?: string
}> {
  try {
    // Call backend to verify credentials
    const response = await fetch('/api/twitter/verify', {
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
    console.error('Twitter verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Post a tweet to Twitter via backend API
 */
export async function postTweet(
  credentials: TwitterCredentials,
  options: TwitterPostOptions
): Promise<{ success: boolean; tweetId?: string; url?: string; error?: string }> {
  try {
    // Text length validation is useful client-side for UX
    if (!options.text || options.text.length > 280) {
      return { success: false, error: 'Tweet text must be between 1-280 characters' };
    }

    // Call backend to post tweet - backend will validate credentials from database
    const response = await fetch('/api/twitter/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: options.text,
        mediaIds: options.mediaIds
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to post tweet');
    }

    const data = await response.json();

    return {
      success: true,
      tweetId: data.tweetId,
      url: data.tweetUrl
    };
  } catch (error) {
    console.error('Twitter post error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post tweet'
    };
  }
}

/**
 * Upload media to Twitter via backend API
 */
export async function uploadTwitterMedia(
  credentials: TwitterCredentials,
  mediaData: string,  // base64 encoded
  mediaType: 'image' | 'video'
): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  try {
    // Call backend to upload media - backend will validate credentials from database
    const response = await fetch('/api/twitter/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaData,
        mediaType
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to upload media');
    }

    const data = await response.json();

    return {
      success: true,
      mediaId: data.mediaId
    };
  } catch (error) {
    console.error('Twitter media upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload media'
    };
  }
}

/**
 * Get user profile information via backend API
 */
export async function getTwitterProfile(
  credentials: TwitterCredentials
): Promise<{ success: boolean; profile?: any; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'Twitter account not connected' };
    }

    // Call backend to get profile
    const response = await fetch('/api/twitter/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }

    const data = await response.json();

    return {
      success: true,
      profile: {
        id: data.id,
        username: data.username,
        name: data.name,
      }
    };
  } catch (error) {
    console.error('Twitter profile fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile'
    };
  }
}
