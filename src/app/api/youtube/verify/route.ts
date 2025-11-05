/**
 * YouTube - Verify Credentials
 * POST /api/youtube/verify
 *
 * Verifies YouTube credentials and returns channel information
 * Follows the same pattern as /api/facebook/verify and /api/tiktok/verify
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { CredentialService } from '@/services/database'
import type { YouTubeCredentials } from '@/types'

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

    // Get workspace_id
    const { data: userData } = await supabase
      .from('users')
      .select('workspace_id')
      .eq('id', user.id)
      .maybeSingle<{ workspace_id: string }>()

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const workspaceId = userData.workspace_id

    // Get YouTube credentials from database
    const credentialService = new CredentialService(supabase)
    const credentials = await credentialService.getPlatformCredentials(
      workspaceId,
      'youtube'
    )

    if (!credentials || !('accessToken' in credentials) || !('channelId' in credentials)) {
      return NextResponse.json(
        { error: 'YouTube not connected', connected: false },
        { status: 400 }
      )
    }

    const youTubeCreds = credentials as YouTubeCredentials

    // Check if token is expired
    if (youTubeCreds.expiresAt && new Date(youTubeCreds.expiresAt) < new Date()) {
      return NextResponse.json(
        {
          error: 'Access token expired. Please reconnect.',
          connected: false,
          expired: true
        },
        { status: 400 }
      )
    }

    // Token is valid, return channel info
    return NextResponse.json({
      connected: true,
      channelId: youTubeCreds.channelId,
      channelTitle: youTubeCreds.channelTitle,
      channelThumbnail: youTubeCreds.channelThumbnail,
      connectedAt: youTubeCreds.connectedAt
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to verify YouTube credentials',
        connected: false,
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}
