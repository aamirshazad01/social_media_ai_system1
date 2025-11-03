/**
 * Workspace Service
 * Handles all database operations related to workspace management
 * Includes: workspace CRUD, member management, capacity checks
 */

import { createServerClient } from '@/lib/supabase/server'
import type { Workspace, UpdateWorkspaceInput, WorkspaceMember } from '@/types/workspace'
import { logWorkspaceAction } from './auditLogService'

/**
 * Workspace Service - Static methods for workspace operations
 * All methods use server-side Supabase client for security
 */
export class WorkspaceService {
  /**
   * Get workspace by ID
   * Retrieves complete workspace information
   *
   * @param workspaceId - The workspace ID to fetch
   * @returns Workspace object or null if not found
   * @throws Logs error but doesn't throw
   */
  static async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    try {
      const supabase = await createServerClient()

      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single()

      if (error) {
        if (error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - expected for not found
          console.error('Error fetching workspace:', error)
        }
        return null
      }

      return data as Workspace
    } catch (error) {
      console.error('Unexpected error in getWorkspace:', error)
      return null
    }
  }

  /**
   * Update workspace settings
   * Only admins can do this (enforced by RLS policy)
   *
   * @param workspaceId - Workspace to update
   * @param updates - Fields to update (name, max_users, settings)
   * @param userId - User making the change (for audit log)
   * @returns Updated workspace or null if failed
   * @throws Errors are caught and logged
   */
  static async updateWorkspace(
    workspaceId: string,
    updates: UpdateWorkspaceInput,
    userId: string
  ): Promise<Workspace | null> {
    try {
      const supabase = await createServerClient()

      // Build update object with timestamp
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      // Validate max_users if provided
      if (updateData.max_users && updateData.max_users < 1) {
        console.warn('Invalid max_users value:', updateData.max_users)
        delete updateData.max_users // Don't update invalid value
      }

      // Validate name if provided
      if (updateData.name && updateData.name.trim().length === 0) {
        console.warn('Invalid workspace name (empty string)')
        delete updateData.name
      }

      if (Object.keys(updateData).length === 1) {
        // Only updated_at, nothing to actually update
        return await this.getWorkspace(workspaceId)
      }

      // Update the workspace
      const { data, error } = await (supabase
        .from('workspaces') as any)
        .update(updateData)
        .eq('id', workspaceId)
        .select()
        .single()

      if (error) {
        console.error('Error updating workspace:', error)
        return null
      }

      // Log the action
      await logWorkspaceAction({
        workspaceId,
        userId,
        action: 'workspace_updated',
        entityType: 'workspace',
        entityId: workspaceId,
        details: updates,
      })

      return data as Workspace
    } catch (error) {
      console.error('Unexpected error in updateWorkspace:', error)
      return null
    }
  }

  /**
   * Get all members in a workspace
   * Includes: id, email, name, avatar, role, and join date
   *
   * @param workspaceId - Workspace to get members for
   * @returns Array of workspace members, empty array if none or error
   */
  static async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    try {
      const supabase = await createServerClient()

      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, avatar_url, role, created_at, workspace_id')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true }) // Oldest members first

      if (error) {
        console.error('Error fetching workspace members:', error)
        return []
      }

      return data as WorkspaceMember[]
    } catch (error) {
      console.error('Unexpected error in getWorkspaceMembers:', error)
      return []
    }
  }

  /**
   * Remove a member from workspace
   * This permanently deletes the user account in that workspace
   * Note: Cascading deletes will remove their posts, credentials, etc.
   * Only admins can do this (permission checked in API route)
   *
   * @param workspaceId - Current workspace
   * @param userId - User to remove
   * @param removedBy - Admin performing the action (for audit log)
   * @returns Success boolean
   */
  static async removeMember(
    workspaceId: string,
    userId: string,
    removedBy: string
  ): Promise<boolean> {
    try {
      const supabase = await createServerClient()

      // Get member info before deleting (for audit log)
      const { data: member } = await supabase
        .from('users')
        .select('email, full_name, role')
        .eq('id', userId)
        .eq('workspace_id', workspaceId)
        .single()

      if (!member) {
        console.warn('Member not found for removal:', userId)
        return false
      }

      // Delete the user from this workspace
      // Note: This cascades to delete their posts, credentials, campaigns, etc.
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
        .eq('workspace_id', workspaceId) // Extra safety check

      if (error) {
        console.error('Error removing member:', error)
        return false
      }

      // Log the action
      await logWorkspaceAction({
        workspaceId,
        userId: removedBy,
        action: 'member_removed',
        entityType: 'workspace_member',
        entityId: userId,
        details: {
          removed_user_id: userId,
          removed_user_email: (member as any).email,
          removed_user_role: (member as any).role,
        },
      })

      return true
    } catch (error) {
      console.error('Unexpected error in removeMember:', error)
      return false
    }
  }

  /**
   * Change a member's role
   * Allows admins to promote/demote members between admin, editor, and viewer roles
   * Only admins can do this (permission checked in API route)
   *
   * @param workspaceId - Current workspace
   * @param userId - User whose role to change
   * @param newRole - New role to assign (admin, editor, viewer)
   * @param changedBy - Admin performing the action (for audit log)
   * @returns Success boolean
   */
  static async changeMemberRole(
    workspaceId: string,
    userId: string,
    newRole: 'admin' | 'editor' | 'viewer',
    changedBy: string
  ): Promise<boolean> {
    try {
      const supabase = await createServerClient()

      // Validate role
      const validRoles = ['admin', 'editor', 'viewer']
      if (!validRoles.includes(newRole)) {
        console.warn('Invalid role provided:', newRole)
        return false
      }

      // Get old role (for audit log)
      const { data: member } = await supabase
        .from('users')
        .select('role, email')
        .eq('id', userId)
        .eq('workspace_id', workspaceId)
        .single()

      if (!member) {
        console.warn('Member not found for role change:', userId)
        return false
      }

      // Don't update if role is already the same
      if ((member as any).role === newRole) {
        console.info('Role already set to:', newRole)
        return true // Not an error, just no-op
      }

      // Update the role
      const { error } = await (supabase
        .from('users') as any)
        .update({ role: newRole })
        .eq('id', userId)
        .eq('workspace_id', workspaceId) // Extra safety check

      if (error) {
        console.error('Error changing role:', error)
        return false
      }

      // Log the action
      await logWorkspaceAction({
        workspaceId,
        userId: changedBy,
        action: 'member_role_changed',
        entityType: 'workspace_member',
        entityId: userId,
        details: {
          target_user_id: userId,
          target_user_email: (member as any).email,
          old_role: (member as any).role,
          new_role: newRole,
        },
      })

      return true
    } catch (error) {
      console.error('Unexpected error in changeMemberRole:', error)
      return false
    }
  }

  /**
   * Check if workspace is at capacity
   * Compares current member count to max_users setting
   *
   * @param workspaceId - Workspace to check
   * @returns True if workspace is at or over max capacity
   */
  static async isWorkspaceFull(workspaceId: string): Promise<boolean> {
    try {
      const supabase = await createServerClient()

      // Get workspace max_users setting
      const { data: workspace } = await supabase
        .from('workspaces')
        .select('max_users')
        .eq('id', workspaceId)
        .single()

      if (!workspace) {
        console.warn('Workspace not found for capacity check:', workspaceId)
        return true // Err on side of caution - don't allow join if workspace unknown
      }

      // Count current members
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)

      if (error) {
        console.error('Error counting workspace members:', error)
        return true // Err on side of caution
      }

      const memberCount = count ?? 0
      return memberCount >= (workspace as any).max_users
    } catch (error) {
      console.error('Unexpected error in isWorkspaceFull:', error)
      return true // Err on side of caution
    }
  }

  /**
   * Get workspace member count
   * Returns the current number of members in the workspace
   *
   * @param workspaceId - Workspace to count members for
   * @returns Number of members, 0 if error or workspace not found
   */
  static async getWorkspaceMemberCount(workspaceId: string): Promise<number> {
    try {
      const supabase = await createServerClient()

      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspaceId)

      if (error) {
        console.error('Error counting members:', error)
        return 0
      }

      return count ?? 0
    } catch (error) {
      console.error('Unexpected error in getWorkspaceMemberCount:', error)
      return 0
    }
  }

  /**
   * Get workspace member by ID
   * Retrieves a single member's information
   *
   * @param workspaceId - Workspace to search in
   * @param userId - User to find
   * @returns Member object or null if not found
   */
  static async getWorkspaceMember(
    workspaceId: string,
    userId: string
  ): Promise<WorkspaceMember | null> {
    try {
      const supabase = await createServerClient()

      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, avatar_url, role, created_at, workspace_id')
        .eq('id', userId)
        .eq('workspace_id', workspaceId)
        .single()

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching member:', error)
        }
        return null
      }

      return data as WorkspaceMember
    } catch (error) {
      console.error('Unexpected error in getWorkspaceMember:', error)
      return null
    }
  }
}
