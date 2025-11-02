# Instagram API Setup Guide

Follow these steps to enable real Instagram posting in your Social Media OS.

**⚠️ IMPORTANT**: Instagram API requires a **Facebook Business account** and **Instagram Business/Creator account**. Personal Instagram accounts won't work.

## Prerequisites

Before you start:
- ✅ Facebook account
- ✅ Facebook Page (create one if you don't have)
- ✅ Instagram Business or Creator account
- ✅ Instagram account connected to your Facebook Page

---

## Step 1: Create Facebook App

1. Go to **https://developers.facebook.com**
2. Click **"My Apps"** → **"Create App"**
3. Select **"Business"** as app type
4. Fill in app details:
   - **App Name**: Social Media OS (or your preferred name)
   - **App Contact Email**: Your email
   - **Business Account**: Select or create one
5. Click **"Create App"**

---

## Step 2: Add Instagram Product

1. In your app dashboard, find **"Add Products"**
2. Locate **"Instagram Graph API"**
3. Click **"Set Up"**
4. The Instagram product will be added to your app

---

## Step 3: Configure App Settings

### Basic Settings
1. Go to **"Settings"** → **"Basic"**
2. Note down:
   - **App ID** - Your application identifier
   - **App Secret** - Click "Show" to reveal
3. Add **App Domains**: `localhost` (for development)
4. Add **Privacy Policy URL**: Your privacy policy URL
5. Click **"Save Changes"**

### OAuth Settings
1. Scroll to **"Add Platform"**
2. Select **"Website"**
3. Add **Site URL**: `http://localhost:3000` (for development)
4. Click **"Save Changes"**

---

## Step 4: Connect Instagram Business Account

1. Go to **"Instagram Graph API"** → **"Tools"**
2. Click **"Add or Remove Instagram Business Accounts"**
3. Select your Facebook Page
4. The Instagram Business account connected to that page will be linked
5. If no Instagram account is connected:
   - Go to your Facebook Page settings
   - Click **"Instagram"** in left menu
   - Click **"Connect Account"**
   - Log in to your Instagram Business account

---

## Step 5: Configure OAuth Redirect URLs

1. Go to **"Facebook Login"** → **"Settings"**
2. Add **Valid OAuth Redirect URIs**:
   - **Development**: `http://localhost:3000/api/instagram/callback`
   - **Production**: `https://yourdomain.com/api/instagram/callback`
3. Click **"Save Changes"**

---

## Step 6: Request Permissions

### Required Permissions
1. Go to **"App Review"** → **"Permissions and Features"**
2. Request these permissions:
   - ✅ `instagram_basic` - Basic profile access
   - ✅ `instagram_content_publish` - Post content
   - ✅ `pages_show_list` - Access Facebook Pages
   - ✅ `pages_read_engagement` - Read Page data

3. For each permission:
   - Click **"Request Advanced Access"**
   - Fill out the form explaining your use case
   - Submit for review

**Note**: You can test with Standard Access before approval, but with limitations.

---

## Step 7: Add Credentials to Your App

1. Open your `.env` file in the project root
2. Add your Instagram/Facebook credentials:

```env
# Instagram API Configuration (uses Facebook App)
INSTAGRAM_APP_ID=your_app_id_here
INSTAGRAM_APP_SECRET=your_app_secret_here
# Alternative names (same values)
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   # Start it again
   npm run dev
   ```

---

## Step 8: Configure Supabase Storage

Instagram requires images to be hosted at publicly accessible URLs. We use Supabase Storage for this.

1. Go to **Supabase Dashboard** → **Storage**
2. Ensure the **"media"** bucket exists
3. Make sure the bucket is **public** or has proper policies:
   ```sql
   -- Allow public read access
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'media' );
   
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated Upload"
   ON storage.objects FOR INSERT
   WITH CHECK ( bucket_id = 'media' AND auth.role() = 'authenticated' );
   ```

---

## Step 9: Test the Integration

1. Open **http://localhost:3000**
2. Sign in to your app
3. Go to **"Accounts"** section
4. Click **"Connect"** on the Instagram card
5. You'll be redirected to Facebook to authorize
6. Select your Facebook Page
7. Click **"Continue"** to grant permissions
8. You'll be redirected back to your app
9. Instagram should now show as **Connected** ✅

---

## Step 10: Post Your First Instagram Post

1. Go to **"Create Content"**
2. Create a new post
3. Select **Instagram** as the platform
4. Write your caption (max 2200 characters)
5. **IMPORTANT**: Generate or upload an image (Instagram requires media)
6. Click through the workflow: Draft → Ready to Publish
7. Go to **"Published"** tab
8. Click **"Publish"** button
9. Check your Instagram account - the post should be live! 📸

---

## Troubleshooting

### "Instagram/Facebook API credentials not configured"
- Make sure you've added `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET` to `.env`
- Restart the dev server after adding credentials

### "No Facebook Pages found"
- You need to create a Facebook Page first
- Go to https://www.facebook.com/pages/create
- Create a Business Page

### "No Instagram Business Account found"
- Your Instagram account must be a **Business** or **Creator** account
- Convert your account: Instagram App → Settings → Account → Switch to Professional Account
- Connect it to your Facebook Page

### "Redirect URL mismatch"
- Ensure the redirect URL in Facebook App matches exactly:
  - Dev: `http://localhost:3000/api/instagram/callback`
  - Prod: `https://yourdomain.com/api/instagram/callback`
- No trailing slashes!

### "Permissions not granted"
- Check **App Review** → **Permissions and Features**
- Make sure `instagram_basic` and `instagram_content_publish` are approved
- You can test with Standard Access (limited) before Advanced Access approval

### "Post failed - image URL not accessible"
- Instagram requires publicly accessible image URLs
- Check Supabase Storage bucket is public
- Verify the image URL is accessible in a browser
- Check storage policies allow public read access

### "Caption exceeds limit"
- Instagram captions have a 2200 character limit
- Shorten your caption and try again

### "Access token expired"
- Instagram tokens expire after 60 days
- Click "Disconnect" and "Connect" again to get a new token

---

## Instagram API Limitations

### Free Tier (Standard Access)
- **POST limit**: 25 posts per day per user
- **Image requirements**:
  - Format: JPG, PNG
  - Max size: 8MB
  - Aspect ratio: 4:5 to 1.91:1
  - Min resolution: 320px
- **Caption**: Max 2200 characters
- **Hashtags**: Max 30 per post

### Advanced Access (After Approval)
- Higher rate limits
- More API features
- Production-level access

---

## Production Deployment Notes

When deploying to production:

1. **Update Redirect URL** in Facebook App to your production domain
2. **Update `.env`** file:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
3. **App Review**: Submit your app for review to get Advanced Access
4. **Business Verification**: May need to verify your business
5. **Keep credentials secure**:
   - Never commit `.env` to git
   - Use environment variables in hosting platform
   - Consider using secrets management service

---

## Security Best Practices

✅ **DO**:
- Store credentials in environment variables
- Use HTTPS in production (required by Facebook)
- Implement rate limiting
- Log all API calls for debugging
- Handle expired tokens gracefully
- Validate image URLs before posting

❌ **DON'T**:
- Commit credentials to git
- Share API keys publicly
- Expose credentials in client-side code
- Skip OAuth - always use proper authentication
- Post without checking token expiration

---

## Instagram vs Other Platforms

| Feature | Instagram | Twitter | LinkedIn |
|---------|-----------|---------|----------|
| **OAuth Version** | OAuth 2.0 (via Facebook) | OAuth 1.0a | OAuth 2.0 |
| **Requires** | Business Account + Facebook Page | Twitter Account | LinkedIn Account |
| **Character Limit** | 2200 | 280 | 3000 |
| **Media Required** | YES (image/video mandatory) | No | No |
| **Media Upload** | Public URL required | Direct upload | Direct upload |
| **Token Expiration** | 60 days | Never | 60 days |
| **Rate Limits** | 25 posts/day | 50 posts/day | 100 posts/day |
| **Setup Complexity** | High (Facebook + Instagram) | Low | Medium |

---

## Architecture: How It Works

### OAuth Flow
```
User → Click "Connect Instagram"
     ↓
Redirect to Facebook OAuth
     ↓
User authorizes app
     ↓
Select Facebook Page
     ↓
Get Page Access Token
     ↓
Find Instagram Business Account linked to Page
     ↓
Store encrypted credentials
     ↓
Connected! ✅
```

### Posting Flow
```
User → Click "Publish"
     ↓
Upload image to Supabase Storage
     ↓
Get public URL
     ↓
Step 1: Create Instagram media container (with public URL)
     ↓
Step 2: Publish the container
     ↓
Post live on Instagram! 📸
```

---

## API Documentation

- **Facebook Developers**: https://developers.facebook.com
- **Instagram Graph API**: https://developers.facebook.com/docs/instagram-api
- **Content Publishing**: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
- **Rate Limits**: https://developers.facebook.com/docs/graph-api/overview/rate-limiting

---

## Common Issues & Solutions

### Issue: "This app is in Development Mode"
**Solution**: 
- Go to **App Review** → **Request Advanced Access**
- Or switch to **Live Mode** in Settings → Basic

### Issue: "Instagram account not connected to Page"
**Solution**:
- Go to Facebook Page → Settings → Instagram
- Click "Connect Account"
- Log in with Instagram Business account

### Issue: "Image upload failed"
**Solution**:
- Check Supabase Storage is configured
- Verify bucket permissions
- Ensure image is under 8MB

### Issue: "Container creation failed"
**Solution**:
- Image URL must be publicly accessible
- Check image meets Instagram requirements
- Verify aspect ratio (4:5 to 1.91:1)

---

## Next Steps

After completing setup:

1. ✅ Test authentication flow
2. ✅ Test posting with images
3. ⏳ Implement video support (future)
4. ⏳ Add carousel posts (future)
5. ⏳ Fetch analytics (future)

---

**Ready to share visually!** 📸 Once you've completed these steps, your Social Media OS can post directly to Instagram!
