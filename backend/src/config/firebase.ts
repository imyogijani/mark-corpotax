import admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

let initialized = false;

// Initialize Firebase Admin SDK
export function initializeFirebase() {
  if (initialized) {
    return;
  }

  try {
    // Try to load service account from file (check multiple locations)
    const possiblePaths = [
      path.join(__dirname, '../serviceAccountKey.json'),      // src/serviceAccountKey.json (dev)
      path.join(__dirname, '../../src/serviceAccountKey.json'), // From dist folder (prod)
      path.join(process.cwd(), 'src/serviceAccountKey.json'),   // From project root
      path.join(process.cwd(), 'serviceAccountKey.json'),       // Project root
    ];
    
    let serviceAccountPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        serviceAccountPath = p;
        break;
      }
    }
    
    if (serviceAccountPath) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      
      console.log('✅ Firebase Admin SDK initialized with service account');
      console.log(`   File: ${serviceAccountPath}`);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Try to load from environment variable (for production)
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      
      console.log('✅ Firebase Admin SDK initialized with environment variable');
    } else {
      // Initialize with application default credentials (for Cloud Run, etc.)
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'meet-me-a78cc'
      });
      
      console.log('⚠️ Firebase Admin SDK initialized with default credentials');
    }
    
    initialized = true;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
}

// Get Firestore instance
export function getFirestore(): admin.firestore.Firestore {
  if (!initialized) {
    initializeFirebase();
  }
  return admin.firestore();
}

// Firestore helper object for common operations
export const db = {
  // Get all documents from a collection
  async getAll(collectionName: string): Promise<any[]> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(collectionName).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get document by ID
  async getById(collectionName: string, id: string): Promise<any | null> {
    const firestore = getFirestore();
    const doc = await firestore.collection(collectionName).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return {
      id: doc.id,
      ...doc.data()
    };
  },

  // Create document with auto-generated ID
  async create(collectionName: string, data: any): Promise<string> {
    const firestore = getFirestore();
    const docRef = await firestore.collection(collectionName).add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  },

  // Create document with specific ID
  async createWithId(collectionName: string, id: string, data: any): Promise<void> {
    const firestore = getFirestore();
    await firestore.collection(collectionName).doc(id).set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  },

  // Update document
  async update(collectionName: string, id: string, data: any): Promise<void> {
    const firestore = getFirestore();
    await firestore.collection(collectionName).doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  },

  // Delete document
  async delete(collectionName: string, id: string): Promise<void> {
    const firestore = getFirestore();
    await firestore.collection(collectionName).doc(id).delete();
  },

  // Query documents with conditions
  async query(
    collectionName: string, 
    field: string, 
    operator: admin.firestore.WhereFilterOp, 
    value: any
  ): Promise<any[]> {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection(collectionName)
      .where(field, operator, value)
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Query with multiple conditions
  async queryMultiple(
    collectionName: string,
    conditions: Array<{ field: string; operator: admin.firestore.WhereFilterOp; value: any }>
  ): Promise<any[]> {
    const firestore = getFirestore();
    let query: admin.firestore.Query = firestore.collection(collectionName);
    
    for (const condition of conditions) {
      query = query.where(condition.field, condition.operator, condition.value);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Query with ordering
  async queryOrdered(
    collectionName: string,
    orderByField: string,
    direction: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<any[]> {
    const firestore = getFirestore();
    let query: admin.firestore.Query = firestore
      .collection(collectionName)
      .orderBy(orderByField, direction);
    
    if (limitCount) {
      query = query.limit(limitCount);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Count documents in collection
  async count(collectionName: string): Promise<number> {
    const firestore = getFirestore();
    const snapshot = await firestore.collection(collectionName).count().get();
    return snapshot.data().count;
  },

  // Find one document matching condition
  async findOne(collectionName: string, field: string, value: any): Promise<any | null> {
    const firestore = getFirestore();
    const snapshot = await firestore
      .collection(collectionName)
      .where(field, '==', value)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  },

  // Check if document exists
  async exists(collectionName: string, id: string): Promise<boolean> {
    const firestore = getFirestore();
    const doc = await firestore.collection(collectionName).doc(id).get();
    return doc.exists;
  },

  // Batch write operations
  async batchWrite(
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      collection: string;
      id?: string;
      data?: any;
    }>
  ): Promise<void> {
    const firestore = getFirestore();
    const batch = firestore.batch();
    
    for (const op of operations) {
      const ref = op.id 
        ? firestore.collection(op.collection).doc(op.id)
        : firestore.collection(op.collection).doc();
      
      switch (op.type) {
        case 'create':
          batch.set(ref, {
            ...op.data,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          break;
        case 'update':
          batch.update(ref, {
            ...op.data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          break;
        case 'delete':
          batch.delete(ref);
          break;
      }
    }
    
    await batch.commit();
  },

  // Get Firestore server timestamp
  serverTimestamp() {
    return admin.firestore.FieldValue.serverTimestamp();
  },

  // Get raw Firestore instance for complex queries
  getFirestore() {
    return getFirestore();
  }
};

export default admin;
