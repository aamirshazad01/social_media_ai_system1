/**
 * Twitter OAuth - Start Authentication Flow
 * POST /api/twitter/auth
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createTwitterClient } from '@/lib/twitter/client'

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

    // Get callback URL from environment (ensure no double slash)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || ''
    const callbackURL = `${baseUrl}/api/twitter/callback`

    // Create Twitter client
    const twitterClient = createTwitterClient()

    // Generate OAuth request token
    const authLink = await twitterClient.generateAuthLink(callbackURL, {
      linkMode: 'authorize', // Use 'authorize' to force user to re-authenticate each time
    })

    // Store oauth_token_secret temporarily in the session
    // In production, store this in Redis or a database with expiration
    // For now, we'll return it to the client to pass back in the callback
    const response = NextResponse.json({
      url: authLink.url,
      oauth_token: authLink.oauth_token,
      oauth_token_secret: authLink.oauth_token_secret,
    })

    // Set a secure cookie with the oauth_token_secret
    response.cookies.set('twitter_oauth_token_secret', authLink.oauth_token_secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Twitter OAuth error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Twitter authentication', details: (error as Error).message },
      { status: 500 }
    )
  }
}
