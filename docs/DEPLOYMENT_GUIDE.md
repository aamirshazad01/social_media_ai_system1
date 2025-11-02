# 🚀 Vercel Deployment Guide

Your Social Media OS is now deployed at: **https://social-medias-os.vercel.app/**

## ✅ Current Configuration Status

Your `.env` file is already configured with the correct Vercel domain:
```
NEXT_PUBLIC_APP_URL=https://social-medias-os.vercel.app/
```

## 🔧 Required Configuration Updates

### 1️⃣ Supabase Configuration

**Update Redirect URLs:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Add these URLs:
   - **Site URL**: `https://social-medias-os.vercel.app`
   - **Redirect URLs** (add both):
     - `https://social-medias-os.vercel.app/**`
     - `http://localhost:3000/**` (keep for local development)

### 2️⃣ Twitter/X OAuth Configuration

**Update Callback URLs:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Select your app (App ID: 31771414)
3. Navigate to **User authentication settings**
4. Update **Callback URLs**:
   - Add: `https://social-medias-os.vercel.app/api/twitter/callback`
   - Keep: `http://localhost:3000/api/twitter/callback` (for local dev)
5. Update **Website URL**: `https://social-medias-os.vercel.app`
6. Click **Save**

### 3️⃣ LinkedIn OAuth Configuration

**Update Redirect URLs:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Select your app (Client ID: 770wcup37bj1dz)
3. Go to **Auth** tab
4. Under **OAuth 2.0 settings** → **Redirect URLs**:
   - Add: `https://social-medias-os.vercel.app/api/linkedin/callback`
   - Keep: `http://localhost:3000/api/linkedin/callback`
5. Click **Update**

### 4️⃣ Instagram/Facebook OAuth Configuration

**Update OAuth Redirect URIs:**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Select your app (App ID: 1376799513861125)
3. Go to **Facebook Login** → **Settings**
4. Add to **Valid OAuth Redirect URIs**:
   - `https://social-medias-os.vercel.app/api/instagram/callback`
   - `https://social-medias-os.vercel.app/api/facebook/callback`
5. Update **App Domains**: Add `social-medias-os.vercel.app`
6. Click **Save Changes**

### 5️⃣ Threads OAuth Configuration

**Update Redirect URIs:**
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Select your Threads app (App ID: 1505277927477157)
3. Go to **Threads** → **Settings**
4. Add to **Valid OAuth Redirect URIs**:
   - `https://social-medias-os.vercel.app/api/threads/callback`
5. Click **Save Changes**

### 6️⃣ Vercel Environment Variables

**Ensure all environment variables are set in Vercel:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Verify all variables from `.env` are added:

```bash
# Gemini AI
GEMINI_API_KEY
NEXT_PUBLIC_GEMINI_API_KEY

# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# Twitter/X
TWITTER_API_KEY
TWITTER_API_SECRET
TWITTER_BEARER_TOKEN
Access_Token
Access_Token_Secret
Twitter_CLIENT_ID
Twitter_CLIENT_SECRET

# LinkedIn
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET

# Instagram/Facebook
INSTAGRAM_APP_ID
INSTAGRAM_APP_SECRET
FACEBOOK_APP_ID
FACEBOOK_APP_SECRET

# Threads
THREADS_APP_ID
THREADS_APP_SECRET

# App URL
NEXT_PUBLIC_APP_URL=https://social-medias-os.vercel.app/
```

## 🔍 Testing Checklist

After completing all configurations, test the following:

- [ ] **User Authentication**
  - Sign up with email
  - Login
  - Logout
  - Password reset

- [ ] **Social Media Connections**
  - [ ] Connect Twitter/X account
  - [ ] Connect LinkedIn account
  - [ ] Connect Instagram account
  - [ ] Connect Facebook account
  - [ ] Connect Threads account

- [ ] **Core Features**
  - [ ] Create a post
  - [ ] Schedule a post
  - [ ] Upload media
  - [ ] AI content generation
  - [ ] Post to platforms
  - [ ] View analytics

## 🐛 Troubleshooting

### OAuth Callback Errors

**Problem**: "Callback URL mismatch" or "Invalid redirect URI"

**Solution**: 
- Double-check that the callback URLs match exactly (including `/api/[platform]/callback`)
- Ensure there are no trailing slashes unless specified
- Wait 5-10 minutes after updating OAuth settings for changes to propagate

### Environment Variable Issues

**Problem**: "API credentials not configured" errors

**Solution**:
1. Check Vercel dashboard that all environment variables are set
2. After adding/updating variables, redeploy the application
3. Ensure variable names match exactly (case-sensitive)

### CORS Errors

**Problem**: "CORS policy" errors when connecting platforms

**Solution**:
- Add your Vercel domain to each platform's allowed origins
- Check Supabase CORS settings
- Verify Next.js API routes are properly configured

### 404 Errors on Refresh

**Problem**: Page refreshes return 404

**Solution**: 
- This shouldn't happen with Next.js, but if it does:
- Check `next.config.mjs` settings
- Ensure Vercel is detecting the framework correctly

## 📊 Monitoring & Logs

**View Deployment Logs:**
1. Go to Vercel Dashboard
2. Select your project
3. Click on **Deployments**
4. Click on a deployment to view logs

**View Runtime Logs:**
1. Go to your project in Vercel
2. Click on **Functions** tab
3. Select a function to view its logs
4. Use for debugging API routes

## 🔐 Security Checklist

- [ ] All API keys are stored as environment variables (not in code)
- [ ] `.env` file is in `.gitignore`
- [ ] Supabase Row Level Security (RLS) is enabled
- [ ] OAuth apps are in production mode
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] Rate limiting is configured (if needed)

## 🚀 Redeployment

To redeploy after making changes:

1. **Automatic** (recommended):
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
   Vercel will automatically redeploy

2. **Manual**:
   - Use Vercel CLI: `vercel --prod`
   - Or trigger from Vercel Dashboard

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Twitter API Docs**: https://developer.twitter.com/en/docs
- **LinkedIn API Docs**: https://docs.microsoft.com/en-us/linkedin/
- **Facebook/Instagram API Docs**: https://developers.facebook.com/docs

---



