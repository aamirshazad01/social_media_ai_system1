# Facebook OAuth "Invalid Scopes" - Quick Fix

## The Problem
```
Invalid Scopes: pages_manage_posts, pages_read_user_content, read_insights.
```

## The Solution (3 Steps)

### Step 1: Update Your Local Environment
Edit `.env.local` and ensure this line exists:
```env
FACEBOOK_USE_ADVANCED_SCOPES=false
```

### Step 2: Restart Development Server
```bash
npm run dev
```

### Step 3: Try Connecting Facebook Again
Your app will now use basic scopes that work immediately in Development Mode.

---

## What You Get with This Fix

### Immediately (No App Review Needed)
✅ List your Facebook pages
✅ See engagement metrics
✅ Read comments and reactions
✅ Access basic profile info

### After App Review (Production)
✅ + Create/edit posts
✅ + Read user-generated content
✅ + Access detailed analytics

---

## To Submit for App Review (Optional)

When ready for production:

1. Go to: https://developers.facebook.com/apps/YOUR_APP_ID/roles
2. Submit for App Review → Request these permissions:
   - `pages_manage_posts`
   - `pages_read_user_content`
   - `read_insights`
3. Wait ~1-3 days for approval
4. Update `.env` to: `FACEBOOK_USE_ADVANCED_SCOPES=true`
5. Deploy to production

---

## Debugging

**Check token status:**
```
GET http://localhost:3000/api/facebook/debug-token?token=YOUR_TOKEN
```

**Check logs:**
Look at browser console and server logs for error details.

---

## Files Changed

- ✏️ `src/lib/facebook/client.ts` - Dual scope config
- ✏️ `src/app/api/auth/oauth/[platform]/route.ts` - Uses smart scope selection
- ✏️ `src/app/api/auth/oauth/facebook/callback/route.ts` - Better error handling
- ✏️ `.env.local` - Development scope setting
- ✏️ `.env` - Production scope setting
- ✨ `src/app/api/facebook/debug-token/route.ts` - NEW token debugging endpoint

---

## Still Having Issues?

1. **Clear cache:** Browser dev tools → Application → Clear all
2. **Restart server:** Kill and `npm run dev`
3. **Check environment:** Confirm `.env.local` has correct setting
4. **Debug token:** Use `/api/facebook/debug-token` endpoint
5. **Check role:** Ensure your account is admin in the Facebook page

---

## Need More Details?

See `FACEBOOK_OAUTH_SCOPES_FIX.md` for comprehensive documentation.
