/**
 * Firebase Firestore User Seeding Script
 *
 * This script creates initial admin and demo users in Firebase Firestore.
 * Run with: node scripts/seed-firebase-users.js
 *
 * Make sure serviceAccountKey.json is placed in backend/src/ folder
 */

const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Initialize Firebase with service account
const serviceAccountPath = path.join(
  __dirname,
  "../src/serviceAccountKey.json"
);

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ serviceAccountKey.json not found!");
  console.error(`Expected at: ${serviceAccountPath}`);
  console.error("\nTo get the service account key:");
  console.error(
    "1. Go to https://console.firebase.google.com/project/meet-me-a78cc/settings/serviceaccounts/adminsdk"
  );
  console.error('2. Click "Generate new private key"');
  console.error(
    '3. Save the file as "serviceAccountKey.json" in backend/src/ folder'
  );
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

// Predefined users to seed
const users = [
  // Admin Users
  {
    name: "Admin User",
    email: "admin@markcorpotax.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Demo Admin",
    email: "admin@example.com",
    password: "password",
    role: "admin",
  },
  // Regular Users
  {
    name: "John Doe",
    email: "john@example.com",
    password: "user123",
    role: "user",
  },
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "user123",
    role: "user",
  },
];

async function seedUsers() {
  try {
    console.log("🔥 Connected to Firebase Firestore");
    console.log(`📁 Project ID: ${serviceAccount.project_id}`);

    let createdCount = 0;
    let skippedCount = 0;

    // Get existing users
    const usersSnapshot = await db.collection("users").get();
    const existingEmails = usersSnapshot.docs.map((doc) =>
      doc.data().email?.toLowerCase()
    );

    for (const userData of users) {
      // Check if user already exists
      if (existingEmails.includes(userData.email.toLowerCase())) {
        console.log(`⏭️  User ${userData.email} already exists - skipping`);
        skippedCount++;
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const now = admin.firestore.FieldValue.serverTimestamp();

      // Create user
      await db.collection("users").add({
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });

      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      createdCount++;
    }

    console.log("\n📊 Seeding Summary:");
    console.log(`Created: ${createdCount} users`);
    console.log(`Skipped: ${skippedCount} users (already exist)`);

    console.log("\n🔑 Login Credentials:");
    console.log("==========================================");
    users.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log("------------------------------------------");
    });

    console.log("\n✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedUsers();
