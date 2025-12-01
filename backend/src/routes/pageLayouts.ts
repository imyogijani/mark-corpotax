import express from "express";
import { Request, Response } from "express";
import { db } from "../config/firebase";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

// Collection name for page layouts
const COLLECTION_NAME = "pageLayouts";

// Get raw Firestore instance for complex queries
const firestore = () => db.getFirestore();

// @desc    Get page layout by page name (Public route - must be first)
// @route   GET /api/page-layouts/page/:pageName
// @access  Public (for rendering)
router.get(
  "/page/:pageName",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { pageName } = req.params;
      const snapshot = await firestore()
        .collection(COLLECTION_NAME)
        .where("pageName", "==", pageName)
        .where("isPublished", "==", true)
        .limit(1)
        .get();

      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: "Page layout not found",
        });
        return;
      }

      const doc = snapshot.docs[0];
      res.status(200).json({
        success: true,
        message: "Page layout retrieved successfully",
        data: { id: doc.id, ...doc.data() },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error retrieving page layout",
      });
    }
  }
);

// Apply authentication to all remaining routes
router.use(protect);
router.use(authorize("admin"));

// @desc    Get all page layouts
// @route   GET /api/page-layouts
// @access  Private (Admin only)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await firestore()
      .collection(COLLECTION_NAME)
      .orderBy("updatedAt", "desc")
      .get();

    const layouts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      message: "Page layouts retrieved successfully",
      data: layouts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving page layouts",
    });
  }
});

// @desc    Get a specific page layout by ID
// @route   GET /api/page-layouts/:id
// @access  Private (Admin only)
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doc = await firestore().collection(COLLECTION_NAME).doc(id).get();

    if (!doc.exists) {
      res.status(404).json({
        success: false,
        message: "Page layout not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Page layout retrieved successfully",
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving page layout",
    });
  }
});

// @desc    Create a new page layout
// @route   POST /api/page-layouts
// @access  Private (Admin only)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageName, components, isPublished = false } = req.body;

    if (!pageName) {
      res.status(400).json({
        success: false,
        message: "Page name is required",
      });
      return;
    }

    const layoutData = {
      pageName,
      components: components || [],
      isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await firestore()
      .collection(COLLECTION_NAME)
      .add(layoutData);
    const newDoc = await docRef.get();

    res.status(201).json({
      success: true,
      message: "Page layout created successfully",
      data: { id: docRef.id, ...newDoc.data() },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error creating page layout",
    });
  }
});

// @desc    Update a page layout
// @route   PUT /api/page-layouts/:id
// @access  Private (Admin only)
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { pageName, components, isPublished } = req.body;

    const docRef = firestore().collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({
        success: false,
        message: "Page layout not found",
      });
      return;
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (pageName !== undefined) updateData.pageName = pageName;
    if (components !== undefined) updateData.components = components;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Page layout updated successfully",
      data: { id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error updating page layout",
    });
  }
});

// @desc    Delete a page layout
// @route   DELETE /api/page-layouts/:id
// @access  Private (Admin only)
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const docRef = firestore().collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({
        success: false,
        message: "Page layout not found",
      });
      return;
    }

    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Page layout deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error deleting page layout",
    });
  }
});

// @desc    Publish a page layout
// @route   POST /api/page-layouts/:id/publish
// @access  Private (Admin only)
router.post(
  "/:id/publish",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const docRef = firestore().collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        res.status(404).json({
          success: false,
          message: "Page layout not found",
        });
        return;
      }

      await docRef.update({
        isPublished: true,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const updatedDoc = await docRef.get();

      res.status(200).json({
        success: true,
        message: "Page layout published successfully",
        data: { id: updatedDoc.id, ...updatedDoc.data() },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error publishing page layout",
      });
    }
  }
);

// @desc    Unpublish a page layout
// @route   POST /api/page-layouts/:id/unpublish
// @access  Private (Admin only)
router.post(
  "/:id/unpublish",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const docRef = firestore().collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        res.status(404).json({
          success: false,
          message: "Page layout not found",
        });
        return;
      }

      await docRef.update({
        isPublished: false,
        updatedAt: new Date().toISOString(),
      });

      const updatedDoc = await docRef.get();

      res.status(200).json({
        success: true,
        message: "Page layout unpublished successfully",
        data: { id: updatedDoc.id, ...updatedDoc.data() },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error unpublishing page layout",
      });
    }
  }
);

// @desc    Sync page builder content to pageContent collection
// @route   POST /api/page-layouts/sync-content
// @access  Private (Admin only)
router.post(
  "/sync-content",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, section, content } = req.body;

      if (!page || !section || !content) {
        res.status(400).json({
          success: false,
          message: "Page, section, and content are required",
        });
        return;
      }

      const pageContentRef = firestore().collection("pageContent");
      const batch = firestore().batch();
      const results: any[] = [];

      // Process each content item
      for (const [key, value] of Object.entries(content)) {
        // Find existing content with this page/section/key
        const existingQuery = await pageContentRef
          .where("page", "==", page.toLowerCase())
          .where("section", "==", section)
          .where("key", "==", key)
          .limit(1)
          .get();

        if (!existingQuery.empty) {
          // Update existing content
          const docRef = existingQuery.docs[0].ref;
          batch.update(docRef, {
            value: value,
            updatedAt: new Date().toISOString(),
          });
          results.push({ key, action: "updated" });
        } else {
          // Create new content
          const newDocRef = pageContentRef.doc();
          batch.set(newDocRef, {
            page: page.toLowerCase(),
            section: section,
            key: key,
            value: value,
            type: typeof value === "object" ? "array" : "text",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          results.push({ key, action: "created" });
        }
      }

      await batch.commit();

      res.status(200).json({
        success: true,
        message: "Content synced successfully",
        data: { synced: results.length, results },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error syncing content",
      });
    }
  }
);

// @desc    Bulk sync all sections from page builder
// @route   POST /api/page-layouts/bulk-sync
// @access  Private (Admin only)
router.post(
  "/bulk-sync",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, sections } = req.body;

      if (!page || !sections || !Array.isArray(sections)) {
        res.status(400).json({
          success: false,
          message: "Page and sections array are required",
        });
        return;
      }

      const pageContentRef = firestore().collection("pageContent");
      const batch = firestore().batch();
      let totalSynced = 0;

      for (const sectionData of sections) {
        const { section, content } = sectionData;

        if (!section || !content) continue;

        for (const [key, value] of Object.entries(content)) {
          // Find existing content
          const existingQuery = await pageContentRef
            .where("page", "==", page.toLowerCase())
            .where("section", "==", section)
            .where("key", "==", key)
            .limit(1)
            .get();

          if (!existingQuery.empty) {
            batch.update(existingQuery.docs[0].ref, {
              value: value,
              updatedAt: new Date().toISOString(),
            });
          } else {
            const newDocRef = pageContentRef.doc();
            batch.set(newDocRef, {
              page: page.toLowerCase(),
              section: section,
              key: key,
              value: value,
              type: typeof value === "object" ? "array" : "text",
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          totalSynced++;
        }
      }

      await batch.commit();

      res.status(200).json({
        success: true,
        message: "All content synced successfully",
        data: { totalSynced },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error syncing content",
      });
    }
  }
);

export default router;
