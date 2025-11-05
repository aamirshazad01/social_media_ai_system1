/**
 * A/B Testing Service
 * Create, manage, and analyze A/B tests for campaigns
 */

import { createServerClient } from '@/lib/supabase/server'
import type { Post } from '@/types'

export interface ABTest {
  id: string
  campaignId: string
  name: string
  hypothesis: string
  variationType: 'caption' | 'image' | 'cta' | 'timing' | 'platform'
  controlPostId: string
  variantPostIds: string[]
  trafficSplit: Record<string, number>
  status: 'draft' | 'running' | 'completed' | 'cancelled'
  startDate?: string
  endDate?: string
  winnerPostId?: string
  confidenceLevel?: number
  results: ABTestResults
  insights: string[]
  createdBy: string
  createdAt: string
}

export interface ABTestResults {
  control: PostPerformance
  variants: PostPerformance[]
  statisticalSignificance: number
  recommendation: string
}

export interface PostPerformance {
  postId: string
  impressions: number
  engagement: number
  clicks: number
  conversions: number
  engagementRate: number
  clickThroughRate: number
  conversionRate: number
}

let supabaseInstance: any = null

async function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = await createServerClient()
  }
  return supabaseInstance
}

export class ABTestingService {
  /**
   * Create a new A/B test
   */
  static async createTest(
    campaignId: string,
    workspaceId: string,
    userId: string,
    testData: {
      name: string
      hypothesis: string
      variationType: ABTest['variationType']
      controlPostId: string
      variantPostIds: string[]
      trafficSplit?: Record<string, number>
    }
  ): Promise<ABTest> {
    try {
      const supabase = await getSupabase()

      // Default traffic split: equal distribution
      const defaultSplit = this.calculateDefaultTrafficSplit(
        testData.controlPostId,
        testData.variantPostIds
      )

      const test = {
        campaign_id: campaignId,
        workspace_id: workspaceId,
        name: testData.name,
        hypothesis: testData.hypothesis,
        variation_type: testData.variationType,
        control_post_id: testData.controlPostId,
        variant_post_ids: testData.variantPostIds,
        traffic_split: testData.trafficSplit || defaultSplit,
        status: 'draft',
        created_by: userId,
        results: {
          control: this.emptyPerformance(testData.controlPostId),
          variants: testData.variantPostIds.map(id => this.emptyPerformance(id)),
          statisticalSignificance: 0,
          recommendation: ''
        },
        insights: []
      }

      const { data, error } = await supabase
        .from('ab_tests')
        .insert(test)
        .select()
        .single()

      if (error) throw error

      return this.transformFromDB(data)
    } catch (error) {
      console.error('Error creating A/B test:', error)
      throw error
    }
  }

  /**
   * Get all tests for a campaign
   */
  static async getTestsForCampaign(
    campaignId: string,
    workspaceId: string
  ): Promise<ABTest[]> {
    try {
      const supabase = await getSupabase()

      const { data, error } = await supabase
        .from('ab_tests')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(this.transformFromDB)
    } catch (error) {
      console.error('Error fetching A/B tests:', error)
      return []
    }
  }

  /**
   * Start an A/B test
   */
  static async startTest(testId: string, workspaceId: string): Promise<ABTest> {
    try {
      const supabase = await getSupabase()

      const { data, error } = await supabase
        .from('ab_tests')
        .update({
          status: 'running',
          start_date: new Date().toISOString()
        })
        .eq('id', testId)
        .eq('workspace_id', workspaceId)
        .select()
        .single()

      if (error) throw error

      return this.transformFromDB(data)
    } catch (error) {
      console.error('Error starting A/B test:', error)
      throw error
    }
  }

  /**
   * Complete an A/B test
   */
  static async completeTest(
    testId: string,
    workspaceId: string,
    results: ABTestResults,
    winnerPostId?: string
  ): Promise<ABTest> {
    try {
      const supabase = await getSupabase()

      const { data, error } = await supabase
        .from('ab_tests')
        .update({
          status: 'completed',
          end_date: new Date().toISOString(),
          results,
          winner_post_id: winnerPostId,
          confidence_level: results.statisticalSignificance
        })
        .eq('id', testId)
        .eq('workspace_id', workspaceId)
        .select()
        .single()

      if (error) throw error

      return this.transformFromDB(data)
    } catch (error) {
      console.error('Error completing A/B test:', error)
      throw error
    }
  }

  /**
   * Analyze A/B test results
   */
  static async analyzeResults(
    test: ABTest,
    posts: Post[]
  ): Promise<ABTestResults> {
    const controlPost = posts.find(p => p.id === test.controlPostId)
    const variantPosts = posts.filter(p => test.variantPostIds.includes(p.id))

    if (!controlPost || variantPosts.length === 0) {
      throw new Error('Posts not found for A/B test')
    }

    const controlPerf = this.calculatePostPerformance(controlPost)
    const variantPerfs = variantPosts.map(this.calculatePostPerformance)

    // Calculate statistical significance (simplified)
    const bestVariant = variantPerfs.reduce((best, curr) => 
      curr.engagementRate > best.engagementRate ? curr : best
    )

    const improvement = ((bestVariant.engagementRate - controlPerf.engagementRate) / controlPerf.engagementRate) * 100
    const significance = this.calculateSignificance(controlPerf, bestVariant)

    let recommendation = ''
    if (significance > 95 && improvement > 10) {
      recommendation = `Strong winner detected! Variant performs ${improvement.toFixed(1)}% better. Use this version going forward.`
    } else if (significance > 90 && improvement > 5) {
      recommendation = `Promising results. Variant shows ${improvement.toFixed(1)}% improvement. Consider longer test for confirmation.`
    } else if (Math.abs(improvement) < 5) {
      recommendation = 'No significant difference detected. Both versions perform similarly.'
    } else {
      recommendation = 'Results inconclusive. Need more data or longer test duration.'
    }

    return {
      control: controlPerf,
      variants: variantPerfs,
      statisticalSignificance: significance,
      recommendation
    }
  }

  /**
   * Generate insights from A/B test
   */
  static generateInsights(test: ABTest, results: ABTestResults): string[] {
    const insights: string[] = []

    const { control, variants } = results

    // Engagement insights
    variants.forEach((variant, idx) => {
      const improvement = ((variant.engagementRate - control.engagementRate) / control.engagementRate) * 100
      
      if (improvement > 20) {
        insights.push(`Variant ${String.fromCharCode(65 + idx)} shows exceptional ${improvement.toFixed(1)}% improvement in engagement`)
      } else if (improvement > 10) {
        insights.push(`Variant ${String.fromCharCode(65 + idx)} outperforms control by ${improvement.toFixed(1)}%`)
      } else if (improvement < -10) {
        insights.push(`Variant ${String.fromCharCode(65 + idx)} underperforms control by ${Math.abs(improvement).toFixed(1)}%`)
      }
    })

    // Click-through insights
    const bestCTR = variants.reduce((best, curr) => 
      curr.clickThroughRate > best.clickThroughRate ? curr : best
    , control)
    
    if (bestCTR.clickThroughRate > control.clickThroughRate * 1.15) {
      insights.push(`${bestCTR.postId === control.postId ? 'Control' : 'Best variant'} achieves 15%+ higher click-through rate`)
    }

    // Statistical significance insights
    if (results.statisticalSignificance < 80) {
      insights.push('Test needs more data for conclusive results')
    } else if (results.statisticalSignificance > 95) {
      insights.push('Results are statistically significant with high confidence')
    }

    return insights
  }

  /**
   * Helper: Calculate default traffic split
   */
  private static calculateDefaultTrafficSplit(
    controlId: string,
    variantIds: string[]
  ): Record<string, number> {
    const totalVariants = 1 + variantIds.length
    const splitPercentage = 100 / totalVariants

    const split: Record<string, number> = {
      [controlId]: splitPercentage
    }

    variantIds.forEach(id => {
      split[id] = splitPercentage
    })

    return split
  }

  /**
   * Helper: Empty performance object
   */
  private static emptyPerformance(postId: string): PostPerformance {
    return {
      postId,
      impressions: 0,
      engagement: 0,
      clicks: 0,
      conversions: 0,
      engagementRate: 0,
      clickThroughRate: 0,
      conversionRate: 0
    }
  }

  /**
   * Helper: Calculate post performance
   */
  private static calculatePostPerformance(post: Post): PostPerformance {
    const impressions = post.analytics?.impressions || 0
    const engagement = post.analytics?.engagement || 0
    const clicks = post.analytics?.clicks || 0

    return {
      postId: post.id,
      impressions,
      engagement,
      clicks,
      conversions: 0,
      engagementRate: impressions > 0 ? (engagement / impressions) * 100 : 0,
      clickThroughRate: impressions > 0 ? (clicks / impressions) * 100 : 0,
      conversionRate: 0
    }
  }

  /**
   * Helper: Calculate statistical significance (simplified)
   */
  private static calculateSignificance(
    control: PostPerformance,
    variant: PostPerformance
  ): number {
    // Simplified calculation - in production, use proper statistical tests
    const sampleSize = Math.min(control.impressions, variant.impressions)
    
    if (sampleSize < 100) return 50 // Not enough data
    if (sampleSize < 1000) return 70
    if (sampleSize < 5000) return 85
    return 95 // High confidence with large sample
  }

  /**
   * Transform database row to ABTest type
   */
  private static transformFromDB(data: any): ABTest {
    return {
      id: data.id,
      campaignId: data.campaign_id,
      name: data.name,
      hypothesis: data.hypothesis,
      variationType: data.variation_type,
      controlPostId: data.control_post_id,
      variantPostIds: data.variant_post_ids || [],
      trafficSplit: data.traffic_split || {},
      status: data.status,
      startDate: data.start_date,
      endDate: data.end_date,
      winnerPostId: data.winner_post_id,
      confidenceLevel: data.confidence_level,
      results: data.results || {
        control: this.emptyPerformance(data.control_post_id),
        variants: [],
        statisticalSignificance: 0,
        recommendation: ''
      },
      insights: data.insights || [],
      createdBy: data.created_by,
      createdAt: data.created_at
    }
  }
}
