import { Platform, Post, PostContent } from '@/types';
import { getPlatformCredentials } from './credentialService';
import { postTweet, uploadTwitterMedia } from './platforms/twitterService';
import { postToLinkedIn } from './platforms/linkedinService';
import { postToFacebook, uploadFacebookPhoto } from './platforms/facebookService';
import { postToInstagram } from './platforms/instagramService';

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
  mediaUrl?: string
): Promise<PublishResult> {
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
          // TODO: Convert mediaUrl to File object and upload
          // const mediaResult = await uploadTwitterMedia(credentials, mediaFile);
          // if (mediaResult.success && mediaResult.mediaId) {
          //   mediaIds = [mediaResult.mediaId];
          // }
          console.log('Twitter media upload would happen here');
        }

        result = await postTweet(credentials, {
          text: content,
          mediaIds
        });
        break;
      }

      case 'linkedin': {
        result = await postToLinkedIn(credentials, {
          text: content,
          visibility: 'PUBLIC',
          mediaUrl
        });
        break;
      }

      case 'facebook': {
        result = await postToFacebook(credentials, {
          message: content,
          imageUrl: mediaUrl
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

        result = await postToInstagram(credentials, {
          caption: content,
          imageUrl: mediaUrl
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
      postId: result.postId,
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
