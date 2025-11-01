/**
 * Credential Service - Supabase Database Operations
 * Handles encrypted storage of social media credentials
 */

import { supabase } from '@/lib/supabase'
import { encrypt, decrypt, getUserEncryptionKey } from '@/lib/encryption'
import {
  Platform,
  TwitterCredentials,
  LinkedInCredentials,
  FacebookCredentials,
  InstagramCredentials,
  PlatformCredentials,
} from '@/types'

type AnyCredentials = TwitterCredentials | LinkedInCredentials | FacebookCredentials | InstagramCredentials

export class CredentialService {
  /**
   * Save credentials for a platform
   */
  static async savePlatformCredentials(
    platform: Platform,
    credentials: AnyCredentials,
    userId: string,
    workspaceId: string
  ): Promise<void> {
    try {
      // Encrypt credentials
      const encryptionKey = getUserEncryptionKey(userId)
      const credentialsJson = JSON.stringify(credentials)
      const encrypted = await encrypt(credentialsJson, encryptionKey)

      // Check if credentials already exist
      const { data: existing } = await supabase
        .from('social_accounts')
        .select('id')
        .eq('workspace_id', workspaceId)
        .eq('platform', platform)
        .maybeSingle<{ id: string }>()

      if (existing) {
        // Update existing
        const usernameVal = 'username' in credentials ? (credentials as any).username ?? null : null
        const { error } = await (supabase
          .from('social_accounts') as any)
          .update({
            credentials_encrypted: encrypted,
            is_connected: credentials.isConnected,
            username: usernameVal,
            connected_at: credentials.isConnected ? new Date().toISOString() : null,
            last_verified_at: new Date().toISOString(),
          })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Insert new
        const usernameInsert = 'username' in credentials ? (credentials as any).username ?? null : null
        const { error } = await (supabase.from('social_accounts') as any).insert({
          workspace_id: workspaceId,
          platform,
          credentials_encrypted: encrypted,
          is_connected: credentials.isConnected,
          username: usernameInsert,
          connected_at: credentials.isConnected ? new Date().toISOString() : null,
          last_verified_at: new Date().toISOString(),
        })

        if (error) throw error
      }
    } catch (error) {
      console.error('Error saving credentials:', error)
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
  ): Promise<AnyCredentials | null> {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('credentials_encrypted')
        .eq('workspace_id', workspaceId)
        .eq('platform', platform)
        .maybeSingle<{ credentials_encrypted: string }>()

      if (error || !data) return null

      // Decrypt credentials
      const encryptionKey = getUserEncryptionKey(userId)
      const decrypted = await decrypt(data.credentials_encrypted, encryptionKey)
      const credentials = JSON.parse(decrypted)

      return credentials
    } catch (error) {
      console.error('Error getting credentials:', error)
      return null
    }
  }

  /**
   * Get all platform credentials
   */
  static async getAllCredentials(
    userId: string,
    workspaceId: string
  ): Promise<PlatformCredentials> {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('platform, credentials_encrypted')
        .eq('workspace_id', workspaceId)

      if (error) throw error

      const credentials: PlatformCredentials = {}
      const encryptionKey = getUserEncryptionKey(userId)

      for (const account of (data || []) as Array<{ platform: string; credentials_encrypted: string }>) {
        try {
          const decrypted = await decrypt(account.credentials_encrypted, encryptionKey)
          credentials[account.platform as Platform] = JSON.parse(decrypted)
        } catch (error) {
          console.error(`Error decrypting ${account.platform} credentials:`, error)
        }
      }

      return credentials
    } catch (error) {
      console.error('Error getting all credentials:', error)
      return {}
    }
  }

  /**
   * Check if a platform is connected
   */
  static async isPlatformConnected(platform: Platform, workspaceId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('is_connected')
        .eq('workspace_id', workspaceId)
        .eq('platform', platform)
        .maybeSingle<{ is_connected: boolean }>()

      if (error || !data) return false

      return data.is_connected
    } catch (error) {
      return false
    }
  }

  /**
   * Get connection summary for all platforms
   */
  static async getConnectionSummary(workspaceId: string): Promise<Record<Platform, boolean>> {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('platform, is_connected')
        .eq('workspace_id', workspaceId)

      if (error) throw error

      const summary: Record<Platform, boolean> = {
        twitter: false,
        linkedin: false,
        facebook: false,
        instagram: false,
      }

      for (const account of (data || []) as Array<{ platform: Platform; is_connected: boolean }>) {
        summary[account.platform] = account.is_connected
      }

      return summary
    } catch (error) {
      console.error('Error getting connection summary:', error)
      return {
        twitter: false,
        linkedin: false,
        facebook: false,
        instagram: false,
      }
    }
  }

  /**
   * Disconnect a platform
   */
  static async disconnectPlatform(
    platform: Platform,
    userId: string,
    workspaceId: string
  ): Promise<void> {
    try {
      // Get existing credentials
      const credentials = await this.getPlatformCredentials(platform, userId, workspaceId)
      if (!credentials) return

      // Update to disconnected
      credentials.isConnected = false
      await this.savePlatformCredentials(platform, credentials, userId, workspaceId)
    } catch (error) {
      console.error('Error disconnecting platform:', error)
      throw error
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
      const { error } = await supabase
        .from('social_accounts')
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
   * Clear all credentials for workspace
   */
  static async clearAllCredentials(workspaceId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('workspace_id', workspaceId)

      if (error) throw error
    } catch (error) {
      console.error('Error clearing all credentials:', error)
      throw error
    }
  }
}
