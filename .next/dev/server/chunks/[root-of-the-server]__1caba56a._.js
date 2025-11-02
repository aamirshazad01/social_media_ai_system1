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
"[project]/src/lib/instagram/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Instagram API Client Utility
 * Handles Instagram Graph API OAuth 2.0 and content publishing
 * Note: Instagram API requires a Facebook Business account
 */ /**
 * Instagram OAuth 2.0 URLs (via Facebook)
 */ __turbopack_context__.s([
    "FACEBOOK_GRAPH_BASE",
    ()=>FACEBOOK_GRAPH_BASE,
    "FACEBOOK_OAUTH_URL",
    ()=>FACEBOOK_OAUTH_URL,
    "FACEBOOK_TOKEN_URL",
    ()=>FACEBOOK_TOKEN_URL,
    "INSTAGRAM_API_BASE",
    ()=>INSTAGRAM_API_BASE,
    "INSTAGRAM_SCOPES",
    ()=>INSTAGRAM_SCOPES,
    "createCarouselContainer",
    ()=>createCarouselContainer,
    "createMediaContainer",
    ()=>createMediaContainer,
    "createVideoContainer",
    ()=>createVideoContainer,
    "exchangeCodeForToken",
    ()=>exchangeCodeForToken,
    "generateInstagramAuthUrl",
    ()=>generateInstagramAuthUrl,
    "getFacebookPages",
    ()=>getFacebookPages,
    "getInstagramAccountInfo",
    ()=>getInstagramAccountInfo,
    "getInstagramBusinessAccount",
    ()=>getInstagramBusinessAccount,
    "getLongLivedToken",
    ()=>getLongLivedToken,
    "getMediaInsights",
    ()=>getMediaInsights,
    "publishMediaContainer",
    ()=>publishMediaContainer,
    "uploadImageToStorage",
    ()=>uploadImageToStorage
]);
const FACEBOOK_OAUTH_URL = 'https://www.facebook.com/v18.0/dialog/oauth';
const FACEBOOK_TOKEN_URL = 'https://graph.facebook.com/v18.0/oauth/access_token';
const INSTAGRAM_API_BASE = 'https://graph.instagram.com';
const FACEBOOK_GRAPH_BASE = 'https://graph.facebook.com/v18.0';
const INSTAGRAM_SCOPES = [
    'instagram_basic',
    'instagram_content_publish',
    'pages_show_list',
    'pages_read_engagement'
];
function generateInstagramAuthUrl(appId, redirectUri, state) {
    const params = new URLSearchParams({
        client_id: appId,
        redirect_uri: redirectUri,
        state: state,
        scope: INSTAGRAM_SCOPES.join(','),
        response_type: 'code'
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
async function getInstagramBusinessAccount(pageId, pageAccessToken) {
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Instagram business account');
    }
    const data = await response.json();
    return data.instagram_business_account?.id || null;
}
async function getInstagramAccountInfo(igUserId, accessToken) {
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${igUserId}?fields=id,username,name,profile_picture_url&access_token=${accessToken}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Instagram account info');
    }
    return response.json();
}
async function createMediaContainer(igUserId, accessToken, imageUrl, caption) {
    const params = new URLSearchParams({
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken
    });
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${igUserId}/media`, {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create media container');
    }
    return response.json();
}
async function createCarouselContainer(igUserId, accessToken, imageUrls, caption) {
    // First, create containers for each image
    const childrenIds = [];
    for (const imageUrl of imageUrls){
        const params = new URLSearchParams({
            image_url: imageUrl,
            is_carousel_item: 'true',
            access_token: accessToken
        });
        const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${igUserId}/media`, {
            method: 'POST',
            body: params
        });
        if (!response.ok) {
            throw new Error('Failed to create carousel item');
        }
        const data = await response.json();
        childrenIds.push(data.id);
    }
    // Create carousel container
    const params = new URLSearchParams({
        media_type: 'CAROUSEL',
        children: childrenIds.join(','),
        caption: caption,
        access_token: accessToken
    });
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${igUserId}/media`, {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create carousel container');
    }
    return response.json();
}
async function createVideoContainer(igUserId, accessToken, videoUrl, caption) {
    const params = new URLSearchParams({
        media_type: 'VIDEO',
        video_url: videoUrl,
        caption: caption,
        access_token: accessToken
    });
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${igUserId}/media`, {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create video container');
    }
    return response.json();
}
async function publishMediaContainer(igUserId, accessToken, creationId) {
    const params = new URLSearchParams({
        creation_id: creationId,
        access_token: accessToken
    });
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${igUserId}/media_publish`, {
        method: 'POST',
        body: params
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to publish media container');
    }
    return response.json();
}
async function uploadImageToStorage(imageBuffer, fileName, supabaseUrl, supabaseKey) {
    // Upload to Supabase Storage
    const formData = new FormData();
    const blob = new Blob([
        new Uint8Array(imageBuffer)
    ], {
        type: 'image/jpeg'
    });
    formData.append('file', blob, fileName);
    const response = await fetch(`${supabaseUrl}/storage/v1/object/media/${fileName}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${supabaseKey}`
        },
        body: formData
    });
    if (!response.ok) {
        throw new Error('Failed to upload image to storage');
    }
    // Return public URL
    return `${supabaseUrl}/storage/v1/object/public/media/${fileName}`;
}
async function getMediaInsights(mediaId, accessToken) {
    const metrics = [
        'engagement',
        'impressions',
        'reach',
        'saved'
    ];
    const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${mediaId}/insights?metric=${metrics.join(',')}&access_token=${accessToken}`);
    if (!response.ok) {
        throw new Error('Failed to fetch media insights');
    }
    return response.json();
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/app/api/instagram/auth/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Instagram OAuth - Start Authentication Flow
 * POST /api/instagram/auth
 */ __turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/instagram/client.ts [app-route] (ecmascript)");
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
        // Get Instagram/Facebook credentials from environment
        const appId = process.env.INSTAGRAM_APP_ID || process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.INSTAGRAM_APP_SECRET || process.env.FACEBOOK_APP_SECRET;
        if (!appId || !appSecret) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Instagram/Facebook API credentials not configured in environment'
            }, {
                status: 500
            });
        }
        // Generate callback URL
        const callbackURL = `${("TURBOPACK compile-time value", "http://localhost:3000")}/api/instagram/callback`;
        // Generate random state for CSRF protection
        const state = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(32).toString('hex');
        // Generate Instagram OAuth URL (via Facebook)
        const authUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$instagram$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateInstagramAuthUrl"])(appId, callbackURL, state);
        // Create response with auth URL
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url: authUrl,
            state: state
        });
        // Store state in secure cookie for verification
        response.cookies.set('instagram_oauth_state', state, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'lax',
            maxAge: 600,
            path: '/'
        });
        return response;
    } catch (error) {
        console.error('Instagram OAuth error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to initiate Instagram authentication',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1caba56a._.js.map