import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { CampaignAnalyticsService } from '@/services/campaign/campaignAnalytics'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userRow, error } = await supabase
      .from('users')
      .select('workspace_id')
      .eq('id', user.id)
      .maybeSingle<{ workspace_id: string }>()

    if (error || !userRow) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 400 })
    }

    const analytics = await CampaignAnalyticsService.getCampaignAnalytics(
      id,
      userRow.workspace_id
    )

    return NextResponse.json(analytics)
  } catch (e: any) {
    console.error('Analytics API error:', e)
    return NextResponse.json(
      { error: e?.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
