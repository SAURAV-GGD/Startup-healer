import React, { createContext, useContext, useState, ReactNode, useSyncExternalStore, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { apiClient } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'bda' | 'client'
  company_name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, portal: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const emptySubscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user:v1')
      if (savedUser) {
        try {
          return JSON.parse(savedUser)
        } catch {
          localStorage.removeItem('user:v1')
        }
      }
    }
    return null
  })

  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot)
  const loading = !isMounted
  const router = useRouter()

  const login = useCallback(async (email: string, password: string, portal: string) => {
    const data = await apiClient.login(email, password, portal)
    localStorage.setItem('user:v1', JSON.stringify(data.user))
    setUser(data.user)

    // Redirect based on role
    switch (data.user.role) {
      case 'admin':
        router.push('/admin/dashboard')
        break
      case 'bda':
        router.push('/employee/dashboard')
        break
      case 'client':
        router.push('/client/dashboard')
        break
    }
  }, [router])

  const logout = useCallback(async () => {
    await apiClient.logout()
    localStorage.removeItem('user:v1')
    setUser(null)
    router.push('/auth/login')
  }, [router])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
