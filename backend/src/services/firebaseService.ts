import { getFirestore } from "../config/firebase";
import admin from "firebase-admin";
import bcrypt from "bcryptjs";

/**
 * Collection names for all data
 * Using the website_ prefix for most collections as per the new database structure
 */
export const COLLECTIONS = {
  PAGE_CONTENT: "website_content",
  CONTACTS: "website_contacts",
  USERS: "website_users",
  BLOG: "website_blogs",
  APPOINTMENTS: "appointments",
  NOTIFICATIONS: "website_notifications",
  SITE_SETTINGS: "website_settings",
  TEAM: "team",
  SERVICES: "services",
  BUSINESS: "business",
};

// Placeholder for MeetMe DB integration if needed
export const MEET_ME_DB = null;

// ==========================================
// INTERFACES
// ==========================================

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPageContent {
  id?: string;
  page: string;
  section: string;
  key: string;
  value: any;
  type: "text" | "image" | "list" | "object" | "string";
  isActive: boolean;
  division?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IContact {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: "new" | "read" | "replied";
  createdAt?: string;
  updatedAt?: string;
}

export interface IBlog {
  id?: string;
  title: string;
  content: string;
  slug: string;
  author: string;
  category: string;
  status: "draft" | "published";
  viewCount: number;
  featuredImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface INotification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: any;
  createdAt?: string;
}

export interface IAppointment {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  serviceId?: string;
  serviceName?: string;
  businessId?: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "scheduled";
  message?: string;
  source: string;
  createdAt?: string;
  updatedAt?: string;
  adminNotes?: string;
  emailSent?: boolean;
}

export interface IStaffAppointment extends IAppointment {
  staffId: string;
  customerId: string;
  serviceIds: string[];
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  servicePrice: number;
  customerName: string;
  customerPhone: string;
  notes: string;
  isRecurring: boolean;
}

export interface ITeamMember {
  id?: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  division?: "finance" | "taxation" | "both";
  linkedin?: string;
  twitter?: string;
  email?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface IBusiness {
  id?: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface IService {
  id?: string;
  businessId: string;
  name: string;
  description?: string;
  duration?: number;
  price?: number;
  isActive: boolean;
  createdAt?: string;
}

// ==========================================
// SERVICES
// ==========================================

/**
 * User Service
 */
export const UserService = {
  async findById(id: string): Promise<IUser | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.USERS).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IUser;
  },

  async findByEmail(email: string): Promise<IUser | null> {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection(COLLECTIONS.USERS)
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as IUser;
  },

  async findAll(): Promise<IUser[]> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(COLLECTIONS.USERS).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IUser));
  },

  async create(data: Partial<IUser>): Promise<IUser> {
    const firestore = getFirestore();
    let hashedPassword = data.password;
    if (data.password && !data.password.startsWith("$2")) {
      const salt = await bcrypt.genSalt(12);
      hashedPassword = await bcrypt.hash(data.password, salt);
    }

    const userData = {
      ...data,
      password: hashedPassword,
      email: data.email?.toLowerCase(),
      isActive: data.isActive !== false,
      role: data.role || "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await firestore.collection(COLLECTIONS.USERS).add(userData);
    return { id: docRef.id, ...userData } as IUser;
  },

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const firestore = getFirestore();
    const cleanData = { ...data };
    if (cleanData.password && !cleanData.password.startsWith("$2")) {
      const salt = await bcrypt.genSalt(12);
      cleanData.password = await bcrypt.hash(cleanData.password, salt);
    }
    await firestore.collection(COLLECTIONS.USERS).doc(id).update({
      ...cleanData,
      updatedAt: new Date().toISOString()
    });
    return this.findById(id);
  },

  async updateLastLogin(id: string): Promise<void> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.USERS).doc(id).update({
      lastLogin: new Date().toISOString(),
    });
  },
};

/**
 * Page Content Service
 */
export const PageContentService = {
  async findByFilter(filter: {
    page?: string;
    section?: string;
    key?: string;
    isActive?: boolean;
    division?: string;
  }): Promise<IPageContent[]> {
    const firestore = getFirestore();
    let query: admin.firestore.Query = firestore.collection(COLLECTIONS.PAGE_CONTENT);

    if (filter.page) query = query.where("page", "==", filter.page);
    if (filter.section) query = query.where("section", "==", filter.section);
    if (filter.key) query = query.where("key", "==", filter.key);
    if (filter.isActive !== undefined) query = query.where("isActive", "==", filter.isActive);

    const snapshot = await query.get();
    let content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IPageContent));

    if (filter.division) {
      content = content.filter(item => 
        item.division === filter.division || item.division === "global" || !item.division
      );
    }
    return content;
  },

  async findById(id: string): Promise<IPageContent | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.PAGE_CONTENT).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IPageContent;
  },

  async findAll(): Promise<IPageContent[]> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(COLLECTIONS.PAGE_CONTENT).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IPageContent));
  },

  async create(data: Partial<IPageContent>): Promise<IPageContent> {
    const firestore = getFirestore();
    const contentData = {
      ...data,
      isActive: data.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await firestore.collection(COLLECTIONS.PAGE_CONTENT).add(contentData);
    return { id: docRef.id, ...contentData } as IPageContent;
  },

  async update(id: string, data: Partial<IPageContent>): Promise<IPageContent | null> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.PAGE_CONTENT).doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return this.findById(id);
  },

  clearCache() {
    console.log("Memory cache cleared (placeholder)");
  },
};

/**
 * Blog Service
 */
export const BlogService = {
  async findPublished(): Promise<IBlog[]> {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection(COLLECTIONS.BLOG)
      .where("status", "==", "published")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IBlog));
  },
  
  async findBySlug(slug: string): Promise<IBlog | null> {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection(COLLECTIONS.BLOG)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as IBlog;
  },

  async findAll(filters?: { category?: string; status?: string }): Promise<IBlog[]> {
    const firestore = getFirestore();
    let query: admin.firestore.Query = firestore.collection(COLLECTIONS.BLOG);
    if (filters?.category) query = query.where("category", "==", filters.category);
    if (filters?.status) query = query.where("status", "==", filters.status);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IBlog));
  },

  async findById(id: string): Promise<IBlog | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.BLOG).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IBlog;
  },

  async getCategories(): Promise<string[]> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(COLLECTIONS.BLOG).get();
    const categories = new Set<string>();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.category) categories.add(data.category);
    });
    return Array.from(categories);
  },

  async incrementViewCount(id: string): Promise<boolean> {
    const firestore = getFirestore();
    const docRef = firestore.collection(COLLECTIONS.BLOG).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    const currentCount = doc.data()?.viewCount || 0;
    await docRef.update({ viewCount: currentCount + 1 });
    return true;
  },

  async create(data: Partial<IBlog>): Promise<IBlog> {
    const firestore = getFirestore();
    const blogData = {
      ...data,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await firestore.collection(COLLECTIONS.BLOG).add(blogData);
    return { id: docRef.id, ...blogData } as IBlog;
  },

  async update(id: string, data: Partial<IBlog>): Promise<IBlog | null> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.BLOG).doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.BLOG).doc(id).delete();
    return true;
  },
};

/**
 * Contact Service
 */
export const ContactService = {
  async create(data: Partial<IContact>): Promise<IContact> {
    const firestore = getFirestore();
    const contactData = {
      ...data,
      status: data.status || "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await firestore.collection(COLLECTIONS.CONTACTS).add(contactData);
    return { id: docRef.id, ...contactData } as IContact;
  },

  async findAll(): Promise<IContact[]> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(COLLECTIONS.CONTACTS).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IContact));
  },

  async findById(id: string): Promise<IContact | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.CONTACTS).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IContact;
  },

  async update(id: string, data: Partial<IContact>): Promise<IContact | null> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.CONTACTS).doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.CONTACTS).doc(id).delete();
    return true;
  },
};

/**
 * Notification Service
 */
export const NotificationService = {
  async create(data: Partial<INotification>): Promise<INotification> {
    const firestore = getFirestore();
    const notificationData = {
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const docRef = await firestore.collection(COLLECTIONS.NOTIFICATIONS).add(notificationData);
    return { id: docRef.id, ...notificationData } as INotification;
  },

  async findByUserId(userId: string): Promise<INotification[]> {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection(COLLECTIONS.NOTIFICATIONS)
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as INotification));
  },

  async findByUser(userId: string): Promise<INotification[]> {
    return this.findByUserId(userId);
  },

  async markAsRead(id: string): Promise<boolean> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.NOTIFICATIONS).doc(id).update({ read: true });
    return true;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection(COLLECTIONS.NOTIFICATIONS)
      .where("userId", "==", userId)
      .where("read", "==", false)
      .get();
    
    const batch = firestore.batch();
    snapshot.docs.forEach(doc => batch.update(doc.ref, { read: true }));
    await batch.commit();
    return true;
  },

  async findById(id: string): Promise<INotification | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.NOTIFICATIONS).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as INotification;
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.NOTIFICATIONS).doc(id).delete();
    return true;
  },
};

/**
 * Team Service
 */
export const TeamService = {
  async findAll(): Promise<ITeamMember[]> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(COLLECTIONS.TEAM).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ITeamMember));
  },

  async findById(id: string): Promise<ITeamMember | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.TEAM).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as ITeamMember;
  },

  async create(data: any): Promise<ITeamMember> {
    const firestore = getFirestore();
    const docRef = await firestore.collection(COLLECTIONS.TEAM).add({
      ...data,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  },

  async update(id: string, data: any): Promise<ITeamMember | null> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.TEAM).doc(id).update(data);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.TEAM).doc(id).delete();
    return true;
  },
};

/**
 * Site Settings Service
 */
export const SiteSettingsService = {
  async get(key: string): Promise<any> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.SITE_SETTINGS).doc(key).get();
    if (!doc.exists) return null;
    return doc.data()?.value;
  },

  async set(key: string, value: any): Promise<void> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.SITE_SETTINGS).doc(key).set({
      value,
      updatedAt: new Date().toISOString()
    });
  },

  async getAll(): Promise<any> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(COLLECTIONS.SITE_SETTINGS).get();
    const settings: any = {};
    snapshot.docs.forEach(doc => settings[doc.id] = doc.data()?.value);
    return settings;
  },

  async getLinkedBusinessId(): Promise<string | null> {
    return this.get("linkedBusinessId");
  },

  async setLinkedBusinessId(id: string | null): Promise<void> {
    return this.set("linkedBusinessId", id);
  }
};

/**
 * Business Service
 */
export const BusinessService = {
  async findAll(): Promise<IBusiness[]> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(COLLECTIONS.BUSINESS).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IBusiness));
  },

  async findById(id: string): Promise<IBusiness | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.BUSINESS).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IBusiness;
  },

  async create(data: Partial<IBusiness>): Promise<IBusiness> {
    const firestore = getFirestore();
    const businessData = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    const docRef = await firestore.collection(COLLECTIONS.BUSINESS).add(businessData);
    return { id: docRef.id, ...businessData } as IBusiness;
  },

  async update(id: string, data: Partial<IBusiness>): Promise<IBusiness | null> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.BUSINESS).doc(id).update(data);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.BUSINESS).doc(id).delete();
    return true;
  },
};

/**
 * Service (Offerings) Service
 */
export const ServiceService = {
  async findByBusinessId(businessId: string): Promise<IService[]> {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection(COLLECTIONS.SERVICES)
      .where("businessId", "==", businessId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IService));
  },

  async findById(id: string): Promise<IService | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.SERVICES).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IService;
  },

  async create(data: Partial<IService>): Promise<IService> {
    const firestore = getFirestore();
    const serviceData = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    const docRef = await firestore.collection(COLLECTIONS.SERVICES).add(serviceData);
    return { id: docRef.id, ...serviceData } as IService;
  },

  async update(id: string, data: Partial<IService>): Promise<IService | null> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.SERVICES).doc(id).update(data);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.SERVICES).doc(id).delete();
    return true;
  },
};

/**
 * Appointment Service (Bridging logic mostly)
 */
export const AppointmentService = {
  async create(data: any): Promise<IAppointment> {
    const firestore = getFirestore();
    const docRef = await firestore.collection(COLLECTIONS.APPOINTMENTS).add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  },

  async update(id: string, data: any): Promise<IAppointment | null> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.APPOINTMENTS).doc(id).update({
      ...data,
      updatedAt: new Date().toISOString()
    });
    return this.findById(id);
  },

  async findAll(): Promise<IAppointment[]> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(COLLECTIONS.APPOINTMENTS).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IAppointment));
  },

  async findById(id: string): Promise<IAppointment | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(COLLECTIONS.APPOINTMENTS).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IAppointment;
  },

  async findByEmail(email: string): Promise<IAppointment[]> {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection(COLLECTIONS.APPOINTMENTS)
      .where("email", "==", email.toLowerCase())
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IAppointment));
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getFirestore();
    await firestore.collection(COLLECTIONS.APPOINTMENTS).doc(id).delete();
    return true;
  },

  async createInMeetMe(data: any): Promise<void> {
    console.log("Mock syncing to MeetMe DB...", data);
    // Future expansion: actually connect to the Flutter app DB
  }
};