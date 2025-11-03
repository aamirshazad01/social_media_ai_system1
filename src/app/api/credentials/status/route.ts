/**
 * Credentials Status Endpoint
 * GET /api/credentials/status
 *
 * Returns connection status for all platforms
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { CredentialService } from '@/services/database/credentialService'

export async function GET(req: NextRequest) {
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

    const workspaceId = (userRow as any).workspace_id

    // ✅ Clean up any invalid credentials first (orphaned records)
    await CredentialService.cleanupInvalidCredentials(workspaceId)

    // ✅ Get connection status
    const status = await CredentialService.getConnectionStatus(workspaceId)

    return NextResponse.json(status)
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
