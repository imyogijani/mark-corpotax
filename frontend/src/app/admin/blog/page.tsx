"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { apiClient, type Blog } from "@/lib/api-client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

  const draftCount = blogs.filter(b => b.status === 'draft').length;
  const publishedCount = blogs.filter(b => b.status === 'published').length;

  return (
    <AdminLayout title="Blog Management">
      <div className="space-y-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Blog Posts</h2>
              <p className="text-sm text-gray-500">Manage your website's articles and news</p>
            </div>
          </div>
          <Link href="/admin/blog/new">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 px-6 py-2.5 font-medium transition-all hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900/60">Total Posts</p>
                  <h3 className="text-2xl font-bold text-blue-900">{blogs.length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-900/60">Published</p>
                  <h3 className="text-2xl font-bold text-emerald-900">{publishedCount}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-900/60">Drafts</p>
                  <h3 className="text-2xl font-bold text-amber-900">{draftCount}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search & Filters */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-2">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles by title or content..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10 border-0 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:bg-white h-12 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2 px-2 md:px-0">
                <Filter className="h-4 w-4 text-gray-400 hidden md:block" />
                <select
                  aria-label="Filter by status"
                  title="Filter by status"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "all" | "draft" | "published",
                    )
                  }
                  className="h-12 px-4 border-0 bg-gray-50/50 rounded-xl text-sm font-medium text-gray-600 outline-none focus:ring-1 focus:ring-primary/20 appearance-none min-w-[140px] cursor-pointer"
                >
                  <option value="all">All Articles</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-sm font-medium">Loading articles...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-sm border-dashed border-2 bg-gray-50/50">
                  <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                      {searchTerm ? <Search size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchTerm ? "No results found" : "No articles yet"}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm">
                      {searchTerm 
                        ? `We couldn't find any articles matching "${searchTerm}". Try different keywords.` 
                        : "Start building your blog by creating your first awesome article."}
                    </p>
                    {!searchTerm && (
                      <Link href="/admin/blog/new">
                        <Button className="rounded-xl px-6">
                          <Plus className="h-4 w-4 mr-2" />
                          Write First Article
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {filteredBlogs.map((blog, index) => (
                    <motion.div
                      key={blog._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="flex-1 p-6">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                      {blog.title}
                                    </h3>
                                    <Badge
                                      variant="secondary"
                                      className={`rounded-full ${
                                        blog.status === "published"
                                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                          : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                      }`}
                                    >
                                      {blog.status === "published" ? "Published" : "Draft"}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                    {blog.excerpt || "No excerpt provided for this article..."}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3.5 w-3.5" />
                                  <span>{blog.author}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                {blog.status === "published" && (
                                  <div className="flex items-center gap-1.5 text-emerald-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span>Last updated: {new Date(blog.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 text-blue-600">
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>{blog.viewCount || 0} views</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50/80 md:w-48 p-4 md:p-6 flex md:flex-col items-center justify-end md:justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-100">
                              {blog.status === "published" && (
                                <Button variant="outline" size="sm" asChild className="w-full bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                  <Link href={`/blog/${blog.slug}`} target="_blank">
                                    <Eye className="h-4 w-4 md:mr-2" />
                                    <span className="hidden md:inline">View Live</span>
                                  </Link>
                                </Button>
                              )}
                              <Button variant="outline" size="sm" asChild className="w-full bg-white hover:bg-gray-100">
                                <Link href={`/admin/blog/edit/${blog._id}`}>
                                  <Edit className="h-4 w-4 md:mr-2 text-gray-600" />
                                  <span className="hidden md:inline text-gray-600">Edit Post</span>
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteBlog(blog._id)}
                                className="w-full bg-white text-rose-600 border-rose-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                              >
                                <Trash2 className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">Delete</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
