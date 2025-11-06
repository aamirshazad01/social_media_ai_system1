/**
 * TOKEN REFRESH SERVICE
 * Manages automatic token refresh for long-lived tokens
 * Handles token expiration tracking and proactive refresh
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'
import { SocialAccountRepository } from '@/core/database/repositories/SocialAccountRepository'
import { PlatformServiceFactory } from './PlatformServiceFactory'
import { ExternalAPIError } from '@/core/errors/AppError'

/**
 * Token Refresh Configuration
 * Defines refresh thresholds per platform
 */
const TOKEN_REFRESH_CONFIG = {
  twitter: {
    refreshThresholdDays: 1,
    maxRetries: 3
  },
  linkedin: {
    // LinkedIn doesn't support refresh tokens - would need reauthentication
    refreshThresholdDays: 0, // Never auto-refresh
    maxRetries: 0
  },
  facebook: {
    refreshThresholdDays: 30, // Refresh 30 days before expiry
    maxRetries: 3
  },
  instagram: {
    refreshThresholdDays: 30, // Same as Facebook
    maxRetries: 3
  },
  tiktok: {
    refreshThresholdDays: 1,
    maxRetries: 3
  },
  youtube: {
    refreshThresholdDays: 1,
    maxRetries: 3
  }
} as const

/**
 * Token Refresh Service
 * Handles automatic token refresh for platform credentials
 */
export class TokenRefreshService {
  private supabase: ReturnType<typeof createClient<Database>>
  private socialAccountRepository: SocialAccountRepository
  private platformServiceFactory: PlatformServiceFactory

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )
    this.socialAccountRepository = new SocialAccountRepository()
    this.platformServiceFactory = new PlatformServiceFactory()
  }

  /**
   * Check if token needs refresh
   * Compares expiration time with current time + threshold
   */
  private shouldRefreshToken(expiresAt: Date, platform: keyof typeof TOKEN_REFRESH_CONFIG): boolean {
    if (!expiresAt) return false

    const config = TOKEN_REFRESH_CONFIG[platform]
    if (config.refreshThresholdDays === 0) return false // Skip refresh for this platform

    const now = new Date()
    const refreshThresholdMs = config.refreshThresholdDays * 24 * 60 * 60 * 1000
    const refreshDeadline = new Date(expiresAt.getTime() - refreshThresholdMs)

    return now >= refreshDeadline
  }

  /**
   * Refresh credentials for a social account
   * Returns true if successful, false if failed
   */
  async refreshCredentials(
    accountId: string,
    workspaceId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get social account
      const { data: account, error: fetchError } = await this.supabase
        .from('social_accounts')
        .select()
        .eq('id', accountId)
        .eq('workspace_id', workspaceId)
        .single()

      if (fetchError || !account) {
        return {
          success: false,
          error: `Account not found: ${fetchError?.message}`
        }
      }

      const platform = account.platform as keyof typeof TOKEN_REFRESH_CONFIG

      // Check if refresh is needed
      const expiresAt = account.expires_at ? new Date(account.expires_at) : null
      if (!expiresAt || !this.shouldRefreshToken(expiresAt, platform)) {
        return { success: true } // No refresh needed
      }

      // Get refresh token (encrypted)
      const decrypted = await this.socialAccountRepository.getDecryptedCredentials(
        accountId,
        workspaceId
      )

      if (!decrypted.refreshToken) {
        return {
          success: false,
          error: `No refresh token available for ${platform}`
        }
      }

      // Get platform service
      const platformService = this.platformServiceFactory.createService(platform)
      if (!platformService) {
        return {
          success: false,
          error: `Unsupported platform: ${platform}`
        }
      }

      // Initialize with OAuth config
      platformService.initialize({
        platform,
        clientId: process.env[`${platform.toUpperCase()}_CLIENT_ID`] || '',
        clientSecret: process.env[`${platform.toUpperCase()}_CLIENT_SECRET`] || '',
        redirectUri: process.env[`${platform.toUpperCase()}_REDIRECT_URI`] || '',
        scopes: [], // Scopes not needed for refresh
        authorizationUrl: '',
        tokenUrl: ''
      })

      // Refresh token
      const newTokens = await platformService.refreshAccessToken(decrypted.refreshToken)

      // Update social account with new tokens
      const updatedCredentials = {
        ...decrypted,
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken || decrypted.refreshToken,
        expiresAt: new Date(Date.now() + newTokens.expiresIn * 1000)
      }

      await this.socialAccountRepository.updateAccessToken(
        accountId,
        workspaceId,
        updatedCredentials
      )

      // Clear refresh error count on successful refresh
      await this.supabase
        .from('social_accounts')
        .update({ refresh_error_count: 0 })
        .eq('id', accountId)
        .eq('workspace_id', workspaceId)

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)

      // Increment error count
      const { data: account } = await this.supabase
        .from('social_accounts')
        .select('refresh_error_count')
        .eq('id', accountId)
        .single()

      const newErrorCount = (account?.refresh_error_count || 0) + 1
      const config = TOKEN_REFRESH_CONFIG[account?.platform as keyof typeof TOKEN_REFRESH_CONFIG]

      // Mark as failed if max retries exceeded
      if (newErrorCount >= config.maxRetries) {
        await this.supabase
          .from('social_accounts')
          .update({
            is_active: false,
            refresh_error_count: newErrorCount
          })
          .eq('id', accountId)
      } else {
        await this.supabase
          .from('social_accounts')
          .update({ refresh_error_count: newErrorCount })
          .eq('id', accountId)
      }

      return {
        success: false,
        error: `Token refresh failed: ${errorMessage}`
      }
    }
  }

  /**
   * Batch refresh all credentials needing refresh
   * Should be called by background job periodically (every hour)
   */
  async refreshAllExpiredTokens(): Promise<{
    total: number
    successful: number
    failed: number
  }> {
    try {
      // Get all active accounts with expiring tokens
      const { data: accounts, error } = await this.supabase
        .from('social_accounts')
        .select('id, workspace_id, platform, expires_at')
        .eq('is_active', true)
        .not('expires_at', 'is', null)

      if (error) {
        throw new Error(`Failed to fetch accounts: ${error.message}`)
      }

      let successful = 0
      let failed = 0

      // Process each account
      for (const account of accounts || []) {
        const platform = account.platform as keyof typeof TOKEN_REFRESH_CONFIG
        const expiresAt = new Date(account.expires_at)

        if (this.shouldRefreshToken(expiresAt, platform)) {
          const result = await this.refreshCredentials(account.id, account.workspace_id)

          if (result.success) {
            successful++
          } else {
            failed++
          }
        }
      }

      return {
        total: accounts?.length || 0,
        successful,
        failed
      }
    } catch (error) {
      throw new ExternalAPIError(
        'TokenRefresh',
        `Batch refresh failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Get refresh status for a specific account
   */
  async getRefreshStatus(accountId: string, workspaceId: string): Promise<{
    needsRefresh: boolean
    expiresAt: Date | null
    lastRefreshed: Date | null
    errorCount: number
    isActive: boolean
  }> {
    const { data: account, error } = await this.supabase
      .from('social_accounts')
      .select('expires_at, refresh_error_count, is_active, updated_at')
      .eq('id', accountId)
      .eq('workspace_id', workspaceId)
      .single()

    if (error || !account) {
      throw new Error(`Account not found: ${error?.message}`)
    }

    const expiresAt = account.expires_at ? new Date(account.expires_at) : null
    const platform = account.platform as keyof typeof TOKEN_REFRESH_CONFIG

    return {
      needsRefresh: expiresAt ? this.shouldRefreshToken(expiresAt, platform) : false,
      expiresAt,
      lastRefreshed: new Date(account.updated_at),
      errorCount: account.refresh_error_count || 0,
      isActive: account.is_active
    }
  }
}

// Export singleton instance
export const tokenRefreshService = new TokenRefreshService()
