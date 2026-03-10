// API Client - Uses real backend API
// Token key: 'auth_token' (must match auth.ts)

const getApiBaseUrl = () => {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();
const TOKEN_KEY = "auth_token";

// ============ Types ============
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  slug: string;
  status: "draft" | "published";
  featuredImage?: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

interface Contact {
  updatedAt: any;
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

interface Appointment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  content: string;
  features: string[];
  price: string;
  category: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface PageContent {
  _id: string;
  page: string;
  section: string;
  type: "text" | "image" | "list" | "object";
  key: string;
  value: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalContacts: number;
  totalAppointments: number;
  totalPageContents: number;
  pendingContacts: number;
  pendingAppointments: number;
  recentContacts: Array<{
    _id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
  }>;
  recentAppointments: Array<{
    _id: string;
    name: string;
    email: string;
    service: string;
    status: string;
    createdAt: string;
  }>;
}

// ============ API Client Class ============
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${
      7 * 24 * 60 * 60
    }; SameSite=Lax`;
  }

  private clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("user");
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 - clear token and redirect
        if (response.status === 401) {
          this.clearToken();
        }
        throw new Error(data.error || data.message || "API request failed");
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  }

  // ============ Auth Methods ============
  async login(
    email: string,
    password: string,
  ): Promise<ApiResponse<LoginResponse>> {
    // Development mode static login bypass
    if (
      process.env.NODE_ENV === "development" &&
      email === "admin@markcorpotax.com" &&
      password === "admin123"
    ) {
      const mockUser = {
        id: "dev-admin-id",
        name: "Dev Admin",
        email: "admin@markcorpotax.com",
        role: "admin",
      };
      const mockToken = "dev-static-token-12345";
      this.setToken(mockToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(mockUser));
      }
      return {
        success: true,
        message: "Development static login successful",
        data: { token: mockToken, user: mockUser },
      };
    }

    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }

    return response;
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    // First check localStorage
    if (typeof window !== "undefined") {
      const token = this.getToken();
      const storedUser = localStorage.getItem("user");

      if (storedUser && token) {
        try {
          const user = JSON.parse(storedUser);
          return {
            success: true,
            message: "User retrieved",
            data: {
              _id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              createdAt: new Date().toISOString(),
            },
          };
        } catch {
          // Continue to API call
        }
      }
    }

    return this.request<User>("/auth/me");
  }

  logout(): void {
    this.clearToken();
  }

  removeToken(): void {
    this.clearToken();
  }

  // Password methods
  async checkEmailExists(
    email: string,
  ): Promise<ApiResponse<{ exists: boolean }>> {
    return this.request<{ exists: boolean }>("/auth/check-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<ApiResponse<void>> {
    return this.request<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, newPassword }),
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<void>> {
    return this.request<void>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async updateProfile(name: string, email: string): Promise<ApiResponse<User>> {
    return this.request<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    });
  }

  async logoutUser(): Promise<ApiResponse<void>> {
    try {
      const response = await this.request<void>("/auth/logout", {
        method: "POST",
      });
      this.clearToken();
      return response;
    } catch {
      this.clearToken();
      return { success: true, message: "Logged out" };
    }
  }

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>("/auth/refresh", {
      method: "POST",
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }

    return response;
  }

  async verifyToken(): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>("/auth/verify");
  }

  // ============ Blog Methods ============
  async getBlogs(): Promise<ApiResponse<Blog[]>> {
    return this.request<Blog[]>("/blog");
  }

  async getBlog(id: string): Promise<ApiResponse<Blog>> {
    return this.request<Blog>(`/blog/${id}`);
  }

  async createBlog(blog: Partial<Blog>): Promise<ApiResponse<Blog>> {
    return this.request<Blog>("/blog", {
      method: "POST",
      body: JSON.stringify(blog),
    });
  }

  async updateBlog(
    id: string,
    blog: Partial<Blog>,
  ): Promise<ApiResponse<Blog>> {
    return this.request<Blog>(`/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(blog),
    });
  }

  async deleteBlog(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/blog/${id}`, { method: "DELETE" });
  }

  async getAdminBlogs(): Promise<ApiResponse<Blog[]>> {
    return this.request<Blog[]>("/blog");
  }

  // ============ Contact Methods ============
  async submitContact(
    contact: Partial<Contact>,
  ): Promise<ApiResponse<Contact>> {
    return this.request<Contact>("/contact", {
      method: "POST",
      body: JSON.stringify(contact),
    });
  }

  async getContacts(): Promise<ApiResponse<Contact[]>> {
    return this.request<Contact[]>("/contact");
  }

  async updateContactStatus(
    id: string,
    status: Contact["status"],
  ): Promise<ApiResponse<Contact>> {
    return this.request<Contact>(`/contact/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async deleteContact(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/contact/${id}`, {
      method: "DELETE",
    });
  }

  // ============ Appointment Methods ============
  async bookAppointment(
    appointment: Partial<Appointment>,
  ): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointment),
    });
  }

  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    return this.request<Appointment[]>("/appointments");
  }

  async updateAppointmentStatus(
    id: string,
    status: Appointment["status"],
  ): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async deleteAppointment(
    id: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/appointments/${id}`, {
      method: "DELETE",
    });
  }

  async getUserAppointments(): Promise<ApiResponse<Appointment[]>> {
    return this.request<Appointment[]>("/appointments/my");
  }

  async getUserContacts(): Promise<ApiResponse<Contact[]>> {
    return this.request<Contact[]>("/contact/my");
  }

  async submitAppointment(appointmentData: {
    name: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    message?: string;
  }): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  }

  // ============ Notification Methods ============
  async getNotifications(params?: {
    read?: boolean;
    type?: string;
    category?: string;
    limit?: number;
    page?: number;
  }): Promise<
    ApiResponse<{
      notifications: any[];
      pagination: any;
      unreadCount: number;
    }>
  > {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const query = queryParams.toString();
    return this.request<any>(`/notifications${query ? `?${query}` : ""}`);
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/notifications/${id}/read`, { method: "PUT" });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
    return this.request<any>("/notifications/read-all", { method: "PUT" });
  }

  async deleteNotification(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/notifications/${id}`, { method: "DELETE" });
  }

  async clearAllNotifications(): Promise<ApiResponse<any>> {
    return this.request<any>("/notifications", { method: "DELETE" });
  }

  async getUnreadNotificationCount(): Promise<ApiResponse<{ count: number }>> {
    return this.request<{ count: number }>("/notifications/unread-count");
  }

  async createNotification(notification: {
    userId?: string;
    type?: "info" | "success" | "warning" | "error";
    title: string;
    message: string;
    category?: string;
    actionUrl?: string;
    actionLabel?: string;
    metadata?: any;
  }): Promise<ApiResponse<any>> {
    return this.request<any>("/notifications", {
      method: "POST",
      body: JSON.stringify(notification),
    });
  }

  // ============ Service Methods ============
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.request<Service[]>("/services");
  }

  async getService(id: string): Promise<ApiResponse<Service>> {
    return this.request<Service>(`/services/${id}`);
  }

  // ============ Admin Dashboard ============
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.request<DashboardStats>("/admin/dashboard-stats");
  }

  // ============ Content Management ============
  async getPageContent(
    page: string,
    nocache = false,
    division?: string,
  ): Promise<ApiResponse<any>> {
    let query = nocache ? `?nocache=true&t=${Date.now()}` : "";
    if (division) {
      query += query ? `&division=${division}` : `?division=${division}`;
    }
    return this.request<any>(`/content/${page}${query}`);
  }

  async getPageLayout(
    pageName: string,
    division?: string,
  ): Promise<ApiResponse<any>> {
    let query = division ? `?division=${division}` : "";
    return this.request<any>(`/page-layouts/page/${pageName}${query}`);
  }

  async getAdminContent(page?: string): Promise<ApiResponse<any>> {
    const endpoint = page ? `/admin/content/${page}` : "/admin/content";
    return this.request<any>(endpoint);
  }

  async updatePageContent(
    page: string,
    content: any,
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/content/${page}`, {
      method: "PUT",
      body: JSON.stringify(content),
    });
  }

  async updateContent(id: string, content: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/content/${id}`, {
      method: "PUT",
      body: JSON.stringify(content),
    });
  }

  async createPageContent(content: any): Promise<ApiResponse<any>> {
    return this.request<any>("/admin/content", {
      method: "POST",
      body: JSON.stringify(content),
    });
  }

  async deletePageContent(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/content/${id}`, { method: "DELETE" });
  }

  async bulkUpdateContent(
    page: string,
    content: any[],
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/content/bulk/${page}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
  }

  async getAppointmentSettings(): Promise<
    ApiResponse<{
      fees: { [key: string]: number };
      timeSlots: string[];
      businessHours: { start: string; end: string };
    }>
  > {
    return this.request<any>("/admin/appointments/settings");
  }

  async updateAppointmentSettings(settings: {
    fees?: { [key: string]: number };
    timeSlots?: string[];
    businessHours?: { start: string; end: string };
  }): Promise<ApiResponse<any>> {
    return this.request<any>("/admin/appointments/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  // ============ Health & Debug ============
  async getHealth(): Promise<ApiResponse<any>> {
    // Determine Root URL (remove /api suffix)
    let rootURL = this.baseURL;
    if (rootURL.endsWith("/api")) {
      rootURL = rootURL.substring(0, rootURL.length - 4);
    } else if (rootURL.endsWith("/api/")) {
      rootURL = rootURL.substring(0, rootURL.length - 5);
    }

    // Ensure we don't end with a slash for clean appending
    if (rootURL.endsWith("/")) {
      rootURL = rootURL.substring(0, rootURL.length - 1);
    }

    try {
      const response = await fetch(`${rootURL}/health`);
      if (!response.ok) throw new Error("Status " + response.status);
      return await response.json();
    } catch (error: any) {
      return {
        success: false,
        message: "Backend unreachable",
        error: error.message,
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type {
  ApiResponse,
  LoginResponse,
  Blog,
  User,
  Contact,
  Appointment,
  Service,
  PageContent,
  DashboardStats,
};
