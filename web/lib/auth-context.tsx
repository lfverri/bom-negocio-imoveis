"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient } from "./api-client"

type User = {
  id: string
  full_name: string
  email?: string
  cpf?: string
  phone?: string
  is_active: boolean
  created_at: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const token = apiClient.getAccessToken()
      if (token) {
        try {
          const userData = await apiClient.getMe()
          setUser(userData)
        } catch (error) {
          console.error("[v0] Failed to fetch user:", error)
          apiClient.clearTokens()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (identifier: string, password: string) => {
    const userData = await apiClient.login(identifier, password)
    setUser(userData)
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
