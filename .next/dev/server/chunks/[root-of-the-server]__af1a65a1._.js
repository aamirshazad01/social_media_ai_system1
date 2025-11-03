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
"[project]/src/app/api/workspace/activity/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Route: /api/workspace/activity
 * Methods: GET
 *
 * GET: Get activity/audit log for the workspace with filters
 */ __turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/database/auditLogService.ts [app-route] (ecmascript)");
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
        // Only admins can view activity logs
        if (userData.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Only admins can view activity logs'
            }, {
                status: 403
            });
        }
        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || undefined;
        const action = searchParams.get('action') || undefined;
        const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')) : undefined;
        const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')) : undefined;
        let limit = parseInt(searchParams.get('limit') || '50');
        let offset = parseInt(searchParams.get('offset') || '0');
        // Validate pagination parameters
        if (isNaN(limit) || limit < 1) limit = 50;
        if (isNaN(offset) || offset < 0) offset = 0;
        if (limit > 500) limit = 500; // Cap at 500
        // Validate date range
        if (startDate && isNaN(startDate.getTime())) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid startDate format'
            }, {
                status: 400
            });
        }
        if (endDate && isNaN(endDate.getTime())) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid endDate format'
            }, {
                status: 400
            });
        }
        // Get activity log
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$database$2f$auditLogService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getWorkspaceActivityLog"])(userData.workspace_id, {
            userId,
            action: action,
            startDate,
            endDate,
            limit,
            offset
        });
        // Format activities for response
        const activities = result.data.map((log)=>({
                id: log.id,
                workspace_id: log.workspace_id,
                user_id: log.user_id,
                user_email: log.users?.email || 'Unknown User',
                user_name: log.users?.full_name || null,
                action: log.action,
                entity_type: log.entity_type,
                entity_id: log.entity_id,
                details: log.details,
                created_at: log.created_at
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: activities,
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            hasMore: result.hasMore
        });
    } catch (error) {
        console.error('Error in GET /api/workspace/activity:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__af1a65a1._.js.map