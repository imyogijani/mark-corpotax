import admin from "firebase-admin";
import { getFirestore } from "../config/firebase";

// Collection to store settings
const SETTINGS_COLLECTION = "siteSettings";
const DB_CONFIG_DOC = "databaseConfig";

// Interface for database config
export interface ExternalDatabaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL?: string;
  appointmentsCollection: string;
  servicesCollection: string;
  businessCollection: string;
  isConnected: boolean;
  lastSyncAt?: string;
}

// Cache for external app instance
let cachedExternalApp: admin.app.App | null = null;
let cachedConfig: ExternalDatabaseConfig | null = null;

/**
 * Get the external database configuration from site settings
 */
export async function getExternalDbConfig(): Promise<ExternalDatabaseConfig | null> {
  try {
    const firestore = getFirestore();
    const docRef = firestore.collection(SETTINGS_COLLECTION).doc(DB_CONFIG_DOC);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    const config = doc.data() as ExternalDatabaseConfig;

    if (!config.isConnected) {
      return null;
    }

    return config;
  } catch (error) {
    console.error("Error getting external DB config:", error);
    return null;
  }
}

/**
 * Initialize or get cached external Firebase app
 */
export async function getExternalFirebaseApp(): Promise<admin.app.App | null> {
  try {
    const config = await getExternalDbConfig();

    if (!config) {
      return null;
    }

    // Check if config has changed
    if (cachedConfig && cachedExternalApp) {
      if (cachedConfig.projectId === config.projectId) {
        return cachedExternalApp;
      }
      // Config changed, delete old app
      await cachedExternalApp.delete();
      cachedExternalApp = null;
      cachedConfig = null;
    }

    // Check if app already exists
    const appName = `external-${config.projectId}`;
    const existingApp = admin.apps.find((app) => app?.name === appName);

    if (existingApp) {
      cachedExternalApp = existingApp;
      cachedConfig = config;
      return existingApp;
    }

    // Initialize new app with provided credentials
    const externalApp = admin.initializeApp(
      {
        credential: admin.credential.cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey.replace(/\\n/g, "\n"),
        }),
        databaseURL: config.databaseURL,
      },
      appName
    );

    cachedExternalApp = externalApp;
    cachedConfig = config;

    return externalApp;
  } catch (error) {
    console.error("Error initializing external Firebase:", error);
    return null;
  }
}

/**
 * Get Firestore instance for external database (if connected) or default
 */
export async function getAppointmentDatabase(): Promise<{
  firestore: FirebaseFirestore.Firestore;
  config: ExternalDatabaseConfig | null;
  isExternal: boolean;
}> {
  try {
    const config = await getExternalDbConfig();

    if (config && config.isConnected) {
      const externalApp = await getExternalFirebaseApp();

      if (externalApp) {
        return {
          firestore: externalApp.firestore(),
          config,
          isExternal: true,
        };
      }
    }

    // Fallback to default database
    return {
      firestore: getFirestore(),
      config: null,
      isExternal: false,
    };
  } catch (error) {
    console.error("Error getting appointment database:", error);
    // Fallback to default database on error
    return {
      firestore: getFirestore(),
      config: null,
      isExternal: false,
    };
  }
}

/**
 * Clear the cached external app (useful when config changes)
 */
export async function clearExternalAppCache(): Promise<void> {
  if (cachedExternalApp) {
    try {
      await cachedExternalApp.delete();
    } catch (error) {
      console.error("Error deleting cached external app:", error);
    }
    cachedExternalApp = null;
    cachedConfig = null;
  }
}
