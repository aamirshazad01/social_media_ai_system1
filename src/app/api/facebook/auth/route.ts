/**
 * Facebook OAuth - Start Authentication Flow
 * POST /api/facebook/auth
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateFacebookAuthUrl } from '@/lib/facebook/client'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Facebook credentials from environment
    const appId = process.env.FACEBOOK_CLIENT_ID
    const appSecret = process.env.FACEBOOK_CLIENT_SECRET

    if (!appId || !appSecret) {
      return NextResponse.json(
        { error: 'Facebook API credentials not configured in environment' },
        { status: 500 }
      )
    }

    // Generate callback URL (ensure no double slash)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || ''
    const callbackURL = `${baseUrl}/api/facebook/callback`

    // Generate random state for CSRF protection
    const state = randomBytes(32).toString('hex')

    // Generate Facebook OAuth URL
    const authUrl = generateFacebookAuthUrl(appId, callbackURL, state)

    // Create response with auth URL
    const response = NextResponse.json({
      url: authUrl,
      state: state,
    })

    // Store state in secure cookie for verification
    response.cookies.set('facebook_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Facebook OAuth error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to initiate Facebook authentication', 
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}
