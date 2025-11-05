import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ABTestingService } from '@/services/campaign/abTestingService'

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

    const tests = await ABTestingService.getTestsForCampaign(id, userRow.workspace_id)
    return NextResponse.json(tests)
  } catch (e: any) {
    console.error('A/B tests API error:', e)
    return NextResponse.json(
      { error: e?.message || 'Failed to fetch A/B tests' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params
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

    const body = await req.json()

    if (!body.name || !body.controlPostId || !body.variantPostIds?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const test = await ABTestingService.createTest(
      campaignId,
      userRow.workspace_id,
      user.id,
      body
    )

    return NextResponse.json(test, { status: 201 })
  } catch (e: any) {
    console.error('Create A/B test API error:', e)
    return NextResponse.json(
      { error: e?.message || 'Failed to create A/B test' },
      { status: 500 }
    )
  }
}
