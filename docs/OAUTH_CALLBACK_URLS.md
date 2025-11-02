# 🔐 OAuth Callback URLs - Quick Reference

## Your Vercel Domain
```
https://social-medias-os.vercel.app/
```

## 📋 Callback URLs to Add

Copy and paste these URLs into each platform's OAuth settings:

### 🐦 Twitter/X
**Developer Portal**: https://developer.twitter.com/en/portal/dashboard

**Callback URL:**
```
https://social-medias-os.vercel.app/api/twitter/callback
```

**Website URL:**
```
https://social-medias-os.vercel.app
```

---

### 💼 LinkedIn
**Developer Portal**: https://www.linkedin.com/developers/apps

**OAuth 2.0 Redirect URL:**
```
https://social-medias-os.vercel.app/api/linkedin/callback
```

---

### 📷 Instagram / Facebook
**Developer Portal**: https://developers.facebook.com

**Valid OAuth Redirect URIs:**
```
https://social-medias-os.vercel.app/api/instagram/callback
https://social-medias-os.vercel.app/api/facebook/callback
```

**App Domains:**
```
social-medias-os.vercel.app
```

---

### 🧵 Threads
**Developer Portal**: https://developers.facebook.com

**Valid OAuth Redirect URI:**
```
https://social-medias-os.vercel.app/api/threads/callback
```

---

## 🌐 Supabase Configuration
**Dashboard**: https://supabase.com/dashboard

**Site URL:**
```
https://social-medias-os.vercel.app
```

**Redirect URLs (add to list):**
```
https://social-medias-os.vercel.app/**
```

---

## ✅ Keep for Local Development

Don't delete these localhost URLs - you need them for local development:

```
http://localhost:3000/api/twitter/callback
http://localhost:3000/api/linkedin/callback
http://localhost:3000/api/instagram/callback
http://localhost:3000/api/facebook/callback
http://localhost:3000/api/threads/callback
http://localhost:3000/**
```

---

## 📝 Step-by-Step Process

For each platform:

1. **Open the developer portal** (links above)
2. **Find your app** using the App ID/Client ID from your `.env` file
3. **Navigate to OAuth settings** (usually under "Settings" or "Auth")
4. **Add the callback URL** (don't remove localhost URLs)
5. **Save changes**
6. **Wait 5-10 minutes** for changes to propagate
7. **Test the connection** in your app

---

## 🔍 Finding OAuth Settings

### Twitter/X
1. Go to your app in the Developer Portal
2. Click **"User authentication settings"**
3. Find **"Callback URL / Redirect URL"** section
4. Add the new URL

### LinkedIn
1. Open your app in Developer Portal
2. Click **"Auth"** tab
3. Scroll to **"OAuth 2.0 settings"**
4. Add to **"Redirect URLs"**

### Facebook/Instagram/Threads
1. Select your app in Developer Portal
2. In left sidebar, click **"Facebook Login"** or **"Instagram"** or **"Threads"**
3. Click **"Settings"**
4. Find **"Valid OAuth Redirect URIs"**
5. Add the URLs (one per line)

### Supabase
1. Go to your project dashboard
2. Click **"Authentication"** in sidebar
3. Click **"URL Configuration"**
4. Update **"Site URL"** and add to **"Redirect URLs"**

---

## ⚠️ Important Notes

- **Don't remove localhost URLs** - you need them for local development
- **Wait 5-10 minutes** after saving - changes take time to propagate
- **Use exact URLs** - no typos, check for trailing slashes
- **HTTPS required** - Vercel uses HTTPS by default
- **Test after adding** - try connecting each platform in your app

---

## 🐛 Troubleshooting

**"Invalid callback URL" error:**
- Check for typos in the URL
- Ensure you saved the settings
- Wait 10 minutes and try again
- Check if the app is in production mode

**"Redirect URI mismatch" error:**
- URL must match exactly
- Check for extra or missing slashes
- Verify the callback path is correct

**OAuth still not working:**
- Clear browser cache
- Check Vercel environment variables
- Review Vercel deployment logs
- Ensure all platforms are in production mode

---

## ✨ You're All Set!

Once all callback URLs are updated and you've waited a few minutes, test each connection in your deployed app:

👉 **https://social-medias-os.vercel.app/**

Connect each platform and verify the OAuth flow works correctly!
