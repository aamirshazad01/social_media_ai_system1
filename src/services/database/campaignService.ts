/**
 * Campaign Service - Supabase Database Operations
 * Handles all CRUD operations for campaigns
 */

import { createServerClient } from '@/lib/supabase/server'
import { Campaign } from '@/types'
import type { Database } from '@/lib/supabase/types'

let supabaseInstance: any = null

async function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = await createServerClient()
  }
  return supabaseInstance
}

export class CampaignService {
  /**
   * Get all campaigns for workspace
   */
  static async getAllCampaigns(workspaceId: string): Promise<Campaign[]> {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(this.transformFromDB)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      throw error
    }
  }

  /**
   * Get campaign by ID
   */
  static async getCampaignById(campaignId: string, workspaceId: string): Promise<Campaign | null> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .eq('workspace_id', workspaceId)
        .single()

      if (error) throw error

      return data ? this.transformFromDB(data) : null
    } catch (error) {
      console.error('Error fetching campaign:', error)
      return null
    }
  }

  /**
   * Create a new campaign
   */
  static async createCampaign(
    workspaceId: string,
    name: string,
    description?: string,
    startDate?: string,
    endDate?: string,
    goals?: string[]
  ): Promise<Campaign> {
    try {
      const campaign: Database['public']['Tables']['campaigns']['Insert'] = {
        workspace_id: workspaceId,
        name,
        goal: description || null,
        color: this.getRandomCampaignColor(),
        start_date: startDate || new Date().toISOString(),
        end_date: endDate || null,
      }

      const { data, error } = await (supabase
        .from('campaigns') as any)
        .insert(campaign)
        .select()
        .single()

      if (error) throw error

      return this.transformFromDB(data)
    } catch (error) {
      console.error('Error creating campaign:', error)
      throw error
    }
  }

  /**
   * Update a campaign
   */
  static async updateCampaign(campaign: Campaign, workspaceId: string): Promise<Campaign> {
    try {
      const dbCampaign = {
        name: campaign.name,
        goal: campaign.description || null,
        color: campaign.color,
        start_date: campaign.startDate,
        end_date: campaign.endDate ?? null,
      }

      const { data, error } = await (supabase
        .from('campaigns') as any)
        .update(dbCampaign)
        .eq('id', campaign.id)
        .eq('workspace_id', workspaceId)
        .select()
        .single()

      if (error) throw error

      return this.transformFromDB(data)
    } catch (error) {
      console.error('Error updating campaign:', error)
      throw error
    }
  }

  /**
   * Delete a campaign
   */
  static async deleteCampaign(campaignId: string, workspaceId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)
        .eq('workspace_id', workspaceId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting campaign:', error)
      throw error
    }
  }

  /**
   * Get posts count for a campaign
   */
  static async getCampaignPostsCount(campaignId: string, workspaceId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaignId)
        .eq('workspace_id', workspaceId)

      if (error) throw error

      return count || 0
    } catch (error) {
      console.error('Error getting campaign posts count:', error)
      return 0
    }
  }

  /**
   * Transform database row to Campaign type
   */
  private static transformFromDB(dbCampaign: any): Campaign {
    return {
      id: dbCampaign.id,
      name: dbCampaign.name,
      description: dbCampaign.goal,
      color: dbCampaign.color,
      startDate: dbCampaign.start_date,
      endDate: dbCampaign.end_date,
      createdAt: dbCampaign.created_at,
    }
  }

  /**
   * Generate random campaign color
   */
  private static getRandomCampaignColor(): string {
    const colors = [
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#F59E0B', // Amber
      '#10B981', // Green
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#14B8A6', // Teal
      '#F97316', // Orange
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
}
