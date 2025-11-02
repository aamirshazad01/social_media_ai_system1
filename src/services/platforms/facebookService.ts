import { FacebookCredentials } from '@/types';

/**
 * Facebook API Service
 * Now uses real backend API endpoints for Facebook integration
 */

const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0';

export interface FacebookPostOptions {
  message: string;
  link?: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
}

/**
 * Start Facebook OAuth flow
 * Opens window for Facebook authentication
 */
export async function startFacebookAuth(): Promise<{ success: boolean; error?: string }> {
  try {
    // Call backend to start OAuth flow
    const response = await fetch('/api/facebook/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start Facebook authentication');
    }

    const { url } = await response.json();

    // Open Facebook auth in current window
    window.location.href = url;

    return { success: true };
  } catch (error) {
    console.error('Facebook auth start error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start authentication'
    };
  }
}

/**
 * Verify Facebook credentials by calling backend
 */
export async function verifyFacebookCredentials(credentials: FacebookCredentials): Promise<{
  success: boolean;
  pageName?: string;
  error?: string
}> {
  try {
    // Call backend to verify credentials
    const response = await fetch('/api/facebook/verify', {
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
      pageName: data.pageName
    };
  } catch (error) {
    console.error('Facebook verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Post to Facebook via backend API
 */
export async function postToFacebook(
  credentials: FacebookCredentials,
  options: FacebookPostOptions
): Promise<{ success: boolean; postId?: string; url?: string; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'Facebook account not connected' };
    }

    if (!options.message || options.message.length > 63206) {
      return { success: false, error: 'Message must be between 1-63206 characters' };
    }

    // Call backend to post
    const response = await fetch('/api/facebook/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: options.message,
        imageUrl: options.imageUrl,
        link: options.link
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to post to Facebook');
    }

    const data = await response.json();

    return {
      success: true,
      postId: data.postId,
      url: data.postUrl
    };
  } catch (error) {
    console.error('Facebook post error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post to Facebook'
    };
  }
}

/**
 * Upload media to Facebook via backend API
 * Returns public URL for use in posting
 */
export async function uploadFacebookPhoto(
  credentials: FacebookCredentials,
  mediaData: string  // base64 encoded
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'Facebook account not connected' };
    }

    // Call backend to upload media to Supabase Storage
    const response = await fetch('/api/facebook/upload-media', {
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
    console.error('Facebook media upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload media'
    };
  }
}

/**
 * Get Facebook Page info via backend API
 */
export async function getFacebookPageInfo(
  credentials: FacebookCredentials
): Promise<{ success: boolean; pageInfo?: any; error?: string }> {
  try {
    if (!credentials.isConnected) {
      return { success: false, error: 'Facebook account not connected' };
    }

    // Call backend to get page info
    const response = await fetch('/api/facebook/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch page info');
    }

    const data = await response.json();

    return {
      success: true,
      pageInfo: {
        id: data.pageId,
        name: data.pageName,
        category: data.category,
        fanCount: data.fanCount,
      }
    };
  } catch (error) {
    console.error('Facebook page info fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch page info'
    };
  }
}

