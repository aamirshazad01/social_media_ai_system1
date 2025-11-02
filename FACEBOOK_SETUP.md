# Facebook API Setup Guide

Follow these steps to enable real Facebook posting in your Social Media OS.

**Note**: This uses the same Facebook App as Instagram. If you've already set up Instagram, you can use the same credentials!

## Prerequisites

Before you start:
- ✅ Facebook account
- ✅ Facebook Page (required for posting)

---

## Step 1: Create Facebook App (or Use Existing)

### If You Already Set Up Instagram:
✅ **You can skip to Step 6!** Use the same `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` from your Instagram setup.

### If Starting Fresh:
1. Go to **https://developers.facebook.com**
2. Click **"My Apps"** → **"Create App"**
3. Select **"Business"** as app type
4. Fill in app details:
   - **App Name**: Social Media OS
   - **App Contact Email**: Your email
   - **Business Account**: Select or create one
5. Click **"Create App"**

---

## Step 2: Add Required Products

1. In your app dashboard, find **"Add Products"**
2. Add **"Facebook Login"**
3. Click **"Set Up"**

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
3. Add **Site URL**: `http://localhost:3000`
4. Click **"Save Changes"**

---

## Step 4: Configure Facebook Login

1. Go to **"Facebook Login"** → **"Settings"**
2. Add **Valid OAuth Redirect URIs**:
   - **Development**: `http://localhost:3000/api/facebook/callback`
   - **Production**: `https://yourdomain.com/api/facebook/callback`
3. Enable **"Client OAuth Login"**: YES
4. Enable **"Web OAuth Login"**: YES
5. Click **"Save Changes"**

---

## Step 5: Request Permissions

### Required Permissions
1. Go to **"App Review"** → **"Permissions and Features"**
2. Request these permissions:
   - ✅ `pages_show_list` - Access Facebook Pages
   - ✅ `pages_read_engagement` - Read Page data
   - ✅ `pages_manage_posts` - Post content
   - ✅ `pages_manage_engagement` - Manage comments/reactions
   - ✅ `public_profile` - Basic profile access

3. For each permission:
   - Click **"Request Advanced Access"**
   - Fill out the form explaining your use case
   - Submit for review

**Note**: You can test with Standard Access before approval, but with limitations.

---

## Step 6: Add Credentials to Your App

1. Open your `.env` file in the project root
2. Add your Facebook credentials (or verify they're already there from Instagram setup):

```env
# Facebook API Configuration
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

## Step 7: Create or Select Facebook Page

Facebook posting requires a Facebook Page (not personal profile).

### If You Don't Have a Page:
1. Go to **https://www.facebook.com/pages/create**
2. Select **"Business or Brand"**
3. Fill in:
   - **Page Name**: Your business name
   - **Category**: Select appropriate category
   - **Description**: Brief description
4. Click **"Create Page"**

### If You Have a Page:
✅ Make sure you're an admin of the page you want to post to.

---

## Step 8: Configure Supabase Storage

Facebook accepts public URLs for images. We use Supabase Storage.

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
4. Click **"Connect"** on the Facebook card
5. You'll be redirected to Facebook to authorize
6. Select your Facebook Page
7. Click **"Continue"** to grant permissions
8. You'll be redirected back to your app
9. Facebook should now show as **Connected** ✅

---

## Step 10: Post Your First Facebook Post

1. Go to **"Create Content"**
2. Create a new post
3. Select **Facebook** as the platform
4. Write your message (max 63,206 characters)
5. Optionally generate or upload an image
6. Click through the workflow: Draft → Ready to Publish
7. Go to **"Published"** tab
8. Click **"Publish"** button
9. Check your Facebook Page - the post should be live! 📘

---

## Troubleshooting

### "Facebook API credentials not configured"
- Make sure you've added `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` to `.env`
- Restart the dev server after adding credentials

### "No Facebook Pages found"
- You need to create a Facebook Page first
- Go to https://www.facebook.com/pages/create
- Create a Business Page

### "Redirect URL mismatch"
- Ensure the redirect URL in Facebook App matches exactly:
  - Dev: `http://localhost:3000/api/facebook/callback`
  - Prod: `https://yourdomain.com/api/facebook/callback`
- No trailing slashes!

### "Permissions not granted"
- Check **App Review** → **Permissions and Features**
- Make sure `pages_manage_posts` is approved
- You can test with Standard Access (limited) before Advanced Access approval

### "Post failed - image URL not accessible"
- Facebook requires publicly accessible image URLs
- Check Supabase Storage bucket is public
- Verify the image URL is accessible in a browser
- Check storage policies allow public read access

### "Message exceeds limit"
- Facebook posts have a 63,206 character limit
- Shorten your message and try again

### "Access token expired"
- Facebook tokens expire after 60 days
- Click "Disconnect" and "Connect" again to get a new token

---

## Facebook API Limitations

### Free Tier (Standard Access)
- **POST limit**: Varies by page (typically 200-600 posts/day)
- **Image requirements**:
  - Format: JPG, PNG, GIF
  - Max size: 10MB
  - Recommended: 1200x630px
- **Message**: Max 63,206 characters
- **Hashtags**: No limit (but 1-2 recommended)

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

## Facebook vs Other Platforms

| Feature | Facebook | Twitter | LinkedIn | Instagram |
|---------|----------|---------|----------|-----------|
| **OAuth Version** | OAuth 2.0 | OAuth 1.0a | OAuth 2.0 | OAuth 2.0 (via FB) |
| **Requires** | Facebook Page | Twitter Account | LinkedIn Account | Business + FB Page |
| **Character Limit** | 63,206 | 280 | 3000 | 2200 |
| **Media Required** | No | No | No | YES |
| **Media Upload** | Public URL | Direct upload | Direct upload | Public URL |
| **Token Expiration** | 60 days | Never | 60 days | 60 days |
| **Rate Limits** | 200-600/day | 50/day | 100/day | 25/day |
| **Setup Complexity** | Medium | Low | Medium | High |

---

## Architecture: How It Works

### OAuth Flow
```
User → Click "Connect Facebook"
     ↓
Redirect to Facebook OAuth
     ↓
User authorizes app
     ↓
Select Facebook Page
     ↓
Get Page Access Token
     ↓
Store encrypted credentials
     ↓
Connected! ✅
```

### Posting Flow
```
User → Click "Publish"
     ↓
Upload image to Supabase Storage (if present)
     ↓
Get public URL
     ↓
Post to Facebook Page with message + image URL
     ↓
Post live on Facebook! 📘
```

---

## API Documentation

- **Facebook Developers**: https://developers.facebook.com
- **Facebook Login**: https://developers.facebook.com/docs/facebook-login
- **Pages API**: https://developers.facebook.com/docs/pages-api
- **Graph API**: https://developers.facebook.com/docs/graph-api

---

## Common Issues & Solutions

### Issue: "This app is in Development Mode"
**Solution**: 
- Go to **App Review** → **Request Advanced Access**
- Or switch to **Live Mode** in Settings → Basic

### Issue: "Page not found"
**Solution**:
- Make sure you're an admin of the Facebook Page
- Check that the page is published (not draft)

### Issue: "Image upload failed"
**Solution**:
- Check Supabase Storage is configured
- Verify bucket permissions
- Ensure image is under 10MB

### Issue: "Post creation failed"
**Solution**:
- Image URL must be publicly accessible
- Check image meets Facebook requirements
- Verify you have posting permissions

---

## Next Steps

After completing setup:

1. ✅ Test authentication flow
2. ✅ Test posting text-only
3. ✅ Test posting with images
4. ⏳ Implement video support (future)
5. ⏳ Add link preview optimization (future)
6. ⏳ Fetch analytics (future)

---

**Ready to share socially!** 📘 Once you've completed these steps, your Social Media OS can post directly to Facebook Pages!
