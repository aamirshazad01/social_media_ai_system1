/**
 * Audit Log Service
 * Logs all credential-related events for compliance and debugging
 */

import { supabase } from '@/lib/supabase'
import type { Platform } from '@/types'

export interface AuditEventParams {
  workspaceId: string
  userId: string
  platform: Platform
  action: string
  status: 'success' | 'failed' | 'partial'
  errorMessage?: string
  errorCode?: string
  ipAddress?: string
  userAgent?: string
  requestPath?: string
  metadata?: any
}

/**
 * Log an audit event
 */
export async function logAuditEvent({
  workspaceId,
  userId,
  platform,
  action,
  status,
  errorMessage,
  errorCode,
  ipAddress,
  userAgent,
  requestPath,
  metadata,
}: AuditEventParams): Promise<void> {
  try {
    const { error } = await supabase.from('credential_audit_log').insert({
      workspace_id: workspaceId,
      user_id: userId,
      platform,
      action,
      status,
      error_message: errorMessage || null,
      error_code: errorCode || null,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
      request_path: requestPath || null,
      metadata: metadata || null,
    } as any)

    if (error) {
      console.error('Failed to insert audit log:', error)
    }
  } catch (error) {
    console.error('Audit logging error:', error)
    // Don't throw - logging failures shouldn't break the app
  }
}

/**
 * Get audit logs for a workspace
 */
export async function getAuditLogs(
  workspaceId: string,
  filters?: {
    platform?: Platform
    action?: string
    status?: string
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
  }
): Promise<any[]> {
  try {
    let query = supabase
      .from('credential_audit_log')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (filters?.platform) {
      query = query.eq('platform', filters.platform)
    }

    if (filters?.action) {
      query = query.eq('action', filters.action)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString())
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString())
    }

    const limit = Math.min(filters?.limit || 100, 1000) // Cap at 1000
    const offset = filters?.offset || 0

    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }
}

/**
 * Get audit logs for a specific user
 */
export async function getUserAuditLogs(
  workspaceId: string,
  userId: string,
  options?: {
    limit?: number
    offset?: number
  }
): Promise<any[]> {
  try {
    let query = supabase
      .from('credential_audit_log')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const limit = Math.min(options?.limit || 50, 500)
    const offset = options?.offset || 0

    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user audit logs:', error)
    return []
  }
}

/**
 * Get summary of credential activities
 */
export async function getAuditSummary(
  workspaceId: string,
  days: number = 7
): Promise<{
  totalConnections: number
  totalDisconnections: number
  totalRefreshes: number
  totalFailures: number
  platformStats: Record<string, any>
  recentActivity: any[]
}> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const logs = await getAuditLogs(workspaceId, {
      startDate,
      limit: 1000,
    })

    const summary = {
      totalConnections: 0,
      totalDisconnections: 0,
      totalRefreshes: 0,
      totalFailures: 0,
      platformStats: {
        twitter: { connections: 0, disconnections: 0, refreshes: 0, failures: 0 },
        linkedin: { connections: 0, disconnections: 0, refreshes: 0, failures: 0 },
        facebook: { connections: 0, disconnections: 0, refreshes: 0, failures: 0 },
        instagram: { connections: 0, disconnections: 0, refreshes: 0, failures: 0 },
      },
      recentActivity: logs.slice(0, 10),
    }

    for (const log of logs) {
      if (log.status === 'failed') {
        summary.totalFailures++
        ;(summary.platformStats as any)[(log as any).platform].failures++
      }

      if (log.action === 'platform_connected') {
        summary.totalConnections++
        ;(summary.platformStats as any)[(log as any).platform].connections++
      } else if (log.action === 'platform_disconnected') {
        summary.totalDisconnections++
        ;(summary.platformStats as any)[(log as any).platform].disconnections++
      } else if (log.action === 'token_refreshed') {
        summary.totalRefreshes++
        ;(summary.platformStats as any)[(log as any).platform].refreshes++
      }
    }

    return summary
  } catch (error) {
    console.error('Error getting audit summary:', error)
    return {
      totalConnections: 0,
      totalDisconnections: 0,
      totalRefreshes: 0,
      totalFailures: 0,
      platformStats: {
        twitter: { connections: 0, disconnections: 0, refreshes: 0, failures: 0 },
        linkedin: { connections: 0, disconnections: 0, refreshes: 0, failures: 0 },
        facebook: { connections: 0, disconnections: 0, refreshes: 0, failures: 0 },
        instagram: { connections: 0, disconnections: 0, refreshes: 0, failures: 0 },
      },
      recentActivity: [],
    }
  }
}

/**
 * Clean up old audit logs (older than 90 days)
 */
export async function cleanupOldAuditLogs(): Promise<number> {
  try {
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const { data, error } = await supabase
      .from('credential_audit_log')
      .delete()
      .lt('created_at', ninetyDaysAgo.toISOString())
      .select('id')

    if (error) throw error

    return data?.length || 0
  } catch (error) {
    console.error('Error cleaning up audit logs:', error)
    return 0
  }
}
