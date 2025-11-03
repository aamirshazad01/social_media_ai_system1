module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/src/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Supabase Server Client
 * Use this client in server components, API routes, and server actions
 */ __turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "createServerClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://cqzkzzadngzwipszcspn.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxemt6emFkbmd6d2lwc3pjc3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTY5NTksImV4cCI6MjA3NzU5Mjk1OX0.GxaYWzYkghKJekRwvJcA-2o70VLMoDGzHE20kCcmOnE"), {
        cookies: {
            get (name) {
                return cookieStore.get(name)?.value;
            },
            set (name, value, options) {
                try {
                    cookieStore.set({
                        name,
                        value,
                        ...options
                    });
                } catch (error) {
                // Handle cookie errors (happens in Server Components)
                }
            },
            remove (name, options) {
                try {
                    cookieStore.set({
                        name,
                        value: '',
                        ...options
                    });
                } catch (error) {
                // Handle cookie errors
                }
            }
        }
    });
}
;
}),
"[project]/src/lib/facebook/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Facebook API Client Utility
 * Handles Facebook Graph API OAuth 2.0 and content publishing
 */ /**
 * Facebook OAuth 2.0 URLs
 */ // Use versioned OAuth endpoints to align with latest login experience
__turbopack_context__.s([
    "FACEBOOK_GRAPH_BASE",
    ()=>FACEBOOK_GRAPH_BASE,
    "FACEBOOK_OAUTH_URL",
    ()=>FACEBOOK_OAUTH_URL,
    "FACEBOOK_SCOPES",
    ()=>FACEBOOK_SCOPES,
    "FACEBOOK_TOKEN_URL",
    ()=>FACEBOOK_TOKEN_URL,
    "createMultiPhotoPost",
    ()=>createMultiPhotoPost,
    "deletePost",
    ()=>deletePost,
    "exchangeCodeForToken",
    ()=>exchangeCodeForToken,
    "generateFacebookAuthUrl",
    ()=>generateFacebookAuthUrl,
    "getFacebookPages",
    ()=>getFacebookPages,
    "getLongLivedToken",
    ()=>getLongLivedToken,
    "getPageInfo",
    ()=>getPageInfo,
    "getPageInsights",
    ()=>getPageInsights,
    "getPostInsights",
    ()=>getPostInsights,
    "postPhotoToFacebookPage",
    ()=>postPhotoToFacebookPage,
    "postToFacebookPage",
    ()=>postToFacebookPage,
    "uploadPhotoToFacebook",
    ()=>uploadPhotoToFacebook,
    "uploadVideoToFacebookPage",
    ()=>uploadVideoToFacebookPage
]);
const FACEBOOK_OAUTH_URL = 'https://www.facebook.com/v21.0/dialog/oauth';
const FACEBOOK_TOKEN_URL = 'https://graph.facebook.com/v21.0/oauth/access_token';
const FACEBOOK_GRAPH_BASE = 'https://graph.facebook.com/v21.0';
const FACEBOOK_SCOPES = [
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_posts',
    'pages_manage_engagement',
    'public_profile',
    'email'
];
function generateFacebookAuthUrl(appId, redirectUri, state) {
    const params = new URLSearchParams({
        client_id: appId,
        redirect_uri: redirectUri,
        state: state,
        scope: FACEBOOK_SCOPES.join(','),
        response_type: 'code',
        auth_type: 'rerequest',
        // Use popup display to avoid cookie consent page issues
        display: 'popup'
    });
    return `${FACEBOOK_OAUTH_URL}?${params.toString()}`;
}
async function exchangeCodeForToken(code, appId, appSecret, redirectUri) {
    const params = new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        code: code,
        redirect_uri: redirectUri
    });
    const response = await fetch(`${FACEBOOK_TOKEN_URL}?${params.toString()}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to exchange code for token');
    }
    return response.json();
}
async function getLongLivedToken(shortLivedToken, appId, appSecret) {
    const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: shortLivedToken
    });
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/oauth/access_token?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to get long-lived token');
    }
    return response.json();
}
async function getFacebookPages(accessToken) {
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/me/accounts?access_token=${accessToken}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Facebook pages');
    }
    return response.json();
}
async function getPageInfo(pageId, pageAccessToken) {
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${pageId}?fields=id,name,category,fan_count&access_token=${pageAccessToken}`);
    if (!response.ok) {
        throw new Error('Failed to fetch page info');
    }
    return response.json();
}
async function postToFacebookPage(pageId, pageAccessToken, message, link) {
    const params = new URLSearchParams({
        message: message,
        access_token: pageAccessToken
    });
    if (link) {
        params.append('link', link);
    }
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${pageId}/feed`, {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to post to Facebook');
    }
    return response.json();
}
async function postPhotoToFacebookPage(pageId, pageAccessToken, imageUrl, message) {
    const params = new URLSearchParams({
        url: imageUrl,
        caption: message,
        access_token: pageAccessToken
    });
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${pageId}/photos`, {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to post photo to Facebook');
    }
    return response.json();
}
async function uploadPhotoToFacebook(pageId, pageAccessToken, imageUrl) {
    const params = new URLSearchParams({
        url: imageUrl,
        published: 'false',
        access_token: pageAccessToken
    });
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${pageId}/photos`, {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to upload photo');
    }
    return response.json();
}
async function createMultiPhotoPost(pageId, pageAccessToken, photoIds, message) {
    const attachedMedia = photoIds.map((id)=>({
            media_fbid: id
        }));
    const params = new URLSearchParams({
        message: message,
        attached_media: JSON.stringify(attachedMedia),
        access_token: pageAccessToken
    });
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${pageId}/feed`, {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create multi-photo post');
    }
    return response.json();
}
async function getPostInsights(postId, pageAccessToken) {
    const metrics = [
        'post_impressions',
        'post_impressions_unique',
        'post_engaged_users',
        'post_clicks',
        'post_reactions_like_total',
        'post_reactions_love_total'
    ];
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${postId}/insights?metric=${metrics.join(',')}&access_token=${pageAccessToken}`);
    if (!response.ok) {
        throw new Error('Failed to fetch post insights');
    }
    return response.json();
}
async function getPageInsights(pageId, pageAccessToken, since, until) {
    const metrics = [
        'page_impressions',
        'page_impressions_unique',
        'page_engaged_users',
        'page_post_engagements',
        'page_fans'
    ];
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${pageId}/insights?metric=${metrics.join(',')}&since=${since}&until=${until}&access_token=${pageAccessToken}`);
    if (!response.ok) {
        throw new Error('Failed to fetch page insights');
    }
    return response.json();
}
async function uploadVideoToFacebookPage(pageId, pageAccessToken, videoUrl, description) {
    const params = new URLSearchParams({
        file_url: videoUrl,
        description: description,
        access_token: pageAccessToken
    });
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${pageId}/videos`, {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to upload video');
    }
    return response.json();
}
async function deletePost(postId, pageAccessToken) {
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${postId}?access_token=${pageAccessToken}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete post');
    }
    return response.json();
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/app/api/facebook/auth/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Facebook OAuth - Start Authentication Flow
 * POST /api/facebook/auth
 */ __turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$facebook$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/facebook/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
;
async function POST(req) {
    try {
        // Check authentication
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Get Facebook credentials from environment
        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        if (!appId || !appSecret) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Facebook API credentials not configured in environment'
            }, {
                status: 500
            });
        }
        // Generate callback URL (ensure no double slash)
        const baseUrl = ("TURBOPACK compile-time value", "https://social-medias-os.vercel.app/")?.replace(/\/$/, '') || '';
        const callbackURL = `${baseUrl}/api/facebook/callback`;
        // Generate random state for CSRF protection
        const state = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(32).toString('hex');
        // Generate Facebook OAuth URL
        const authUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$facebook$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateFacebookAuthUrl"])(appId, callbackURL, state);
        // Create response with auth URL
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url: authUrl,
            state: state
        });
        // Store state in secure cookie for verification
        response.cookies.set('facebook_oauth_state', state, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'lax',
            maxAge: 600,
            path: '/'
        });
        return response;
    } catch (error) {
        console.error('Facebook OAuth error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to initiate Facebook authentication',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ea35b2b2._.js.map