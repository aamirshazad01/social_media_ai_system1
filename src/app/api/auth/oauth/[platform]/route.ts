/**
 * OAuth Initiation Route
 * POST /api/auth/oauth/[platform]
 *
 * Initiates OAuth flow for any supported platform
 * Generates CSRF state and PKCE parameters
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createOAuthState } from '@/services/database/oauthStateService'
import { logAuditEvent } from '@/services/database/auditLogService'
import type { Platform } from '@/types'

const OAUTH_URLS: Record<string, string> = {
  twitter: 'https://twitter.com/i/oauth2/authorize',
  linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
  facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
  instagram: 'https://www.facebook.com/v18.0/dialog/oauth', // Instagram uses Facebook OAuth
}

const SCOPES: Record<string, string[]> = {
  twitter: ['tweet.write', 'tweet.read', 'users.read'],
  linkedin: ['r_basicprofile', 'w_member_social', 'r_emailaddress'],
  facebook: ['pages_manage_posts', 'pages_read_engagement', 'pages_manage_metadata'],
  instagram: ['instagram_graph_user_profile', 'pages_manage_posts', 'pages_read_engagement'],
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: platformParam } = await params
  const platform = platformParam as Platform
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
  const userAgent = req.headers.get('user-agent')

  try {
    // ✅ Step 1: Authenticate user
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NOT_AUTHENTICATED' },
        { status: 401 }
      )
    }

    // ✅ Step 2: Get workspace
    const { data: userRow, error: userError } = await supabase
      .from('users')
      .select('workspace_id')
      .eq('id', user.id)
      .maybeSingle()

    if (userError || !userRow) {
      return NextResponse.json(
        { error: 'Workspace not found', code: 'NO_WORKSPACE' },
        { status: 400 }
      )
    }

    const workspaceId = (userRow as any).workspace_id

    // ✅ Step 3: Validate platform
    if (!Object.keys(OAUTH_URLS).includes(platform)) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform,
        action: 'oauth_initiation_invalid_platform',
        status: 'failed',
        errorCode: 'INVALID_PLATFORM',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.json(
        { error: 'Invalid platform', code: 'INVALID_PLATFORM' },
        { status: 400 }
      )
    }

    // ✅ Step 4: Get platform configuration
    const clientId = process.env[`${platform.toUpperCase()}_CLIENT_ID`]
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
    const callbackUrl = `${baseUrl}/api/auth/oauth/${platform}/callback`

    if (!clientId) {
      await logAuditEvent({
        workspaceId,
        userId: user.id,
        platform,
        action: 'oauth_initiation_config_missing',
        status: 'failed',
        errorCode: 'CONFIG_MISSING',
        ipAddress: ipAddress || undefined,
      })

      return NextResponse.json(
        { error: `${platform} is not configured`, code: 'CONFIG_MISSING' },
        { status: 500 }
      )
    }

    // ✅ Step 5: Create OAuth state (CSRF protection)
    const oauthState = await createOAuthState(
      workspaceId,
      platform,
      ipAddress || undefined,
      userAgent || undefined,
      true // Use PKCE for all platforms
    )

    // ✅ Step 6: Build OAuth authorization URL
    const params = new URLSearchParams({
      ...(platform === 'instagram' ? { app_id: clientId } : { client_id: clientId }),
      redirect_uri: callbackUrl,
      response_type: 'code',
      state: oauthState.state,
    })

    // Add platform-specific parameters
    if (platform === 'twitter') {
      params.append('code_challenge', oauthState.codeChallenge!)
      params.append('code_challenge_method', 'S256')
      params.append('scope', SCOPES[platform].join(' '))
    } else if (platform === 'linkedin') {
      params.append('scope', SCOPES[platform].join('%20'))
    } else if (platform === 'facebook' || platform === 'instagram') {
      params.append('scope', SCOPES[platform].join(','))
      params.append('display', 'popup')
    }

    const oauthUrl = `${OAUTH_URLS[platform]}?${params.toString()}`

    // ✅ Step 7: Store PKCE verifier in secure httpOnly cookie
    const response = NextResponse.json({
      success: true,
      redirectUrl: oauthUrl,
    })

    if (oauthState.codeVerifier) {
      response.cookies.set(
        `oauth_${platform}_verifier`,
        oauthState.codeVerifier,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 10 * 60, // 10 minutes
          path: '/',
        }
      )
    }

    // ✅ Step 8: Log success
    await logAuditEvent({
      workspaceId,
      userId: user.id,
      platform,
      action: 'oauth_initiation_successful',
      status: 'success',
      ipAddress: ipAddress || undefined,
    })

    return response
  } catch (error) {
    console.error(`OAuth initiation error for ${platform}:`, error)

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
            platform,
            action: 'oauth_initiation_error',
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : String(error),
            errorCode: 'INITIATION_ERROR',
            ipAddress: req.headers.get('x-forwarded-for') || undefined,
          })
        }
      }
    } catch (auditError) {
      console.error('Failed to log OAuth error:', auditError)
    }

    return NextResponse.json(
      { error: 'Failed to initiate OAuth', code: 'INITIATION_ERROR' },
      { status: 500 }
    )
  }
}
