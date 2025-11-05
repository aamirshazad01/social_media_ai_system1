/**
 * TikTok - Verify Credentials
 * POST /api/tiktok/verify
 *
 * Verifies TikTok credentials and returns account information
 * Follows the same pattern as /api/facebook/verify
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { CredentialService } from '@/services/database'
import type { TikTokCredentials } from '@/types'

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

    // Get TikTok credentials from database
    const credentialService = new CredentialService(supabase)
    const credentials = await credentialService.getPlatformCredentials(
      workspaceId,
      'tiktok'
    )

    if (!credentials || !('accessToken' in credentials) || !('openId' in credentials)) {
      return NextResponse.json(
        { error: 'TikTok not connected', connected: false },
        { status: 400 }
      )
    }

    const tikTokCreds = credentials as TikTokCredentials

    // Check if token is expired
    if (tikTokCreds.expiresAt && new Date(tikTokCreds.expiresAt) < new Date()) {
      return NextResponse.json(
        {
          error: 'Access token expired. Please reconnect.',
          connected: false,
          expired: true
        },
        { status: 400 }
      )
    }

    // Token is valid, return account info
    return NextResponse.json({
      connected: true,
      username: tikTokCreds.username,
      displayName: tikTokCreds.displayName,
      avatarUrl: tikTokCreds.avatarUrl,
      connectedAt: tikTokCreds.connectedAt,
      openId: tikTokCreds.openId
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to verify TikTok credentials',
        connected: false,
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}
