import express, { Request, Response } from "express";
import { getFirestore } from "../config/firebase";
import { protect, authorize } from "../middleware/auth";
import admin from "firebase-admin";
import {
  DatabaseConfigService,
  WEBSITE_COLLECTIONS,
} from "../services/websiteDatabase";
import {
  clearExternalAppCache,
  testExternalConnection,
  getConnectionInfo,
} from "../services/appointmentDatabase";

const router = express.Router();

// Use website collections for settings
const SETTINGS_COLLECTION = WEBSITE_COLLECTIONS.SITE_SETTINGS;
const DB_CONFIG_DOC = "external_db_config";

// Interface for database config
interface DatabaseConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL?: string;
  appointmentsCollection: string;
  servicesCollection: string;
  businessCollection: string;
  isConnected: boolean;
  lastSyncAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Helper to mask sensitive data
const maskPrivateKey = (key: string): string => {
  if (!key) return "";
  return "••••••••••••••••••••";
};

// Helper to initialize external Firebase connection
const initializeExternalFirebase = async (
  config: DatabaseConfig
): Promise<admin.app.App | null> => {
  try {
    // Check if app already exists
    const appName = `external-${config.projectId}`;
    const existingApps = admin.apps;
    const existingApp = existingApps.find((app) => app?.name === appName);

    if (existingApp) {
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

    return externalApp;
  } catch (error) {
    console.error("Error initializing external Firebase:", error);
    return null;
  }
};

// Get database configuration
router.get(
  "/database",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const firestore = getFirestore();
      const docRef = firestore
        .collection(SETTINGS_COLLECTION)
        .doc(DB_CONFIG_DOC);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(200).json({
          success: true,
          data: null,
          message: "No database configuration found",
        });
      }

      const data = doc.data() as DatabaseConfig;

      // Get stats if connected
      let stats = {};
      if (data.isConnected) {
        try {
          const externalApp = await initializeExternalFirebase(data);
          if (externalApp) {
            const externalDb = externalApp.firestore();

            const [appointmentsSnap, servicesSnap, businessSnap] =
              await Promise.all([
                externalDb.collection(data.appointmentsCollection).get(),
                externalDb.collection(data.servicesCollection).get(),
                externalDb.collection(data.businessCollection).get(),
              ]);

            stats = {
              appointmentsCount: appointmentsSnap.size,
              servicesCount: servicesSnap.size,
              businessCount: businessSnap.size,
            };
          }
        } catch (error) {
          console.error("Error getting stats:", error);
        }
      }

      // Mask sensitive data before sending
      return res.status(200).json({
        success: true,
        data: {
          ...data,
          privateKey: maskPrivateKey(data.privateKey),
        },
        stats,
      });
    } catch (error) {
      console.error("Error fetching database config:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch database configuration",
      });
    }
  }
);

// Test database connection
router.post(
  "/database/test",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const {
        projectId,
        clientEmail,
        privateKey,
        databaseURL,
        appointmentsCollection = "appointments",
        servicesCollection = "services",
        businessCollection = "business",
      } = req.body;

      if (!projectId || !clientEmail || !privateKey) {
        return res.status(400).json({
          success: false,
          message: "Missing required credentials",
        });
      }

      // Try to initialize connection
      const config: DatabaseConfig = {
        projectId,
        clientEmail,
        privateKey,
        databaseURL,
        appointmentsCollection,
        servicesCollection,
        businessCollection,
        isConnected: false,
      };

      const externalApp = await initializeExternalFirebase(config);

      if (!externalApp) {
        return res.status(400).json({
          success: false,
          message:
            "Failed to connect to database. Please check your credentials.",
        });
      }

      // Test connection by reading collections
      const externalDb = externalApp.firestore();

      try {
        const [appointmentsSnap, servicesSnap, businessSnap] =
          await Promise.all([
            externalDb.collection(appointmentsCollection).limit(1).get(),
            externalDb.collection(servicesCollection).limit(1).get(),
            externalDb.collection(businessCollection).limit(1).get(),
          ]);

        // Get counts
        const [appointmentsCount, servicesCount, businessCount] =
          await Promise.all([
            externalDb
              .collection(appointmentsCollection)
              .get()
              .then((snap) => snap.size),
            externalDb
              .collection(servicesCollection)
              .get()
              .then((snap) => snap.size),
            externalDb
              .collection(businessCollection)
              .get()
              .then((snap) => snap.size),
          ]);

        return res.status(200).json({
          success: true,
          message: "Connection successful!",
          stats: {
            appointmentsCount,
            servicesCount,
            businessCount,
          },
        });
      } catch (collectionError) {
        console.error("Error accessing collections:", collectionError);
        return res.status(400).json({
          success: false,
          message:
            "Connected to Firebase but could not access collections. Check collection names.",
        });
      }
    } catch (error: any) {
      console.error("Error testing connection:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to test database connection",
      });
    }
  }
);

// Save database configuration
router.post(
  "/database",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const {
        projectId,
        clientEmail,
        privateKey,
        databaseURL,
        appointmentsCollection = "appointments",
        servicesCollection = "services",
        businessCollection = "business",
      } = req.body;

      if (!projectId || !clientEmail || !privateKey) {
        return res.status(400).json({
          success: false,
          message: "Missing required credentials",
        });
      }

      // Test connection first
      const config: DatabaseConfig = {
        projectId,
        clientEmail,
        privateKey,
        databaseURL,
        appointmentsCollection,
        servicesCollection,
        businessCollection,
        isConnected: false,
      };

      const externalApp = await initializeExternalFirebase(config);

      if (!externalApp) {
        return res.status(400).json({
          success: false,
          message:
            "Failed to connect to database. Please check your credentials.",
        });
      }

      // Test connection by reading a collection
      const externalDb = externalApp.firestore();

      try {
        await externalDb.collection(appointmentsCollection).limit(1).get();
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            "Could not access the appointments collection. Check your configuration.",
        });
      }

      // Save configuration
      const firestore = getFirestore();
      const docRef = firestore
        .collection(SETTINGS_COLLECTION)
        .doc(DB_CONFIG_DOC);
      const existingDoc = await docRef.get();

      const configToSave: DatabaseConfig = {
        projectId,
        clientEmail,
        privateKey,
        databaseURL,
        appointmentsCollection,
        servicesCollection,
        businessCollection,
        isConnected: true,
        lastSyncAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!existingDoc.exists) {
        configToSave.createdAt = new Date().toISOString();
      }

      await docRef.set(configToSave, { merge: true });

      // Get stats
      const [appointmentsCount, servicesCount, businessCount] =
        await Promise.all([
          externalDb
            .collection(appointmentsCollection)
            .get()
            .then((snap) => snap.size),
          externalDb
            .collection(servicesCollection)
            .get()
            .then((snap) => snap.size),
          externalDb
            .collection(businessCollection)
            .get()
            .then((snap) => snap.size),
        ]);

      return res.status(200).json({
        success: true,
        message: "Database configuration saved and connected",
        stats: {
          appointmentsCount,
          servicesCount,
          businessCount,
        },
      });
    } catch (error: any) {
      console.error("Error saving database config:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to save database configuration",
      });
    }
  }
);

// Disconnect database
router.delete(
  "/database",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const firestore = getFirestore();
      const docRef = firestore
        .collection(SETTINGS_COLLECTION)
        .doc(DB_CONFIG_DOC);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: "No database configuration found",
        });
      }

      // Update to disconnected state but keep the config
      await docRef.update({
        isConnected: false,
        updatedAt: new Date().toISOString(),
      });

      // Optionally, delete the external app instance
      const data = doc.data() as DatabaseConfig;
      const appName = `external-${data.projectId}`;
      const existingApp = admin.apps.find((app) => app?.name === appName);
      if (existingApp) {
        await existingApp.delete();
      }

      return res.status(200).json({
        success: true,
        message: "Database disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting database:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to disconnect database",
      });
    }
  }
);

// Sync data from external database
router.post(
  "/database/sync",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const firestore = getFirestore();
      const docRef = firestore
        .collection(SETTINGS_COLLECTION)
        .doc(DB_CONFIG_DOC);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: "No database configuration found",
        });
      }

      const config = doc.data() as DatabaseConfig;

      if (!config.isConnected) {
        return res.status(400).json({
          success: false,
          message: "Database is not connected",
        });
      }

      const externalApp = await initializeExternalFirebase(config);

      if (!externalApp) {
        return res.status(400).json({
          success: false,
          message: "Failed to connect to external database",
        });
      }

      const externalDb = externalApp.firestore();

      // Get counts for stats
      const [appointmentsCount, servicesCount, businessCount] =
        await Promise.all([
          externalDb
            .collection(config.appointmentsCollection)
            .get()
            .then((snap) => snap.size),
          externalDb
            .collection(config.servicesCollection)
            .get()
            .then((snap) => snap.size),
          externalDb
            .collection(config.businessCollection)
            .get()
            .then((snap) => snap.size),
        ]);

      // Update last sync time
      await docRef.update({
        lastSyncAt: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        message: "Sync completed successfully",
        appointmentsCount,
        servicesCount,
        businessCount,
      });
    } catch (error: any) {
      console.error("Error syncing database:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to sync database",
      });
    }
  }
);

export default router;
