/**
 * Twitter OAuth Callback
 * GET /api/auth/oauth/twitter/callback?code=xxx&state=xxx
 *
 * Handles OAuth callback from Twitter
 * - Verifies CSRF state
 * - Exchanges code for token using PKCE
 * - Saves credentials securely
 * - NEVER stores API keys
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyOAuthState } from '@/services/database/oauthStateService'
import { CredentialService } from '@/services/database/credentialService'
import { logAuditEvent } from '@/services/database/auditLogService'
import { verifyPKCECode } from '@/services/database/oauthStateService'

/**
 * Helper function to redirect with error
 * Errors are logged but not exposed in URL
 */
function createErrorRedirect(baseUrl: string): string {
  const url = new URL(baseUrl)
  url.pathname = '/settings'
  url.searchParams.set('tab', 'accounts')
  return url.toString()
}

export async function GET(req: NextRequest) {
  const supabase = await createServerClient()
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')

  try {
    // ✅ Step 1: Check authentication
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const response = NextResponse.redirect(
        new URL('/login?error=oauth_unauthorized', req.nextUrl.origin)
      )
      return response
    }

    // ✅ Step 2: Get workspace and verify admin role
    const { data: userRow } = await supabase
      .from('users')
      .select('workspace_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!userRow) {
      const response = NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=no_workspace', req.nextUrl.origin)
      )
      return response
    }

    const workspaceId = (userRow as any).workspace_id
    const userRole = (userRow as any).role

    // Check if user is admin (required for OAuth connections)
    if (userRole !== 'admin') {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'twitter',
        action: 'oauth_callback_unauthorized',
        status: 'failed',
        errorCode: 'INSUFFICIENT_PERMISSIONS',
        ipAddress: ipAddress || undefined,
      })

      const response = NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=insufficient_permissions', req.nextUrl.origin)
      )
      return response
    }

    // ✅ Step 3: Check for OAuth denial from Twitter
    if (error) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'twitter',
        action: 'oauth_user_denied',
        status: 'failed',
        errorCode: error,
        ipAddress: ipAddress || undefined,
      })

      const response = NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=user_denied', req.nextUrl.origin)
      )
      return response
    }

    // ✅ Step 4: Validate required parameters
    if (!code || !state) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'twitter',
        action: 'oauth_missing_params',
        status: 'failed',
        errorCode: 'MISSING_PARAMS',
        ipAddress: ipAddress || undefined,
      })

      const response = NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=missing_params', req.nextUrl.origin)
      )
      return response
    }

    // ✅ Step 5: Verify CSRF state (prevents replay attacks)
    const stateVerification = await verifyOAuthState(workspaceId, 'twitter', state)

    if (!stateVerification.valid) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'twitter',
        action: 'oauth_csrf_check_failed',
        status: 'failed',
        errorMessage: stateVerification.error,
        errorCode: 'CSRF_FAILED',
        ipAddress: ipAddress || undefined,
      })

      const response = NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=csrf_check_failed', req.nextUrl.origin)
      )
      return response
    }

    // ✅ Step 6: Get PKCE verifier from secure cookie
    const codeVerifier = req.cookies.get('oauth_twitter_verifier')?.value

    if (!codeVerifier) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'twitter',
        action: 'oauth_missing_verifier',
        status: 'failed',
        errorCode: 'MISSING_VERIFIER',
        ipAddress: ipAddress || undefined,
      })

      const response = NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=missing_verifier', req.nextUrl.origin)
      )
      response.cookies.delete('oauth_twitter_verifier')
      return response
    }

    // ✅ Step 7: Exchange code for token
    // Import Twitter client
    const { createTwitterClient } = await import('@/lib/twitter/client')
    const twitterClient = createTwitterClient()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
    const callbackUrl = `${baseUrl}/api/auth/oauth/twitter/callback`

    let tokenData: any
    try {
      console.log('🔐 Step 7: Exchanging Twitter auth code for access token')
      // Use the OAuth2 flow to exchange code for token
      const clientId = process.env.TWITTER_CLIENT_ID
      if (!clientId) {
        throw new Error('Twitter Client ID not configured')
      }

      // twitter-api-v2 uses different method name for OAuth2 token exchange
      tokenData = await (twitterClient as any).oAuth2.accessToken(
        code,
        codeVerifier,
        clientId,
        callbackUrl
      )
      console.log('🔐 Token exchange response:', JSON.stringify(tokenData, null, 2))
    } catch (exchangeError) {
      console.error('❌ Token exchange error:', exchangeError)

      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'twitter',
        action: 'oauth_token_exchange_failed',
        status: 'failed',
        errorMessage: exchangeError instanceof Error ? exchangeError.message : String(exchangeError),
        errorCode: 'TOKEN_EXCHANGE_FAILED',
        ipAddress: ipAddress || undefined,
      })

      const response = NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=token_exchange_failed', req.nextUrl.origin)
      )
      response.cookies.delete('oauth_twitter_verifier')
      return response
    }

    // ✅ Step 8: Get user info to verify credentials
    let twitterUser: any
    try {
      console.log('👤 Step 8: Getting Twitter user info')
      console.log('Token data structure:', Object.keys(tokenData))

      // The token response might be nested, try different approaches
      const accessToken = tokenData.access_token || tokenData.token?.access_token || tokenData
      console.log('Access token extracted:', accessToken?.substring(0, 20) + '...')

      if (!accessToken) {
        throw new Error(`No access token found in token response. Response keys: ${Object.keys(tokenData).join(', ')}`)
      }

      // Create authenticated client with the access token
      const userClient = new (await import('twitter-api-v2')).TwitterApi(accessToken)
      const userMe = userClient.readOnly.v2
      twitterUser = await userMe.me()
      console.log('👤 Twitter user info retrieved:', twitterUser)
    } catch (userError) {
      console.error('❌ Failed to get user info:', userError)

      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'twitter',
        action: 'oauth_get_user_failed',
        status: 'failed',
        errorMessage: userError instanceof Error ? userError.message : String(userError),
        errorCode: 'GET_USER_FAILED',
        ipAddress: ipAddress || undefined,
      })

      const response = NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=get_user_failed', req.nextUrl.origin)
      )
      response.cookies.delete('oauth_twitter_verifier')
      return response
    }

    // ✅ Step 9: Build credentials object
    // IMPORTANT: DO NOT store API keys here!
    // Only store user-specific tokens
    const accessToken = tokenData.access_token || tokenData.token?.access_token || tokenData
    const refreshToken = tokenData.refresh_token || tokenData.token?.refresh_token || null

    const credentials: any = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      username: twitterUser.data?.username || twitterUser.username,
      userId: twitterUser.data?.id || twitterUser.id,
      isConnected: true,
      connectedAt: new Date().toISOString(),
    }

    // Add expiration if provided
    const expiresIn = tokenData.expires_in || tokenData.token?.expires_in
    if (expiresIn) {
      credentials.expiresAt = new Date(
        Date.now() + expiresIn * 1000
      ).toISOString()
    }

    console.log('✅ Step 9: Credentials prepared for user:', credentials.username)

    // ✅ Step 10: Save credentials to database (encrypted)
    try {
      await CredentialService.savePlatformCredentials(
        'twitter',
        credentials,
        user.id,
        workspaceId
      )
    } catch (saveError) {
      console.error('Failed to save credentials:', saveError)

      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'twitter',
        action: 'oauth_save_credentials_failed',
        status: 'failed',
        errorMessage: saveError instanceof Error ? saveError.message : String(saveError),
        errorCode: 'SAVE_CREDENTIALS_FAILED',
        ipAddress: ipAddress || undefined,
      })

      const response = NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=save_failed', req.nextUrl.origin)
      )
      response.cookies.delete('oauth_twitter_verifier')
      return response
    }

    // ✅ Step 11: Success - redirect to dashboard
    const response = NextResponse.redirect(
      new URL('/settings?tab=accounts&oauth_success=twitter', req.nextUrl.origin)
    )

    // Clear the OAuth verifier cookie
    response.cookies.delete('oauth_twitter_verifier')

    // Log success
    await logAuditEvent({
      workspaceId,
      userId: user.id,
      platform: 'twitter',
      action: 'platform_connected',
      status: 'success',
      ipAddress: ipAddress || undefined,
    })

    return response
  } catch (error) {
    console.error('Twitter OAuth callback error:', error)

    // Try to log the error
    try {
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
            platform: 'twitter',
            action: 'oauth_callback_error',
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : String(error),
            errorCode: 'CALLBACK_ERROR',
            ipAddress: req.headers.get('x-forwarded-for') || undefined,
          })
        }
      }
    } catch (auditError) {
      console.error('Failed to log callback error:', auditError)
    }

    const response = NextResponse.redirect(
      new URL('/settings?tab=accounts&oauth_error=callback_error', req.nextUrl.origin)
    )
    response.cookies.delete('oauth_twitter_verifier')
    return response
  }
}
