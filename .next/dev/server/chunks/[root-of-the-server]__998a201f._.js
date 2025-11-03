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
"[project]/src/lib/auth/encryptionManager.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Server-side Encryption Manager
 * Handles all encryption/decryption operations
 * Keys are NEVER sent to client
 * Uses Node.js crypto module for secure operations
 */ __turbopack_context__.s([
    "decryptCredentials",
    ()=>decryptCredentials,
    "encryptCredentials",
    ()=>encryptCredentials,
    "generateRandomBytes",
    ()=>generateRandomBytes,
    "getOrCreateWorkspaceEncryptionKey",
    ()=>getOrCreateWorkspaceEncryptionKey,
    "hashValue",
    ()=>hashValue
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
async function getOrCreateWorkspaceEncryptionKey(workspaceId) {
    try {
        const masterSecret = process.env.ENCRYPTION_MASTER_KEY;
        if (!masterSecret) {
            throw new Error('ENCRYPTION_MASTER_KEY environment variable not set');
        }
        // Derive a workspace-specific key using PBKDF2
        const key = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].pbkdf2Sync(masterSecret, workspaceId, 100000, 32, 'sha256');
        return key;
    } catch (error) {
        console.error('Failed to get workspace encryption key:', error);
        throw new Error('Encryption key unavailable');
    }
}
async function encryptCredentials(credentials, encryptionKey) {
    try {
        const data = JSON.stringify(credentials);
        // Generate random IV (12 bytes for GCM)
        const iv = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(12);
        // Create cipher
        const cipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createCipheriv('aes-256-gcm', encryptionKey, iv);
        // Encrypt data
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Get authentication tag
        const authTag = cipher.getAuthTag();
        // Combine IV + authTag + encrypted data
        const combined = Buffer.concat([
            iv,
            authTag,
            Buffer.from(encrypted, 'hex')
        ]);
        // Return as base64
        return combined.toString('base64');
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Failed to encrypt credentials');
    }
}
async function decryptCredentials(encryptedData, encryptionKey) {
    try {
        // Decode from base64
        const combined = Buffer.from(encryptedData, 'base64');
        // Extract IV (first 12 bytes), authTag (next 16 bytes), and ciphertext
        const iv = combined.slice(0, 12);
        const authTag = combined.slice(12, 28);
        const ciphertext = combined.slice(28);
        // Create decipher
        const decipher = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createDecipheriv('aes-256-gcm', encryptionKey, iv);
        // Set authentication tag
        decipher.setAuthTag(authTag);
        // Decrypt
        let decrypted = decipher.update(ciphertext.toString('hex'), 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Failed to decrypt credentials');
    }
}
function hashValue(value) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(value).digest('hex');
}
function generateRandomBytes(length = 32) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(length).toString('hex');
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
"[project]/src/services/database/credentialService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Server-side Credential Service
 * Single source of truth for credentials (database-backed only)
 * Proper encryption/decryption with workspace-specific keys
 * Token refresh handling
 */ __turbopack_context__.s([
    "CredentialService",
    ()=>CredentialService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/index.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$encryptionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/encryptionManager.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/database/auditLogService.ts [app-route] (ecmascript)");
;
;
;
class CredentialService {
    /**
   * Save platform credentials to database
   * Encrypts using workspace-specific key
   */ static async savePlatformCredentials(platform, credentials, userId, workspaceId, options = {}) {
        try {
            // Get encryption key for this workspace
            const encryptionKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$encryptionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrCreateWorkspaceEncryptionKey"])(workspaceId);
            // Encrypt credentials
            const encryptedData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$encryptionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encryptCredentials"])(credentials, encryptionKey);
            // Check if already exists
            const { data: existing, error: checkError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('social_accounts').select('id').eq('workspace_id', workspaceId).eq('platform', platform).maybeSingle();
            if (checkError) throw checkError;
            // Prepare common data
            const commonData = {
                credentials_encrypted: encryptedData,
                is_connected: credentials.isConnected ?? true,
                username: credentials.username || null,
                expires_at: credentials.expiresAt || null,
                last_refreshed_at: new Date().toISOString(),
                refresh_token_encrypted: credentials.refreshToken ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$encryptionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encryptCredentials"])({
                    token: credentials.refreshToken
                }, encryptionKey) : null,
                page_id: options.pageId || null,
                page_name: options.pageName || null,
                connected_at: credentials.isConnected ? new Date().toISOString() : null,
                refresh_error_count: 0
            };
            if (existing) {
                // Update existing
                const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('social_accounts').update(commonData).eq('id', existing.id);
                if (updateError) throw updateError;
                // Log audit
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                    workspaceId,
                    userId,
                    platform,
                    action: 'credentials_updated',
                    status: 'success'
                });
            } else {
                // Insert new
                const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('social_accounts').insert({
                    workspace_id: workspaceId,
                    platform,
                    ...commonData
                });
                if (insertError) throw insertError;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                    workspaceId,
                    userId,
                    platform,
                    action: 'platform_connected',
                    status: 'success'
                });
            }
        } catch (error) {
            console.error('Error saving credentials:', error);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                workspaceId,
                userId,
                platform,
                action: 'credentials_save_failed',
                status: 'failed',
                errorMessage: error instanceof Error ? error.message : String(error),
                errorCode: 'SAVE_ERROR'
            }).catch((err)=>console.error('Failed to log error:', err));
            throw error;
        }
    }
    /**
   * Get credentials for a specific platform
   */ static async getPlatformCredentials(platform, userId, workspaceId) {
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('social_accounts').select('*').eq('workspace_id', workspaceId).eq('platform', platform).maybeSingle();
            if (error || !data) return null;
            // Decrypt credentials
            const encryptionKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$encryptionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrCreateWorkspaceEncryptionKey"])(workspaceId);
            const credentials = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$encryptionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decryptCredentials"])(data.credentials_encrypted, encryptionKey);
            // Decrypt refresh token if exists
            let refreshToken = null;
            if (data.refresh_token_encrypted) {
                try {
                    const decryptedRefresh = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$encryptionManager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decryptCredentials"])(data.refresh_token_encrypted, encryptionKey);
                    refreshToken = decryptedRefresh.token;
                } catch (err) {
                    console.error('Failed to decrypt refresh token:', err);
                }
            }
            return {
                ...credentials,
                refreshToken,
                expiresAt: data.expires_at,
                pageId: data.page_id,
                pageName: data.page_name,
                isConnected: data.is_connected
            };
        } catch (error) {
            console.error('Error getting credentials:', error);
            return null;
        }
    }
    /**
   * Verify and refresh token if needed
   */ static async verifyAndRefreshToken(platform, userId, workspaceId, refreshFunction) {
        try {
            const credentials = await this.getPlatformCredentials(platform, userId, workspaceId);
            if (!credentials) {
                throw new Error(`No credentials found for ${platform}`);
            }
            // Check if token is expired
            if (credentials.expiresAt) {
                const expiresAt = new Date(credentials.expiresAt).getTime();
                const now = Date.now();
                if (now > expiresAt) {
                    // Token expired, try to refresh
                    if (refreshFunction && credentials.refreshToken) {
                        try {
                            const newCredentials = await refreshFunction(credentials);
                            // Save refreshed credentials
                            await this.savePlatformCredentials(platform, newCredentials, userId, workspaceId);
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                                workspaceId,
                                userId,
                                platform,
                                action: 'token_refreshed',
                                status: 'success'
                            });
                            return newCredentials;
                        } catch (refreshError) {
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                                workspaceId,
                                userId,
                                platform,
                                action: 'token_refresh_failed',
                                status: 'failed',
                                errorMessage: refreshError instanceof Error ? refreshError.message : String(refreshError),
                                errorCode: 'REFRESH_ERROR'
                            });
                            throw new Error(`Token refresh failed: ${refreshError instanceof Error ? refreshError.message : String(refreshError)}`);
                        }
                    } else {
                        throw new Error('Token expired and no refresh token available');
                    }
                }
            }
            return credentials;
        } catch (error) {
            console.error('Token verification failed:', error);
            throw error;
        }
    }
    /**
   * Disconnect platform
   */ static async disconnectPlatform(platform, userId, workspaceId) {
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('social_accounts').update({
                is_connected: false,
                credentials_encrypted: null,
                refresh_token_encrypted: null,
                connected_at: null
            }).eq('workspace_id', workspaceId).eq('platform', platform);
            if (error) throw error;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                workspaceId,
                userId,
                platform,
                action: 'platform_disconnected',
                status: 'success'
            });
        } catch (error) {
            console.error('Error disconnecting platform:', error);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logAuditEvent"])({
                workspaceId,
                userId,
                platform,
                action: 'disconnect_failed',
                status: 'failed',
                errorMessage: error instanceof Error ? error.message : String(error),
                errorCode: 'DISCONNECT_ERROR'
            }).catch((err)=>console.error('Failed to log error:', err));
            throw error;
        }
    }
    /**
   * Get connection status for all platforms
   */ static async getConnectionStatus(workspaceId) {
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('social_accounts').select('platform, is_connected, username, page_name, expires_at').eq('workspace_id', workspaceId);
            if (error) throw error;
            const status = {
                twitter: {
                    isConnected: false
                },
                linkedin: {
                    isConnected: false
                },
                facebook: {
                    isConnected: false
                },
                instagram: {
                    isConnected: false
                }
            };
            const now = Date.now();
            const oneDayMs = 1000 * 60 * 60 * 24;
            for (const account of data || []){
                const expiresAt = account.expires_at ? new Date(account.expires_at).getTime() : null;
                status[account.platform] = {
                    isConnected: account.is_connected,
                    username: account.username || account.page_name,
                    expiresAt: account.expires_at,
                    isExpiringSoon: expiresAt && expiresAt - now < oneDayMs && expiresAt > now,
                    isExpired: expiresAt && expiresAt <= now
                };
            }
            return status;
        } catch (error) {
            console.error('Error getting connection status:', error);
            return {
                twitter: {
                    isConnected: false
                },
                linkedin: {
                    isConnected: false
                },
                facebook: {
                    isConnected: false
                },
                instagram: {
                    isConnected: false
                }
            };
        }
    }
    /**
   * Delete platform credentials completely
   */ static async deletePlatformCredentials(platform, workspaceId) {
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('social_accounts').delete().eq('workspace_id', workspaceId).eq('platform', platform);
            if (error) throw error;
        } catch (error) {
            console.error('Error deleting credentials:', error);
            throw error;
        }
    }
    /**
   * Get all connection statuses
   */ static async getAllCredentialsStatus(workspaceId) {
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('social_accounts').select('platform, is_connected, username, page_name').eq('workspace_id', workspaceId);
            if (error) throw error;
            return (data || []).map((account)=>({
                    platform: account.platform,
                    isConnected: account.is_connected,
                    username: account.username || account.page_name
                }));
        } catch (error) {
            console.error('Error getting all credentials status:', error);
            return [];
        }
    }
}
}),
"[project]/src/app/api/credentials/status/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Credentials Status Endpoint
 * GET /api/credentials/status
 *
 * Returns connection status for all platforms
 */ __turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$credentialService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/database/credentialService.ts [app-route] (ecmascript)");
;
;
;
async function GET(req) {
    try {
        // ✅ Authenticate user
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // ✅ Get workspace
        const { data: userRow, error: userError } = await supabase.from('users').select('workspace_id').eq('id', user.id).maybeSingle();
        if (userError || !userRow) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Workspace not found'
            }, {
                status: 400
            });
        }
        // ✅ Get connection status
        const status = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$credentialService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CredentialService"].getConnectionStatus(userRow.workspace_id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(status);
    } catch (error) {
        console.error('Status check error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to check status'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__998a201f._.js.map