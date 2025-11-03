import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

interface PlatformHealth {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
  status: 'healthy' | 'warning' | 'error'
  message: string
  lastChecked?: string
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's workspace
    const { data: userData } = await supabase
      .from('users')
      .select('workspace_id, role')
      .eq('id', user.id)
      .single()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only admins can view API health
    if (userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const health: Record<string, PlatformHealth> = {}

    // Check Twitter API
    health.twitter = checkTwitterHealth()

    // Check LinkedIn API
    health.linkedin = checkLinkedInHealth()

    // Check Facebook API
    health.facebook = checkFacebookHealth()

    // Check Instagram API (uses Facebook)
    health.instagram = checkInstagramHealth()

    return NextResponse.json(health)
  } catch (error) {
    console.error('API health check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function checkTwitterHealth(): PlatformHealth {
  const clientId = process.env.TWITTER_CLIENT_ID
  const clientSecret = process.env.TWITTER_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return {
      platform: 'twitter',
      status: 'error',
      message: 'OAuth credentials not configured',
      lastChecked: new Date().toISOString(),
    }
  }

  return {
    platform: 'twitter',
    status: 'healthy',
    message: 'Twitter OAuth is configured',
    lastChecked: new Date().toISOString(),
  }
}

function checkLinkedInHealth(): PlatformHealth {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return {
      platform: 'linkedin',
      status: 'error',
      message: 'OAuth credentials not configured',
      lastChecked: new Date().toISOString(),
    }
  }

  return {
    platform: 'linkedin',
    status: 'healthy',
    message: 'LinkedIn OAuth is configured',
    lastChecked: new Date().toISOString(),
  }
}

function checkFacebookHealth(): PlatformHealth {
  const appId = process.env.FACEBOOK_APP_ID
  const appSecret = process.env.FACEBOOK_APP_SECRET

  if (!appId || !appSecret) {
    return {
      platform: 'facebook',
      status: 'error',
      message: 'OAuth credentials not configured',
      lastChecked: new Date().toISOString(),
    }
  }

  return {
    platform: 'facebook',
    status: 'healthy',
    message: 'Facebook OAuth is configured',
    lastChecked: new Date().toISOString(),
  }
}

function checkInstagramHealth(): PlatformHealth {
  // Instagram uses Facebook's OAuth system
  const appId = process.env.FACEBOOK_APP_ID
  const appSecret = process.env.FACEBOOK_APP_SECRET

  if (!appId || !appSecret) {
    return {
      platform: 'instagram',
      status: 'error',
      message: 'Facebook OAuth credentials not configured (required for Instagram)',
      lastChecked: new Date().toISOString(),
    }
  }

  return {
    platform: 'instagram',
    status: 'healthy',
    message: 'Instagram OAuth is configured (via Facebook)',
    lastChecked: new Date().toISOString(),
  }
}
