/**
 * Server-side Credential Service
 * Single source of truth for credentials (database-backed only)
 * Proper encryption/decryption with workspace-specific keys
 * Token refresh handling
 */

import { supabase } from '@/lib/supabase'
import {
  encryptCredentials,
  decryptCredentials,
  getOrCreateWorkspaceEncryptionKey,
} from '@/lib/auth/encryptionManager'
import { logAuditEvent } from './auditLogService'
import type { Platform } from '@/types'

export class CredentialService {
  /**
   * Save platform credentials to database
   * Encrypts using workspace-specific key
   */
  static async savePlatformCredentials(
    platform: Platform,
    credentials: any,
    userId: string,
    workspaceId: string,
    options: { pageId?: string; pageName?: string } = {}
  ): Promise<void> {
    try {
      // Get encryption key for this workspace
      const encryptionKey = await getOrCreateWorkspaceEncryptionKey(workspaceId)

      // Encrypt credentials
      const encryptedData = await encryptCredentials(credentials, encryptionKey)

      // Check if already exists
      const { data: existing, error: checkError } = await supabase
        .from('social_accounts')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('platform', platform)
        .maybeSingle()

      if (checkError) throw checkError

      // Prepare common data
      const commonData = {
        credentials_encrypted: encryptedData,
        is_connected: credentials.isConnected ?? true,
        username: credentials.username || null,
        expires_at: credentials.expiresAt || null,
        last_refreshed_at: new Date().toISOString(),
        refresh_token_encrypted: credentials.refreshToken
          ? await encryptCredentials(
              { token: credentials.refreshToken },
              encryptionKey
            )
          : null,
        page_id: options.pageId || null,
        page_name: options.pageName || null,
        connected_at: credentials.isConnected ? new Date().toISOString() : null,
        refresh_error_count: 0,
      }

      if (existing) {
        // Update existing
        const { error: updateError } = await (supabase
          .from('social_accounts') as any)
          .update(commonData)
          .eq('id', (existing as any).id)

        if (updateError) throw updateError

        // Log audit
        await logAuditEvent({
          workspaceId,
          userId,
          platform,
          action: 'credentials_updated',
          status: 'success',
        })
      } else {
        // Insert new
        const { error: insertError } = await (supabase.from('social_accounts') as any).insert({
          workspace_id: workspaceId,
          platform,
          ...commonData,
        })

        if (insertError) throw insertError

        await logAuditEvent({
          workspaceId,
          userId,
          platform,
          action: 'platform_connected',
          status: 'success',
        })
      }
    } catch (error) {
      console.error('Error saving credentials:', error)

      await logAuditEvent({
        workspaceId,
        userId,
        platform,
        action: 'credentials_save_failed',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : String(error),
        errorCode: 'SAVE_ERROR',
      }).catch(err => console.error('Failed to log error:', err))

      throw error
    }
  }

  /**
   * Get credentials for a specific platform
   */
  static async getPlatformCredentials(
    platform: Platform,
    userId: string,
    workspaceId: string
  ): Promise<any | null> {
    try {
      const { data, error } = await (supabase
        .from('social_accounts') as any)
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('platform', platform)
        .maybeSingle()

      if (error || !data) return null

      // Decrypt credentials
      const encryptionKey = await getOrCreateWorkspaceEncryptionKey(workspaceId)
      const credentials = await decryptCredentials((data as any).credentials_encrypted, encryptionKey)

      // Decrypt refresh token if exists
      let refreshToken = null
      if ((data as any).refresh_token_encrypted) {
        try {
          const decryptedRefresh = await decryptCredentials(
            (data as any).refresh_token_encrypted,
            encryptionKey
          )
          refreshToken = decryptedRefresh.token
        } catch (err) {
          console.error('Failed to decrypt refresh token:', err)
        }
      }

      return {
        ...credentials,
        refreshToken,
        expiresAt: (data as any).expires_at,
        pageId: (data as any).page_id,
        pageName: (data as any).page_name,
        isConnected: (data as any).is_connected,
      }
    } catch (error) {
      console.error('Error getting credentials:', error)
      return null
    }
  }

  /**
   * Verify and refresh token if needed
   */
  static async verifyAndRefreshToken(
    platform: Platform,
    userId: string,
    workspaceId: string,
    refreshFunction?: (credentials: any) => Promise<any>
  ): Promise<any> {
    try {
      const credentials = await this.getPlatformCredentials(platform, userId, workspaceId)

      if (!credentials) {
        throw new Error(`No credentials found for ${platform}`)
      }

      // Check if token is expired
      if (credentials.expiresAt) {
        const expiresAt = new Date(credentials.expiresAt).getTime()
        const now = Date.now()

        if (now > expiresAt) {
          // Token expired, try to refresh
          if (refreshFunction && credentials.refreshToken) {
            try {
              const newCredentials = await refreshFunction(credentials)

              // Save refreshed credentials
              await this.savePlatformCredentials(
                platform,
                newCredentials,
                userId,
                workspaceId
              )

              await logAuditEvent({
                workspaceId,
                userId,
                platform,
                action: 'token_refreshed',
                status: 'success',
              })

              return newCredentials
            } catch (refreshError) {
              await logAuditEvent({
                workspaceId,
                userId,
                platform,
                action: 'token_refresh_failed',
                status: 'failed',
                errorMessage:
                  refreshError instanceof Error ? refreshError.message : String(refreshError),
                errorCode: 'REFRESH_ERROR',
              })

              throw new Error(
                `Token refresh failed: ${
                  refreshError instanceof Error ? refreshError.message : String(refreshError)
                }`
              )
            }
          } else {
            throw new Error('Token expired and no refresh token available')
          }
        }
      }

      return credentials
    } catch (error) {
      console.error('Token verification failed:', error)
      throw error
    }
  }

  /**
   * Disconnect platform
   */
  static async disconnectPlatform(
    platform: Platform,
    userId: string,
    workspaceId: string
  ): Promise<void> {
    try {
      const { error } = await (supabase
        .from('social_accounts') as any)
        .update({
          is_connected: false,
          credentials_encrypted: null,
          refresh_token_encrypted: null,
          connected_at: null,
        })
        .eq('workspace_id', workspaceId)
        .eq('platform', platform)

      if (error) throw error

      await logAuditEvent({
        workspaceId,
        userId,
        platform,
        action: 'platform_disconnected',
        status: 'success',
      })
    } catch (error) {
      console.error('Error disconnecting platform:', error)

      await logAuditEvent({
        workspaceId,
        userId,
        platform,
        action: 'disconnect_failed',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : String(error),
        errorCode: 'DISCONNECT_ERROR',
      }).catch(err => console.error('Failed to log error:', err))

      throw error
    }
  }

  /**
   * Get connection status for all platforms
   */
  static async getConnectionStatus(
    workspaceId: string
  ): Promise<Record<Platform, any>> {
    try {
      const { data, error } = await (supabase
        .from('social_accounts') as any)
        .select('platform, is_connected, username, page_name, expires_at')
        .eq('workspace_id', workspaceId)

      if (error) throw error

      const status: Record<string, any> = {
        twitter: { isConnected: false },
        linkedin: { isConnected: false },
        facebook: { isConnected: false },
        instagram: { isConnected: false },
      }

      const now = Date.now()
      const oneDayMs = 1000 * 60 * 60 * 24

      for (const account of data || []) {
        const expiresAt: number | null = ((account as any).expires_at
          ? new Date((account as any).expires_at).getTime()
          : null) as number | null

        (status as any)[(account as any).platform] = {
          isConnected: (account as any).is_connected,
          username: (account as any).username || (account as any).page_name,
          expiresAt: (account as any).expires_at,
          isExpiringSoon:
            expiresAt && expiresAt - now < oneDayMs && expiresAt > now,
          isExpired: expiresAt && expiresAt <= now,
        }
      }

      return status
    } catch (error) {
      console.error('Error getting connection status:', error)
      return {
        twitter: { isConnected: false },
        linkedin: { isConnected: false },
        facebook: { isConnected: false },
        instagram: { isConnected: false },
      }
    }
  }

  /**
   * Delete platform credentials completely
   */
  static async deletePlatformCredentials(
    platform: Platform,
    workspaceId: string
  ): Promise<void> {
    try {
      const { error } = await (supabase
        .from('social_accounts') as any)
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('platform', platform)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting credentials:', error)
      throw error
    }
  }

  /**
   * Get all connection statuses
   */
  static async getAllCredentialsStatus(
    workspaceId: string
  ): Promise<Array<{ platform: Platform; isConnected: boolean; username?: string }>> {
    try {
      const { data, error } = await (supabase
        .from('social_accounts') as any)
        .select('platform, is_connected, username, page_name')
        .eq('workspace_id', workspaceId)

      if (error) throw error

      return (data || []).map((account: any) => ({
        platform: account.platform as Platform,
        isConnected: account.is_connected,
        username: account.username || account.page_name,
      }))
    } catch (error) {
      console.error('Error getting all credentials status:', error)
      return []
    }
  }
}
