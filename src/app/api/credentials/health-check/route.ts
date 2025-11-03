/**
 * Credentials Health Check Endpoint
 * GET /api/credentials/health-check
 *
 * Verifies all connected platforms' credentials
 * Checks for expiring tokens
 * Suitable for background jobs
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

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

    // ✅ Get all accounts for workspace
    const { data: accounts, error: accountsError } = await supabase
      .from('social_accounts')
      .select('platform, is_connected, expires_at, last_refreshed_at, refresh_error_count')
      .eq('workspace_id', workspaceId)
      .eq('is_connected', true)

    if (accountsError) throw accountsError

    // ✅ Check each account
    const now = Date.now()
    const oneDayMs = 1000 * 60 * 60 * 24
    const threeDaysMs = 3 * oneDayMs

    const healthStatus: any = {
      timestamp: new Date().toISOString(),
      workspace_id: workspaceId,
      accounts: {},
      summary: {
        total_connected: 0,
        expiring_soon: 0,
        expired: 0,
        needs_refresh: 0,
      },
    }

    for (const account of accounts || []) {
      const expiresAt = (account as any).expires_at ? new Date((account as any).expires_at).getTime() : null
      const timeUntilExpiry = expiresAt ? expiresAt - now : null

      let status = 'healthy'
      if (expiresAt && timeUntilExpiry !== null && timeUntilExpiry <= 0) {
        status = 'expired'
        healthStatus.summary.expired++
      } else if (expiresAt && timeUntilExpiry !== null && timeUntilExpiry < oneDayMs) {
        status = 'expiring_soon'
        healthStatus.summary.expiring_soon++
      }

      healthStatus.accounts[(account as any).platform] = {
        connected: (account as any).is_connected,
        status,
        expires_at: (account as any).expires_at,
        time_until_expiry_days: timeUntilExpiry ? Math.ceil(timeUntilExpiry / oneDayMs) : null,
        last_refreshed: (account as any).last_refreshed_at,
        refresh_errors: (account as any).refresh_error_count,
      }

      healthStatus.summary.total_connected++

      // Need refresh if expiring within 3 days
      if (expiresAt && timeUntilExpiry !== null && timeUntilExpiry < threeDaysMs && timeUntilExpiry > 0) {
        healthStatus.summary.needs_refresh++
      }
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    )
  }
}
