'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import AuthPage from './AuthPage'
import { Loader2 } from 'lucide-react'

interface ProtectedAppProps {
  children: React.ReactNode
}

export default function ProtectedApp({ children }: ProtectedAppProps) {
  const { user, loading } = useAuth()

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-charcoal animate-spin mx-auto mb-4" />
          <p className="text-slate">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage />
  }

  // Show protected content if authenticated (wrapped with NotificationProvider for settings routes)
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  )
}
