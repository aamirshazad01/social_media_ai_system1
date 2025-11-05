/**
 * Campaign Analytics Hook
 * Fetch and manage campaign analytics data
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CampaignAnalytics } from '@/services/campaign/campaignAnalytics'

interface UseCampaignAnalyticsReturn {
  analytics: CampaignAnalytics | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useCampaignAnalytics(campaignId: string | null): UseCampaignAnalyticsReturn {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load campaign analytics
   */
  const loadAnalytics = useCallback(async () => {
    if (!campaignId) {
      setAnalytics(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch(`/api/campaigns/${campaignId}/analytics`)
      
      if (!res.ok) {
        throw new Error(`Failed to load analytics: ${res.statusText}`)
      }

      const data = await res.json()
      setAnalytics(data)
    } catch (err: any) {
      console.error('Error loading campaign analytics:', err)
      setError(err.message || 'Failed to load analytics')
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }, [campaignId])

  /**
   * Refresh analytics
   */
  const refresh = useCallback(async () => {
    await loadAnalytics()
  }, [loadAnalytics])

  // Load analytics when campaign ID changes
  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  return {
    analytics,
    loading,
    error,
    refresh
  }
}
