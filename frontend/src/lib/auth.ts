// Unified Authentication Library
// Uses consistent 'auth_token' key across the entire application

const getApiUrl = () => {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();
const TOKEN_KEY = "auth_token";
const USER_KEY = "user";

// ============ Types ============
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: AuthUser;
  };
}

// ============ Token Management ============
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  // Also set cookie for SSR/middleware
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${
    7 * 24 * 60 * 60
  }; SameSite=Lax`;
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// ============ User Management ============
export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const setUser = (user: AuthUser): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// ============ Auth State Helpers ============
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === "admin";
};

// ============ Auth API Calls ============
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Development mode static login bypass
  if (
    process.env.NODE_ENV === "development" &&
    email === "admin@markcorpotax.com" &&
    password === "admin123"
  ) {
    const mockUser: AuthUser = {
      id: "dev-admin-id",
      name: "Dev Admin",
      email: "admin@markcorpotax.com",
      role: "admin",
    };
    const mockToken = "dev-static-token-12345";
    setToken(mockToken);
    setUser(mockUser);
    return {
      success: true,
      message: "Development static login successful",
      data: { token: mockToken, user: mockUser },
    };
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.data?.token) {
      setToken(data.data.token);
      setUser(data.data.user);
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Login failed. Please try again.",
    };
  }
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.success && data.data?.token) {
      setToken(data.data.token);
      setUser(data.data.user);
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Registration failed. Please try again.",
    };
  }
};

export const logout = (): void => {
  removeToken();
};

export const verifyToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data.success) {
      removeToken();
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

// ============ Authenticated Fetch Helper ============
export const authFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message: string; data?: T }> => {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Handle 401 - redirect to login
    if (response.status === 401) {
      removeToken();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
      return {
        success: false,
        message: "Session expired. Please login again.",
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Request failed",
    };
  }
};

// Export token key for consistency
export const AUTH_TOKEN_KEY = TOKEN_KEY;
