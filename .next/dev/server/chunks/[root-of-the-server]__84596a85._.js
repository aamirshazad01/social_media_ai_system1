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
    "getWorkspaceActivityLog",
    ()=>getWorkspaceActivityLog,
    "logAuditEvent",
    ()=>logAuditEvent,
    "logWorkspaceAction",
    ()=>logWorkspaceAction
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
async function logWorkspaceAction({ workspaceId, userId, action, entityType, entityId, details }) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('audit_logs').insert({
            workspace_id: workspaceId,
            user_id: userId,
            action,
            entity_type: entityType,
            entity_id: entityId,
            details,
            created_at: new Date().toISOString()
        });
        if (error) {
            console.error(`Failed to log workspace action "${action}":`, error);
        }
    } catch (error) {
        console.error('Workspace audit logging error:', error);
    // Don't throw - logging failures shouldn't break the app
    }
}
async function getWorkspaceActivityLog(workspaceId, filters) {
    try {
        // Build the query
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('audit_logs').select(`
        id,
        workspace_id,
        user_id,
        action,
        entity_type,
        entity_id,
        details,
        created_at,
        users:user_id (
          email,
          full_name
        )
      `, {
            count: 'exact'
        }).eq('workspace_id', workspaceId).order('created_at', {
            ascending: false
        });
        // Apply filters
        if (filters?.userId) {
            query = query.eq('user_id', filters.userId);
        }
        if (filters?.action) {
            query = query.eq('action', filters.action);
        }
        if (filters?.startDate) {
            query = query.gte('created_at', filters.startDate.toISOString());
        }
        if (filters?.endDate) {
            query = query.lte('created_at', filters.endDate.toISOString());
        }
        // Pagination
        const limit = Math.min(filters?.limit || 50, 500) // Cap at 500
        ;
        const offset = filters?.offset || 0;
        query = query.range(offset, offset + limit - 1);
        const { data, error, count } = await query;
        if (error) {
            console.error('Error fetching workspace activity log:', error);
            throw error;
        }
        return {
            data: data || [],
            total: count || 0,
            limit,
            offset,
            hasMore: (count || 0) > offset + limit
        };
    } catch (error) {
        console.error('Error getting workspace activity log:', error);
        return {
            data: [],
            total: 0,
            limit: filters?.limit || 50,
            offset: filters?.offset || 0,
            hasMore: false
        };
    }
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/services/database/inviteService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Invite Service
 * Manages workspace invitations with security features
 * Includes: token generation, validation, expiry checking, email verification
 */ __turbopack_context__.s([
    "InviteService",
    ()=>InviteService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/database/auditLogService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
class InviteService {
    /**
   * Generate a cryptographically secure random token
   * Used for both shareable links and email invitations
   *
   * @returns URL-safe base64 encoded 32-byte random token
   * @throws Never throws - always generates valid token
   */ static generateToken() {
        // Generate 32 random bytes (256 bits of entropy)
        // base64url encoding is safe for URLs (no +, /, = characters)
        return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(32).toString('base64url');
    }
    /**
   * Calculate expiration date based on days
   * Returns ISO timestamp or null for never-expiring invites
   *
   * @param days - Number of days until expiration (null = never expires)
   * @returns ISO timestamp string or null
   */ static calculateExpiration(days) {
        if (!days || days <= 0) return null;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);
        return expiryDate.toISOString();
    }
    /**
   * Create a new invitation
   * Generates a secure token and stores invitation record
   * Supports both email-specific and shareable link invitations
   *
   * @param workspaceId - Workspace to invite to
   * @param input - Invitation details (email optional, role required, expiry optional)
   * @param invitedBy - User ID creating the invite
   * @returns Created invite object or null if failed
   */ static async createInvite(workspaceId, input, invitedBy) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            // Validate input
            const validRoles = [
                'admin',
                'editor',
                'viewer'
            ];
            if (!validRoles.includes(input.role)) {
                console.warn('Invalid role in createInvite:', input.role);
                return null;
            }
            // Validate email if provided
            if (input.email && !input.email.includes('@')) {
                console.warn('Invalid email format:', input.email);
                return null;
            }
            // Generate unique secure token
            const token = this.generateToken();
            // Calculate expiration time
            const expiresAt = this.calculateExpiration(input.expiresInDays);
            // Create the invitation in database
            const { data, error } = await supabase.from('workspace_invites').insert({
                workspace_id: workspaceId,
                email: input.email || null,
                role: input.role,
                token,
                expires_at: expiresAt,
                invited_by: invitedBy
            }).select().single();
            if (error) {
                console.error('Error creating invite:', error);
                return null;
            }
            // Log the action
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWorkspaceAction"])({
                workspaceId,
                userId: invitedBy,
                action: 'member_invited',
                entityType: 'workspace_invite',
                entityId: data.id,
                details: {
                    invite_email: input.email || 'shareable_link',
                    invite_role: input.role,
                    expires_at: expiresAt
                }
            });
            return data;
        } catch (error) {
            console.error('Unexpected error in createInvite:', error);
            return null;
        }
    }
    /**
   * Get all pending invitations for a workspace
   * Used by admins to view and manage active invites
   *
   * @param workspaceId - Workspace to get invites for
   * @returns Array of pending invites, empty array if none or error
   */ static async getWorkspaceInvites(workspaceId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            const { data, error } = await supabase.from('workspace_invites').select('*').eq('workspace_id', workspaceId).is('used_at', null) // Only pending (unused) invites
            .order('created_at', {
                ascending: false
            });
            if (error) {
                console.error('Error fetching workspace invites:', error);
                return [];
            }
            return data;
        } catch (error) {
            console.error('Unexpected error in getWorkspaceInvites:', error);
            return [];
        }
    }
    /**
   * Validate an invitation token
   * Checks: token exists, not already used, not expired
   * Safe to call from public endpoints
   *
   * @param token - Invitation token to validate
   * @returns Valid invite object or null if invalid/expired/used
   */ static async validateInvite(token) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            // Find the invite by token
            const { data, error } = await supabase.from('workspace_invites').select('*').eq('token', token).is('used_at', null) // Must not be already used
            .single();
            if (error || !data) {
                // Token not found or already used
                return null;
            }
            const invite = data;
            // Check if invite has expired
            if (invite.expires_at) {
                const expiryDate = new Date(invite.expires_at);
                const now = new Date();
                if (now > expiryDate) {
                    // Invite has expired
                    return null;
                }
            }
            // Token is valid
            return invite;
        } catch (error) {
            console.error('Unexpected error in validateInvite:', error);
            return null;
        }
    }
    /**
   * Accept an invitation and add user to workspace
   * Updates user's workspace and role, marks invite as used
   * Called when user clicks invite link and is logged in
   *
   * @param token - Invitation token to accept
   * @param userId - User ID accepting the invite
   * @returns Success boolean
   */ static async acceptInvite(token, userId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            // Step 1: Validate the invite (must be valid and not expired)
            const invite = await this.validateInvite(token);
            if (!invite) {
                console.warn('Invalid or expired invitation token');
                return false;
            }
            // Step 2: Get user's current information
            const { data: userData } = await supabase.from('users').select('email, workspace_id').eq('id', userId).single();
            if (!userData) {
                console.warn('User not found:', userId);
                return false;
            }
            // Step 3: For email invites, verify email matches
            if (invite.email && invite.email !== userData.email) {
                console.warn('Email mismatch for email-specific invite');
                return false // Email doesn't match the invite recipient
                ;
            }
            // Step 4: Update user's workspace assignment and role
            const { error: updateError } = await supabase.from('users').update({
                workspace_id: invite.workspace_id,
                role: invite.role
            }).eq('id', userId);
            if (updateError) {
                console.error('Error updating user workspace:', updateError);
                return false;
            }
            // Step 5: Mark invite as used
            const { error: inviteError } = await supabase.from('workspace_invites').update({
                used_at: new Date().toISOString(),
                used_by: userId
            }).eq('id', invite.id);
            if (inviteError) {
                console.error('Error marking invite as used:', inviteError);
            // This is not fatal - user is already in workspace
            // But we should log it
            }
            // Step 6: Log the action
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWorkspaceAction"])({
                workspaceId: invite.workspace_id,
                userId,
                action: 'member_joined',
                entityType: 'workspace_invite',
                entityId: invite.id,
                details: {
                    invite_id: invite.id,
                    role: invite.role,
                    invited_by: invite.invited_by,
                    previous_workspace_id: userData.workspace_id
                }
            });
            return true;
        } catch (error) {
            console.error('Unexpected error in acceptInvite:', error);
            return false;
        }
    }
    /**
   * Revoke (cancel) an invitation
   * Deletes the invite so it cannot be used
   * Only admins can do this
   *
   * @param inviteId - Invite ID to revoke
   * @param workspaceId - Workspace (for verification)
   * @param revokedBy - Admin performing the action
   * @returns Success boolean
   */ static async revokeInvite(inviteId, workspaceId, revokedBy) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            // Get invite details before deleting (for audit log)
            const { data: invite } = await supabase.from('workspace_invites').select('*').eq('id', inviteId).eq('workspace_id', workspaceId) // Verify workspace match
            .single();
            if (!invite) {
                console.warn('Invite not found for revocation:', inviteId);
                return false;
            }
            // Delete the invite
            const { error } = await supabase.from('workspace_invites').delete().eq('id', inviteId).eq('workspace_id', workspaceId);
            if (error) {
                console.error('Error revoking invite:', error);
                return false;
            }
            // Log the action
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWorkspaceAction"])({
                workspaceId,
                userId: revokedBy,
                action: 'invite_revoked',
                entityType: 'workspace_invite',
                entityId: inviteId,
                details: {
                    invite_email: invite.email || 'shareable_link',
                    invite_role: invite.role,
                    expires_at: invite.expires_at
                }
            });
            return true;
        } catch (error) {
            console.error('Unexpected error in revokeInvite:', error);
            return false;
        }
    }
    /**
   * Resend an invitation email
   * Creates a new invite with same role and workspace
   * Used when user wants to send invite to same email again
   *
   * @param inviteId - Original invite ID to reference
   * @param workspaceId - Workspace
   * @param resendBy - Admin performing the resend
   * @returns New invite object or null if failed
   */ static async resendInvite(inviteId, workspaceId, resendBy) {
        try {
            // Get original invite details
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            const { data: originalInvite } = await supabase.from('workspace_invites').select('*').eq('id', inviteId).eq('workspace_id', workspaceId).single();
            if (!originalInvite || !originalInvite.email) {
                console.warn('Original invite not found or is not email-based:', inviteId);
                return null;
            }
            // Create new invite with same details
            return await this.createInvite(workspaceId, {
                email: originalInvite.email,
                role: originalInvite.role
            }, resendBy);
        } catch (error) {
            console.error('Unexpected error in resendInvite:', error);
            return null;
        }
    }
    /**
   * Check if invite is expired
   * Utility method to check expiration status
   *
   * @param expiresAt - Expiration date ISO string or null
   * @returns True if expired, false if valid or never expires
   */ static isInviteExpired(expiresAt) {
        if (!expiresAt) return false // Never expires
        ;
        return new Date() > new Date(expiresAt);
    }
    /**
   * Get time remaining for invite
   * Utility method to display countdown
   *
   * @param expiresAt - Expiration date ISO string or null
   * @returns Time remaining in milliseconds, 0 if expired, Infinity if never expires
   */ static getTimeRemaining(expiresAt) {
        if (!expiresAt) return Infinity // Never expires
        ;
        const remaining = new Date(expiresAt).getTime() - Date.now();
        return Math.max(remaining, 0);
    }
}
}),
"[project]/src/services/database/workspaceService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Workspace Service
 * Handles all database operations related to workspace management
 * Includes: workspace CRUD, member management, capacity checks
 */ __turbopack_context__.s([
    "WorkspaceService",
    ()=>WorkspaceService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/database/auditLogService.ts [app-route] (ecmascript)");
;
;
class WorkspaceService {
    /**
   * Get workspace by ID
   * Retrieves complete workspace information
   *
   * @param workspaceId - The workspace ID to fetch
   * @returns Workspace object or null if not found
   * @throws Logs error but doesn't throw
   */ static async getWorkspace(workspaceId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            const { data, error } = await supabase.from('workspaces').select('*').eq('id', workspaceId).single();
            if (error) {
                if (error.code !== 'PGRST116') {
                    // PGRST116 is "no rows returned" - expected for not found
                    console.error('Error fetching workspace:', error);
                }
                return null;
            }
            return data;
        } catch (error) {
            console.error('Unexpected error in getWorkspace:', error);
            return null;
        }
    }
    /**
   * Update workspace settings
   * Only admins can do this (enforced by RLS policy)
   *
   * @param workspaceId - Workspace to update
   * @param updates - Fields to update (name, max_users, settings)
   * @param userId - User making the change (for audit log)
   * @returns Updated workspace or null if failed
   * @throws Errors are caught and logged
   */ static async updateWorkspace(workspaceId, updates, userId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            // Build update object with timestamp
            const updateData = {
                ...updates,
                updated_at: new Date().toISOString()
            };
            // Validate max_users if provided
            if (updateData.max_users && updateData.max_users < 1) {
                console.warn('Invalid max_users value:', updateData.max_users);
                delete updateData.max_users; // Don't update invalid value
            }
            // Validate name if provided
            if (updateData.name && updateData.name.trim().length === 0) {
                console.warn('Invalid workspace name (empty string)');
                delete updateData.name;
            }
            if (Object.keys(updateData).length === 1) {
                // Only updated_at, nothing to actually update
                return await this.getWorkspace(workspaceId);
            }
            // Update the workspace
            const { data, error } = await supabase.from('workspaces').update(updateData).eq('id', workspaceId).select().single();
            if (error) {
                console.error('Error updating workspace:', error);
                return null;
            }
            // Log the action
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWorkspaceAction"])({
                workspaceId,
                userId,
                action: 'workspace_updated',
                entityType: 'workspace',
                entityId: workspaceId,
                details: updates
            });
            return data;
        } catch (error) {
            console.error('Unexpected error in updateWorkspace:', error);
            return null;
        }
    }
    /**
   * Get all members in a workspace
   * Includes: id, email, name, avatar, role, and join date
   *
   * @param workspaceId - Workspace to get members for
   * @returns Array of workspace members, empty array if none or error
   */ static async getWorkspaceMembers(workspaceId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            const { data, error } = await supabase.from('users').select('id, email, full_name, avatar_url, role, created_at, workspace_id').eq('workspace_id', workspaceId).order('created_at', {
                ascending: true
            }) // Oldest members first
            ;
            if (error) {
                console.error('Error fetching workspace members:', error);
                return [];
            }
            return data;
        } catch (error) {
            console.error('Unexpected error in getWorkspaceMembers:', error);
            return [];
        }
    }
    /**
   * Remove a member from workspace
   * This permanently deletes the user account in that workspace
   * Note: Cascading deletes will remove their posts, credentials, etc.
   * Only admins can do this (permission checked in API route)
   *
   * @param workspaceId - Current workspace
   * @param userId - User to remove
   * @param removedBy - Admin performing the action (for audit log)
   * @returns Success boolean
   */ static async removeMember(workspaceId, userId, removedBy) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            // Get member info before deleting (for audit log)
            const { data: member } = await supabase.from('users').select('email, full_name, role').eq('id', userId).eq('workspace_id', workspaceId).single();
            if (!member) {
                console.warn('Member not found for removal:', userId);
                return false;
            }
            // Delete the user from this workspace
            // Note: This cascades to delete their posts, credentials, campaigns, etc.
            const { error } = await supabase.from('users').delete().eq('id', userId).eq('workspace_id', workspaceId) // Extra safety check
            ;
            if (error) {
                console.error('Error removing member:', error);
                return false;
            }
            // Log the action
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWorkspaceAction"])({
                workspaceId,
                userId: removedBy,
                action: 'member_removed',
                entityType: 'workspace_member',
                entityId: userId,
                details: {
                    removed_user_id: userId,
                    removed_user_email: member.email,
                    removed_user_role: member.role
                }
            });
            return true;
        } catch (error) {
            console.error('Unexpected error in removeMember:', error);
            return false;
        }
    }
    /**
   * Change a member's role
   * Allows admins to promote/demote members between admin, editor, and viewer roles
   * Only admins can do this (permission checked in API route)
   *
   * @param workspaceId - Current workspace
   * @param userId - User whose role to change
   * @param newRole - New role to assign (admin, editor, viewer)
   * @param changedBy - Admin performing the action (for audit log)
   * @returns Success boolean
   */ static async changeMemberRole(workspaceId, userId, newRole, changedBy) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            // Validate role
            const validRoles = [
                'admin',
                'editor',
                'viewer'
            ];
            if (!validRoles.includes(newRole)) {
                console.warn('Invalid role provided:', newRole);
                return false;
            }
            // Get old role (for audit log)
            const { data: member } = await supabase.from('users').select('role, email').eq('id', userId).eq('workspace_id', workspaceId).single();
            if (!member) {
                console.warn('Member not found for role change:', userId);
                return false;
            }
            // Don't update if role is already the same
            if (member.role === newRole) {
                console.info('Role already set to:', newRole);
                return true // Not an error, just no-op
                ;
            }
            // Update the role
            const { error } = await supabase.from('users').update({
                role: newRole
            }).eq('id', userId).eq('workspace_id', workspaceId) // Extra safety check
            ;
            if (error) {
                console.error('Error changing role:', error);
                return false;
            }
            // Log the action
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWorkspaceAction"])({
                workspaceId,
                userId: changedBy,
                action: 'member_role_changed',
                entityType: 'workspace_member',
                entityId: userId,
                details: {
                    target_user_id: userId,
                    target_user_email: member.email,
                    old_role: member.role,
                    new_role: newRole
                }
            });
            return true;
        } catch (error) {
            console.error('Unexpected error in changeMemberRole:', error);
            return false;
        }
    }
    /**
   * Check if workspace is at capacity
   * Compares current member count to max_users setting
   *
   * @param workspaceId - Workspace to check
   * @returns True if workspace is at or over max capacity
   */ static async isWorkspaceFull(workspaceId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            // Get workspace max_users setting
            const { data: workspace } = await supabase.from('workspaces').select('max_users').eq('id', workspaceId).single();
            if (!workspace) {
                console.warn('Workspace not found for capacity check:', workspaceId);
                return true // Err on side of caution - don't allow join if workspace unknown
                ;
            }
            // Count current members
            const { count, error } = await supabase.from('users').select('*', {
                count: 'exact',
                head: true
            }).eq('workspace_id', workspaceId);
            if (error) {
                console.error('Error counting workspace members:', error);
                return true // Err on side of caution
                ;
            }
            const memberCount = count ?? 0;
            return memberCount >= workspace.max_users;
        } catch (error) {
            console.error('Unexpected error in isWorkspaceFull:', error);
            return true // Err on side of caution
            ;
        }
    }
    /**
   * Get workspace member count
   * Returns the current number of members in the workspace
   *
   * @param workspaceId - Workspace to count members for
   * @returns Number of members, 0 if error or workspace not found
   */ static async getWorkspaceMemberCount(workspaceId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            const { count, error } = await supabase.from('users').select('*', {
                count: 'exact',
                head: true
            }).eq('workspace_id', workspaceId);
            if (error) {
                console.error('Error counting members:', error);
                return 0;
            }
            return count ?? 0;
        } catch (error) {
            console.error('Unexpected error in getWorkspaceMemberCount:', error);
            return 0;
        }
    }
    /**
   * Get workspace member by ID
   * Retrieves a single member's information
   *
   * @param workspaceId - Workspace to search in
   * @param userId - User to find
   * @returns Member object or null if not found
   */ static async getWorkspaceMember(workspaceId, userId) {
        try {
            const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
            const { data, error } = await supabase.from('users').select('id, email, full_name, avatar_url, role, created_at, workspace_id').eq('id', userId).eq('workspace_id', workspaceId).single();
            if (error) {
                if (error.code !== 'PGRST116') {
                    console.error('Error fetching member:', error);
                }
                return null;
            }
            return data;
        } catch (error) {
            console.error('Unexpected error in getWorkspaceMember:', error);
            return null;
        }
    }
}
}),
"[project]/src/app/api/workspace/invites/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Route: /api/workspace/invites
 * Methods: GET, POST, DELETE
 *
 * GET: List all pending invites for workspace (admin only)
 * POST: Create a new invitation (admin only)
 * DELETE: Revoke an invitation (admin only)
 */ __turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$inviteService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/database/inviteService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$workspaceService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/database/workspaceService.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(request) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Get user's workspace and role
        const { data: userData, error: userError } = await supabase.from('users').select('workspace_id, role').eq('id', user.id).single();
        if (userError || !userData || !('workspace_id' in userData)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User profile not found'
            }, {
                status: 404
            });
        }
        // Only admins can view invites
        if (userData.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Only admins can view invitations'
            }, {
                status: 403
            });
        }
        // Get all pending invites
        const invites = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$inviteService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InviteService"].getWorkspaceInvites(userData.workspace_id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: invites
        });
    } catch (error) {
        console.error('Error in GET /api/workspace/invites:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Get user's workspace and role
        const { data: userData, error: userError } = await supabase.from('users').select('workspace_id, role').eq('id', user.id).single();
        if (userError || !userData || !('workspace_id' in userData)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User profile not found'
            }, {
                status: 404
            });
        }
        // Check if user is admin
        if (userData.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Only admins can create invitations'
            }, {
                status: 403
            });
        }
        // Check if workspace is full
        const isFull = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$workspaceService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["WorkspaceService"].isWorkspaceFull(userData.workspace_id);
        if (isFull) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Workspace is at maximum capacity'
            }, {
                status: 400
            });
        }
        // Parse request body
        let input;
        try {
            input = await request.json();
        } catch (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid JSON in request body'
            }, {
                status: 400
            });
        }
        // Validate input
        const validRoles = [
            'admin',
            'editor',
            'viewer'
        ];
        if (!validRoles.includes(input.role)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid role'
            }, {
                status: 400
            });
        }
        if (input.email && !input.email.includes('@')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid email address'
            }, {
                status: 400
            });
        }
        if (input.expiresInDays !== undefined && input.expiresInDays !== null) {
            if (input.expiresInDays < 1 || input.expiresInDays > 365) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Expiration must be between 1 and 365 days'
                }, {
                    status: 400
                });
            }
        }
        // Create the invite
        const invite = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$inviteService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InviteService"].createInvite(userData.workspace_id, input, user.id);
        if (!invite) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to create invitation'
            }, {
                status: 500
            });
        }
        // Build invite URL
        const baseUrl = ("TURBOPACK compile-time value", "https://social-medias-os.vercel.app/") || 'http://localhost:3000';
        const inviteUrl = `${baseUrl}/invite/${invite.token}`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: {
                invite,
                inviteUrl
            }
        });
    } catch (error) {
        console.error('Error in POST /api/workspace/invites:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Get invite ID from query params
        const { searchParams } = new URL(request.url);
        const inviteId = searchParams.get('inviteId');
        if (!inviteId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing inviteId query parameter'
            }, {
                status: 400
            });
        }
        // Get user's workspace and role
        const { data: userData, error: userError } = await supabase.from('users').select('workspace_id, role').eq('id', user.id).single();
        if (userError || !userData || !('workspace_id' in userData)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User profile not found'
            }, {
                status: 404
            });
        }
        // Check if user is admin
        if (userData.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Only admins can revoke invitations'
            }, {
                status: 403
            });
        }
        // Revoke the invite
        const success = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$inviteService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InviteService"].revokeInvite(inviteId, userData.workspace_id, user.id);
        if (!success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to revoke invitation'
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error('Error in DELETE /api/workspace/invites:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__84596a85._.js.map