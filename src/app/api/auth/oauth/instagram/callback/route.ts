/**
 * Instagram OAuth Callback
 * GET /api/auth/oauth/instagram/callback?code=xxx&state=xxx
 *
 * Handles OAuth callback from Instagram
 * - Uses Facebook's OAuth system
 * - Gets Instagram Business Account
 * - Supports multiple accounts selection
 * - Saves account credentials
 * - NEVER stores API keys
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyOAuthState } from '@/services/database/oauthStateService'
import { CredentialService } from '@/services/database/credentialService'
import { logAuditEvent } from '@/services/database/auditLogService'

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
      return NextResponse.redirect(
        new URL('/login?error=oauth_unauthorized', req.nextUrl.origin)
      )
    }

    // ✅ Step 2: Get workspace and verify admin role
    const { data: userRow } = await supabase
      .from('users')
      .select('workspace_id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (!userRow) {
      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=no_workspace', req.nextUrl.origin)
      )
    }

    const workspaceId = (userRow as any).workspace_id
    const userRole = (userRow as any).role

    // Check if user is admin (required for OAuth connections)
    if (userRole !== 'admin') {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'instagram',
        action: 'oauth_callback_unauthorized',
        status: 'failed',
        errorCode: 'INSUFFICIENT_PERMISSIONS',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=insufficient_permissions', req.nextUrl.origin)
      )
    }

    // ✅ Step 3: Check for OAuth denial
    if (error) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'instagram',
        action: 'oauth_user_denied',
        status: 'failed',
        errorCode: error,
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=user_denied', req.nextUrl.origin)
      )
    }

    // ✅ Step 4: Validate parameters
    if (!code || !state) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'instagram',
        action: 'oauth_missing_params',
        status: 'failed',
        errorCode: 'MISSING_PARAMS',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=missing_params', req.nextUrl.origin)
      )
    }

    // ✅ Step 5: Verify CSRF state
    const stateVerification = await verifyOAuthState(workspaceId, 'instagram', state)

    if (!stateVerification.valid) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'instagram',
        action: 'oauth_csrf_check_failed',
        status: 'failed',
        errorMessage: stateVerification.error,
        errorCode: 'CSRF_FAILED',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=csrf_check_failed', req.nextUrl.origin)
      )
    }

    // ✅ Step 6: Exchange code for token
    const appId = process.env.INSTAGRAM_CLIENT_ID || process.env.FACEBOOK_CLIENT_ID
    const appSecret = process.env.INSTAGRAM_CLIENT_SECRET || process.env.FACEBOOK_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
    const callbackUrl = `${baseUrl}/api/auth/oauth/instagram/callback`

    if (!appId || !appSecret) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'instagram',
        action: 'oauth_config_missing',
        status: 'failed',
        errorCode: 'CONFIG_MISSING',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=config_missing', req.nextUrl.origin)
      )
    }

    let accessToken: string
    try {
      console.log('🔄 Exchanging Instagram auth code for token...')
      console.log('Callback URL:', callbackUrl)

      const tokenResponse = await fetch('https://graph.instagram.com/v18.0/oauth/access_token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: callbackUrl,
          code,
        }),
      })

      console.log('📝 Token response status:', tokenResponse.status)

      const tokenData = await tokenResponse.json()
      console.log('📋 Token response data:', {
        hasToken: !!tokenData.access_token,
        error: tokenData.error,
        errorDescription: tokenData.error_description,
      })

      if (!tokenResponse.ok) {
        throw new Error(
          `Token exchange failed (${tokenResponse.status}): ${
            tokenData.error_description || tokenData.error || tokenResponse.statusText
          }`
        )
      }

      if (!tokenData.access_token) {
        throw new Error('No access token in response')
      }

      accessToken = tokenData.access_token
      console.log('✅ Got access token')
    } catch (exchangeError) {
      console.error('❌ Token exchange error:', exchangeError)

      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'instagram',
        action: 'oauth_token_exchange_failed',
        status: 'failed',
        errorMessage: exchangeError instanceof Error ? exchangeError.message : String(exchangeError),
        errorCode: 'TOKEN_EXCHANGE_FAILED',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=token_exchange_failed', req.nextUrl.origin)
      )
    }

    // ✅ Step 7: Get long-lived token
    let longLivedToken = accessToken
    try {
      const refreshResponse = await fetch(
        `https://graph.instagram.com/v18.0/access_token?${new URLSearchParams({
          grant_type: 'ig_exchange_user_access_token',
          access_token: accessToken,
        })}`
      )

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        longLivedToken = refreshData.access_token || accessToken
      }
    } catch (refreshError) {
      console.warn('Failed to get long-lived token:', refreshError)
      // Continue with short-lived token
    }

    // ✅ Step 8: Get Instagram business account
    let instagramUserId: string | null = null
    let instagramUsername: string | null = null

    try {
      const igResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username,name&access_token=${longLivedToken}`
      )

      if (igResponse.ok) {
        const igData = await igResponse.json()
        instagramUserId = igData.id
        instagramUsername = igData.username
      }
    } catch (igError) {
      console.error('Failed to get Instagram account:', igError)

      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'instagram',
        action: 'oauth_get_account_failed',
        status: 'failed',
        errorMessage: igError instanceof Error ? igError.message : String(igError),
        errorCode: 'GET_ACCOUNT_FAILED',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=get_account_failed', req.nextUrl.origin)
      )
    }

    // ✅ Step 9: Validate that we got an account
    if (!instagramUserId || !instagramUsername) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'instagram',
        action: 'oauth_no_account_found',
        status: 'failed',
        errorCode: 'NO_ACCOUNT_FOUND',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=no_account_found', req.nextUrl.origin)
      )
    }

    // ✅ Step 10: Build credentials object
    // IMPORTANT: DO NOT store API keys!
    const credentials: any = {
      accessToken: longLivedToken,
      userId: instagramUserId,
      username: instagramUsername,
      isConnected: true,
      connectedAt: new Date().toISOString(),
    }

    // Instagram tokens typically last 60 days
    credentials.expiresAt = new Date(
      Date.now() + 60 * 24 * 60 * 60 * 1000
    ).toISOString()

    // ✅ Step 11: Save credentials
    try {
      await CredentialService.savePlatformCredentials(
        'instagram',
        credentials,
        user.id,
        workspaceId,
        {
          pageId: instagramUserId,
          pageName: instagramUsername,
        }
      )
    } catch (saveError) {
      console.error('Failed to save credentials:', saveError)

      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'instagram',
        action: 'oauth_save_credentials_failed',
        status: 'failed',
        errorMessage: saveError instanceof Error ? saveError.message : String(saveError),
        errorCode: 'SAVE_CREDENTIALS_FAILED',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=save_failed', req.nextUrl.origin)
      )
    }

    // ✅ Step 12: Success
    const response = NextResponse.redirect(
      new URL('/settings?tab=accounts&oauth_success=instagram', req.nextUrl.origin)
    )

    await logAuditEvent({
      workspaceId,
      userId: user.id,
      platform: 'instagram',
      action: 'platform_connected',
      status: 'success',
      metadata: {
        userId: instagramUserId,
        username: instagramUsername,
      },
      ipAddress: ipAddress || undefined,
    })

    return response
  } catch (error) {
    console.error('Instagram OAuth callback error:', error)

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
            platform: 'instagram',
            action: 'oauth_callback_error',
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : String(error),
            errorCode: 'CALLBACK_ERROR',
            ipAddress: req.headers.get('x-forwarded-for') || undefined,
          })
        }
      }
    } catch (auditError) {
      console.error('Failed to log error:', auditError)
    }

    return NextResponse.redirect(
      new URL('/settings?tab=accounts&oauth_error=callback_error', req.nextUrl.origin)
    )
  }
}
