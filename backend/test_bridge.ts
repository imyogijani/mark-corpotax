import { db, initializeFirebase } from "./src/config/firebase";
import {
  AppointmentService,
  MEET_ME_DB,
  IStaffAppointment,
} from "./src/services/firebaseService";

async function testBridge() {
  console.log("--- Starting Bridge Verification ---");
  initializeFirebase();

  const testBusinessId = "test_mark_corpotax_id";
  const testAppointment: Partial<IStaffAppointment> = {
    businessId: testBusinessId,
    staffId: "test_staff",
    customerId: "website_test_visitor",
    serviceId: "tax_filing",
    serviceIds: ["tax_filing"],
    appointmentDate: "2026-03-01",
    appointmentTime: "10:00",
    durationMinutes: 60,
    status: "scheduled",
    serviceName: "Test Tax Filing",
    customerName: "Test Web User",
    customerPhone: "1234567890",
    notes: "Testing API Bridge Integration",
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    console.log(`Writing test appointment to ${MEET_ME_DB} database...`);
    const id = await AppointmentService.createInMeetMe(testAppointment);
    console.log(`✅ Success! Document created with ID: ${id}`);

    // Cleanup - Delete test document
    // await db.delete('appointments', id, MEET_ME_DB);
    // console.log('Cleanup: Test document deleted.');
  } catch (error: any) {
    console.error("❌ Bridge Verification Failed!");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.stack) {
      console.error("Stack Trace:", error.stack);
    }
    if (error.code) {
      console.error("Error Code:", error.code);
    }
    console.error("Firestore instance:", db);
  }
}

testBridge();
