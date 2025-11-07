'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  workspaceId: string | null
  userRole: 'admin' | 'editor' | 'viewer' | null
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<'admin' | 'editor' | 'viewer' | null>(null)
  const fetchInProgressRef = React.useRef(false)
  const initialLoadComplete = React.useRef(false)

  // Log role changes for debugging
  React.useEffect(() => {
    if (userRole !== null) {
      console.log(`[AuthContext] 🔐 User role updated to: ${userRole}`)
    }
  }, [userRole])

  React.useEffect(() => {
    if (workspaceId !== null) {
      console.log(`[AuthContext] 🏢 Workspace ID updated to: ${workspaceId}`)
    }
  }, [workspaceId])

  // Fetch user profile data (workspace_id and role)
  const fetchUserProfile = async (userId: string, retryCount = 0) => {
    // Prevent concurrent profile fetches to avoid race conditions
    if (fetchInProgressRef.current) {
      console.log('[AuthContext] Profile fetch already in progress, skipping')
      return
    }

    fetchInProgressRef.current = true
    const maxRetries = 3

    try {
      console.log(`[AuthContext] Fetching profile for user ${userId} (attempt ${retryCount + 1})`)

      // Try RPC first to avoid users RLS recursion
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_my_profile')
      if (!rpcError && rpcData) {
        const d: any = Array.isArray(rpcData) ? rpcData[0] : rpcData
        if (d && d.workspace_id && d.role) {
          console.log(`[AuthContext] ✅ Profile loaded via RPC - Role: ${d.role}, Workspace: ${d.workspace_id}`)
          setWorkspaceId(d.workspace_id as string)
          setUserRole(d.role as 'admin' | 'editor' | 'viewer')
          return
        } else {
          console.warn('[AuthContext] RPC returned incomplete data:', d)
        }
      } else if (rpcError) {
        console.warn('[AuthContext] RPC error:', rpcError)
      }

      // Fallback: direct select (requires non-recursive users RLS policy)
      const { data, error } = await supabase
        .from('users')
        .select('workspace_id, role')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('[AuthContext] Direct query error:', error)
        throw error
      }

      if (!data) {
        console.warn('[AuthContext] No user data found for userId:', userId)
        
        // Retry if we haven't exceeded max retries
        if (retryCount < maxRetries) {
          fetchInProgressRef.current = false
          console.log(`[AuthContext] Retrying profile fetch in 1 second...`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          return fetchUserProfile(userId, retryCount + 1)
        }
        
        setWorkspaceId(null)
        setUserRole(null)
        return
      }

      const workspace = (data as any).workspace_id as string
      const role = (data as any).role as 'admin' | 'editor' | 'viewer'

      if (!workspace || !role) {
        console.error('[AuthContext] Incomplete profile data:', { workspace, role })
        
        // Retry if we haven't exceeded max retries
        if (retryCount < maxRetries) {
          fetchInProgressRef.current = false
          console.log(`[AuthContext] Retrying profile fetch in 1 second...`)
          await new Promise(resolve => setTimeout(resolve, 1000))
          return fetchUserProfile(userId, retryCount + 1)
        }
        
        setWorkspaceId(null)
        setUserRole(null)
        return
      }

      console.log(`[AuthContext] ✅ Profile loaded via direct query - Role: ${role}, Workspace: ${workspace}`)
      setWorkspaceId(workspace)
      setUserRole(role)
    } catch (error) {
      const e = error as any
      console.error(
        '[AuthContext] Error fetching user profile:',
        (e && (e.message || e.code || e.status || e.details)) ?? (typeof e === 'string' ? e : JSON.stringify(e))
      )
      
      // Retry if we haven't exceeded max retries
      if (retryCount < maxRetries) {
        fetchInProgressRef.current = false
        console.log(`[AuthContext] Retrying profile fetch after error in 1 second...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return fetchUserProfile(userId, retryCount + 1)
      }
      
      setWorkspaceId(null)
      setUserRole(null)
    } finally {
      fetchInProgressRef.current = false
    }
  }
// Initialize session
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()

        if (mounted) {
          if (error) {
            console.error('[AuthContext] Error getting session:', error)
            setLoading(false)
            return
          }

          setSession(initialSession)
          setUser(initialSession?.user ?? null)

          if (initialSession?.user) {
            await fetchUserProfile(initialSession.user.id)
          }
          // Mark initial load as complete to prevent duplicate fetches
          initialLoadComplete.current = true
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing auth:', error)
      } finally {
        // Set loading to false after initial check
        // onAuthStateChange will handle subsequent updates
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('[AuthContext] Auth state changed:', event, 'User ID:', currentSession?.user?.id)

      if (mounted) {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          // Only fetch profile if initial load is complete
          // This prevents duplicate fetches during the initial session setup
          if (initialLoadComplete.current) {
            console.log('[AuthContext] User session active, fetching profile...')
            await fetchUserProfile(currentSession.user.id)
          } else {
            console.log('[AuthContext] Initial load in progress, skipping duplicate profile fetch')
          }
        } else {
          console.log('[AuthContext] No user session, clearing workspace and role')
          setWorkspaceId(null)
          setUserRole(null)
        }

        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Sign up new user
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      // The trigger function will automatically create workspace and user profile
      return { error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: error as Error }
    }
  }

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: error as Error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setWorkspaceId(null)
      setUserRole(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Refresh session
  const refreshSession = async () => {
    try {
      const { data: { session: refreshedSession } } = await supabase.auth.getSession()
      setSession(refreshedSession)
      setUser(refreshedSession?.user ?? null)

      if (refreshedSession?.user) {
        await fetchUserProfile(refreshedSession.user.id)
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    workspaceId,
    userRole,
    signUp,
    signIn,
    signOut,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

