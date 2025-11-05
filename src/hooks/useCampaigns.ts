/**
 * Campaign Management Hook
 * Centralized state management for campaigns
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Campaign } from '@/types'

interface UseCampaignsReturn {
  campaigns: Campaign[]
  loading: boolean
  error: string | null
  createCampaign: (data: Partial<Campaign>) => Promise<Campaign | null>
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<Campaign | null>
  deleteCampaign: (id: string) => Promise<boolean>
  refreshCampaigns: () => Promise<void>
}

export function useCampaigns(): UseCampaignsReturn {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load all campaigns
   */
  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch('/api/campaigns')
      
      if (!res.ok) {
        throw new Error(`Failed to load campaigns: ${res.statusText}`)
      }

      const data = await res.json()
      setCampaigns(data)
    } catch (err: any) {
      console.error('Error loading campaigns:', err)
      setError(err.message || 'Failed to load campaigns')
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create a new campaign
   */
  const createCampaign = useCallback(async (data: Partial<Campaign>): Promise<Campaign | null> => {
    try {
      setError(null)
      
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create campaign')
      }

      const created = await res.json()
      setCampaigns(prev => [created, ...prev])
      return created
    } catch (err: any) {
      console.error('Error creating campaign:', err)
      setError(err.message || 'Failed to create campaign')
      return null
    }
  }, [])

  /**
   * Update a campaign
   */
  const updateCampaign = useCallback(async (
    id: string,
    updates: Partial<Campaign>
  ): Promise<Campaign | null> => {
    try {
      setError(null)
      
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update campaign')
      }

      const updated = await res.json()
      setCampaigns(prev => prev.map(c => c.id === id ? updated : c))
      return updated
    } catch (err: any) {
      console.error('Error updating campaign:', err)
      setError(err.message || 'Failed to update campaign')
      return null
    }
  }, [])

  /**
   * Delete a campaign
   */
  const deleteCampaign = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to delete campaign')
      }

      setCampaigns(prev => prev.filter(c => c.id !== id))
      return true
    } catch (err: any) {
      console.error('Error deleting campaign:', err)
      setError(err.message || 'Failed to delete campaign')
      return false
    }
  }, [])

  /**
   * Refresh campaigns
   */
  const refreshCampaigns = useCallback(async () => {
    await loadCampaigns()
  }, [loadCampaigns])

  // Load campaigns on mount
  useEffect(() => {
    loadCampaigns()
  }, [loadCampaigns])

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    refreshCampaigns
  }
}
