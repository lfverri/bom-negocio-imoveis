// API client with JWT interceptors and refresh token logic

type TokenResponse = {
  access_token: string
  refresh_token: string
}

type User = {
  id: string
  full_name: string
  email?: string
  cpf?: string
  phone?: string
  is_active: boolean
  created_at: string
}

const DEMO_MODE = true // Set to false when backend is ready

const DEMO_USER: User = {
  id: "demo-user-1",
  full_name: "João Silva",
  email: "joao.silva@example.com",
  cpf: "12345678901",
  phone: "(11) 98765-4321",
  is_active: true,
  created_at: new Date().toISOString(),
}

const DEMO_TOKENS: TokenResponse = {
  access_token: "demo-access-token",
  refresh_token: "demo-refresh-token",
}

class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || "/api"
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private refreshPromise: Promise<string> | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("access_token")
      this.refreshToken = localStorage.getItem("refresh_token")
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken)
      localStorage.setItem("refresh_token", refreshToken)
    }
  }

  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  }

  getAccessToken() {
    return this.accessToken
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available")
    }

    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        })

        if (!response.ok) {
          throw new Error("Failed to refresh token")
        }

        const data: TokenResponse = await response.json()
        this.setTokens(data.access_token, data.refresh_token)
        return data.access_token
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (DEMO_MODE) {
      console.log("[v0] Demo mode - simulating API request:", endpoint)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

      // Return appropriate mock data based on endpoint
      if (endpoint === "/auth/me") {
        return DEMO_USER as T
      }

      // For other endpoints, return empty success response
      return {} as T
    }

    const url = `${this.baseURL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(url, { ...options, headers })

    // Handle 401 - try to refresh token and retry
    if (response.status === 401 && this.refreshToken) {
      try {
        const newAccessToken = await this.refreshAccessToken()
        headers["Authorization"] = `Bearer ${newAccessToken}`
        response = await fetch(url, { ...options, headers })
      } catch (error) {
        this.clearTokens()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
        throw error
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async login(identifier: string, password: string): Promise<User> {
    if (DEMO_MODE) {
      console.log("[v0] Demo mode - accepting any credentials")
      await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate login delay

      // Accept any non-empty credentials
      if (!identifier || !password) {
        throw new Error("Please enter credentials")
      }

      this.setTokens(DEMO_TOKENS.access_token, DEMO_TOKENS.refresh_token)
      return DEMO_USER
    }

    const data = await this.request<TokenResponse & { user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    })
    this.setTokens(data.access_token, data.refresh_token)
    return data.user
  }

  async getMe(): Promise<User> {
    return this.request<User>("/auth/me")
  }

  async logout() {
    this.clearTokens()
  }
}

export const apiClient = new ApiClient()
