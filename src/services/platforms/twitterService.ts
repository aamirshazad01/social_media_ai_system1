import { TwitterCredentials } from '@/types';

/**
 * Twitter/X API Service
 * This service uses Twitter API v2 for posting and account management
 *
 * Note: Due to CORS restrictions, actual API calls should be made from a backend server.
 * This implementation provides the structure and client-side validation.
 */

const TWITTER_API_BASE = 'https://api.twitter.com/2';

export interface TwitterPostOptions {
  text: string;
  mediaIds?: string[];
}

/**
 * Verify Twitter credentials by making a test API call
 */
export async function verifyTwitterCredentials(credentials: TwitterCredentials): Promise<{ success: boolean; username?: string; error?: string }> {
  try {
    // In a real implementation, this would call your backend server
    // which would then make the OAuth 1.0a authenticated request to Twitter API

    // For now, basic validation
    if (!credentials.apiKey || !credentials.apiSecret || !credentials.accessToken || !credentials.accessTokenSecret) {
      return { success: false, error: 'Missing required credentials' };
    }

    // TODO: Call backend endpoint to verify credentials
    // const response = await fetch('/api/twitter/verify', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // });

    // Simulated success for now
    console.log('Twitter credentials would be verified via backend');

    return {
      success: true,
      username: 'twitter_user' // Would come from API response
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
 * Post a tweet to Twitter
 */
export async function postTweet(
  credentials: TwitterCredentials,
  options: TwitterPostOptions
): Promise<{ success: boolean; tweetId?: string; url?: string; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'Twitter account not connected' };
    }

    if (!options.text || options.text.length > 280) {
      return { success: false, error: 'Tweet text must be between 1-280 characters' };
    }

    // TODO: Call backend endpoint to post tweet
    // const response = await fetch('/api/twitter/post', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     credentials,
    //     text: options.text,
    //     mediaIds: options.mediaIds
    //   })
    // });

    console.log('Tweet would be posted via backend:', options.text);

    // Simulated success response
    const tweetId = `simulated_${Date.now()}`;
    return {
      success: true,
      tweetId,
      url: `https://twitter.com/${credentials.username}/status/${tweetId}`
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
 * Upload media to Twitter (images/videos)
 */
export async function uploadTwitterMedia(
  credentials: TwitterCredentials,
  mediaFile: File
): Promise<{ success: boolean; mediaId?: string; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'Twitter account not connected' };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
    if (!allowedTypes.includes(mediaFile.type)) {
      return { success: false, error: 'Unsupported media type' };
    }

    // Validate file size (max 5MB for images, 512MB for videos)
    const maxSize = mediaFile.type.startsWith('video/') ? 512 * 1024 * 1024 : 5 * 1024 * 1024;
    if (mediaFile.size > maxSize) {
      return { success: false, error: 'File size exceeds limit' };
    }

    // TODO: Call backend endpoint to upload media
    // const formData = new FormData();
    // formData.append('media', mediaFile);
    // const response = await fetch('/api/twitter/upload', {
    //   method: 'POST',
    //   body: formData
    // });

    console.log('Media would be uploaded via backend:', mediaFile.name);

    // Simulated success response
    return {
      success: true,
      mediaId: `media_${Date.now()}`
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
 * Get user profile information
 */
export async function getTwitterProfile(
  credentials: TwitterCredentials
): Promise<{ success: boolean; profile?: any; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'Twitter account not connected' };
    }

    // TODO: Call backend endpoint
    console.log('Profile would be fetched via backend');

    return {
      success: true,
      profile: {
        id: '123456',
        username: credentials.username || 'twitter_user',
        name: 'Twitter User',
        followers: 0,
        following: 0
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
