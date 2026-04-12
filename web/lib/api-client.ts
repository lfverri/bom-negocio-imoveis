// API client with JWT interceptors and refresh token logic

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
};

type ApiUser = {
  id: string;
  name: string;
  email?: string;
  cpf?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
};

type User = {
  id: string;
  full_name: string;
  email?: string;
  cpf?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
};

const DEMO_MODE = true; // Set to false when backend is ready

const DEMO_USER: User = {
  id: "demo-user-1",
  full_name: "João Silva",
  email: "joao.silva@example.com",
  cpf: "12345678901",
  phone: "(11) 98765-4321",
  is_active: true,
  created_at: new Date().toISOString(),
};

const DEMO_TOKENS: TokenResponse = {
  access_token: "demo-access-token",
  refresh_token: "demo-refresh-token",
};

class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || "/api";
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("access_token");
      this.refreshToken = localStorage.getItem("refresh_token");
    }
  }

  setTokens(accessToken: string, refreshToken = "") {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  private normalizeUser(user: ApiUser | User): User {
    if ("full_name" in user) {
      return user;
    }

    return {
      id: user.id,
      full_name: user.name,
      email: user.email ?? undefined,
      cpf: user.cpf ?? undefined,
      phone: user.phone ?? undefined,
      is_active: user.isActive,
      created_at: user.createdAt,
    };
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to refresh token");
        }

        const data: TokenResponse = await response.json();
        const accessToken = data.accessToken ?? data.access_token;
        const refreshToken = data.refreshToken ?? data.refresh_token ?? "";
        if (!accessToken) {
          throw new Error("Failed to refresh token");
        }

        this.setTokens(accessToken, refreshToken);
        return accessToken;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (DEMO_MODE) {
      console.log("[v0] Demo mode - simulating API request:", endpoint);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

      // Return appropriate mock data based on endpoint
      if (endpoint === "/auth/me") {
        return DEMO_USER as T;
      }

      // For other endpoints, return empty success response
      return {} as T;
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 - try to refresh token and retry
    if (response.status === 401 && this.refreshToken) {
      try {
        const newAccessToken = await this.refreshAccessToken();
        headers["Authorization"] = `Bearer ${newAccessToken}`;
        response = await fetch(url, { ...options, headers });
      } catch (error) {
        this.clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw error;
      }
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async login(identifier: string, password: string): Promise<User> {
    if (DEMO_MODE) {
      console.log("[v0] Demo mode - accepting any credentials");
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate login delay

      // Accept any non-empty credentials
      if (!identifier || !password) {
        throw new Error("Please enter credentials");
      }

      this.setTokens(DEMO_TOKENS.access_token, DEMO_TOKENS.refresh_token);
      return DEMO_USER;
    }

    const data = await this.request<TokenResponse & { user: ApiUser | User }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      },
    );
    const accessToken = data.accessToken ?? data.access_token;
    const refreshToken = data.refreshToken ?? data.refresh_token ?? "";

    if (!accessToken) {
      throw new Error("Token de acesso ausente na resposta de login");
    }

    this.setTokens(accessToken, refreshToken);
    return this.normalizeUser(data.user);
  }

  async register(input: {
    name: string;
    email: string;
    password: string;
    cpf?: string;
    phone?: string;
    avatarUrl?: string;
  }): Promise<User> {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!input.name || !input.email || !input.password) {
        throw new Error("Preencha nome, email e senha");
      }

      this.setTokens(DEMO_TOKENS.access_token, DEMO_TOKENS.refresh_token);
      return {
        ...DEMO_USER,
        full_name: input.name,
        email: input.email,
        cpf: input.cpf,
        phone: input.phone,
      };
    }

    const data = await this.request<TokenResponse & { user: ApiUser | User }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );

    const accessToken = data.accessToken ?? data.access_token;
    const refreshToken = data.refreshToken ?? data.refresh_token ?? "";

    if (!accessToken) {
      throw new Error("Token de acesso ausente na resposta de registro");
    }

    this.setTokens(accessToken, refreshToken);
    return this.normalizeUser(data.user);
  }

  async getMe(): Promise<User> {
    const data = await this.request<ApiUser | User>("/auth/me");
    return this.normalizeUser(data);
  }

  async logout() {
    this.clearTokens();
  }
}

export const apiClient = new ApiClient();
