/**
 * Campaign Analytics Service
 * Provides comprehensive analytics and insights for campaigns
 */

import { createServerClient } from '@/lib/supabase/server'
import type { Campaign, Post, Platform } from '@/types'

export interface CampaignAnalytics {
  campaignId: string
  performance: CampaignPerformance
  goals: GoalProgress[]
  timeline: TimelineData[]
  platforms: PlatformPerformance[]
  healthScore: number
  insights: AIInsight[]
  alerts: CampaignAlert[]
}

export interface CampaignPerformance {
  totalPosts: number
  publishedPosts: number
  scheduledPosts: number
  draftPosts: number
  totalReach: number
  totalEngagement: number
  avgEngagementRate: number
  clickThroughRate: number
  followerGrowth: number
  topPerformingPost?: Post
  worstPerformingPost?: Post
}

export interface GoalProgress {
  goal: string
  target?: number
  actual: number
  percentage: number
  status: 'on-track' | 'at-risk' | 'achieved' | 'failed'
}

export interface TimelineData {
  date: string
  posts: number
  reach: number
  engagement: number
  followers: number
}

export interface PlatformPerformance {
  platform: Platform
  postsCount: number
  avgEngagement: number
  totalReach: number
  bestPerformingPost?: Post
  trend: 'up' | 'down' | 'stable'
}

export interface AIInsight {
  type: 'success' | 'warning' | 'info' | 'tip'
  title: string
  description: string
  action?: string
  priority: 'high' | 'medium' | 'low'
}

export interface CampaignAlert {
  type: 'error' | 'warning' | 'info'
  message: string
  action?: string
  timestamp: string
}

let supabaseInstance: any = null

async function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = await createServerClient()
  }
  return supabaseInstance
}

export class CampaignAnalyticsService {
  /**
   * Get comprehensive analytics for a campaign
   */
  static async getCampaignAnalytics(
    campaignId: string,
    workspaceId: string
  ): Promise<CampaignAnalytics> {
    const [campaign, posts] = await Promise.all([
      this.getCampaign(campaignId, workspaceId),
      this.getCampaignPosts(campaignId, workspaceId)
    ])

    if (!campaign) {
      throw new Error('Campaign not found')
    }

    const performance = this.calculatePerformance(posts)
    const platforms = this.calculatePlatformPerformance(posts)
    const timeline = await this.getTimelineData(campaignId, workspaceId)
    const healthScore = await this.calculateHealthScore(campaign, posts)
    const goals = this.calculateGoalProgress(campaign, performance)
    const insights = this.generateInsights(campaign, performance, platforms, posts)
    const alerts = this.generateAlerts(campaign, posts)

    return {
      campaignId,
      performance,
      goals,
      timeline,
      platforms,
      healthScore,
      insights,
      alerts
    }
  }

  /**
   * Calculate campaign performance metrics
   */
  private static calculatePerformance(posts: Post[]): CampaignPerformance {
    const publishedPosts = posts.filter(p => p.status === 'published')
    const scheduledPosts = posts.filter(p => p.status === 'scheduled')
    const draftPosts = posts.filter(p => p.status === 'draft')

    // Calculate totals from post analytics
    const totalReach = publishedPosts.reduce((sum, p) => sum + (p.analytics?.reach || 0), 0)
    const totalEngagement = publishedPosts.reduce((sum, p) => sum + (p.analytics?.engagement || 0), 0)
    const totalImpressions = publishedPosts.reduce((sum, p) => sum + (p.analytics?.impressions || 0), 0)

    const avgEngagementRate = totalImpressions > 0 
      ? (totalEngagement / totalImpressions) * 100 
      : 0

    const totalClicks = publishedPosts.reduce((sum, p) => sum + (p.analytics?.clicks || 0), 0)
    const clickThroughRate = totalImpressions > 0 
      ? (totalClicks / totalImpressions) * 100 
      : 0

    // Find best and worst performing posts
    const sortedByEngagement = [...publishedPosts].sort(
      (a, b) => (b.analytics?.engagement || 0) - (a.analytics?.engagement || 0)
    )

    return {
      totalPosts: posts.length,
      publishedPosts: publishedPosts.length,
      scheduledPosts: scheduledPosts.length,
      draftPosts: draftPosts.length,
      totalReach,
      totalEngagement,
      avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
      clickThroughRate: Math.round(clickThroughRate * 100) / 100,
      followerGrowth: 0, // Would come from platform APIs
      topPerformingPost: sortedByEngagement[0],
      worstPerformingPost: sortedByEngagement[sortedByEngagement.length - 1]
    }
  }

  /**
   * Calculate platform-specific performance
   */
  private static calculatePlatformPerformance(posts: Post[]): PlatformPerformance[] {
    const platformMap = new Map<Platform, Post[]>()

    // Group posts by platform
    posts.forEach(post => {
      post.platforms.forEach(platform => {
        if (!platformMap.has(platform)) {
          platformMap.set(platform, [])
        }
        platformMap.get(platform)!.push(post)
      })
    })

    // Calculate metrics for each platform
    return Array.from(platformMap.entries()).map(([platform, platformPosts]) => {
      const publishedPosts = platformPosts.filter(p => p.status === 'published')
      const totalEngagement = publishedPosts.reduce((sum, p) => sum + (p.analytics?.engagement || 0), 0)
      const avgEngagement = publishedPosts.length > 0 ? totalEngagement / publishedPosts.length : 0
      const totalReach = publishedPosts.reduce((sum, p) => sum + (p.analytics?.reach || 0), 0)

      const sortedByEngagement = [...publishedPosts].sort(
        (a, b) => (b.analytics?.engagement || 0) - (a.analytics?.engagement || 0)
      )

      return {
        platform,
        postsCount: platformPosts.length,
        avgEngagement: Math.round(avgEngagement),
        totalReach,
        bestPerformingPost: sortedByEngagement[0],
        trend: 'stable' as const // Would be calculated from historical data
      }
    })
  }

  /**
   * Get timeline data for campaign
   */
  private static async getTimelineData(
    campaignId: string,
    workspaceId: string
  ): Promise<TimelineData[]> {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase
        .from('campaign_analytics')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('workspace_id', workspaceId)
        .order('date', { ascending: true })
        .limit(30)

      if (error) throw error

      return data.map((row: any) => ({
        date: row.date,
        posts: row.total_posts,
        reach: row.total_reach,
        engagement: row.total_engagement,
        followers: row.follower_count
      }))
    } catch (error) {
      console.error('Error fetching timeline data:', error)
      return []
    }
  }

  /**
   * Calculate campaign health score (0-100)
   */
  private static async calculateHealthScore(
    campaign: Campaign,
    posts: Post[]
  ): Promise<number> {
    let score = 0

    // Factor 1: Post volume (0-30 points)
    const postCount = posts.length
    score += Math.min(30, postCount * 3)

    // Factor 2: Scheduled posts (0-20 points)
    const scheduledCount = posts.filter(p => p.status === 'scheduled').length
    score += Math.min(20, scheduledCount * 4)

    // Factor 3: Publishing consistency (0-20 points)
    const publishedCount = posts.filter(p => p.status === 'published').length
    if (publishedCount > 0) {
      score += 20
    }

    // Factor 4: Goal progress (0-15 points)
    if (campaign.goals && campaign.goals.length > 0) {
      score += 15
    }

    // Factor 5: Time remaining vs progress (0-15 points)
    if (campaign.endDate) {
      const now = new Date()
      const end = new Date(campaign.endDate)
      const start = new Date(campaign.startDate)
      const totalDuration = end.getTime() - start.getTime()
      const elapsed = now.getTime() - start.getTime()
      const percentElapsed = elapsed / totalDuration

      if (publishedCount / postCount >= percentElapsed) {
        score += 15 // On track
      } else if (publishedCount / postCount >= percentElapsed * 0.7) {
        score += 10 // Slightly behind
      } else {
        score += 5 // Behind schedule
      }
    }

    return Math.min(100, Math.max(0, score))
  }

  /**
   * Calculate goal progress
   */
  private static calculateGoalProgress(
    campaign: Campaign,
    performance: CampaignPerformance
  ): GoalProgress[] {
    if (!campaign.goals || campaign.goals.length === 0) {
      return []
    }

    return campaign.goals.map(goal => {
      // Simple heuristic - would be more sophisticated in production
      const targetReached = performance.publishedPosts >= 10
      const percentage = Math.min(100, (performance.publishedPosts / 10) * 100)

      return {
        goal,
        target: 10,
        actual: performance.publishedPosts,
        percentage: Math.round(percentage),
        status: targetReached ? 'achieved' : percentage >= 70 ? 'on-track' : percentage >= 40 ? 'at-risk' : 'failed'
      }
    })
  }

  /**
   * Generate AI insights
   */
  private static generateInsights(
    campaign: Campaign,
    performance: CampaignPerformance,
    platforms: PlatformPerformance[],
    posts: Post[]
  ): AIInsight[] {
    const insights: AIInsight[] = []

    // Insight: Top performing platform
    if (platforms.length > 1) {
      const topPlatform = [...platforms].sort((a, b) => b.avgEngagement - a.avgEngagement)[0]
      if (topPlatform.avgEngagement > 0) {
        insights.push({
          type: 'success',
          title: `${topPlatform.platform} is your top performer`,
          description: `Posts on ${topPlatform.platform} receive ${Math.round(topPlatform.avgEngagement)} avg engagement. Consider increasing content for this platform.`,
          action: 'Optimize platform mix',
          priority: 'medium'
        })
      }
    }

    // Insight: Low posting frequency
    if (performance.totalPosts < 5) {
      insights.push({
        type: 'warning',
        title: 'Low posting frequency',
        description: `You have only ${performance.totalPosts} posts in this campaign. Consider creating more content to improve reach.`,
        action: 'Create more posts',
        priority: 'high'
      })
    }

    // Insight: No scheduled posts
    if (performance.scheduledPosts === 0 && performance.draftPosts > 0) {
      insights.push({
        type: 'warning',
        title: 'No posts scheduled',
        description: `You have ${performance.draftPosts} draft(s) but nothing scheduled. Schedule posts to maintain consistency.`,
        action: 'Schedule posts',
        priority: 'high'
      })
    }

    // Insight: High engagement rate
    if (performance.avgEngagementRate > 5) {
      insights.push({
        type: 'success',
        title: 'Excellent engagement rate!',
        description: `Your ${performance.avgEngagementRate.toFixed(2)}% engagement rate is above industry average (2-3%). Keep up the great work!`,
        priority: 'low'
      })
    }

    // Insight: Content variety
    const platformCount = new Set(posts.flatMap(p => p.platforms)).size
    if (platformCount === 1 && platforms.length < 3) {
      insights.push({
        type: 'tip',
        title: 'Diversify platform presence',
        description: 'You\'re only posting to one platform. Consider expanding to other platforms to increase reach.',
        action: 'Add more platforms',
        priority: 'medium'
      })
    }

    return insights
  }

  /**
   * Generate campaign alerts
   */
  private static generateAlerts(campaign: Campaign, posts: Post[]): CampaignAlert[] {
    const alerts: CampaignAlert[] = []
    const now = new Date()

    // Alert: Campaign ending soon
    if (campaign.endDate) {
      const endDate = new Date(campaign.endDate)
      const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysUntilEnd <= 7 && daysUntilEnd > 0) {
        const scheduledCount = posts.filter(p => p.status === 'scheduled').length
        if (scheduledCount === 0) {
          alerts.push({
            type: 'warning',
            message: `Campaign ends in ${daysUntilEnd} days but no posts are scheduled`,
            action: 'Schedule posts now',
            timestamp: now.toISOString()
          })
        }
      }
    }

    // Alert: No posts in campaign
    if (posts.length === 0) {
      alerts.push({
        type: 'error',
        message: 'No posts in this campaign yet',
        action: 'Create your first post',
        timestamp: now.toISOString()
      })
    }

    // Alert: Campaign paused
    if (campaign.status === 'paused') {
      alerts.push({
        type: 'info',
        message: 'Campaign is paused. Posts will not be published.',
        action: 'Resume campaign',
        timestamp: now.toISOString()
      })
    }

    return alerts
  }

  /**
   * Helper: Get campaign
   */
  private static async getCampaign(
    campaignId: string,
    workspaceId: string
  ): Promise<Campaign | null> {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .eq('workspace_id', workspaceId)
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        description: data.goal,
        color: data.color,
        startDate: data.start_date,
        endDate: data.end_date,
        goals: data.goals || [],
        status: data.status || 'planning',
        campaignType: data.campaign_type,
        contentThemes: data.content_themes || [],
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Error fetching campaign:', error)
      return null
    }
  }

  /**
   * Helper: Get campaign posts
   */
  private static async getCampaignPosts(
    campaignId: string,
    workspaceId: string
  ): Promise<Post[]> {
    try {
      const supabase = await getSupabase()
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('workspace_id', workspaceId)

      if (error) throw error

      return data.map((post: any) => ({
        id: post.id,
        topic: post.topic,
        platforms: post.platforms,
        content: post.content,
        status: post.status,
        scheduledAt: post.scheduled_at,
        publishedAt: post.published_at,
        campaignId: post.campaign_id,
        createdAt: post.created_at,
        analytics: {
          reach: 0,
          engagement: 0,
          impressions: 0,
          clicks: 0
        }
      })) as Post[]
    } catch (error) {
      console.error('Error fetching campaign posts:', error)
      return []
    }
  }

  /**
   * Update daily campaign analytics
   */
  static async updateDailyAnalytics(
    campaignId: string,
    workspaceId: string
  ): Promise<void> {
    try {
      const posts = await this.getCampaignPosts(campaignId, workspaceId)
      const performance = this.calculatePerformance(posts)
      const platforms = this.calculatePlatformPerformance(posts)

      const platformBreakdown = platforms.reduce((acc, p) => {
        acc[p.platform] = {
          posts: p.postsCount,
          engagement: p.avgEngagement,
          reach: p.totalReach
        }
        return acc
      }, {} as Record<string, any>)

      const supabase = await getSupabase()
      const today = new Date().toISOString().split('T')[0]

      await supabase
        .from('campaign_analytics')
        .upsert({
          campaign_id: campaignId,
          workspace_id: workspaceId,
          date: today,
          total_posts: performance.totalPosts,
          published_posts: performance.publishedPosts,
          total_reach: performance.totalReach,
          total_engagement: performance.totalEngagement,
          engagement_rate: performance.avgEngagementRate,
          click_through_rate: performance.clickThroughRate,
          platform_breakdown: platformBreakdown
        }, {
          onConflict: 'campaign_id,date'
        })
    } catch (error) {
      console.error('Error updating daily analytics:', error)
    }
  }
}
