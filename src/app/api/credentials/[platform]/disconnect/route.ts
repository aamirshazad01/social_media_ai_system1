/**
 * Disconnect Platform Endpoint
 * DELETE /api/credentials/[platform]/disconnect
 *
 * Disconnects a platform account
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { CredentialService } from '@/services/database/credentialService'
import type { Platform } from '@/types'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: platformParam } = await params
  const platform = platformParam as Platform
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')

  try {
    // ✅ Authenticate user
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // ✅ Get workspace
    const { data: userRow, error: userError } = await supabase
      .from('users')
      .select('workspace_id')
      .eq('id', user.id)
      .maybeSingle()

    if (userError || !userRow) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 400 }
      )
    }

    // ✅ Validate platform
    const validPlatforms = ['twitter', 'linkedin', 'facebook', 'instagram']
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    // ✅ Disconnect platform
    await CredentialService.disconnectPlatform(
      platform,
      user.id,
      (userRow as any).workspace_id
    )

    return NextResponse.json({
      success: true,
      message: `${platform} disconnected successfully`,
    })
  } catch (error) {
    console.error('Disconnect error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect' },
      { status: 500 }
    )
  }
}
