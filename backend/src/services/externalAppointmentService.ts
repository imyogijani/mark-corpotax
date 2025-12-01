import { db } from "../config/firebase";
import {
  COLLECTIONS,
  IAppointment,
  IBusiness,
  IService,
} from "./firebaseService";
import {
  getAppointmentDatabase,
  ExternalDatabaseConfig,
} from "./externalDatabase";

// Helper function to convert Firestore timestamp to ISO string
function formatTimestamp(data: any): any {
  if (!data) return data;
  const result = { ...data };

  if (result.createdAt?.toDate) {
    result.createdAt = result.createdAt.toDate().toISOString();
  }
  if (result.updatedAt?.toDate) {
    result.updatedAt = result.updatedAt.toDate().toISOString();
  }

  return result;
}

/**
 * External Appointment Service
 * Uses external database (if configured) for appointment operations
 * Falls back to local database if no external connection
 */
export const ExternalAppointmentService = {
  /**
   * Get all appointments from the connected database
   */
  async findAll(): Promise<IAppointment[]> {
    try {
      const { firestore, config, isExternal } = await getAppointmentDatabase();
      const collectionName =
        config?.appointmentsCollection || COLLECTIONS.APPOINTMENTS;

      const snapshot = await firestore
        .collection(collectionName)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map((doc) =>
        formatTimestamp({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Fallback without ordering
      try {
        const { firestore, config } = await getAppointmentDatabase();
        const collectionName =
          config?.appointmentsCollection || COLLECTIONS.APPOINTMENTS;

        const snapshot = await firestore.collection(collectionName).get();
        return snapshot.docs
          .map((doc) => formatTimestamp({ id: doc.id, ...doc.data() }))
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
      } catch (fallbackError) {
        console.error("Error in fallback:", fallbackError);
        return [];
      }
    }
  },

  /**
   * Get appointments by business ID
   */
  async findByBusinessId(businessId: string): Promise<IAppointment[]> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName =
        config?.appointmentsCollection || COLLECTIONS.APPOINTMENTS;

      const snapshot = await firestore
        .collection(collectionName)
        .where("businessId", "==", businessId)
        .get();

      return snapshot.docs
        .map((doc) => formatTimestamp({ id: doc.id, ...doc.data() }))
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

  /**
   * Get appointment by ID
   */
  async findById(id: string): Promise<IAppointment | null> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName =
        config?.appointmentsCollection || COLLECTIONS.APPOINTMENTS;

      const doc = await firestore.collection(collectionName).doc(id).get();

      if (!doc.exists) return null;
      return formatTimestamp({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return null;
    }
  },

  /**
   * Create new appointment
   */
  async create(data: Partial<IAppointment>): Promise<IAppointment> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName =
        config?.appointmentsCollection || COLLECTIONS.APPOINTMENTS;

      const appointmentData = {
        ...data,
        status: data.status || "pending",
        source: data.source || "website",
        emailSent: false,
        smsSent: false,
        email: data.email?.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await firestore
        .collection(collectionName)
        .add(appointmentData);
      const newDoc = await docRef.get();

      return formatTimestamp({ id: docRef.id, ...newDoc.data() });
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  /**
   * Update appointment
   */
  async update(
    id: string,
    data: Partial<IAppointment>
  ): Promise<IAppointment | null> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName =
        config?.appointmentsCollection || COLLECTIONS.APPOINTMENTS;

      const docRef = firestore.collection(collectionName).doc(id);
      await docRef.update({
        ...data,
        updatedAt: new Date(),
      });

      const updatedDoc = await docRef.get();
      if (!updatedDoc.exists) return null;

      return formatTimestamp({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
      console.error("Error updating appointment:", error);
      return null;
    }
  },

  /**
   * Delete appointment
   */
  async delete(id: string): Promise<boolean> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName =
        config?.appointmentsCollection || COLLECTIONS.APPOINTMENTS;

      await firestore.collection(collectionName).doc(id).delete();
      return true;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return false;
    }
  },

  /**
   * Get appointment stats
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
 * External Business Service
 * Uses external database (if configured) for business operations
 */
export const ExternalBusinessService = {
  /**
   * Get all businesses
   */
  async findAll(): Promise<IBusiness[]> {
    try {
      const { firestore, config, isExternal } = await getAppointmentDatabase();
      const collectionName = config?.businessCollection || COLLECTIONS.BUSINESS;

      const snapshot = await firestore.collection(collectionName).get();
      return snapshot.docs.map((doc) =>
        formatTimestamp({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      console.error("Error fetching businesses:", error);
      return [];
    }
  },

  /**
   * Get business by ID
   */
  async findById(id: string): Promise<IBusiness | null> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName = config?.businessCollection || COLLECTIONS.BUSINESS;

      const doc = await firestore.collection(collectionName).doc(id).get();

      if (!doc.exists) return null;
      return formatTimestamp({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error("Error fetching business:", error);
      return null;
    }
  },

  /**
   * Get active businesses
   */
  async findActive(): Promise<IBusiness[]> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName = config?.businessCollection || COLLECTIONS.BUSINESS;

      const snapshot = await firestore
        .collection(collectionName)
        .where("isActive", "==", true)
        .get();

      return snapshot.docs.map((doc) =>
        formatTimestamp({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      console.error("Error fetching active businesses:", error);
      return [];
    }
  },
};

/**
 * External Service Service
 * Uses external database (if configured) for service operations
 */
export const ExternalServiceService = {
  /**
   * Get all services
   */
  async findAll(): Promise<IService[]> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName = config?.servicesCollection || COLLECTIONS.SERVICES;

      const snapshot = await firestore.collection(collectionName).get();
      return snapshot.docs.map((doc) =>
        formatTimestamp({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  },

  /**
   * Get services by business ID
   */
  async findByBusinessId(businessId: string): Promise<IService[]> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName = config?.servicesCollection || COLLECTIONS.SERVICES;

      const snapshot = await firestore
        .collection(collectionName)
        .where("businessId", "==", businessId)
        .get();

      return snapshot.docs.map((doc) =>
        formatTimestamp({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      console.error("Error fetching services by businessId:", error);
      return [];
    }
  },

  /**
   * Get active services by business ID
   */
  async findActiveByBusinessId(businessId: string): Promise<IService[]> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName = config?.servicesCollection || COLLECTIONS.SERVICES;

      const snapshot = await firestore
        .collection(collectionName)
        .where("businessId", "==", businessId)
        .where("isActive", "==", true)
        .get();

      return snapshot.docs.map((doc) =>
        formatTimestamp({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      console.error("Error fetching active services:", error);
      return [];
    }
  },

  /**
   * Get service by ID
   */
  async findById(id: string): Promise<IService | null> {
    try {
      const { firestore, config } = await getAppointmentDatabase();
      const collectionName = config?.servicesCollection || COLLECTIONS.SERVICES;

      const doc = await firestore.collection(collectionName).doc(id).get();

      if (!doc.exists) return null;
      return formatTimestamp({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error("Error fetching service:", error);
      return null;
    }
  },
};

/**
 * Helper to check if external database is connected
 */
export async function isExternalDatabaseConnected(): Promise<boolean> {
  const { isExternal } = await getAppointmentDatabase();
  return isExternal;
}

/**
 * Get connection status info
 */
export async function getConnectionInfo(): Promise<{
  isConnected: boolean;
  projectId?: string;
  appointmentsCount?: number;
  servicesCount?: number;
  businessCount?: number;
}> {
  const { firestore, config, isExternal } = await getAppointmentDatabase();

  if (!isExternal || !config) {
    return { isConnected: false };
  }

  try {
    const [appointments, services, businesses] = await Promise.all([
      firestore.collection(config.appointmentsCollection).get(),
      firestore.collection(config.servicesCollection).get(),
      firestore.collection(config.businessCollection).get(),
    ]);

    return {
      isConnected: true,
      projectId: config.projectId,
      appointmentsCount: appointments.size,
      servicesCount: services.size,
      businessCount: businesses.size,
    };
  } catch (error) {
    console.error("Error getting connection info:", error);
    return { isConnected: false };
  }
}
