/**
 * LinkedIn OAuth Callback
 * GET /api/auth/oauth/linkedin/callback?code=xxx&state=xxx
 *
 * Handles OAuth callback from LinkedIn
 * - Supports refresh tokens for token renewal
 * - Gets user profile info
 * - Saves credentials securely
 * - NEVER stores API secrets
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
        new URL('/?error=oauth_unauthorized', req.nextUrl.origin)
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
        platform: 'linkedin',
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
        platform: 'linkedin',
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
        platform: 'linkedin',
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
    const stateVerification = await verifyOAuthState(workspaceId, 'linkedin', state)

    if (!stateVerification.valid) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'linkedin',
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
    const clientId = process.env.LINKEDIN_CLIENT_ID
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
    const callbackUrl = `${baseUrl}/api/auth/oauth/linkedin/callback`

    if (!clientId || !clientSecret) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'linkedin',
        action: 'oauth_config_missing',
        status: 'failed',
        errorCode: 'CONFIG_MISSING',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.redirect(
        new URL('/settings?tab=accounts&oauth_error=config_missing', req.nextUrl.origin)
      )
    }

    let tokenData: any
    try {
      const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
        }),
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json()
        throw new Error(`Token exchange failed: ${errorData.error_description || tokenResponse.statusText}`)
      }

      tokenData = await tokenResponse.json()

      if (!tokenData.access_token) {
        throw new Error('No access token in response')
      }
    } catch (exchangeError) {
      console.error('Token exchange error:', exchangeError)

      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'linkedin',
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

    // ✅ Step 7: Get user profile
    let profileName = 'LinkedIn User'
    let profileId = null

    try {
      const profileResponse = await fetch(
        'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName)',
        {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        }
      )

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        const firstName = profileData.firstName?.localized?.[Object.keys(profileData.firstName.localized)[0]] || ''
        const lastName = profileData.lastName?.localized?.[Object.keys(profileData.lastName.localized)[0]] || ''
        profileName = `${firstName} ${lastName}`.trim() || 'LinkedIn User'
        profileId = profileData.id
      }
    } catch (profileError) {
      console.warn('Failed to get profile:', profileError)
      // Continue with default profile name
    }

    // ✅ Step 8: Get user URN for posting
    let userUrn = null
    try {
      const urnResponse = await fetch('https://api.linkedin.com/v2/me?projection=(id)', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      })

      if (urnResponse.ok) {
        const urnData = await urnResponse.json()
        userUrn = `urn:li:person:${urnData.id}`
      }
    } catch (urnError) {
      console.warn('Failed to get user URN:', urnError)
    }

    // ✅ Step 9: Build credentials object
    // IMPORTANT: DO NOT store clientSecret!
    const credentials: any = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || null,
      profileId: userUrn || profileId,
      profileName: profileName,
      tokenType: tokenData.token_type || 'Bearer',
      isConnected: true,
      connectedAt: new Date().toISOString(),
    }

    // LinkedIn access tokens expire in 60 days
    if (tokenData.expires_in) {
      credentials.expiresAt = new Date(
        Date.now() + tokenData.expires_in * 1000
      ).toISOString()
    } else {
      credentials.expiresAt = new Date(
        Date.now() + 60 * 24 * 60 * 60 * 1000
      ).toISOString()
    }

    // ✅ Step 10: Save credentials
    try {
      await CredentialService.savePlatformCredentials(
        'linkedin',
        credentials,
        user.id,
        workspaceId
      )
    } catch (saveError) {
      console.error('Failed to save credentials:', saveError)

      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform: 'linkedin',
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

    // ✅ Step 11: Success
    const response = NextResponse.redirect(
      new URL('/settings?tab=accounts&oauth_success=linkedin', req.nextUrl.origin)
    )

    await logAuditEvent({
      workspaceId,
      userId: user.id,
      platform: 'linkedin',
      action: 'platform_connected',
      status: 'success',
      metadata: {
        profileName,
        hasRefreshToken: !!tokenData.refresh_token,
      },
      ipAddress: ipAddress || undefined,
    })

    return response
  } catch (error) {
    console.error('LinkedIn OAuth callback error:', error)

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
            platform: 'linkedin',
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
