/**
 * Instagram OAuth - Start Authentication Flow
 * POST /api/instagram/auth
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateInstagramAuthUrl } from '@/lib/instagram/client'
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

    // Get Instagram/Facebook credentials from environment
    const appId = process.env.INSTAGRAM_APP_ID || process.env.FACEBOOK_APP_ID
    const appSecret = process.env.INSTAGRAM_APP_SECRET || process.env.FACEBOOK_APP_SECRET

    if (!appId || !appSecret) {
      return NextResponse.json(
        { error: 'Instagram/Facebook API credentials not configured in environment' },
        { status: 500 }
      )
    }

    // Generate callback URL
    const callbackURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/instagram/callback`

    // Generate random state for CSRF protection
    const state = randomBytes(32).toString('hex')

    // Generate Instagram OAuth URL (via Facebook)
    const authUrl = generateInstagramAuthUrl(appId, callbackURL, state)

    // Create response with auth URL
    const response = NextResponse.json({
      url: authUrl,
      state: state,
    })

    // Store state in secure cookie for verification
    response.cookies.set('instagram_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Instagram OAuth error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to initiate Instagram authentication', 
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}
