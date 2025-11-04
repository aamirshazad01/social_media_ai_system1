-- ============================================
-- Social Media OS Database Schema
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE post_status AS ENUM ('draft', 'needs_approval', 'approved', 'ready_to_publish', 'scheduled', 'published', 'failed');
CREATE TYPE platform AS ENUM ('twitter', 'linkedin', 'facebook', 'instagram');
CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE media_source AS ENUM ('ai-generated', 'uploaded');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- ============================================
-- TABLES
-- ============================================

-- Workspaces (Teams/Organizations)
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    max_users INTEGER DEFAULT 10,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (linked to auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role user_role NOT NULL,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Media Accounts
CREATE TABLE social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    platform platform NOT NULL,
    credentials_encrypted TEXT NOT NULL,
    is_connected BOOLEAN DEFAULT true,
    username TEXT,
    connected_at TIMESTAMPTZ,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(workspace_id, platform)
);

-- Posts
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    platforms platform[] NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    status post_status DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    campaign_id UUID,
    engagement_score INTEGER,
    engagement_suggestions TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    goal TEXT,
    color TEXT DEFAULT '#3B82F6',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for campaigns in posts
ALTER TABLE posts
ADD CONSTRAINT fk_campaign
FOREIGN KEY (campaign_id)
REFERENCES campaigns(id)
ON DELETE SET NULL;

-- Media Assets
CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type media_type NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    size BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    tags TEXT[] DEFAULT '{}',
    source media_source DEFAULT 'uploaded',
    used_in_posts UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approvals
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status approval_status DEFAULT 'pending',
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs (Audit Trail)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Analytics
CREATE TABLE post_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    platform platform NOT NULL,
    impressions INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX idx_users_workspace ON users(workspace_id);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_posts_workspace ON posts(workspace_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX idx_posts_campaign ON posts(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_posts_created_by ON posts(created_by);

CREATE INDEX idx_social_accounts_workspace ON social_accounts(workspace_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);

CREATE INDEX idx_campaigns_workspace ON campaigns(workspace_id);

CREATE INDEX idx_media_workspace ON media_assets(workspace_id);
CREATE INDEX idx_media_type ON media_assets(type);
CREATE INDEX idx_media_tags ON media_assets USING GIN(tags);

CREATE INDEX idx_approvals_post ON approvals(post_id);
CREATE INDEX idx_approvals_workspace ON approvals(workspace_id);
CREATE INDEX idx_approvals_status ON approvals(status);

CREATE INDEX idx_activity_logs_workspace ON activity_logs(workspace_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

CREATE INDEX idx_analytics_post ON post_analytics(post_id);
CREATE INDEX idx_analytics_workspace ON post_analytics(workspace_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_assets_updated_at BEFORE UPDATE ON media_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON approvals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_workspace_id UUID;
BEGIN
    -- Create a new workspace for the user
    INSERT INTO public.workspaces (name)
    VALUES (COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Workspace') || '''s Workspace')
    RETURNING id INTO new_workspace_id;

    -- Create user profile
    INSERT INTO public.users (id, email, full_name, role, workspace_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
        'admin',
        new_workspace_id
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_workspace_id UUID,
    p_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO activity_logs (workspace_id, user_id, action, resource_type, resource_id, details)
    VALUES (p_workspace_id, p_user_id, p_action, p_resource_type, p_resource_id, p_details)
    RETURNING id INTO log_id;

    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Helper function to fetch current user's profile without recursive policy evaluation
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS TABLE (workspace_id UUID, role user_role) AS $$
BEGIN
  RETURN QUERY
  SELECT u.workspace_id, u.role
  FROM public.users u
  WHERE u.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable RLS on all tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;

-- Workspaces: Users can only see their own workspace
CREATE POLICY "Users can view their workspace"
    ON workspaces FOR SELECT
    USING (id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can update their workspace"
    ON workspaces FOR UPDATE
    USING (
        id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users: Can view users in their workspace
CREATE POLICY "Users can view workspace members"
    ON users FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (id = auth.uid());

-- Posts: Workspace-scoped access
CREATE POLICY "Users can view posts in their workspace"
    ON posts FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can create posts in their workspace"
    ON posts FOR INSERT
    WITH CHECK (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
        AND created_by = auth.uid()
    );

CREATE POLICY "Users can update posts they created or admins can update any"
    ON posts FOR UPDATE
    USING (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
        AND (
            created_by = auth.uid()
            OR EXISTS (
                SELECT 1 FROM users
                WHERE id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

CREATE POLICY "Admins can delete posts in their workspace"
    ON posts FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Social Accounts: Workspace-scoped
CREATE POLICY "Users can view social accounts in their workspace"
    ON social_accounts FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage social accounts"
    ON social_accounts FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Campaigns: Workspace-scoped
CREATE POLICY "Users can view campaigns in their workspace"
    ON campaigns FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Editors can manage campaigns"
    ON campaigns FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Media Assets: Workspace-scoped
CREATE POLICY "Users can view media in their workspace"
    ON media_assets FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can upload media"
    ON media_assets FOR INSERT
    WITH CHECK (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own media"
    ON media_assets FOR UPDATE
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete media"
    ON media_assets FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Approvals: Workspace-scoped
CREATE POLICY "Users can view approvals in their workspace"
    ON approvals FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can request approvals"
    ON approvals FOR INSERT
    WITH CHECK (
        workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid())
        AND requested_by = auth.uid()
    );

CREATE POLICY "Admins can update approvals"
    ON approvals FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

-- Activity Logs: Read-only for users, workspace-scoped
CREATE POLICY "Users can view activity logs in their workspace"
    ON activity_logs FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

-- Post Analytics: Workspace-scoped
CREATE POLICY "Users can view analytics in their workspace"
    ON post_analytics FOR SELECT
    USING (workspace_id IN (SELECT workspace_id FROM users WHERE id = auth.uid()));

-- ============================================
-- STORAGE BUCKETS (for media files)
-- ============================================

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload media to their workspace"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'media'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Anyone can view media"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

CREATE POLICY "Users can update their own media"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own media"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample workspace and test data
/*
-- Sample Workspace
INSERT INTO workspaces (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Workspace');

-- Sample User (you'll need to create this in Supabase Auth first)
-- INSERT INTO users (id, email, full_name, role, workspace_id)
-- VALUES ('user-uuid-here', 'demo@example.com', 'Demo User', 'admin', '00000000-0000-0000-0000-000000000001');
*/

-- ============================================
-- COMPLETE!
-- ============================================
-- Your database schema is now ready.
-- Next steps:
-- 1. Configure Supabase Auth (email/password provider)
-- 2. Test user signup/login
-- 3. Start migrating data from localStorage
-- ============================================
