import { InstagramCredentials } from '@/types';

/**
 * Instagram API Service
 * Now uses real backend API endpoints for Instagram integration
 * Note: Instagram API requires a Facebook Business account
 */

export interface InstagramPostOptions {
  caption: string;
  imageUrl: string; // Required for Instagram
  mediaType?: 'image' | 'video';
}

/**
 * Start Instagram OAuth flow
 * Opens window for Instagram/Facebook authentication
 */
export async function startInstagramAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    // Call backend to start OAuth flow
    const response = await fetch('/api/instagram/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start Instagram authentication');
    }

    const { url } = await response.json();

    // Open Instagram/Facebook auth in current window
    window.location.href = url;

    return { success: true };
  } catch (error) {
    console.error('Instagram auth start error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start authentication'
    };
  }
}

/**
 * Verify Instagram credentials by calling backend
 */
export async function verifyInstagramCredentials(credentials: InstagramCredentials): Promise<{
  success: boolean;
  username?: string;
  error?: string
}> {
  try {
    // Call backend to verify credentials
    const response = await fetch('/api/instagram/verify', {
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
    console.error('Instagram verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Post to Instagram via backend API
 * Instagram requires a 2-step process: create container → publish container
 */
export async function postToInstagram(
  credentials: InstagramCredentials,
  options: InstagramPostOptions
): Promise<{ success: boolean; postId?: string; url?: string; error?: string }> {
  try {
    // Caption length validation is useful client-side for UX
    if (!options.caption || options.caption.length > 2200) {
      return { success: false, error: 'Caption must be between 1-2200 characters' };
    }

    if (!options.imageUrl) {
      return { success: false, error: 'Instagram requires an image' };
    }

    // Call backend to post (handles 2-step process) - backend will validate credentials from database
    const response = await fetch('/api/instagram/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption: options.caption,
        imageUrl: options.imageUrl
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to post to Instagram');
    }

    const data = await response.json();

    return {
      success: true,
      postId: data.postId,
      url: data.postUrl
    };
  } catch (error) {
    console.error('Instagram post error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post to Instagram'
    };
  }
}

/**
 * Upload media to Instagram via backend API
 * Returns public URL for use in posting
 */
export async function uploadInstagramMedia(
  credentials: InstagramCredentials,
  mediaData: string  // base64 encoded
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    // Call backend to upload media to Supabase Storage - backend will validate credentials from database
    const response = await fetch('/api/instagram/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaData
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to upload media');
    }

    const data = await response.json();

    return {
      success: true,
      imageUrl: data.imageUrl
    };
  } catch (error) {
    console.error('Instagram media upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload media'
    };
  }
}

/**
 * Get Instagram profile via backend API
 */
export async function getInstagramProfile(
  credentials: InstagramCredentials
): Promise<{ success: boolean; profile?: any; error?: string }> {
  try {
    // Call backend to get profile - backend will validate credentials from database
    const response = await fetch('/api/instagram/verify', {
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
        id: data.userId,
        username: data.username,
        name: data.name,
      }
    };
  } catch (error) {
    console.error('Instagram profile fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile'
    };
  }
}

