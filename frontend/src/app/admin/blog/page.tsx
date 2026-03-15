"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiClient, type Blog } from "@/lib/api-client";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published"
  >("all");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await apiClient.getAdminBlogs();
      if (response.success && response.data) {
        // Backend returns { blogs: [...], pagination: {...} } or just array
        const data = response.data as { blogs?: Blog[] } | Blog[];
        const blogsData = Array.isArray(data) ? data : data.blogs || [];
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await apiClient.deleteBlog(id);
      if (response.success) {
        setBlogs(blogs.filter((blog) => blog._id !== id));
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout title="Blog Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Blog Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage your blog posts
            </p>
          </div>
          <Link href="/admin/blog/new">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="max-w-sm"
                />
              </div>
              <select
                title="Filter by status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "draft" | "published",
                  )
                }
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBlogs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No blog posts found.</p>
                  <Link href="/admin/blog/new">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first post
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredBlogs.map((blog, index) => (
                <Card key={blog.id || blog._id || index}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {blog.title}
                          </h3>
                          <Badge
                            variant={
                              blog.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {blog.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">
                          {blog.excerpt}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            By {blog.author} •{" "}
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </p>
                          {blog.status === "published" && (
                            <p>
                              Published:{" "}
                              {new Date(blog.updatedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {blog.status === "published" && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/blog/${blog.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/blog/edit/${blog._id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBlog(blog._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
