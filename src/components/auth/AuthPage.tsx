'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Sparkles } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        // Sign in
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        }
      } else {
        // Sign up
        if (!fullName.trim()) {
          setError('Please enter your full name')
          setLoading(false)
          return
        }

        const { error } = await signUp(email, password, fullName)
        if (error) {
          setError(error.message)
        } else {
          // Success message - check if email confirmation is required
          setError(null)
          setIsLogin(true)
          // Reset form
          setEmail('')
          setPassword('')
          setFullName('')
          alert('Account created successfully! Please sign in.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-charcoal p-3 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-charcoal-dark">AI Content OS</h1>
          <p className="text-slate mt-2">
            AI-powered social media management platform
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-charcoal-dark">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate text-sm mt-1">
              {isLogin
                ? 'Sign in to continue to your workspace'
                : 'Get started with your free account'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-charcoal-dark mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-dark mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-dark mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-transparent"
                required
                minLength={6}
                disabled={loading}
              />
              {!isLogin && (
                <p className="text-xs text-slate mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-white py-3 px-4 rounded-lg font-medium hover:bg-charcoal-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>{isLogin ? 'Sign in' : 'Create account'}</>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
              }}
              disabled={loading}
              className="text-sm text-charcoal hover:text-charcoal-dark font-medium disabled:opacity-50"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
