/**
 * Database TypeScript Types
 * These types will be updated as we create tables in Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
          max_users: number
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
          max_users?: number
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
          max_users?: number
          settings?: Json | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'editor' | 'viewer'
          workspace_id: string
          created_at: string
          updated_at: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          workspace_id: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'editor' | 'viewer'
          workspace_id?: string
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          workspace_id: string
          created_by: string
          topic: string
          platforms: string[]
          content: Json
          status: 'draft' | 'needs_approval' | 'approved' | 'ready_to_publish' | 'scheduled' | 'published' | 'failed'
          scheduled_at: string | null
          published_at: string | null
          campaign_id: string | null
          engagement_score: number | null
          engagement_suggestions: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          created_by: string
          topic: string
          platforms: string[]
          content: Json
          status?: 'draft' | 'needs_approval' | 'approved' | 'ready_to_publish' | 'scheduled' | 'published' | 'failed'
          scheduled_at?: string | null
          published_at?: string | null
          campaign_id?: string | null
          engagement_score?: number | null
          engagement_suggestions?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          created_by?: string
          topic?: string
          platforms?: string[]
          content?: Json
          status?: 'draft' | 'needs_approval' | 'approved' | 'ready_to_publish' | 'scheduled' | 'published' | 'failed'
          scheduled_at?: string | null
          published_at?: string | null
          campaign_id?: string | null
          engagement_score?: number | null
          engagement_suggestions?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      social_accounts: {
        Row: {
          id: string
          workspace_id: string
          platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
          credentials_encrypted: string
          is_connected: boolean
          username: string | null
          connected_at: string | null
          last_verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
          credentials_encrypted: string
          is_connected?: boolean
          username?: string | null
          connected_at?: string | null
          last_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          platform?: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
          credentials_encrypted?: string
          is_connected?: boolean
          username?: string | null
          connected_at?: string | null
          last_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          workspace_id: string
          name: string
          goal: string | null
          color: string
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          goal?: string | null
          color?: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          goal?: string | null
          color?: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media_assets: {
        Row: {
          id: string
          workspace_id: string
          name: string
          type: 'image' | 'video'
          url: string
          thumbnail_url: string | null
          size: number
          width: number | null
          height: number | null
          tags: string[]
          source: 'ai-generated' | 'uploaded'
          used_in_posts: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          type: 'image' | 'video'
          url: string
          thumbnail_url?: string | null
          size: number
          width?: number | null
          height?: number | null
          tags?: string[]
          source?: 'ai-generated' | 'uploaded'
          used_in_posts?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          type?: 'image' | 'video'
          url?: string
          thumbnail_url?: string | null
          size?: number
          width?: number | null
          height?: number | null
          tags?: string[]
          source?: 'ai-generated' | 'uploaded'
          used_in_posts?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      approvals: {
        Row: {
          id: string
          post_id: string
          workspace_id: string
          requested_by: string
          approved_by: string | null
          status: 'pending' | 'approved' | 'rejected'
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          workspace_id: string
          requested_by: string
          approved_by?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          workspace_id?: string
          requested_by?: string
          approved_by?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          action: string
          resource_type: string
          resource_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          user_id?: string
          action?: string
          resource_type?: string
          resource_id?: string | null
          details?: Json | null
          created_at?: string
        }
      }
      post_analytics: {
        Row: {
          id: string
          post_id: string
          workspace_id: string
          platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
          impressions: number
          engagement: number
          clicks: number
          shares: number
          comments: number
          likes: number
          fetched_at: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          workspace_id: string
          platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
          impressions?: number
          engagement?: number
          clicks?: number
          shares?: number
          comments?: number
          likes?: number
          fetched_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          workspace_id?: string
          platform?: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
          impressions?: number
          engagement?: number
          clicks?: number
          shares?: number
          comments?: number
          likes?: number
          fetched_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'editor' | 'viewer'
      post_status: 'draft' | 'needs_approval' | 'approved' | 'ready_to_publish' | 'scheduled' | 'published' | 'failed'
      platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram'
      media_type: 'image' | 'video'
      media_source: 'ai-generated' | 'uploaded'
      approval_status: 'pending' | 'approved' | 'rejected'
    }
  }
}
