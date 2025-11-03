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
"[project]/src/lib/supabase/index.ts [app-route] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "createBrowserClient",
    ()=>createBrowserClient,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-route] (ecmascript)");
;
const createBrowserClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call createBrowserClient() from the server but createBrowserClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/lib/supabase/index.ts <module evaluation>", "createBrowserClient");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call supabase() from the server but supabase is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/lib/supabase/index.ts <module evaluation>", "supabase");
}),
"[project]/src/lib/supabase/index.ts [app-route] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "createBrowserClient",
    ()=>createBrowserClient,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-route] (ecmascript)");
;
const createBrowserClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call createBrowserClient() from the server but createBrowserClient is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/lib/supabase/index.ts", "createBrowserClient");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call supabase() from the server but supabase is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/lib/supabase/index.ts", "supabase");
}),
"[project]/src/lib/supabase/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/lib/supabase/index.ts [app-route] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/index.ts [app-route] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$client__reference__proxy$29$__);
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/auth/stateGenerator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * CSRF State Generator using cryptographically secure random
 * Supports PKCE (Proof Key for Code Exchange)
 */ __turbopack_context__.s([
    "generatePKCE",
    ()=>generatePKCE,
    "generateRandomState",
    ()=>generateRandomState,
    "generateRandomString",
    ()=>generateRandomString,
    "verifyPKCE",
    ()=>verifyPKCE
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
function generateRandomState(length = 64) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(length).toString('hex');
}
function generatePKCE() {
    // Generate random code verifier (43-128 characters, unreserved characters)
    const codeVerifier = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(32).toString('hex').substring(0, 128);
    // Create code challenge using S256 (SHA256)
    const codeChallenge = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(codeVerifier).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return {
        codeChallenge,
        codeVerifier
    };
}
function verifyPKCE(codeVerifier, codeChallenge) {
    try {
        const computed = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(codeVerifier).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        // Constant-time comparison to prevent timing attacks
        return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].timingSafeEqual(Buffer.from(computed), Buffer.from(codeChallenge));
    } catch (error) {
        console.error('PKCE verification error:', error);
        return false;
    }
}
function generateRandomString(length = 32) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(length).toString('hex');
}
}),
"[project]/src/services/database/oauthStateService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * OAuth State Service
 * Manages CSRF state tokens and PKCE verification
 * Database-backed for security
 */ __turbopack_context__.s([
    "cleanupExpiredStates",
    ()=>cleanupExpiredStates,
    "clearWorkspaceOAuthStates",
    ()=>clearWorkspaceOAuthStates,
    "createOAuthState",
    ()=>createOAuthState,
    "getStateInfo",
    ()=>getStateInfo,
    "verifyOAuthState",
    ()=>verifyOAuthState,
    "verifyPKCECode",
    ()=>verifyPKCECode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$stateGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/stateGenerator.ts [app-route] (ecmascript)");
;
;
async function createOAuthState(workspaceId, platform, ipAddress, userAgent, usePKCE = true) {
    try {
        // Generate state
        const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$stateGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateRandomState"])();
        let codeVerifier;
        let codeChallenge;
        let codeChallengeMethod;
        // Generate PKCE if needed
        if (usePKCE) {
            const pkce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$stateGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generatePKCE"])();
            codeChallenge = pkce.codeChallenge;
            codeVerifier = pkce.codeVerifier;
            codeChallengeMethod = 'S256';
        }
        // Calculate expiration (5 minutes)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        // Store in database
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('oauth_states').insert({
            workspace_id: workspaceId,
            platform,
            state,
            code_challenge: codeChallenge || null,
            code_challenge_method: codeChallengeMethod || null,
            expires_at: expiresAt.toISOString(),
            ip_address: ipAddress || null,
            user_agent: userAgent || null
        });
        if (error) throw error;
        return {
            state,
            codeVerifier,
            codeChallenge,
            expiresAt
        };
    } catch (error) {
        console.error('Error creating OAuth state:', error);
        throw new Error('Failed to create OAuth state');
    }
}
async function verifyOAuthState(workspaceId, platform, state) {
    try {
        // Query database for state
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('oauth_states').select('*').eq('workspace_id', workspaceId).eq('platform', platform).eq('state', state).maybeSingle();
        if (error) throw error;
        // Check if state exists
        if (!data) {
            return {
                valid: false,
                error: 'State not found'
            };
        }
        // Check if already used (replay attack prevention)
        if (data.used) {
            return {
                valid: false,
                error: 'State already used (replay attack detected)'
            };
        }
        // Check if expired
        const expiresAt = new Date(data.expires_at).getTime();
        if (Date.now() > expiresAt) {
            return {
                valid: false,
                error: 'State expired'
            };
        }
        // Mark as used
        const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('oauth_states').update({
            used: true,
            used_at: new Date().toISOString()
        }).eq('id', data.id);
        if (updateError) throw updateError;
        return {
            valid: true,
            codeChallenge: data.code_challenge || undefined,
            codeChallengeMethod: data.code_challenge_method || undefined
        };
    } catch (error) {
        console.error('Error verifying OAuth state:', error);
        return {
            valid: false,
            error: 'State verification failed'
        };
    }
}
function verifyPKCECode(codeVerifier, codeChallenge) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$stateGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPKCE"])(codeVerifier, codeChallenge);
}
async function cleanupExpiredStates() {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('oauth_states').delete().lt('expires_at', new Date().toISOString()).select('id');
        if (error) throw error;
        const deletedCount = data?.length || 0;
        console.log(`Cleaned up ${deletedCount} expired OAuth states`);
        return deletedCount;
    } catch (error) {
        console.error('Error cleaning up OAuth states:', error);
        return 0;
    }
}
async function getStateInfo(workspaceId, state) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('oauth_states').select('*').eq('workspace_id', workspaceId).eq('state', state).maybeSingle();
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error getting state info:', error);
        return null;
    }
}
async function clearWorkspaceOAuthStates(workspaceId) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('oauth_states').delete().eq('workspace_id', workspaceId).select('id');
        if (error) throw error;
        return data?.length || 0;
    } catch (error) {
        console.error('Error clearing OAuth states:', error);
        return 0;
    }
}
}),
"[project]/src/services/database/auditLogService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Audit Log Service
 * Logs all credential-related events for compliance and debugging
 */ __turbopack_context__.s([
    "cleanupOldAuditLogs",
    ()=>cleanupOldAuditLogs,
    "getAuditLogs",
    ()=>getAuditLogs,
    "getAuditSummary",
    ()=>getAuditSummary,
    "getUserAuditLogs",
    ()=>getUserAuditLogs,
    "logAuditEvent",
    ()=>logAuditEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/index.ts [app-route] (ecmascript)");
;
async function logAuditEvent({ workspaceId, userId, platform, action, status, errorMessage, errorCode, ipAddress, userAgent, requestPath, metadata }) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('credential_audit_log').insert({
            workspace_id: workspaceId,
            user_id: userId,
            platform,
            action,
            status,
            error_message: errorMessage || null,
            error_code: errorCode || null,
            ip_address: ipAddress || null,
            user_agent: userAgent || null,
            request_path: requestPath || null,
            metadata: metadata || null
        });
        if (error) {
            console.error('Failed to insert audit log:', error);
        }
    } catch (error) {
        console.error('Audit logging error:', error);
    // Don't throw - logging failures shouldn't break the app
    }
}
async function getAuditLogs(workspaceId, filters) {
    try {
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('credential_audit_log').select('*').eq('workspace_id', workspaceId).order('created_at', {
            ascending: false
        });
        if (filters?.platform) {
            query = query.eq('platform', filters.platform);
        }
        if (filters?.action) {
            query = query.eq('action', filters.action);
        }
        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.startDate) {
            query = query.gte('created_at', filters.startDate.toISOString());
        }
        if (filters?.endDate) {
            query = query.lte('created_at', filters.endDate.toISOString());
        }
        const limit = Math.min(filters?.limit || 100, 1000) // Cap at 1000
        ;
        const offset = filters?.offset || 0;
        query = query.range(offset, offset + limit - 1);
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        return [];
    }
}
async function getUserAuditLogs(workspaceId, userId, options) {
    try {
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('credential_audit_log').select('*').eq('workspace_id', workspaceId).eq('user_id', userId).order('created_at', {
            ascending: false
        });
        const limit = Math.min(options?.limit || 50, 500);
        const offset = options?.offset || 0;
        query = query.range(offset, offset + limit - 1);
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching user audit logs:', error);
        return [];
    }
}
async function getAuditSummary(workspaceId, days = 7) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const logs = await getAuditLogs(workspaceId, {
            startDate,
            limit: 1000
        });
        const summary = {
            totalConnections: 0,
            totalDisconnections: 0,
            totalRefreshes: 0,
            totalFailures: 0,
            platformStats: {
                twitter: {
                    connections: 0,
                    disconnections: 0,
                    refreshes: 0,
                    failures: 0
                },
                linkedin: {
                    connections: 0,
                    disconnections: 0,
                    refreshes: 0,
                    failures: 0
                },
                facebook: {
                    connections: 0,
                    disconnections: 0,
                    refreshes: 0,
                    failures: 0
                },
                instagram: {
                    connections: 0,
                    disconnections: 0,
                    refreshes: 0,
                    failures: 0
                }
            },
            recentActivity: logs.slice(0, 10)
        };
        for (const log of logs){
            if (log.status === 'failed') {
                summary.totalFailures++;
                summary.platformStats[log.platform].failures++;
            }
            if (log.action === 'platform_connected') {
                summary.totalConnections++;
                summary.platformStats[log.platform].connections++;
            } else if (log.action === 'platform_disconnected') {
                summary.totalDisconnections++;
                summary.platformStats[log.platform].disconnections++;
            } else if (log.action === 'token_refreshed') {
                summary.totalRefreshes++;
                summary.platformStats[log.platform].refreshes++;
            }
        }
        return summary;
    } catch (error) {
        console.error('Error getting audit summary:', error);
        return {
            totalConnections: 0,
            totalDisconnections: 0,
            totalRefreshes: 0,
            totalFailures: 0,
            platformStats: {
                twitter: {
                    connections: 0,
                    disconnections: 0,
                    refreshes: 0,
                    failures: 0
                },
                linkedin: {
                    connections: 0,
                    disconnections: 0,
                    refreshes: 0,
                    failures: 0
                },
                facebook: {
                    connections: 0,
                    disconnections: 0,
                    refreshes: 0,
                    failures: 0
                },
                instagram: {
                    connections: 0,
                    disconnections: 0,
                    refreshes: 0,
                    failures: 0
                }
            },
            recentActivity: []
        };
    }
}
async function cleanupOldAuditLogs() {
    try {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('credential_audit_log').delete().lt('created_at', ninetyDaysAgo.toISOString()).select('id');
        if (error) throw error;
        return data?.length || 0;
    } catch (error) {
        console.error('Error cleaning up audit logs:', error);
        return 0;
    }
}
}),
"[project]/src/app/api/auth/oauth/[platform]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * OAuth Initiation Route
 * POST /api/auth/oauth/[platform]
 *
 * Initiates OAuth flow for any supported platform
 * Generates CSRF state and PKCE parameters
 */ __turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$oauthStateService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/database/oauthStateService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/database/auditLogService.ts [app-route] (ecmascript)");
;
;
;
;
const OAUTH_URLS = {
    twitter: 'https://twitter.com/i/oauth2/authorize',
    linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
    facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
    instagram: 'https://www.instagram.com/oauth/authorize'
};
const SCOPES = {
    twitter: [
        'tweet.write',
        'tweet.read',
        'users.read'
    ],
    linkedin: [
        'r_basicprofile',
        'w_member_social',
        'r_emailaddress'
    ],
    facebook: [
        'pages_manage_posts',
        'pages_read_engagement',
        'pages_manage_metadata'
    ],
    instagram: [
        'instagram_graph_user_profile',
        'pages_manage_posts',
        'pages_read_engagement'
    ]
};
async function POST(req, { params }) {
    const { platform: platformParam } = await params;
    const platform = platformParam;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    const userAgent = req.headers.get('user-agent');
    try {
        // ✅ Step 1: Authenticate user
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized',
                code: 'NOT_AUTHENTICATED'
            }, {
                status: 401
            });
        }
        // ✅ Step 2: Get workspace
        const { data: userRow, error: userError } = await supabase.from('users').select('workspace_id').eq('id', user.id).maybeSingle();
        if (userError || !userRow) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Workspace not found',
                code: 'NO_WORKSPACE'
            }, {
                status: 400
            });
        }
        const workspaceId = userRow.workspace_id;
        // ✅ Step 3: Validate platform
        if (!Object.keys(OAUTH_URLS).includes(platform)) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                workspaceId,
                userId: user.id,
                platform,
                action: 'oauth_initiation_invalid_platform',
                status: 'failed',
                errorCode: 'INVALID_PLATFORM',
                ipAddress: ipAddress || undefined
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid platform',
                code: 'INVALID_PLATFORM'
            }, {
                status: 400
            });
        }
        // ✅ Step 4: Get platform configuration
        const clientId = process.env[`${platform.toUpperCase()}_CLIENT_ID`];
        const baseUrl = ("TURBOPACK compile-time value", "https://social-medias-os.vercel.app/")?.replace(/\/$/, '');
        const callbackUrl = `${baseUrl}/api/auth/oauth/${platform}/callback`;
        if (!clientId) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                workspaceId,
                userId: user.id,
                platform,
                action: 'oauth_initiation_config_missing',
                status: 'failed',
                errorCode: 'CONFIG_MISSING',
                ipAddress: ipAddress || undefined
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `${platform} is not configured`,
                code: 'CONFIG_MISSING'
            }, {
                status: 500
            });
        }
        // ✅ Step 5: Create OAuth state (CSRF protection)
        const oauthState = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$oauthStateService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOAuthState"])(workspaceId, platform, ipAddress || undefined, userAgent || undefined, true // Use PKCE for all platforms
        );
        // ✅ Step 6: Build OAuth authorization URL
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: callbackUrl,
            response_type: 'code',
            state: oauthState.state
        });
        // Add platform-specific parameters
        if (platform === 'twitter') {
            params.append('code_challenge', oauthState.codeChallenge);
            params.append('code_challenge_method', 'S256');
            params.append('scope', SCOPES[platform].join(' '));
        } else if (platform === 'linkedin') {
            params.append('scope', SCOPES[platform].join('%20'));
        } else if (platform === 'facebook' || platform === 'instagram') {
            params.append('scope', SCOPES[platform].join(','));
            params.append('display', 'popup');
        }
        const oauthUrl = `${OAUTH_URLS[platform]}?${params.toString()}`;
        // ✅ Step 7: Store PKCE verifier in secure httpOnly cookie
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            redirectUrl: oauthUrl
        });
        if (oauthState.codeVerifier) {
            response.cookies.set(`oauth_${platform}_verifier`, oauthState.codeVerifier, {
                httpOnly: true,
                secure: ("TURBOPACK compile-time value", "development") === 'production',
                sameSite: 'lax',
                maxAge: 10 * 60,
                path: '/'
            });
        }
        // ✅ Step 8: Log success
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
            workspaceId,
            userId: user.id,
            platform,
            action: 'oauth_initiation_successful',
            status: 'success',
            ipAddress: ipAddress || undefined
        });
        return response;
    } catch (error) {
        console.error(`OAuth initiation error for ${platform}:`, error);
        // Attempt to log error
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: userRow } = await supabase.from('users').select('workspace_id').eq('id', user.id).maybeSingle();
                if (userRow) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                        workspaceId: userRow.workspace_id,
                        userId: user.id,
                        platform,
                        action: 'oauth_initiation_error',
                        status: 'failed',
                        errorMessage: error instanceof Error ? error.message : String(error),
                        errorCode: 'INITIATION_ERROR',
                        ipAddress: req.headers.get('x-forwarded-for') || undefined
                    });
                }
            }
        } catch (auditError) {
            console.error('Failed to log OAuth error:', auditError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to initiate OAuth',
            code: 'INITIATION_ERROR'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__507aea96._.js.map