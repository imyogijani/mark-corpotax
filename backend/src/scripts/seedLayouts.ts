import { db, initializeFirebase } from "../config/firebase";

initializeFirebase();

const COLLECTION_NAME = "pageLayouts";

const financeHomeLayout = {
  pageName: "home",
  division: "finance",
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  components: [
    { id: "hero-finance", type: "HomeHero", props: {} },
    { id: "about-finance", type: "About", props: {} },
    { id: "honeycomb-finance", type: "Honeycomb", props: {} },
    { id: "features-finance", type: "Features", props: {} },
    { id: "services-finance", type: "Services", props: {} },
    { id: "testimonials-finance", type: "Testimonials", props: {} },
    { id: "blog-finance", type: "Blog", props: {} },
  ],
};

const taxationHomeLayout = {
  pageName: "home",
  division: "taxation",
  isPublished: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  components: [
    { id: "hero-taxation", type: "HomeHero", props: {} },
    { id: "services-taxation", type: "Services", props: {} },
    { id: "about-taxation", type: "About", props: {} },
    { id: "honeycomb-taxation", type: "Honeycomb", props: {} },
    { id: "testimonials-taxation", type: "Testimonials", props: {} },
    { id: "blog-taxation", type: "Blog", props: {} },
  ],
};

async function seedLayout(layout: any) {
  const firestore = db.getFirestore();
  const snapshot = await firestore
    .collection(COLLECTION_NAME)
    .where("pageName", "==", layout.pageName)
    .where("division", "==", layout.division)
    .get();

  if (snapshot.empty) {
    console.log(
      `Creating '${layout.pageName}' layout for division '${layout.division}'...`,
    );
    await firestore.collection(COLLECTION_NAME).add(layout);
    console.log(
      `'${layout.pageName}' layout for '${layout.division}' created successfully.`,
    );
  } else {
    console.log(
      `Updating existing '${layout.pageName}' layout for division '${layout.division}'...`,
    );
    const doc = snapshot.docs[0];
    await doc.ref.update({
      components: layout.components,
      updatedAt: new Date().toISOString(),
    });
    console.log(
      `'${layout.pageName}' layout for '${layout.division}' updated successfully.`,
    );
  }
}

async function seed() {
  try {
    await seedLayout(financeHomeLayout);
    await seedLayout(taxationHomeLayout);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding layouts:", error);
    process.exit(1);
  }
}

seed();
