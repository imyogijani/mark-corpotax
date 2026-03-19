"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
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
  AlertCircle,
  MoreHorizontal,
  ArrowRight,
  Share2,
  BarChart3,
  Globe,
  Loader2,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function BlogManagementPage() {
  const { setTitle } = useAdmin();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "published"
  >("all");

  useEffect(() => {
    setTitle("Blog Management");
    fetchBlogs();
  }, [setTitle]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdminBlogs();
      if (response.success && response.data) {
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
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
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
      (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const draftCount = blogs.filter(b => b.status === 'draft').length;
  const publishedCount = blogs.filter(b => b.status === 'published').length;
  const totalViews = blogs.reduce((acc, b) => acc + (b.viewCount || 0), 0);

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
      {/* Premium Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-gray-100 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100/50">
            <Globe size={12} className="animate-spin-slow" />
            Content Engine v2.4
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Articles</span>
          </h1>
          <p className="text-gray-500 max-w-xl font-medium text-lg leading-relaxed">
            Create, edit and manage your company's insights, industry news and thought leadership pieces from one powerful interface.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchBlogs}
            className="h-14 px-6 rounded-2xl border-gray-200 hover:bg-gray-50 font-bold text-gray-600 gap-2 transition-all active:scale-95"
          >
            <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Link href="/admin/blog/new">
            <Button className="h-14 px-8 bg-gradient-to-r from-primary to-blue-600 hover:shadow-2xl hover:shadow-primary/30 text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95 border-0">
              <Plus className="h-5 w-5 mr-3" strokeWidth={3} />
              Create New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Articles", value: blogs.length, icon: FileText, color: "bg-blue-600", bg: "bg-blue-50" },
          { label: "Live & Public", value: publishedCount, icon: Globe, color: "bg-emerald-600", bg: "bg-emerald-50" },
          { label: "Work in Progress", value: draftCount, icon: Layers, color: "bg-amber-600", bg: "bg-amber-50" },
          { label: "Lifetime Views", value: totalViews.toLocaleString(), icon: BarChart3, color: "bg-purple-600", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-0 shadow-xl shadow-gray-100/50 bg-white/70 backdrop-blur-md overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.05] group-hover:scale-150 transition-transform duration-700 ${stat.color}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color.replace('bg-', 'text-')} transform group-hover:rotate-6 transition-transform`}>
                    <stat.icon size={26} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                    <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stat.bg} ${stat.color.replace('bg-', 'text-')}`}>Active</p>
                  </div>
                </div>
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-tight mt-1 opacity-60">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Advanced Filters & Search */}
      <Card className="border-0 shadow-2xl shadow-gray-200/50 bg-white overflow-hidden rounded-[2rem]">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Scan through title, content or authorship..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-14 h-16 border-0 bg-gray-50/50 focus-visible:ring-4 focus-visible:ring-primary/5 focus-visible:bg-white text-lg font-medium rounded-2xl transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-16 flex items-center gap-3 px-6 bg-gray-50/50 rounded-2xl border border-transparent focus-within:border-primary/20 transition-all">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  aria-label="Status Filter"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as "all" | "draft" | "published",
                    )
                  }
                  className="bg-transparent border-0 text-gray-700 font-black uppercase tracking-widest text-[10px] outline-none cursor-pointer min-w-[120px]"
                >
                  <option value="all">Every State</option>
                  <option value="published">Final (Public)</option>
                  <option value="draft">In-Progress (Draft)</option>
                </select>
              </div>
              <Button variant="ghost" className="h-16 w-16 rounded-2xl hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="h-6 w-6 text-gray-400" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Post List (Premium Cards) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
            <div className="absolute inset-4 rounded-full border-4 border-blue-400/10 border-b-blue-400 animate-spin-slow" />
          </div>
          <p className="text-xl font-black text-gray-900 tracking-tighter animate-pulse">Initializing Data Vault...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-40 h-40 bg-gray-100 rounded-[3rem] flex items-center justify-center mb-8 rotate-3 shadow-inner">
                  <AlertCircle size={64} className="text-gray-300" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">No articles matched your criteria</h2>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium">Try refining your search or create a new masterpiece to populate this list.</p>
                <Button
                  onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
                  className="mt-8 h-12 px-8 rounded-xl bg-gray-900 text-white font-bold"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, type: "spring", damping: 20 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg shadow-gray-200/40 bg-white/80 backdrop-blur-md overflow-hidden rounded-[2.5rem] hover:shadow-2xl hover:shadow-gray-300 transition-all duration-500 group">
                    <div className="flex flex-col md:flex-row min-h-[220px]">
                      {/* Thumbnail Part */}
                      <div className="md:w-72 lg:w-80 h-64 md:h-auto relative overflow-hidden">
                        {blog.featuredImage ? (
                          <Image
                            src={blog.featuredImage}
                            alt={blog.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <ImageIcon size={48} className="text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge
                            className={`px-3 py-1.5 rounded-xl border-0 shadow-lg font-black uppercase tracking-widest text-[10px] ${blog.status === 'published'
                              ? 'bg-emerald-500 text-white shadow-emerald-200'
                              : 'bg-amber-500 text-white shadow-amber-200'
                              }`}
                          >
                            {blog.status}
                          </Badge>
                        </div>
                        {blog.viewCount && blog.viewCount > 100 && (
                          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg flex items-center gap-2">
                            <TrendingUp size={12} className="text-rose-500" />
                            <span className="text-[10px] font-black text-gray-900 uppercase">Trending</span>
                          </div>
                        )}
                      </div>

                      {/* Content Part */}
                      <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{blog.category || 'Insights'}</span>
                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                <div className="flex items-center gap-1.5">
                                  <Clock size={12} className="text-gray-400" />
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">5m Read</span>
                                </div>
                              </div>
                              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-primary transition-colors pr-10">
                                {blog.title}
                              </h3>
                            </div>
                          </div>
                          <p className="text-gray-500 font-medium line-clamp-2 mb-8 text-lg">
                            {blog.excerpt || "We are still crafting the narrative for this specific masterpiece. Check back soon for the full summary of insights and value."}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-gray-100 pt-8">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center border border-white shadow-sm font-black text-xs text-gray-600">
                                {blog.author?.charAt(0) || 'A'}
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Author</p>
                                <p className="text-sm font-black text-gray-900">{blog.author}</p>
                              </div>
                            </div>
                            <div className="h-8 w-px bg-gray-100" />
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Timestamp</p>
                              <p className="text-sm font-black text-gray-900">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '20' + new Date(blog.createdAt).getFullYear().toString().slice(-2) })}</p>
                            </div>
                            <div className="h-8 w-px bg-gray-100 hidden lg:block" />
                            <div className="hidden lg:block">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Interactions</p>
                              <p className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                                <Eye size={16} className="text-primary" />
                                {blog.viewCount || 0}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 ml-auto md:ml-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-12 w-12 rounded-2xl hover:bg-gray-100 text-gray-400 hover:text-gray-900"
                            >
                              <Share2 size={20} />
                            </Button>
                            <div className="h-10 w-px bg-gray-100 mx-2" />
                            <div className="flex gap-2">
                              <Link href={`/admin/blog/edit/${blog._id}`}>
                                <Button className="h-12 w-12 lg:w-auto lg:px-6 rounded-2xl bg-gray-900 hover:bg-black text-white font-black uppercase tracking-widest text-[10px] transition-all group-hover:scale-105">
                                  <Edit className="h-4 w-4 lg:mr-2" />
                                  <span className="hidden lg:inline">Modify</span>
                                </Button>
                              </Link>
                              <Button
                                onClick={() => deleteBlog(blog._id)}
                                className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-0 transition-all border border-rose-100"
                              >
                                <Trash2 size={20} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Decoration Block */}
                      <div className="hidden lg:flex w-2 bg-gray-50 flex-col items-center justify-center gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-gray-300" />)}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
