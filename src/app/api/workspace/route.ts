/**
 * API Route: /api/workspace
 * Methods: GET, PATCH
 *
 * GET: Retrieve current user's workspace information
 * PATCH: Update workspace settings (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { WorkspaceService } from '@/services/database/workspaceService'
import type { UpdateWorkspaceInput } from '@/types/workspace'

/**
 * GET /api/workspace
 * Retrieve current user's workspace details
 *
 * Response: { data: Workspace } or { error: string }
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's workspace ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('workspace_id')
      .eq('id', user.id)
      .single()

    if (userError || !userData || !('workspace_id' in userData)) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Get workspace details
    const workspace = await WorkspaceService.getWorkspace((userData as any).workspace_id)

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: workspace })
  } catch (error) {
    console.error('Error in GET /api/workspace:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/workspace
 * Update workspace settings
 * Requires: Admin role
 *
 * Body: { name?: string, max_users?: number, settings?: object }
 * Response: { data: Workspace } or { error: string }
 */
export async function PATCH(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's role and workspace
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('workspace_id, role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || !('workspace_id' in userData)) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user is admin
    if ((userData as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Only workspace admins can update settings' },
        { status: 403 }
      )
    }

    // Parse request body
    let updates: UpdateWorkspaceInput
    try {
      updates = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate updates
    if (updates.max_users !== undefined && updates.max_users < 1) {
      return NextResponse.json(
        { error: 'Maximum users must be at least 1' },
        { status: 400 }
      )
    }

    if (updates.name !== undefined && updates.name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Workspace name cannot be empty' },
        { status: 400 }
      )
    }

    // Update workspace
    const updatedWorkspace = await WorkspaceService.updateWorkspace(
      (userData as any).workspace_id,
      updates,
      user.id
    )

    if (!updatedWorkspace) {
      return NextResponse.json(
        { error: 'Failed to update workspace' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: updatedWorkspace })
  } catch (error) {
    console.error('Error in PATCH /api/workspace:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
