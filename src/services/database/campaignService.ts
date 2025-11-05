/**
 * Campaign Service - Supabase Database Operations
 * Handles all CRUD operations for campaigns with validation
 */

import { createServerClient } from '@/lib/supabase/server'
import { Campaign } from '@/types'
import type { Database } from '@/lib/supabase/types'
import { CampaignValidator } from '../campaign/campaignValidation'

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
      const supabase = await getSupabase()
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
   * Create a new campaign with validation
   */
  static async createCampaign(
    workspaceId: string,
    campaignData: Partial<Campaign>
  ): Promise<Campaign> {
    try {
      // Validate input
      const validation = CampaignValidator.validateCreate(campaignData)
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`)
      }

      const sanitized = validation.sanitized!

      const supabase = await getSupabase()
      const campaign: any = {
        workspace_id: workspaceId,
        name: sanitized.name,
        goal: sanitized.description || null,
        color: sanitized.color || this.getRandomCampaignColor(),
        start_date: sanitized.startDate || new Date().toISOString(),
        end_date: sanitized.endDate || null,
        goals: sanitized.goals || [],
        status: sanitized.status || 'planning',
        campaign_type: sanitized.campaignType || null,
        content_themes: sanitized.contentThemes || [],
        target_audience: sanitized.targetAudience || {},
        performance_targets: sanitized.performanceTargets || {},
        budget_hours: sanitized.budgetHours || null,
        assigned_to: sanitized.assignedTo || [],
        tags: sanitized.tags || [],
      }

      const { data, error } = await supabase
        .from('campaigns')
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
   * Update a campaign with validation
   */
  static async updateCampaign(
    campaignId: string,
    workspaceId: string,
    updates: Partial<Campaign>
  ): Promise<Campaign> {
    try {
      // Validate input
      const validation = CampaignValidator.validateUpdate(updates)
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`)
      }

      const sanitized = validation.sanitized!

      const supabase = await getSupabase()
      const dbUpdates: any = {}

      if (sanitized.name !== undefined) dbUpdates.name = sanitized.name
      if (sanitized.description !== undefined) dbUpdates.goal = sanitized.description
      if (sanitized.color !== undefined) dbUpdates.color = sanitized.color
      if (sanitized.startDate !== undefined) dbUpdates.start_date = sanitized.startDate
      if (sanitized.endDate !== undefined) dbUpdates.end_date = sanitized.endDate
      if (sanitized.goals !== undefined) dbUpdates.goals = sanitized.goals
      if (sanitized.status !== undefined) dbUpdates.status = sanitized.status
      if (sanitized.campaignType !== undefined) dbUpdates.campaign_type = sanitized.campaignType
      if (sanitized.contentThemes !== undefined) dbUpdates.content_themes = sanitized.contentThemes
      if (sanitized.targetAudience !== undefined) dbUpdates.target_audience = sanitized.targetAudience
      if (sanitized.performanceTargets !== undefined) dbUpdates.performance_targets = sanitized.performanceTargets
      if (sanitized.budgetHours !== undefined) dbUpdates.budget_hours = sanitized.budgetHours
      if (sanitized.assignedTo !== undefined) dbUpdates.assigned_to = sanitized.assignedTo
      if (sanitized.tags !== undefined) dbUpdates.tags = sanitized.tags
      if (sanitized.archived !== undefined) dbUpdates.archived = sanitized.archived

      const { data, error } = await supabase
        .from('campaigns')
        .update(dbUpdates)
        .eq('id', campaignId)
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
      const supabase = await getSupabase()
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
      const supabase = await getSupabase()
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
      goals: dbCampaign.goals || [],
      status: dbCampaign.status || 'planning',
      campaignType: dbCampaign.campaign_type,
      contentThemes: dbCampaign.content_themes || [],
      targetAudience: dbCampaign.target_audience,
      performanceTargets: dbCampaign.performance_targets,
      budgetHours: dbCampaign.budget_hours,
      assignedTo: dbCampaign.assigned_to || [],
      tags: dbCampaign.tags || [],
      archived: dbCampaign.archived || false,
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
