import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ABTestingService } from '@/services/campaign/abTestingService'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; testId: string }> }
) {
  try {
    const { testId } = await params
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

    const test = await ABTestingService.startTest(testId, userRow.workspace_id)
    return NextResponse.json(test)
  } catch (e: any) {
    console.error('Start A/B test API error:', e)
    return NextResponse.json(
      { error: e?.message || 'Failed to start A/B test' },
      { status: 500 }
    )
  }
}
