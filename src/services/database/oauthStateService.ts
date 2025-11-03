/**
 * OAuth State Service
 * Manages CSRF state tokens and PKCE verification
 * Database-backed for security
 */

import { supabase } from '@/lib/supabase'
import {
  generateRandomState,
  generatePKCE,
  verifyPKCE,
} from '@/lib/auth/stateGenerator'
import type { Platform } from '@/types'

export interface OAuthStateData {
  state: string
  codeVerifier?: string
  codeChallenge?: string
  expiresAt: Date
}

/**
 * Create OAuth state for CSRF protection and PKCE
 */
export async function createOAuthState(
  workspaceId: string,
  platform: Platform,
  ipAddress?: string,
  userAgent?: string,
  usePKCE: boolean = true
): Promise<OAuthStateData> {
  try {
    // Generate state
    const state = generateRandomState()

    let codeVerifier: string | undefined
    let codeChallenge: string | undefined
    let codeChallengeMethod: string | undefined

    // Generate PKCE if needed
    if (usePKCE) {
      const pkce = generatePKCE()
      codeChallenge = pkce.codeChallenge
      codeVerifier = pkce.codeVerifier
      codeChallengeMethod = 'S256'
    }

    // Calculate expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // Store in database
    const { error } = await (supabase.from('oauth_states') as any).insert({
      workspace_id: workspaceId,
      platform,
      state,
      code_challenge: codeChallenge || null,
      code_challenge_method: codeChallengeMethod || null,
      expires_at: expiresAt.toISOString(),
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
    })

    if (error) throw error

    return {
      state,
      codeVerifier,
      codeChallenge,
      expiresAt,
    }
  } catch (error) {
    console.error('Error creating OAuth state:', error)
    throw new Error('Failed to create OAuth state')
  }
}

/**
 * Verify OAuth state (CSRF check)
 * Also validates PKCE if present
 */
export async function verifyOAuthState(
  workspaceId: string,
  platform: Platform,
  state: string
): Promise<{
  valid: boolean
  codeChallenge?: string
  codeChallengeMethod?: string
  error?: string
}> {
  try {
    // Query database for state
    const { data, error } = await (supabase
      .from('oauth_states') as any)
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('platform', platform)
      .eq('state', state)
      .maybeSingle()

    if (error) throw error

    // Check if state exists
    if (!data) {
      return { valid: false, error: 'State not found' }
    }

    // Check if already used (replay attack prevention)
    if ((data as any).used) {
      return { valid: false, error: 'State already used (replay attack detected)' }
    }

    // Check if expired
    const expiresAt = new Date((data as any).expires_at).getTime()
    if (Date.now() > expiresAt) {
      return { valid: false, error: 'State expired' }
    }

    // Mark as used
    const { error: updateError } = await (supabase
      .from('oauth_states') as any)
      .update({
        used: true,
        used_at: new Date().toISOString(),
      })
      .eq('id', (data as any).id)

    if (updateError) throw updateError

    return {
      valid: true,
      codeChallenge: (data as any).code_challenge || undefined,
      codeChallengeMethod: (data as any).code_challenge_method || undefined,
    }
  } catch (error) {
    console.error('Error verifying OAuth state:', error)
    return { valid: false, error: 'State verification failed' }
  }
}

/**
 * Verify PKCE
 */
export function verifyPKCECode(
  codeVerifier: string,
  codeChallenge: string
): boolean {
  return verifyPKCE(codeVerifier, codeChallenge)
}

/**
 * Clean up expired OAuth states
 * Should be run periodically as a background job
 */
export async function cleanupExpiredStates(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('oauth_states')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id')

    if (error) throw error

    const deletedCount = data?.length || 0
    console.log(`Cleaned up ${deletedCount} expired OAuth states`)

    return deletedCount
  } catch (error) {
    console.error('Error cleaning up OAuth states:', error)
    return 0
  }
}

/**
 * Get state info for debugging
 */
export async function getStateInfo(
  workspaceId: string,
  state: string
): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('oauth_states')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('state', state)
      .maybeSingle()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting state info:', error)
    return null
  }
}

/**
 * Clean up all states for a workspace (on logout or cleanup)
 */
export async function clearWorkspaceOAuthStates(workspaceId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('oauth_states')
      .delete()
      .eq('workspace_id', workspaceId)
      .select('id')

    if (error) throw error

    return data?.length || 0
  } catch (error) {
    console.error('Error clearing OAuth states:', error)
    return 0
  }
}
