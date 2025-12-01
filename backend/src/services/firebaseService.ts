import { db } from "../config/firebase";
import bcrypt from "bcryptjs";

// Collection names - these should match your Flutter app's Firestore collections
export const COLLECTIONS = {
  // Website CMS collections
  USERS: "users",
  CONTACTS: "contacts",
  PAGE_CONTENT: "pageContent",
  BLOGS: "blogs",
  NOTIFICATIONS: "notifications",
  SITE_SETTINGS: "siteSettings",

  // Flutter app collections (meet-me)
  BUSINESS: "business", // Businesses created by super admin
  APPOINTMENTS: "appointments", // Appointments (synced with Flutter app)
  SERVICES: "services", // Services offered by businesses
};

// Interfaces
export interface IUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isActive: boolean;
  lastLogin?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface IContact {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: "new" | "read" | "replied";
  createdAt?: any;
  updatedAt?: any;
}

// Appointment interface - should match your Flutter app's data structure
export interface IAppointment {
  _id?: string;
  id?: string;
  // Customer info
  name: string;
  email: string;
  phone: string;
  message?: string;

  // Business & Service info (links to Flutter app)
  businessId: string; // Required - links to business collection
  serviceId?: string; // Service selected
  serviceName?: string; // Service name for display
  staffId?: string; // Staff member assigned (optional)
  staffName?: string; // Staff name for display

  // Appointment details
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  duration?: number; // Duration in minutes

  // Status tracking
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
  adminNotes?: string;

  // Source tracking
  source: "website" | "app" | "walk-in"; // Where appointment was created

  // Notifications
  emailSent?: boolean;
  smsSent?: boolean;

  createdAt?: any;
  updatedAt?: any;
}

// Business interface - matches Flutter app's business collection
export interface IBusiness {
  id?: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  logoUrl?: string;
  coverImage?: string;
  ownerId?: string; // User ID of the business owner
  isActive?: boolean;
  workingHours?: {
    [day: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  createdAt?: any;
  updatedAt?: any;
}

// Service interface - matches Flutter app's services
export interface IService {
  id?: string;
  businessId: string; // Links to business
  name: string;
  description?: string;
  duration: number; // Duration in minutes
  price?: number;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// Site Settings interface - for website configuration
export interface ISiteSettings {
  id?: string;
  key: string;
  value: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface IPageContent {
  _id?: string;
  id?: string;
  page: string;
  section: string;
  type: "text" | "image" | "list" | "object";
  key: string;
  value: any;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface INotification {
  _id?: string;
  id?: string;
  userId: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  category?: "general" | "contact" | "appointment";
  actionUrl?: string;
  actionLabel?: string;
  metadata?: any;
  createdAt?: any;
  updatedAt?: any;
}

export interface IBlog {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author: string;
  category: string;
  status: "draft" | "published";
  publishedAt?: string;
  readTime?: number;
  viewCount: number;
  createdAt?: any;
  updatedAt?: any;
}

// Helper function to convert Firestore timestamp to ISO string
function formatTimestamp(data: any): any {
  if (!data) return data;
  const result = { ...data };

  // Convert Firestore timestamps to ISO strings
  if (result.createdAt?.toDate) {
    result.createdAt = result.createdAt.toDate().toISOString();
  }
  if (result.updatedAt?.toDate) {
    result.updatedAt = result.updatedAt.toDate().toISOString();
  }
  if (result.lastLogin?.toDate) {
    result.lastLogin = result.lastLogin.toDate().toISOString();
  }
  if (result.publishedAt?.toDate) {
    result.publishedAt = result.publishedAt.toDate().toISOString();
  }

  return result;
}

// User Service
export const UserService = {
  async findAll(): Promise<IUser[]> {
    const users = await db.getAll(COLLECTIONS.USERS);
    return users.map(formatTimestamp);
  },

  async findById(id: string): Promise<IUser | null> {
    const user = await db.getById(COLLECTIONS.USERS, id);
    return user ? formatTimestamp(user) : null;
  },

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await db.findOne(
      COLLECTIONS.USERS,
      "email",
      email.toLowerCase()
    );
    return user ? formatTimestamp(user) : null;
  },

  async create(data: Partial<IUser>): Promise<IUser> {
    // Hash password before saving
    if (data.password) {
      const salt = await bcrypt.genSalt(12);
      data.password = await bcrypt.hash(data.password, salt);
    }
    data.isActive = data.isActive ?? true;
    data.role = data.role || "user";
    if (data.email) {
      data.email = data.email.toLowerCase();
    }

    const id = await db.create(COLLECTIONS.USERS, data);
    const user = await db.getById(COLLECTIONS.USERS, id);
    return formatTimestamp(user);
  },

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    await db.update(COLLECTIONS.USERS, id, data);
    const user = await db.getById(COLLECTIONS.USERS, id);
    return user ? formatTimestamp(user) : null;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(COLLECTIONS.USERS, id);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  },

  async updateLastLogin(id: string): Promise<void> {
    await db.update(COLLECTIONS.USERS, id, {
      lastLogin: new Date().toISOString(),
    });
  },
};

// Contact Service
export const ContactService = {
  async findAll(): Promise<IContact[]> {
    try {
      const contacts = await db.queryOrdered(
        COLLECTIONS.CONTACTS,
        "createdAt",
        "desc"
      );
      return contacts.map(formatTimestamp);
    } catch (error) {
      // Fallback if ordering fails (no index)
      const contacts = await db.getAll(COLLECTIONS.CONTACTS);
      return contacts
        .map(formatTimestamp)
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
    }
  },

  async findById(id: string): Promise<IContact | null> {
    const contact = await db.getById(COLLECTIONS.CONTACTS, id);
    return contact ? formatTimestamp(contact) : null;
  },

  async create(data: Partial<IContact>): Promise<IContact> {
    data.status = data.status || "new";
    const id = await db.create(COLLECTIONS.CONTACTS, data);
    const contact = await db.getById(COLLECTIONS.CONTACTS, id);
    return formatTimestamp(contact);
  },

  async update(id: string, data: Partial<IContact>): Promise<IContact | null> {
    await db.update(COLLECTIONS.CONTACTS, id, data);
    const contact = await db.getById(COLLECTIONS.CONTACTS, id);
    return contact ? formatTimestamp(contact) : null;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(COLLECTIONS.CONTACTS, id);
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error);
      return false;
    }
  },
};

// Appointment Service - syncs with Flutter "meet me" app
export const AppointmentService = {
  async findAll(): Promise<IAppointment[]> {
    try {
      const appointments = await db.queryOrdered(
        COLLECTIONS.APPOINTMENTS,
        "createdAt",
        "desc"
      );
      return appointments.map(formatTimestamp);
    } catch (error) {
      // Fallback if ordering fails (no index)
      const appointments = await db.getAll(COLLECTIONS.APPOINTMENTS);
      return appointments
        .map(formatTimestamp)
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
    }
  },

  // Get appointments for a specific business
  async findByBusinessId(businessId: string): Promise<IAppointment[]> {
    try {
      const appointments = await db.query(
        COLLECTIONS.APPOINTMENTS,
        "businessId",
        "==",
        businessId
      );
      return appointments
        .map(formatTimestamp)
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
    } catch (error) {
      console.error("Error fetching appointments by businessId:", error);
      return [];
    }
  },

  async findById(id: string): Promise<IAppointment | null> {
    const appointment = await db.getById(COLLECTIONS.APPOINTMENTS, id);
    return appointment ? formatTimestamp(appointment) : null;
  },

  async findByStatus(
    status: string,
    businessId?: string
  ): Promise<IAppointment[]> {
    let appointments = await db.query(
      COLLECTIONS.APPOINTMENTS,
      "status",
      "==",
      status
    );
    if (businessId) {
      appointments = appointments.filter(
        (a: any) => a.businessId === businessId
      );
    }
    return appointments.map(formatTimestamp);
  },

  async findByDate(date: string, businessId?: string): Promise<IAppointment[]> {
    let appointments = await db.query(
      COLLECTIONS.APPOINTMENTS,
      "date",
      "==",
      date
    );
    if (businessId) {
      appointments = appointments.filter(
        (a: any) => a.businessId === businessId
      );
    }
    return appointments.map(formatTimestamp);
  },

  async findByEmail(email: string): Promise<IAppointment[]> {
    const appointments = await db.query(
      COLLECTIONS.APPOINTMENTS,
      "email",
      "==",
      email.toLowerCase()
    );
    return appointments.map(formatTimestamp);
  },

  async create(data: Partial<IAppointment>): Promise<IAppointment> {
    data.status = data.status || "pending";
    data.source = data.source || "website";
    data.emailSent = false;
    data.smsSent = false;

    if (data.email) {
      data.email = data.email.toLowerCase();
    }

    const id = await db.create(COLLECTIONS.APPOINTMENTS, data);
    const appointment = await db.getById(COLLECTIONS.APPOINTMENTS, id);
    return formatTimestamp(appointment);
  },

  async update(
    id: string,
    data: Partial<IAppointment>
  ): Promise<IAppointment | null> {
    await db.update(COLLECTIONS.APPOINTMENTS, id, data);
    const appointment = await db.getById(COLLECTIONS.APPOINTMENTS, id);
    return appointment ? formatTimestamp(appointment) : null;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(COLLECTIONS.APPOINTMENTS, id);
      return true;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return false;
    }
  },

  // Get appointment stats for a business
  async getStats(businessId: string): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }> {
    const appointments = await this.findByBusinessId(businessId);
    return {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    };
  },
};

// Business Service - reads from Flutter app's business collection
export const BusinessService = {
  async findAll(): Promise<IBusiness[]> {
    try {
      const businesses = await db.getAll(COLLECTIONS.BUSINESS);
      return businesses.map(formatTimestamp);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      return [];
    }
  },

  async findById(id: string): Promise<IBusiness | null> {
    try {
      const business = await db.getById(COLLECTIONS.BUSINESS, id);
      return business ? formatTimestamp(business) : null;
    } catch (error) {
      console.error("Error fetching business:", error);
      return null;
    }
  },

  async findActive(): Promise<IBusiness[]> {
    try {
      const businesses = await db.query(
        COLLECTIONS.BUSINESS,
        "isActive",
        "==",
        true
      );
      return businesses.map(formatTimestamp);
    } catch (error) {
      console.error("Error fetching active businesses:", error);
      return [];
    }
  },

  async create(data: Partial<IBusiness>): Promise<IBusiness> {
    const id = await db.create(COLLECTIONS.BUSINESS, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const business = await db.getById(COLLECTIONS.BUSINESS, id);
    return formatTimestamp(business);
  },

  async update(
    id: string,
    data: Partial<IBusiness>
  ): Promise<IBusiness | null> {
    await db.update(COLLECTIONS.BUSINESS, id, {
      ...data,
      updatedAt: new Date(),
    });
    const updated = await db.getById(COLLECTIONS.BUSINESS, id);
    return updated ? formatTimestamp(updated) : null;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(COLLECTIONS.BUSINESS, id);
      return true;
    } catch {
      return false;
    }
  },
};

// Service Service - reads from Flutter app's services collection
export const ServiceService = {
  async findAll(): Promise<IService[]> {
    try {
      const services = await db.getAll(COLLECTIONS.SERVICES);
      return services.map(formatTimestamp);
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  },

  async findByBusinessId(businessId: string): Promise<IService[]> {
    try {
      const services = await db.query(
        COLLECTIONS.SERVICES,
        "businessId",
        "==",
        businessId
      );
      return services
        .map(formatTimestamp)
        .filter((s: IService) => s.isActive !== false);
    } catch (error) {
      console.error("Error fetching services for business:", error);
      return [];
    }
  },

  async findById(id: string): Promise<IService | null> {
    try {
      const service = await db.getById(COLLECTIONS.SERVICES, id);
      return service ? formatTimestamp(service) : null;
    } catch (error) {
      console.error("Error fetching service:", error);
      return null;
    }
  },

  async create(data: Partial<IService>): Promise<IService> {
    const id = await db.create(COLLECTIONS.SERVICES, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const service = await db.getById(COLLECTIONS.SERVICES, id);
    return formatTimestamp(service);
  },

  async update(id: string, data: Partial<IService>): Promise<IService | null> {
    await db.update(COLLECTIONS.SERVICES, id, {
      ...data,
      updatedAt: new Date(),
    });
    const updated = await db.getById(COLLECTIONS.SERVICES, id);
    return updated ? formatTimestamp(updated) : null;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(COLLECTIONS.SERVICES, id);
      return true;
    } catch {
      return false;
    }
  },
};

// Site Settings Service - for website configuration
export const SiteSettingsService = {
  async get(key: string): Promise<any> {
    try {
      const setting = await db.findOne(COLLECTIONS.SITE_SETTINGS, "key", key);
      return setting ? setting.value : null;
    } catch (error) {
      console.error("Error getting site setting:", error);
      return null;
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      const existing = await db.findOne(COLLECTIONS.SITE_SETTINGS, "key", key);
      if (existing) {
        await db.update(COLLECTIONS.SITE_SETTINGS, existing.id, { value });
      } else {
        await db.create(COLLECTIONS.SITE_SETTINGS, { key, value });
      }
    } catch (error) {
      console.error("Error setting site setting:", error);
      throw error;
    }
  },

  async getAll(): Promise<Record<string, any>> {
    try {
      const settings = await db.getAll(COLLECTIONS.SITE_SETTINGS);
      const result: Record<string, any> = {};
      settings.forEach((s: any) => {
        result[s.key] = s.value;
      });
      return result;
    } catch (error) {
      console.error("Error getting all settings:", error);
      return {};
    }
  },

  // Get the configured business ID for the website
  async getLinkedBusinessId(): Promise<string | null> {
    return this.get("linkedBusinessId");
  },

  // Set the linked business for the website
  async setLinkedBusinessId(businessId: string): Promise<void> {
    return this.set("linkedBusinessId", businessId);
  },
};

// Page Content Service
export const PageContentService = {
  async findAll(): Promise<IPageContent[]> {
    const content = await db.getAll(COLLECTIONS.PAGE_CONTENT);
    return content.map(formatTimestamp);
  },

  async findById(id: string): Promise<IPageContent | null> {
    const content = await db.getById(COLLECTIONS.PAGE_CONTENT, id);
    return content ? formatTimestamp(content) : null;
  },

  async findByFilter(filters: {
    page?: string;
    section?: string;
    key?: string;
    isActive?: boolean;
  }): Promise<IPageContent[]> {
    let content = await db.getAll(COLLECTIONS.PAGE_CONTENT);

    if (filters.page) {
      content = content.filter((c: any) => c.page === filters.page);
    }
    if (filters.section) {
      content = content.filter((c: any) => c.section === filters.section);
    }
    if (filters.key) {
      content = content.filter((c: any) => c.key === filters.key);
    }
    if (filters.isActive !== undefined) {
      content = content.filter((c: any) => c.isActive === filters.isActive);
    }

    return content.map(formatTimestamp);
  },

  async create(data: Partial<IPageContent>): Promise<IPageContent> {
    data.isActive = data.isActive ?? true;
    const id = await db.create(COLLECTIONS.PAGE_CONTENT, data);
    const content = await db.getById(COLLECTIONS.PAGE_CONTENT, id);
    return formatTimestamp(content);
  },

  async update(
    id: string,
    data: Partial<IPageContent>
  ): Promise<IPageContent | null> {
    await db.update(COLLECTIONS.PAGE_CONTENT, id, data);
    const content = await db.getById(COLLECTIONS.PAGE_CONTENT, id);
    return content ? formatTimestamp(content) : null;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(COLLECTIONS.PAGE_CONTENT, id);
      return true;
    } catch (error) {
      console.error("Error deleting page content:", error);
      return false;
    }
  },
};

// Notification Service
export const NotificationService = {
  async findByUser(userId: string): Promise<INotification[]> {
    try {
      const notifications = await db.query(
        COLLECTIONS.NOTIFICATIONS,
        "userId",
        "==",
        userId
      );
      return notifications
        .map(formatTimestamp)
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
    } catch (error) {
      console.error("Error finding notifications:", error);
      return [];
    }
  },

  async findById(id: string): Promise<INotification | null> {
    const notification = await db.getById(COLLECTIONS.NOTIFICATIONS, id);
    return notification ? formatTimestamp(notification) : null;
  },

  async create(data: Partial<INotification>): Promise<INotification> {
    data.read = data.read ?? false;
    const id = await db.create(COLLECTIONS.NOTIFICATIONS, data);
    const notification = await db.getById(COLLECTIONS.NOTIFICATIONS, id);
    return formatTimestamp(notification);
  },

  async markAsRead(id: string): Promise<INotification | null> {
    await db.update(COLLECTIONS.NOTIFICATIONS, id, { read: true });
    const notification = await db.getById(COLLECTIONS.NOTIFICATIONS, id);
    return notification ? formatTimestamp(notification) : null;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.findByUser(userId);
    const updates = notifications
      .filter((n) => !n.read)
      .map((n) => db.update(COLLECTIONS.NOTIFICATIONS, n.id!, { read: true }));
    await Promise.all(updates);
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(COLLECTIONS.NOTIFICATIONS, id);
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  },
};

// Blog Service
export const BlogService = {
  async findAll(filters?: {
    status?: string;
    category?: string;
  }): Promise<IBlog[]> {
    let blogs = await db.getAll(COLLECTIONS.BLOGS);

    if (filters) {
      if (filters.status) {
        blogs = blogs.filter((b: any) => b.status === filters.status);
      }
      if (filters.category) {
        blogs = blogs.filter((b: any) => b.category === filters.category);
      }
    }

    return blogs
      .map(formatTimestamp)
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt || 0).getTime() -
          new Date(a.publishedAt || a.createdAt || 0).getTime()
      );
  },

  async findById(id: string): Promise<IBlog | null> {
    const blog = await db.getById(COLLECTIONS.BLOGS, id);
    return blog ? formatTimestamp(blog) : null;
  },

  async findBySlug(slug: string): Promise<IBlog | null> {
    const blog = await db.findOne(COLLECTIONS.BLOGS, "slug", slug);
    return blog ? formatTimestamp(blog) : null;
  },

  async create(data: Partial<IBlog>): Promise<IBlog> {
    data.status = data.status || "draft";
    data.viewCount = data.viewCount || 0;
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }
    const id = await db.create(COLLECTIONS.BLOGS, data);
    const blog = await db.getById(COLLECTIONS.BLOGS, id);
    return formatTimestamp(blog);
  },

  async update(id: string, data: Partial<IBlog>): Promise<IBlog | null> {
    await db.update(COLLECTIONS.BLOGS, id, data);
    const blog = await db.getById(COLLECTIONS.BLOGS, id);
    return blog ? formatTimestamp(blog) : null;
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.delete(COLLECTIONS.BLOGS, id);
      return true;
    } catch (error) {
      console.error("Error deleting blog:", error);
      return false;
    }
  },

  async incrementViewCount(id: string): Promise<void> {
    const blog = await this.findById(id);
    if (blog) {
      await db.update(COLLECTIONS.BLOGS, id, {
        viewCount: (blog.viewCount || 0) + 1,
      });
    }
  },

  async getCategories(): Promise<string[]> {
    const blogs = await this.findAll({ status: "published" });
    const categories = new Set(blogs.map((b) => b.category));
    return Array.from(categories);
  },
};
