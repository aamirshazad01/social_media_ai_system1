import { Platform, Post, PostContent, TwitterCredentials, LinkedInCredentials, FacebookCredentials, InstagramCredentials } from '@/types';
import { getPlatformCredentials } from './credentialService';
import { postTweet, uploadTwitterMedia } from './platforms/twitterService';
import { postToLinkedIn, uploadLinkedInMedia } from './platforms/linkedinService';
import { postToFacebook, uploadFacebookPhoto } from './platforms/facebookService';
import { postToInstagram, uploadInstagramMedia } from './platforms/instagramService';

export interface PublishResult {
  platform: Platform;
  success: boolean;
  postId?: string;
  url?: string;
  error?: string;
}

/**
 * Publish a post to a single platform
 */
export async function publishToSinglePlatform(
  platform: Platform,
  content: string,
  mediaUrl?: string,
  mediaType?: 'image' | 'video'
): Promise<PublishResult> {
  // Auto-detect media type if not provided
  if (!mediaType && mediaUrl) {
    mediaType = (mediaUrl.includes('.mp4') || mediaUrl.includes('.mov') || mediaUrl.includes('video')) 
      ? 'video' 
      : 'image';
  }
  try {
    const credentials = getPlatformCredentials(platform);

    if (!credentials || !credentials.isConnected) {
      return {
        platform,
        success: false,
        error: `${platform} is not connected. Please connect your account first.`
      };
    }

    let result;

    switch (platform) {
      case 'twitter': {
        // Handle media upload if present
        let mediaIds: string[] | undefined;
        if (mediaUrl) {
          const mediaResult = await uploadTwitterMedia(
            credentials as TwitterCredentials, 
            mediaUrl, 
            mediaType || 'image'
          );
          if (mediaResult.success && mediaResult.mediaId) {
            mediaIds = [mediaResult.mediaId];
          }
        }

        result = await postTweet(credentials as TwitterCredentials, {
          text: content,
          mediaIds
        });
        break;
      }

      case 'linkedin': {
        // Handle media upload if present
        let mediaUrn: string | undefined;
        if (mediaUrl) {
          const mediaResult = await uploadLinkedInMedia(
            credentials as LinkedInCredentials, 
            mediaUrl,
            mediaType || 'image'
          );
          if (mediaResult.success && mediaResult.mediaUrn) {
            mediaUrn = mediaResult.mediaUrn;
          }
        }

        result = await postToLinkedIn(credentials as LinkedInCredentials, {
          text: content,
          visibility: 'PUBLIC',
          mediaUrn
        });
        break;
      }

      case 'facebook': {
        // Handle media upload if present
        let imageUrl: string | undefined;
        if (mediaUrl) {
          const mediaResult = await uploadFacebookPhoto(credentials as FacebookCredentials, mediaUrl);
          if (mediaResult.success && mediaResult.imageUrl) {
            imageUrl = mediaResult.imageUrl;
          }
        }

        result = await postToFacebook(credentials as FacebookCredentials, {
          message: content,
          imageUrl: imageUrl,
          mediaType: mediaType
        });
        break;
      }

      case 'instagram': {
        if (!mediaUrl) {
          return {
            platform,
            success: false,
            error: 'Instagram requires an image or video to post'
          };
        }

        // Upload media to get public URL (Instagram requires public URLs)
        const mediaResult = await uploadInstagramMedia(credentials as InstagramCredentials, mediaUrl);
        if (!mediaResult.success || !mediaResult.imageUrl) {
          return {
            platform,
            success: false,
            error: mediaResult.error || 'Failed to upload media'
          };
        }

        result = await postToInstagram(credentials as InstagramCredentials, {
          caption: content,
          imageUrl: mediaResult.imageUrl,
          mediaType: mediaType
        });
        break;
      }

      default:
        return {
          platform,
          success: false,
          error: `Unsupported platform: ${platform}`
        };
    }

    return {
      platform,
      success: result.success,
      postId: (result as any).postId ?? (result as any).tweetId,
      url: result.url,
      error: result.error
    };
  } catch (error) {
    console.error(`Failed to publish to ${platform}:`, error);
    return {
      platform,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Publish a post to multiple platforms
 */
export async function publishPost(post: Post): Promise<PublishResult[]> {
  const results: PublishResult[] = [];

  for (const platform of post.platforms) {
    // Get platform-specific content
    const content = post.content[platform];

    if (!content) {
      results.push({
        platform,
        success: false,
        error: `No content specified for ${platform}`
      });
      continue;
    }

    // Determine media URL (prefer generated image/video, fall back to suggestions)
    const mediaUrl = post.generatedImage || post.generatedVideoUrl;

    const result = await publishToSinglePlatform(platform, content, mediaUrl);
    results.push(result);
  }

  return results;
}

/**
 * Check if a platform is ready to publish (connected and has valid credentials)
 */
export function isPlatformReady(platform: Platform): boolean {
  const credentials = getPlatformCredentials(platform);
  return credentials?.isConnected ?? false;
}

/**
 * Get publishing readiness for all platforms
 */
export function getPublishingReadiness(): Record<Platform, boolean> {
  return {
    twitter: isPlatformReady('twitter'),
    linkedin: isPlatformReady('linkedin'),
    facebook: isPlatformReady('facebook'),
    instagram: isPlatformReady('instagram')
  };
}

/**
 * Validate post before publishing
 */
export function validatePostForPublishing(post: Post): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if at least one platform is selected
  if (!post.platforms || post.platforms.length === 0) {
    errors.push('No platforms selected');
  }

  // Check if platforms are connected
  post.platforms.forEach(platform => {
    if (!isPlatformReady(platform)) {
      errors.push(`${platform} is not connected`);
    }
  });

  // Check if content exists for each platform
  post.platforms.forEach(platform => {
    if (!post.content[platform]) {
      errors.push(`Missing content for ${platform}`);
    }
  });

  // Platform-specific validations
  post.platforms.forEach(platform => {
    const content = post.content[platform];
    if (!content) return;

    switch (platform) {
      case 'twitter':
        if (content.length > 280) {
          errors.push('Twitter content exceeds 280 characters');
        }
        break;
      case 'linkedin':
        if (content.length > 3000) {
          errors.push('LinkedIn content exceeds 3000 characters');
        }
        break;
      case 'facebook':
        if (content.length > 63206) {
          errors.push('Facebook content exceeds 63206 characters');
        }
        break;
      case 'instagram':
        if (content.length > 2200) {
          errors.push('Instagram caption exceeds 2200 characters');
        }
        if (!post.generatedImage && !post.generatedVideoUrl) {
          errors.push('Instagram requires an image or video');
        }
        break;
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
