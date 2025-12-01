/**
 * Website Database Service
 *
 * This service manages a SEPARATE Firebase database specifically for website data:
 * - Website content (CMS)
 * - Contact form submissions
 * - User accounts
 * - Blog posts
 * - Notifications
 *
 * This data is NEVER stored in the external mobile app database.
 * It uses the default Firebase project configured in firebase.ts
 */

import { getFirestore } from "../config/firebase";
import bcrypt from "bcryptjs";
import {
  IUser,
  IContact,
  IPageContent,
  IBlog,
  INotification,
} from "./firebaseService";

// Website-specific collection names
export const WEBSITE_COLLECTIONS = {
  // Website CMS collections - stored in website's own database
  USERS: "website_users",
  CONTACTS: "website_contacts",
  PAGE_CONTENT: "website_content",
  BLOGS: "website_blogs",
  NOTIFICATIONS: "website_notifications",
  SITE_SETTINGS: "website_settings",
  DATABASE_CONFIG: "website_db_config", // For storing external DB connection settings
};

/**
 * Get the website's Firestore instance
 * Always returns the default Firebase project's Firestore
 */
export function getWebsiteFirestore() {
  return getFirestore();
}

/**
 * Website Contact Service
 * Handles contact form submissions - stored in website's database only
 */
export const WebsiteContactService = {
  async create(data: Partial<IContact>): Promise<IContact> {
    const firestore = getWebsiteFirestore();
    const contactData = {
      ...data,
      status: data.status || "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await firestore
      .collection(WEBSITE_COLLECTIONS.CONTACTS)
      .add(contactData);
    return { id: docRef.id, ...contactData } as IContact;
  },

  async findAll(): Promise<IContact[]> {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.CONTACTS)
      .get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IContact[];
  },

  async findById(id: string): Promise<IContact | null> {
    const firestore = getWebsiteFirestore();
    const doc = await firestore
      .collection(WEBSITE_COLLECTIONS.CONTACTS)
      .doc(id)
      .get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IContact;
  },

  async update(id: string, data: Partial<IContact>): Promise<IContact | null> {
    const firestore = getWebsiteFirestore();
    await firestore
      .collection(WEBSITE_COLLECTIONS.CONTACTS)
      .doc(id)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getWebsiteFirestore();
    await firestore.collection(WEBSITE_COLLECTIONS.CONTACTS).doc(id).delete();
    return true;
  },
};

/**
 * Website Content Service
 * Handles CMS content - stored in website's database only
 */
export const WebsiteContentService = {
  async create(data: Partial<IPageContent>): Promise<IPageContent> {
    const firestore = getWebsiteFirestore();
    const contentData = {
      ...data,
      isActive: data.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await firestore
      .collection(WEBSITE_COLLECTIONS.PAGE_CONTENT)
      .add(contentData);
    return { id: docRef.id, ...contentData } as IPageContent;
  },

  async findAll(): Promise<IPageContent[]> {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.PAGE_CONTENT)
      .get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IPageContent[];
  },

  async findById(id: string): Promise<IPageContent | null> {
    const firestore = getWebsiteFirestore();
    const doc = await firestore
      .collection(WEBSITE_COLLECTIONS.PAGE_CONTENT)
      .doc(id)
      .get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IPageContent;
  },

  async findByFilter(filter: {
    page?: string;
    section?: string;
    key?: string;
    isActive?: boolean;
  }): Promise<IPageContent[]> {
    const firestore = getWebsiteFirestore();
    let query: FirebaseFirestore.Query = firestore.collection(
      WEBSITE_COLLECTIONS.PAGE_CONTENT
    );

    if (filter.page) {
      query = query.where("page", "==", filter.page);
    }
    if (filter.section) {
      query = query.where("section", "==", filter.section);
    }
    if (filter.key) {
      query = query.where("key", "==", filter.key);
    }
    if (filter.isActive !== undefined) {
      query = query.where("isActive", "==", filter.isActive);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IPageContent[];
  },

  async findByKey(
    page: string,
    section: string,
    key: string
  ): Promise<IPageContent | null> {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.PAGE_CONTENT)
      .where("page", "==", page)
      .where("section", "==", section)
      .where("key", "==", key)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as IPageContent;
  },

  async update(
    id: string,
    data: Partial<IPageContent>
  ): Promise<IPageContent | null> {
    const firestore = getWebsiteFirestore();
    await firestore
      .collection(WEBSITE_COLLECTIONS.PAGE_CONTENT)
      .doc(id)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getWebsiteFirestore();
    await firestore
      .collection(WEBSITE_COLLECTIONS.PAGE_CONTENT)
      .doc(id)
      .delete();
    return true;
  },

  async upsert(data: {
    page: string;
    section: string;
    key: string;
    value: any;
    type: "text" | "image" | "list" | "object";
  }): Promise<IPageContent | null> {
    const existing = await this.findByKey(data.page, data.section, data.key);
    if (existing) {
      return this.update(existing.id!, data as Partial<IPageContent>);
    }
    return this.create(data as Partial<IPageContent>);
  },
};

/**
 * Website User Service
 * Handles website user accounts - stored in website's database only
 */
export const WebsiteUserService = {
  async create(data: Partial<IUser>): Promise<IUser> {
    const firestore = getWebsiteFirestore();

    // Hash password before saving
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

    const docRef = await firestore
      .collection(WEBSITE_COLLECTIONS.USERS)
      .add(userData);
    return { id: docRef.id, ...userData } as IUser;
  },

  async findAll(): Promise<IUser[]> {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.USERS)
      .get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IUser[];
  },

  async findById(id: string): Promise<IUser | null> {
    const firestore = getWebsiteFirestore();
    const doc = await firestore
      .collection(WEBSITE_COLLECTIONS.USERS)
      .doc(id)
      .get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IUser;
  },

  async findByEmail(email: string): Promise<IUser | null> {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.USERS)
      .where("email", "==", email.toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as IUser;
  },

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    const firestore = getWebsiteFirestore();

    // Hash password if being updated
    if (data.password && !data.password.startsWith("$2")) {
      const salt = await bcrypt.genSalt(12);
      data.password = await bcrypt.hash(data.password, salt);
    }

    await firestore
      .collection(WEBSITE_COLLECTIONS.USERS)
      .doc(id)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getWebsiteFirestore();
    await firestore.collection(WEBSITE_COLLECTIONS.USERS).doc(id).delete();
    return true;
  },

  async updateLastLogin(id: string): Promise<void> {
    const firestore = getWebsiteFirestore();
    await firestore.collection(WEBSITE_COLLECTIONS.USERS).doc(id).update({
      lastLogin: new Date().toISOString(),
    });
  },
};

/**
 * Website Blog Service
 * Handles blog posts - stored in website's database only
 */
export const WebsiteBlogService = {
  async create(data: Partial<IBlog>): Promise<IBlog> {
    const firestore = getWebsiteFirestore();
    const slug =
      data.slug ||
      data.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const blogData = {
      ...data,
      slug,
      status: data.status || "draft",
      viewCount: data.viewCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await firestore
      .collection(WEBSITE_COLLECTIONS.BLOGS)
      .add(blogData);
    return { id: docRef.id, ...blogData } as IBlog;
  },

  async findAll(filters?: {
    category?: string;
    status?: string;
  }): Promise<IBlog[]> {
    const firestore = getWebsiteFirestore();
    let query: FirebaseFirestore.Query = firestore.collection(
      WEBSITE_COLLECTIONS.BLOGS
    );

    if (filters?.category) {
      query = query.where("category", "==", filters.category);
    }
    if (filters?.status) {
      query = query.where("status", "==", filters.status);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IBlog[];
  },

  async findById(id: string): Promise<IBlog | null> {
    const firestore = getWebsiteFirestore();
    const doc = await firestore
      .collection(WEBSITE_COLLECTIONS.BLOGS)
      .doc(id)
      .get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IBlog;
  },

  async findBySlug(slug: string): Promise<IBlog | null> {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.BLOGS)
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as IBlog;
  },

  async findPublished(): Promise<IBlog[]> {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.BLOGS)
      .where("status", "==", "published")
      .get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IBlog[];
  },

  async getCategories(): Promise<string[]> {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.BLOGS)
      .get();
    const categories = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.category) {
        categories.add(data.category);
      }
    });
    return Array.from(categories);
  },

  async incrementViewCount(id: string): Promise<boolean> {
    const firestore = getWebsiteFirestore();
    const docRef = firestore.collection(WEBSITE_COLLECTIONS.BLOGS).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    const currentCount = doc.data()?.viewCount || 0;
    await docRef.update({ viewCount: currentCount + 1 });
    return true;
  },

  async update(id: string, data: Partial<IBlog>): Promise<IBlog | null> {
    const firestore = getWebsiteFirestore();
    await firestore
      .collection(WEBSITE_COLLECTIONS.BLOGS)
      .doc(id)
      .update({
        ...data,
        updatedAt: new Date().toISOString(),
      });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getWebsiteFirestore();
    await firestore.collection(WEBSITE_COLLECTIONS.BLOGS).doc(id).delete();
    return true;
  },
};

/**
 * Website Notification Service
 * Handles user notifications - stored in website's database only
 */
export const WebsiteNotificationService = {
  async create(data: Partial<INotification>): Promise<INotification> {
    const firestore = getWebsiteFirestore();
    const notificationData = {
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const docRef = await firestore
      .collection(WEBSITE_COLLECTIONS.NOTIFICATIONS)
      .add(notificationData);
    return { id: docRef.id, ...notificationData } as INotification;
  },

  async findByUserId(userId: string): Promise<INotification[]> {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.NOTIFICATIONS)
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as INotification[];
  },

  async markAsRead(id: string): Promise<boolean> {
    const firestore = getWebsiteFirestore();
    await firestore
      .collection(WEBSITE_COLLECTIONS.NOTIFICATIONS)
      .doc(id)
      .update({
        read: true,
      });
    return true;
  },

  async delete(id: string): Promise<boolean> {
    const firestore = getWebsiteFirestore();
    await firestore
      .collection(WEBSITE_COLLECTIONS.NOTIFICATIONS)
      .doc(id)
      .delete();
    return true;
  },
};

/**
 * Website Settings Service
 * Handles site settings - stored in website's database only
 */
export const WebsiteSettingsService = {
  async get(key: string) {
    const firestore = getWebsiteFirestore();
    const doc = await firestore
      .collection(WEBSITE_COLLECTIONS.SITE_SETTINGS)
      .doc(key)
      .get();
    if (!doc.exists) return null;
    return doc.data()?.value;
  },

  async set(key: string, value: any) {
    const firestore = getWebsiteFirestore();
    await firestore.collection(WEBSITE_COLLECTIONS.SITE_SETTINGS).doc(key).set({
      value,
      updatedAt: new Date().toISOString(),
    });
    return true;
  },

  async getAll() {
    const firestore = getWebsiteFirestore();
    const snapshot = await firestore
      .collection(WEBSITE_COLLECTIONS.SITE_SETTINGS)
      .get();
    const settings: Record<string, any> = {};
    snapshot.docs.forEach((doc) => {
      settings[doc.id] = doc.data()?.value;
    });
    return settings;
  },
};

/**
 * Database Config Service
 * Stores external database configuration - in website's database
 */
export const DatabaseConfigService = {
  async getConfig() {
    const firestore = getWebsiteFirestore();
    const doc = await firestore
      .collection(WEBSITE_COLLECTIONS.DATABASE_CONFIG)
      .doc("external_db")
      .get();
    if (!doc.exists) return null;
    return doc.data();
  },

  async saveConfig(config: any) {
    const firestore = getWebsiteFirestore();
    await firestore
      .collection(WEBSITE_COLLECTIONS.DATABASE_CONFIG)
      .doc("external_db")
      .set({
        ...config,
        updatedAt: new Date().toISOString(),
      });
    return true;
  },

  async deleteConfig() {
    const firestore = getWebsiteFirestore();
    await firestore
      .collection(WEBSITE_COLLECTIONS.DATABASE_CONFIG)
      .doc("external_db")
      .delete();
    return true;
  },
};

console.log(
  "📦 Website Database Service initialized - using separate collections for website data"
);
