/**
 * Facebook API Client Utility
 * Handles Facebook Graph API OAuth 2.0 and content publishing
 */

/**
 * Facebook OAuth 2.0 URLs
 */
// Use versioned OAuth endpoints to align with latest login experience
export const FACEBOOK_OAUTH_URL = 'https://www.facebook.com/v21.0/dialog/oauth';
export const FACEBOOK_TOKEN_URL = 'https://graph.facebook.com/v21.0/oauth/access_token';
export const FACEBOOK_GRAPH_BASE = 'https://graph.facebook.com/v21.0';

/**
 * Required OAuth scopes for Facebook Pages
 * - pages_show_list: List pages managed by user
 * - pages_manage_posts: Create posts on pages
 * - pages_read_engagement: Read comments, reactions, and engagement data
 * - pages_read_user_content: Access user-generated content on pages
 * - read_insights: Get analytics (impressions, clicks, performance metrics)
 * - public_profile: Basic profile access
 */
export const FACEBOOK_SCOPES = [
  'pages_show_list',
  'pages_manage_posts',
  'pages_read_engagement',
  'pages_read_user_content',
  'read_insights',
  'public_profile',
];

/**
 * Generate Facebook OAuth authorization URL
 */
export function generateFacebookAuthUrl(
  appId: string,
  redirectUri: string,
  state: string
): string {
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    state: state,
    scope: FACEBOOK_SCOPES.join(','),
    response_type: 'code',
    auth_type: 'rerequest',
    // Use popup display to avoid cookie consent page issues
    display: 'popup',
  });

  return `${FACEBOOK_OAUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  appId: string,
  appSecret: string,
  redirectUri: string
): Promise<{
  access_token: string;
  token_type: string;
  expires_in?: number;
}> {
  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    code: code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(`${FACEBOOK_TOKEN_URL}?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to exchange code for token');
  }

  return response.json();
}

/**
 * Get long-lived access token (60 days)
 */
export async function getLongLivedToken(
  shortLivedToken: string,
  appId: string,
  appSecret: string
): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  });

  const response = await fetch(`${FACEBOOK_GRAPH_BASE}/oauth/access_token?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to get long-lived token');
  }

  return response.json();
}

/**
 * Get Facebook Pages managed by the user
 */
export async function getFacebookPages(accessToken: string): Promise<{
  data: Array<{
    id: string;
    name: string;
    access_token: string;
    category: string;
  }>;
}> {
  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/me/accounts?access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Facebook pages');
  }

  return response.json();
}

/**
 * Get Facebook Page info
 */
export async function getPageInfo(
  pageId: string,
  pageAccessToken: string
): Promise<{
  id: string;
  name: string;
  category: string;
  fan_count?: number;
}> {
  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${pageId}?fields=id,name,category,fan_count&access_token=${pageAccessToken}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch page info');
  }

  return response.json();
}

/**
 * Post to Facebook Page
 */
export async function postToFacebookPage(
  pageId: string,
  pageAccessToken: string,
  message: string,
  link?: string
): Promise<{ id: string }> {
  const params = new URLSearchParams({
    message: message,
    access_token: pageAccessToken,
  });

  if (link) {
    params.append('link', link);
  }

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${pageId}/feed`,
    {
      method: 'POST',
      body: params,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to post to Facebook');
  }

  return response.json();
}

/**
 * Post photo to Facebook Page
 */
export async function postPhotoToFacebookPage(
  pageId: string,
  pageAccessToken: string,
  imageUrl: string,
  message: string
): Promise<{ id: string; post_id: string }> {
  const params = new URLSearchParams({
    url: imageUrl,
    caption: message,
    access_token: pageAccessToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${pageId}/photos`,
    {
      method: 'POST',
      body: params,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to post photo to Facebook');
  }

  return response.json();
}

/**
 * Upload photo and get photo ID (for multi-photo posts)
 */
export async function uploadPhotoToFacebook(
  pageId: string,
  pageAccessToken: string,
  imageUrl: string
): Promise<{ id: string }> {
  const params = new URLSearchParams({
    url: imageUrl,
    published: 'false', // Don't publish yet
    access_token: pageAccessToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${pageId}/photos`,
    {
      method: 'POST',
      body: params,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload photo');
  }

  return response.json();
}

/**
 * Create multi-photo post
 */
export async function createMultiPhotoPost(
  pageId: string,
  pageAccessToken: string,
  photoIds: string[],
  message: string
): Promise<{ id: string }> {
  const attachedMedia = photoIds.map(id => ({ media_fbid: id }));

  const params = new URLSearchParams({
    message: message,
    attached_media: JSON.stringify(attachedMedia),
    access_token: pageAccessToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${pageId}/feed`,
    {
      method: 'POST',
      body: params,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create multi-photo post');
  }

  return response.json();
}

/**
 * Get post insights (analytics)
 */
export async function getPostInsights(
  postId: string,
  pageAccessToken: string
): Promise<{
  data: Array<{
    name: string;
    values: Array<{ value: number }>;
  }>;
}> {
  const metrics = [
    'post_impressions',
    'post_impressions_unique',
    'post_engaged_users',
    'post_clicks',
    'post_reactions_like_total',
    'post_reactions_love_total',
  ];

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${postId}/insights?metric=${metrics.join(',')}&access_token=${pageAccessToken}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch post insights');
  }

  return response.json();
}

/**
 * Get Page insights (analytics)
 */
export async function getPageInsights(
  pageId: string,
  pageAccessToken: string,
  since: string,
  until: string
): Promise<{
  data: Array<{
    name: string;
    values: Array<{ value: number; end_time: string }>;
  }>;
}> {
  const metrics = [
    'page_impressions',
    'page_impressions_unique',
    'page_engaged_users',
    'page_post_engagements',
    'page_fans',
  ];

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${pageId}/insights?metric=${metrics.join(',')}&since=${since}&until=${until}&access_token=${pageAccessToken}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch page insights');
  }

  return response.json();
}

/**
 * Upload video to Facebook Page
 */
export async function uploadVideoToFacebookPage(
  pageId: string,
  pageAccessToken: string,
  videoUrl: string,
  description: string
): Promise<{ id: string }> {
  const params = new URLSearchParams({
    file_url: videoUrl,
    description: description,
    access_token: pageAccessToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${pageId}/videos`,
    {
      method: 'POST',
      body: params,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to upload video');
  }

  return response.json();
}

/**
 * Delete post
 */
export async function deletePost(
  postId: string,
  pageAccessToken: string
): Promise<{ success: boolean }> {
  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${postId}?access_token=${pageAccessToken}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete post');
  }

  return response.json();
}
