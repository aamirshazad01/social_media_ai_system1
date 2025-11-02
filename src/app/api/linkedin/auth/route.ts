/**
 * LinkedIn OAuth - Start Authentication Flow
 * POST /api/linkedin/auth
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateLinkedInAuthUrl } from '@/lib/linkedin/client'
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

    // Get LinkedIn credentials from environment
    const clientId = process.env.LINKEDIN_CLIENT_ID
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'LinkedIn API credentials not configured in environment' },
        { status: 500 }
      )
    }

    // Generate callback URL
    const callbackURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/linkedin/callback`

    // Generate random state for CSRF protection
    const state = randomBytes(32).toString('hex')

    // Generate LinkedIn OAuth URL
    const authUrl = generateLinkedInAuthUrl(clientId, callbackURL, state)

    // Create response with auth URL
    const response = NextResponse.json({
      url: authUrl,
      state: state,
    })

    // Store state in secure cookie for verification
    response.cookies.set('linkedin_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    return response
  } catch (error) {
    console.error('LinkedIn OAuth error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to initiate LinkedIn authentication', 
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}
