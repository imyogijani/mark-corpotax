import express from "express";
import { Request, Response } from "express";
import { BlogService } from "../services/firebaseService";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

// @desc    Get blog categories (must be before /:id route)
// @route   GET /api/blog/meta/categories
// @access  Public
router.get("/meta/categories", async (req: Request, res: Response) => {
  try {
    const categories = await BlogService.getCategories();

    res.status(200).json({
      success: true,
      message: "Blog categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving categories",
    });
  }
});

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status = "published", category, page = 1, limit = 10 } = req.query;

    const filters: any = { status: status as string };
    if (category) filters.category = category as string;

    let blogs = await BlogService.findAll(filters);

    const total = blogs.length;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Paginate
    blogs = blogs.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      message: "Blog posts retrieved successfully",
      data: {
        blogs,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: blogs.length,
          totalCount: total,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving blog posts",
    });
  }
});

// @desc    Get single blog post
// @route   GET /api/blog/:id
// @access  Public
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let blog = await BlogService.findById(id);
    if (!blog) {
      blog = await BlogService.findBySlug(id);
    }

    if (!blog || blog.status !== "published") {
      res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
      return;
    }

    // Increment view count
    await BlogService.incrementViewCount(blog.id!);
    blog.viewCount = (blog.viewCount || 0) + 1;

    res.status(200).json({
      success: true,
      message: "Blog post retrieved successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error retrieving blog post",
    });
  }
});

// @desc    Create new blog post (Admin only)
// @route   POST /api/blog
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const blogData = req.body;

      const blog = await BlogService.create(blogData);

      res.status(201).json({
        success: true,
        message: "Blog post created successfully",
        data: blog,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error creating blog post",
      });
    }
  }
);

// @desc    Update blog post (Admin only)
// @route   PUT /api/blog/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const blog = await BlogService.update(id, updateData);

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Blog post updated successfully",
        data: blog,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error updating blog post",
      });
    }
  }
);

// @desc    Delete blog post (Admin only)
// @route   DELETE /api/blog/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const blog = await BlogService.findById(id);

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
        return;
      }

      await BlogService.delete(id);

      res.status(200).json({
        success: true,
        message: "Blog post deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Server error deleting blog post",
      });
    }
  }
);

export default router;
