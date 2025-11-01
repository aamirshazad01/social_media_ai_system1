# Supabase Setup Guide

This guide will help you set up the database schema and configure authentication for your Social Media OS application.

## 📋 Prerequisites

- Supabase project created at [https://supabase.com](https://supabase.com)
- Project URL and API key already added to `.env` file ✅

## 🗄️ Step 1: Create Database Schema

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor**
   - Click on **"SQL Editor"** in the left sidebar
   - Click **"New Query"**

3. **Run the Schema**
   - Open the file: `src/lib/supabase/schema.sql`
   - Copy the entire SQL content
   - Paste it into the SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`

4. **Verify Tables Created**
   - Go to **"Table Editor"** in the left sidebar
   - You should see all tables:
     - ✅ workspaces
     - ✅ users
     - ✅ posts
     - ✅ social_accounts
     - ✅ campaigns
     - ✅ media_assets
     - ✅ approvals
     - ✅ activity_logs
     - ✅ post_analytics

## 🔐 Step 2: Configure Authentication

1. **Enable Email/Password Auth**
   - Go to **"Authentication"** → **"Providers"**
   - Find **"Email"** provider
   - Make sure it's **Enabled** (should be by default)
   - Scroll down to **"Email Templates"**
   - Customize if needed (optional)

2. **Configure Email Settings** (Optional for now)
   - Go to **"Project Settings"** → **"Authentication"**
   - Configure:
     - Site URL: `http://localhost:3000` (for development)
     - Redirect URLs: `http://localhost:3000/**` (allow all localhost)

3. **Disable Email Confirmation** (For Development Only)
   - Go to **"Authentication"** → **"Providers"** → **"Email"**
   - Find **"Confirm email"**
   - Toggle **OFF** for easier development testing
   - ⚠️ **Important**: Turn this back ON for production!

## 🪣 Step 3: Verify Storage Bucket

1. **Check Storage**
   - Go to **"Storage"** in the left sidebar
   - You should see a bucket named **"media"**
   - If not created automatically, the SQL script should have created it

2. **Test Bucket (Optional)**
   - Click on **"media"** bucket
   - Try uploading a test image
   - Delete it after testing

## 🔑 Step 4: Verify Environment Variables

Check your `.env` file has the correct values:

```env
# Gemini AI API Keys
GEMINI_API_KEY="AIzaSyAKztOeoF7i42xaQ5tHKC18jrQZl4IS91o"
NEXT_PUBLIC_GEMINI_API_KEY="AIzaSyAKztOeoF7i42xaQ5tHKC18jrQZl4IS91o"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://cqzkzzadngzwipszcspn.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## ✅ Step 5: Test Connection

Once schema is created, we'll test the connection with a simple test script.

Run:
```bash
npm run dev
```

The app should start without database errors.

## 🗺️ Database Schema Overview

### Core Tables

**workspaces** - Team/organization container
- Each user belongs to one workspace
- Automatically created on signup
- Contains workspace settings

**users** - User accounts
- Linked to Supabase Auth (`auth.users`)
- Has role: admin, editor, viewer
- Belongs to a workspace

**posts** - Social media posts
- Multi-platform support
- Status workflow (draft → approved → published)
- Links to campaigns

**social_accounts** - Connected platform accounts
- Stores encrypted credentials
- One per platform per workspace
- Tracks connection status

**campaigns** - Marketing campaigns
- Group posts together
- Color-coded organization
- Date range tracking

**media_assets** - Media library
- Images and videos
- AI-generated or uploaded
- Tag-based organization

**approvals** - Approval workflow
- Post approval requests
- Admin/editor approval
- Comment support

**activity_logs** - Audit trail
- All user actions tracked
- Workspace-scoped
- For compliance and debugging

**post_analytics** - Social media metrics
- Real platform data
- Per-post, per-platform
- Historical tracking

## 🔒 Security Features

### Row Level Security (RLS)
- ✅ **Enabled on all tables**
- Users can only access data in their workspace
- Role-based permissions (admin, editor, viewer)
- Automatic enforcement at database level

### Multi-Tenancy
- Complete workspace isolation
- No cross-workspace data leakage
- Enforced by RLS policies

### Encrypted Credentials
- Social media credentials stored encrypted
- Application-level encryption
- Never exposed to client

## 🚀 Next Steps

After completing setup:

1. **Test User Signup** - Create authentication UI
2. **Migrate Data** - Move localStorage data to Supabase
3. **Update Services** - Replace localStorage with Supabase queries
4. **Test Workflow** - Verify everything works end-to-end

## 🐛 Troubleshooting

### Schema Fails to Run
- Check for syntax errors in SQL Editor
- Run sections individually if needed
- Check Supabase logs for detailed errors

### Auth Not Working
- Verify email provider is enabled
- Check Site URL is correct
- Ensure .env variables are loaded

### RLS Blocks Queries
- Make sure user is authenticated
- Check user has correct role
- Verify workspace_id matches

### Storage Upload Fails
- Check bucket permissions
- Verify storage policies are created
- Check file size limits

## 📚 Useful Supabase Links

- **Dashboard**: https://supabase.com/dashboard
- **Docs**: https://supabase.com/docs
- **Auth Docs**: https://supabase.com/docs/guides/auth
- **Storage Docs**: https://supabase.com/docs/guides/storage
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security

---

**Ready to continue?** Once you've run the schema, let me know and we'll move on to building the authentication UI! 🚀
