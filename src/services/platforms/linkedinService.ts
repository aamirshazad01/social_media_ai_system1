import { LinkedInCredentials } from '@/types';

/**
 * LinkedIn API Service
 * Now uses real backend API endpoints for LinkedIn integration
 */

export interface LinkedInPostOptions {
  text: string;
  visibility?: 'PUBLIC' | 'CONNECTIONS';
  mediaUrn?: string;
}

/**
 * Start LinkedIn OAuth flow
 * Opens popup window for LinkedIn authentication
 */
export async function startLinkedInAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    // Call backend to start OAuth flow
    const response = await fetch('/api/linkedin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start LinkedIn authentication');
    }

    const { url } = await response.json();

    // Open LinkedIn auth in current window
    window.location.href = url;

    return { success: true };
  } catch (error) {
    console.error('LinkedIn auth start error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start authentication'
    };
  }
}

/**
 * Verify LinkedIn credentials by calling backend
 */
export async function verifyLinkedInCredentials(credentials: LinkedInCredentials): Promise<{
  success: boolean;
  profileName?: string;
  error?: string
}> {
  try {
    // Call backend to verify credentials
    const response = await fetch('/api/linkedin/verify', {
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
      profileName: data.profileName
    };
  } catch (error) {
    console.error('LinkedIn verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Post to LinkedIn via backend API
 */
export async function postToLinkedIn(
  credentials: LinkedInCredentials,
  options: LinkedInPostOptions
): Promise<{ success: boolean; postId?: string; url?: string; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'LinkedIn account not connected' };
    }

    if (!options.text || options.text.length > 3000) {
      return { success: false, error: 'Post text must be between 1-3000 characters' };
    }

    // Call backend to post
    const response = await fetch('/api/linkedin/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: options.text,
        visibility: options.visibility || 'PUBLIC',
        mediaUrn: options.mediaUrn
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to post to LinkedIn');
    }

    const data = await response.json();

    return {
      success: true,
      postId: data.postId,
      url: data.postUrl
    };
  } catch (error) {
    console.error('LinkedIn post error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post to LinkedIn'
    };
  }
}

/**
 * Upload media to LinkedIn via backend API
 */
export async function uploadLinkedInMedia(
  credentials: LinkedInCredentials,
  mediaData: string,
  mediaType: 'image' | 'video' = 'image'
): Promise<{ success: boolean; mediaUrn?: string; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'LinkedIn account not connected' };
    }

    // Call backend to upload media
    const response = await fetch('/api/linkedin/upload-media', {
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
      mediaUrn: data.mediaUrn
    };
  } catch (error) {
    console.error('LinkedIn media upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload media'
    };
  }
}

/**
 * Get LinkedIn profile via backend API
 */
export async function getLinkedInProfile(
  credentials: LinkedInCredentials
): Promise<{ success: boolean; profile?: any; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'LinkedIn account not connected' };
    }

    // Call backend to get profile
    const response = await fetch('/api/linkedin/verify', {
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
        id: data.profileId,
        name: data.profileName,
        email: data.email,
      }
    };
  } catch (error) {
    console.error('LinkedIn profile fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile'
    };
  }
}
