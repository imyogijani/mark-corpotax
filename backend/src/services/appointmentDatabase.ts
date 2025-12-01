/**
 * Appointment Database Service
 *
 * This service manages appointments and related data (businesses, services):
 * - When external DB is configured: Uses the mobile app's Firebase database
 * - When NO external DB is configured: Uses the default Firebase database
 *
 * This allows the website to either:
 * 1. Work standalone with its own appointment system
 * 2. Connect to an existing mobile app's database to share appointments
 */

import admin from "firebase-admin";
import { getFirestore } from "../config/firebase";
import { DatabaseConfigService } from "./websiteDatabase";

// Collection names for appointment data
export const APPOINTMENT_COLLECTIONS = {
  APPOINTMENTS: "appointments",
  BUSINESS: "business",
  SERVICES: "services",
};

// Cached external Firebase app instance
let externalApp: admin.app.App | null = null;
let cachedConfig: any = null;

/**
 * External Database Configuration Interface
 */
export interface ExternalDbConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
  appointmentsCollection: string;
  servicesCollection: string;
  businessCollection: string;
  isConnected: boolean;
  connectedAt?: string;
}

/**
 * Get the external database configuration from website's database
 */
export async function getExternalDbConfig(): Promise<ExternalDbConfig | null> {
  try {
    const config = await DatabaseConfigService.getConfig();
    if (config && config.isConnected) {
      return config as ExternalDbConfig;
    }
    return null;
  } catch (error) {
    console.error("Error getting external DB config:", error);
    return null;
  }
}

/**
 * Initialize or get the external Firebase app
 */
export async function getExternalFirebaseApp(): Promise<admin.app.App | null> {
  const config = await getExternalDbConfig();

  if (!config) {
    // Clear cache if no config
    if (externalApp) {
      try {
        await externalApp.delete();
      } catch (e) {
        // Ignore deletion errors
      }
      externalApp = null;
      cachedConfig = null;
    }
    return null;
  }

  // Check if config changed
  const configKey = `${config.projectId}-${config.clientEmail}`;
  const cachedKey = cachedConfig
    ? `${cachedConfig.projectId}-${cachedConfig.clientEmail}`
    : null;

  if (externalApp && configKey === cachedKey) {
    return externalApp;
  }

  // Delete old app if exists
  if (externalApp) {
    try {
      await externalApp.delete();
    } catch (e) {
      // Ignore deletion errors
    }
    externalApp = null;
  }

  // Initialize new external app
  try {
    const appName = `external-appointment-db-${Date.now()}`;

    externalApp = admin.initializeApp(
      {
        credential: admin.credential.cert({
          projectId: config.projectId,
          privateKey: config.privateKey.replace(/\\n/g, "\n"),
          clientEmail: config.clientEmail,
        }),
        projectId: config.projectId,
      },
      appName
    );

    cachedConfig = config;
    console.log(
      `✅ External appointment database connected: ${config.projectId}`
    );
    return externalApp;
  } catch (error) {
    console.error("Error initializing external Firebase app:", error);
    externalApp = null;
    cachedConfig = null;
    return null;
  }
}

/**
 * Get the appropriate Firestore instance for appointments
 * Returns external DB if configured, otherwise returns default DB
 */
export async function getAppointmentFirestore(): Promise<{
  firestore: admin.firestore.Firestore;
  config: ExternalDbConfig | null;
  isExternal: boolean;
}> {
  const externalConfig = await getExternalDbConfig();

  if (externalConfig) {
    const externalAppInstance = await getExternalFirebaseApp();
    if (externalAppInstance) {
      return {
        firestore: externalAppInstance.firestore(),
        config: externalConfig,
        isExternal: true,
      };
    }
  }

  // Fall back to default database
  return {
    firestore: getFirestore(),
    config: null,
    isExternal: false,
  };
}

/**
 * Clear the external app cache (call when config changes)
 */
export async function clearExternalAppCache(): Promise<void> {
  if (externalApp) {
    try {
      await externalApp.delete();
    } catch (e) {
      // Ignore deletion errors
    }
    externalApp = null;
    cachedConfig = null;
  }
}

/**
 * Test connection to an external database
 */
export async function testExternalConnection(config: {
  projectId: string;
  privateKey: string;
  clientEmail: string;
  appointmentsCollection?: string;
}): Promise<{ success: boolean; message: string; appointmentsCount?: number }> {
  let testApp: admin.app.App | null = null;

  try {
    const appName = `test-connection-${Date.now()}`;

    testApp = admin.initializeApp(
      {
        credential: admin.credential.cert({
          projectId: config.projectId,
          privateKey: config.privateKey.replace(/\\n/g, "\n"),
          clientEmail: config.clientEmail,
        }),
        projectId: config.projectId,
      },
      appName
    );

    const testFirestore = testApp.firestore();
    const collectionName =
      config.appointmentsCollection || APPOINTMENT_COLLECTIONS.APPOINTMENTS;

    // Try to read from the collection
    const snapshot = await testFirestore
      .collection(collectionName)
      .limit(10)
      .get();

    return {
      success: true,
      message: `Successfully connected to ${config.projectId}`,
      appointmentsCount: snapshot.size,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to connect to external database",
    };
  } finally {
    if (testApp) {
      try {
        await testApp.delete();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}

// Helper to format Firestore timestamps
function formatTimestamp(doc: any): any {
  const data = { ...doc };
  if (data.createdAt?.toDate) {
    data.createdAt = data.createdAt.toDate().toISOString();
  }
  if (data.updatedAt?.toDate) {
    data.updatedAt = data.updatedAt.toDate().toISOString();
  }
  return data;
}

/**
 * Appointment Service
 * Uses external database if configured, otherwise uses default database
 */
export const AppointmentDatabaseService = {
  /**
   * Create a new appointment
   */
  async create(data: any): Promise<any> {
    const { firestore, config, isExternal } = await getAppointmentFirestore();
    const collectionName =
      config?.appointmentsCollection || APPOINTMENT_COLLECTIONS.APPOINTMENTS;

    const appointmentData = {
      ...data,
      source: "website",
      status: data.status || "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await firestore
      .collection(collectionName)
      .add(appointmentData);

    console.log(
      `📅 Appointment created in ${
        isExternal ? "external" : "default"
      } database: ${docRef.id}`
    );

    return { id: docRef.id, ...appointmentData };
  },

  /**
   * Get all appointments
   */
  async findAll(): Promise<any[]> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.appointmentsCollection || APPOINTMENT_COLLECTIONS.APPOINTMENTS;

    const snapshot = await firestore.collection(collectionName).get();
    return snapshot.docs.map((doc) =>
      formatTimestamp({ id: doc.id, ...doc.data() })
    );
  },

  /**
   * Get appointment by ID
   */
  async findById(id: string): Promise<any | null> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.appointmentsCollection || APPOINTMENT_COLLECTIONS.APPOINTMENTS;

    const doc = await firestore.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return formatTimestamp({ id: doc.id, ...doc.data() });
  },

  /**
   * Update an appointment
   */
  async update(id: string, data: any): Promise<any | null> {
    const { firestore, config, isExternal } = await getAppointmentFirestore();
    const collectionName =
      config?.appointmentsCollection || APPOINTMENT_COLLECTIONS.APPOINTMENTS;

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await firestore.collection(collectionName).doc(id).update(updateData);

    console.log(
      `📅 Appointment updated in ${
        isExternal ? "external" : "default"
      } database: ${id}`
    );

    return this.findById(id);
  },

  /**
   * Delete an appointment
   */
  async delete(id: string): Promise<boolean> {
    const { firestore, config, isExternal } = await getAppointmentFirestore();
    const collectionName =
      config?.appointmentsCollection || APPOINTMENT_COLLECTIONS.APPOINTMENTS;

    await firestore.collection(collectionName).doc(id).delete();

    console.log(
      `📅 Appointment deleted from ${
        isExternal ? "external" : "default"
      } database: ${id}`
    );

    return true;
  },

  /**
   * Find appointments by filter
   */
  async findByFilter(filter: {
    businessId?: string;
    status?: string;
    date?: string;
    email?: string;
  }): Promise<any[]> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.appointmentsCollection || APPOINTMENT_COLLECTIONS.APPOINTMENTS;

    let query: FirebaseFirestore.Query = firestore.collection(collectionName);

    if (filter.businessId) {
      query = query.where("businessId", "==", filter.businessId);
    }
    if (filter.status) {
      query = query.where("status", "==", filter.status);
    }
    if (filter.date) {
      query = query.where("date", "==", filter.date);
    }
    if (filter.email) {
      query = query.where("email", "==", filter.email);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) =>
      formatTimestamp({ id: doc.id, ...doc.data() })
    );
  },

  /**
   * Get appointments by user email
   */
  async findByEmail(email: string): Promise<any[]> {
    return this.findByFilter({ email });
  },

  /**
   * Get appointments by business ID
   */
  async findByBusinessId(businessId: string): Promise<any[]> {
    return this.findByFilter({ businessId });
  },

  /**
   * Get appointment statistics for a business
   */
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

/**
 * Business Service
 * Uses external database if configured, otherwise uses default database
 */
export const BusinessDatabaseService = {
  /**
   * Get all businesses
   */
  async findAll(): Promise<any[]> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.businessCollection || APPOINTMENT_COLLECTIONS.BUSINESS;

    const snapshot = await firestore.collection(collectionName).get();
    return snapshot.docs.map((doc) =>
      formatTimestamp({ id: doc.id, ...doc.data() })
    );
  },

  /**
   * Get business by ID
   */
  async findById(id: string): Promise<any | null> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.businessCollection || APPOINTMENT_COLLECTIONS.BUSINESS;

    const doc = await firestore.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return formatTimestamp({ id: doc.id, ...doc.data() });
  },

  /**
   * Get active businesses
   */
  async findActive(): Promise<any[]> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.businessCollection || APPOINTMENT_COLLECTIONS.BUSINESS;

    const snapshot = await firestore
      .collection(collectionName)
      .where("isActive", "==", true)
      .get();

    return snapshot.docs.map((doc) =>
      formatTimestamp({ id: doc.id, ...doc.data() })
    );
  },
};

/**
 * Service (offerings) Database Service
 * Uses external database if configured, otherwise uses default database
 */
export const ServiceDatabaseService = {
  /**
   * Get all services
   */
  async findAll(): Promise<any[]> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.servicesCollection || APPOINTMENT_COLLECTIONS.SERVICES;

    const snapshot = await firestore.collection(collectionName).get();
    return snapshot.docs.map((doc) =>
      formatTimestamp({ id: doc.id, ...doc.data() })
    );
  },

  /**
   * Get services by business ID
   */
  async findByBusinessId(businessId: string): Promise<any[]> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.servicesCollection || APPOINTMENT_COLLECTIONS.SERVICES;

    const snapshot = await firestore
      .collection(collectionName)
      .where("businessId", "==", businessId)
      .get();

    return snapshot.docs.map((doc) =>
      formatTimestamp({ id: doc.id, ...doc.data() })
    );
  },

  /**
   * Get active services by business ID
   */
  async findActiveByBusinessId(businessId: string): Promise<any[]> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.servicesCollection || APPOINTMENT_COLLECTIONS.SERVICES;

    const snapshot = await firestore
      .collection(collectionName)
      .where("businessId", "==", businessId)
      .where("isActive", "==", true)
      .get();

    return snapshot.docs.map((doc) =>
      formatTimestamp({ id: doc.id, ...doc.data() })
    );
  },

  /**
   * Get service by ID
   */
  async findById(id: string): Promise<any | null> {
    const { firestore, config } = await getAppointmentFirestore();
    const collectionName =
      config?.servicesCollection || APPOINTMENT_COLLECTIONS.SERVICES;

    const doc = await firestore.collection(collectionName).doc(id).get();
    if (!doc.exists) return null;
    return formatTimestamp({ id: doc.id, ...doc.data() });
  },
};

/**
 * Check if external database is connected
 */
export async function isExternalDatabaseConnected(): Promise<boolean> {
  const config = await getExternalDbConfig();
  return !!config?.isConnected;
}

/**
 * Get connection status info
 */
export async function getConnectionInfo(): Promise<{
  isConnected: boolean;
  projectId?: string;
  usingDatabase: "external" | "default";
  appointmentsCount?: number;
  servicesCount?: number;
  businessCount?: number;
}> {
  const { firestore, config, isExternal } = await getAppointmentFirestore();

  const appointmentsCollection =
    config?.appointmentsCollection || APPOINTMENT_COLLECTIONS.APPOINTMENTS;
  const servicesCollection =
    config?.servicesCollection || APPOINTMENT_COLLECTIONS.SERVICES;
  const businessCollection =
    config?.businessCollection || APPOINTMENT_COLLECTIONS.BUSINESS;

  try {
    const [appointments, services, businesses] = await Promise.all([
      firestore.collection(appointmentsCollection).get(),
      firestore.collection(servicesCollection).get(),
      firestore.collection(businessCollection).get(),
    ]);

    return {
      isConnected: isExternal,
      projectId: config?.projectId,
      usingDatabase: isExternal ? "external" : "default",
      appointmentsCount: appointments.size,
      servicesCount: services.size,
      businessCount: businesses.size,
    };
  } catch (error) {
    return {
      isConnected: false,
      usingDatabase: "default",
    };
  }
}

console.log("📅 Appointment Database Service initialized");
