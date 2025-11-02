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
"[project]/src/lib/linkedin/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LinkedIn API Client Utility
 * Handles LinkedIn OAuth 2.0 and API v2 integration
 */ /**
 * LinkedIn OAuth 2.0 URLs
 */ __turbopack_context__.s([
    "LINKEDIN_API_BASE",
    ()=>LINKEDIN_API_BASE,
    "LINKEDIN_OAUTH_URL",
    ()=>LINKEDIN_OAUTH_URL,
    "LINKEDIN_SCOPES",
    ()=>LINKEDIN_SCOPES,
    "LINKEDIN_TOKEN_URL",
    ()=>LINKEDIN_TOKEN_URL,
    "exchangeCodeForToken",
    ()=>exchangeCodeForToken,
    "generateLinkedInAuthUrl",
    ()=>generateLinkedInAuthUrl,
    "getLinkedInProfile",
    ()=>getLinkedInProfile,
    "getLinkedInUserUrn",
    ()=>getLinkedInUserUrn,
    "initializeImageUpload",
    ()=>initializeImageUpload,
    "initializeVideoUpload",
    ()=>initializeVideoUpload,
    "postToLinkedIn",
    ()=>postToLinkedIn,
    "refreshLinkedInToken",
    ()=>refreshLinkedInToken,
    "uploadImageBinary",
    ()=>uploadImageBinary,
    "uploadVideoBinary",
    ()=>uploadVideoBinary
]);
const LINKEDIN_OAUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const LINKEDIN_SCOPES = [
    'openid',
    'profile',
    'email',
    'w_member_social'
];
function generateLinkedInAuthUrl(clientId, redirectUri, state) {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        state: state,
        scope: LINKEDIN_SCOPES.join(' ')
    });
    return `${LINKEDIN_OAUTH_URL}?${params.toString()}`;
}
async function exchangeCodeForToken(code, clientId, clientSecret, redirectUri) {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri
    });
    const response = await fetch(LINKEDIN_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Failed to exchange code for token');
    }
    return response.json();
}
async function getLinkedInProfile(accessToken) {
    const response = await fetch(`${LINKEDIN_API_BASE}/userinfo`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn profile');
    }
    return response.json();
}
async function getLinkedInUserUrn(accessToken) {
    const response = await fetch(`${LINKEDIN_API_BASE}/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'LinkedIn-Version': '202402'
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn user URN');
    }
    const data = await response.json();
    return data.id; // Returns the user's URN
}
async function postToLinkedIn(accessToken, authorUrn, text, visibility = 'PUBLIC', mediaUrn) {
    const shareContent = {
        author: `urn:li:person:${authorUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
            'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                    text: text
                },
                shareMediaCategory: mediaUrn ? 'IMAGE' : 'NONE'
            }
        },
        visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': visibility
        }
    };
    // Add media if provided
    if (mediaUrn) {
        shareContent.specificContent['com.linkedin.ugc.ShareContent'].media = [
            {
                status: 'READY',
                media: mediaUrn
            }
        ];
    }
    const response = await fetch(`${LINKEDIN_API_BASE}/ugcPosts`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202402'
        },
        body: JSON.stringify(shareContent)
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to post to LinkedIn: ${error}`);
    }
    return response.json();
}
async function initializeImageUpload(accessToken, authorUrn) {
    const requestBody = {
        registerUploadRequest: {
            recipes: [
                'urn:li:digitalmediaRecipe:feedshare-image'
            ],
            owner: `urn:li:person:${authorUrn}`,
            serviceRelationships: [
                {
                    relationshipType: 'OWNER',
                    identifier: 'urn:li:userGeneratedContent'
                }
            ]
        }
    };
    const response = await fetch(`${LINKEDIN_API_BASE}/assets?action=registerUpload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202402'
        },
        body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to initialize image upload: ${error}`);
    }
    const data = await response.json();
    return {
        uploadUrl: data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl,
        asset: data.value.asset
    };
}
async function uploadImageBinary(uploadUrl, imageBuffer, accessToken) {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/octet-stream'
        },
        body: imageBuffer
    });
    if (!response.ok) {
        throw new Error('Failed to upload image binary to LinkedIn');
    }
}
async function initializeVideoUpload(accessToken, authorUrn) {
    const requestBody = {
        registerUploadRequest: {
            recipes: [
                'urn:li:digitalmediaRecipe:feedshare-video'
            ],
            owner: `urn:li:person:${authorUrn}`,
            serviceRelationships: [
                {
                    relationshipType: 'OWNER',
                    identifier: 'urn:li:userGeneratedContent'
                }
            ]
        }
    };
    const response = await fetch(`${LINKEDIN_API_BASE}/assets?action=registerUpload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
            'LinkedIn-Version': '202402'
        },
        body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to initialize video upload: ${error}`);
    }
    const data = await response.json();
    return {
        uploadUrl: data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl,
        asset: data.value.asset
    };
}
async function uploadVideoBinary(uploadUrl, videoBuffer, accessToken) {
    const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/octet-stream'
        },
        body: videoBuffer
    });
    if (!response.ok) {
        throw new Error('Failed to upload video binary to LinkedIn');
    }
}
async function refreshLinkedInToken(refreshToken, clientId, clientSecret) {
    const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret
    });
    const response = await fetch(LINKEDIN_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Failed to refresh token');
    }
    return response.json();
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/app/api/linkedin/auth/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LinkedIn OAuth - Start Authentication Flow
 * POST /api/linkedin/auth
 */ __turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$linkedin$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/linkedin/client.ts [app-route] (ecmascript)");
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
        // Get LinkedIn credentials from environment
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'LinkedIn API credentials not configured in environment'
            }, {
                status: 500
            });
        }
        // Generate callback URL
        const callbackURL = `${("TURBOPACK compile-time value", "http://localhost:3000")}/api/linkedin/callback`;
        // Generate random state for CSRF protection
        const state = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(32).toString('hex');
        // Generate LinkedIn OAuth URL
        const authUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$linkedin$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateLinkedInAuthUrl"])(clientId, callbackURL, state);
        // Create response with auth URL
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url: authUrl,
            state: state
        });
        // Store state in secure cookie for verification
        response.cookies.set('linkedin_oauth_state', state, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === 'production',
            sameSite: 'lax',
            maxAge: 600,
            path: '/'
        });
        return response;
    } catch (error) {
        console.error('LinkedIn OAuth error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to initiate LinkedIn authentication',
            details: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0fdcc579._.js.map