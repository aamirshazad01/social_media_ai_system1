/**
 * YouTube OAuth Callback
 * GET /api/auth/oauth/youtube/callback?code=xxx&state=xxx
 *
 * Handles OAuth callback from YouTube (Google)
 * - Exchanges authorization code for access token and refresh token
 * - Fetches channel information
 * - Saves credentials securely (encrypted)
 * - Logs all authentication events
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyOAuthState } from '@/services/database/oauthStateService'
import { CredentialService } from '@/services/database/credentialService'
import { logAuditEvent } from '@/services/database/auditLogService'
import { createYouTubeClient } from '@/lib/youtube/client'
import type { YouTubeCredentials } from '@/types'

export async function GET(req: NextRequest) {
  console.log('🚀 YouTube OAuth Callback started')
  const supabase = await createServerClient()
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')

  console.log('📥 Callback params:', {
    code: code?.substring(0, 20) + '...',
    state: state?.substring(0, 20) + '...',
    error,
    errorDescription,
  })

  try {
    // ✅ Step 1: Check authentication
    console.log('✅ Step 1: Checking authentication')
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log('❌ No authenticated user found')
      return NextResponse.redirect(
        new URL('/login?error=oauth_unauthorized', req.nextUrl.origin)
      )
    }
    console.log('✅ User authenticated:', user.id)

    // ✅ Step 2: Get workspace and verify admin role
    console.log('✅ Step 2: Getting workspace and verifying admin role')
    const { data: userRow } = await supabase
      .from('users')
      .select('workspace_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!userRow) {
      console.log('❌ No user row found')
      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=no_workspace', req.nextUrl.origin)
      )
    }

    const workspaceId = (userRow as any).workspace_id
    const userRole = (userRow as any).role
    console.log('✅ User workspace:', workspaceId, 'Role:', userRole)

    // Check if user is admin (required for OAuth connections)
    if (userRole !== 'admin') {
      console.log('❌ User is not admin, role is:', userRole)
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'youtube',
        action: 'oauth_callback_unauthorized',
        status: 'failed',
        errorCode: 'INSUFFICIENT_PERMISSIONS',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=insufficient_permissions', req.nextUrl.origin)
      )
    }
    console.log('✅ User is admin, proceeding with OAuth')

    // ✅ Step 3: Check for OAuth denial
    if (error) {
      console.log('❌ OAuth denied:', error, errorDescription)
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'youtube',
        action: 'oauth_callback_denied',
        status: 'failed',
        errorCode: error,
        errorMessage: errorDescription || 'User denied OAuth permission',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL(`/settings?tab=accounts&oauth_error=${error}`, req.nextUrl.origin)
      )
    }

    // ✅ Step 4: Verify OAuth state (CSRF protection)
    console.log('✅ Step 4: Verifying OAuth state')
    if (!code || !state) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'youtube',
        action: 'oauth_callback_missing_params',
        status: 'failed',
        errorCode: 'MISSING_PARAMS',
        errorMessage: 'Missing code or state parameter',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=invalid_params', req.nextUrl.origin)
      )
    }

    const oauthState = await verifyOAuthState(workspaceId, 'youtube', state)
    if (!oauthState) {
      console.log('❌ Invalid or expired OAuth state')
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'youtube',
        action: 'oauth_callback_invalid_state',
        status: 'failed',
        errorCode: 'INVALID_STATE',
        errorMessage: 'Invalid or expired OAuth state token',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=invalid_state', req.nextUrl.origin)
      )
    }
    console.log('✅ OAuth state verified')

    // ✅ Step 5: Get platform configuration
    console.log('✅ Step 5: Getting YouTube configuration')
    const clientId = process.env.YOUTUBE_CLIENT_ID
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
    const redirectUri = `${baseUrl}/api/auth/oauth/youtube/callback`

    if (!clientId || !clientSecret) {
      console.log('❌ YouTube credentials not configured')
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'youtube',
        action: 'oauth_callback_config_missing',
        status: 'failed',
        errorCode: 'CONFIG_MISSING',
        errorMessage: 'YouTube OAuth credentials not configured',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=config_missing', req.nextUrl.origin)
      )
    }

    // ✅ Step 6: Exchange code for access token
    console.log('✅ Step 6: Exchanging code for access token')
    const youtubeClient = createYouTubeClient(clientId, clientSecret, redirectUri)

    // Get PKCE code verifier from cookie
    const codeVerifier = req.cookies.get(`oauth_youtube_verifier`)?.value
    const tokenData = await youtubeClient.exchangeCodeForToken(code, codeVerifier || undefined)

    console.log('✅ Token exchange successful')

    // ✅ Step 7: Get channel information
    console.log('✅ Step 7: Fetching YouTube channel information')
    if (!tokenData.access_token) {
      throw new Error('No access token returned from YouTube')
    }

    const channelInfo = await youtubeClient.getChannelInfo(tokenData.access_token)

    if (!channelInfo.items || channelInfo.items.length === 0) {
      throw new Error('No YouTube channel found for this account')
    }

    const channel = channelInfo.items[0]
    const channelId = channel.id
    const channelTitle = channel.snippet.title
    const channelThumbnail = channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url

    console.log('✅ Channel info fetched:', { channelId, channelTitle })

    // ✅ Step 8: Save credentials securely
    console.log('✅ Step 8: Saving YouTube credentials')
    const credentialService = new CredentialService(supabase)

    const credentials: YouTubeCredentials = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_in
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : undefined,
      isConnected: true,
      channelId: channelId,
      channelTitle: channelTitle,
      channelThumbnail: channelThumbnail,
      connectedAt: new Date().toISOString(),
    }

    const socialAccount = await credentialService.savePlatformCredentials(
      workspaceId,
      'youtube',
      credentials
    )

    console.log('✅ Credentials saved successfully')

    // ✅ Step 9: Log success
    await logAuditEvent({
      workspaceId,
      userId: user.id,
      platform: 'youtube',
      action: 'oauth_callback_successful',
      status: 'success',
      ipAddress: ipAddress || undefined,
      metadata: {
        channelId,
        channelTitle,
      },
    })

    console.log('✅ YouTube OAuth completed successfully')
    return NextResponse.redirect(
      new URL('/settings?tab=accounts&oauth_success=youtube', req.nextUrl.origin)
    )
  } catch (error) {
    console.error('❌ YouTube OAuth callback error:', error)

    // Attempt to log error
    try {
      const supabase = await createServerClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: userRow } = await supabase
          .from('users')
          .select('workspace_id')
          .eq('id', user.id)
          .maybeSingle()

        if (userRow) {
          await logAuditEvent({
            workspaceId: (userRow as any).workspace_id,
            userId: user.id,
            platform: 'youtube',
            action: 'oauth_callback_error',
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : String(error),
            errorCode: 'CALLBACK_ERROR',
            ipAddress: req.headers.get('x-forwarded-for') || undefined,
          })
        }
      }
    } catch (auditError) {
      console.error('Failed to log YouTube OAuth error:', auditError)
    }

    return NextResponse.redirect(
      new URL('/settings?tab=accounts&oauth_error=callback_error', req.nextUrl.origin)
    )
  }
}
