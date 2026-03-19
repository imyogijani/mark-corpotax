"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api-client";
import {
  Save,
  Eye,
  ArrowLeft,
  FileText,
  Type,
  AlignLeft,
  Tags,
  LayoutList,
  Image as ImageIcon,
  Search as SearchIcon,
  User as UserIcon,
  Trash2,
  Sparkles,
  Globe,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  History
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { setTitle } = useAdmin();
  const blogId = params.id as string;

  useEffect(() => {
    setTitle("Refine Article");
  }, [setTitle]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    status: "draft" as "draft" | "published",
    featuredImage: "",
    seoTitle: "",
    metaDescription: "",
    keywords: "",
    authorName: "",
    authorBio: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (blogId) {
      const fetchBlog = async () => {
        try {
          setIsFetching(true);
          const response = await apiClient.getBlog(blogId);
          if (response.success && response.data) {
            const blog = response.data;
            setFormData({
              title: blog.title || "",
              excerpt: blog.excerpt || "",
              content: blog.content || "",
              category: blog.category || "",
              tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : (blog.tags || ""),
              status: blog.status || "draft",
              featuredImage: blog.featuredImage || "",
              seoTitle: blog.seoTitle || "",
              metaDescription: blog.metaDescription || "",
              keywords: blog.keywords || "",
              authorName: blog.authorName || blog.author || "",
              authorBio: blog.authorBio || "",
            });
          } else {
            setError(response.message || "Failed to load blog");
          }
        } catch (err: any) {
          setError("Error fetching blog details from the vault.");
        } finally {
          setIsFetching(false);
        }
      };
      fetchBlog();
    }
  }, [blogId]);

  const handleSubmit = async (
    e: React.FormEvent,
    status: "draft" | "published" = "draft"
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const blogData = {
        ...formData,
        author: formData.authorName || "Admin",
        status,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      const response = await apiClient.updateBlog(blogId, blogData);

      if (response.success) {
        router.push("/admin/blog");
      } else {
        setError(response.error || "Failed to sync updates with production.");
      }
    } catch {
      setError("An unexpected synchronization error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin" />
          <div className="absolute inset-4 rounded-full border-t-2 border-blue-400 animate-spin-slow" />
        </div>
        <p className="text-xl font-black text-gray-900 tracking-tighter animate-pulse uppercase">Accessing Content Archive...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-32 relative">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-12"
      >
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 border-b border-gray-100 pb-12">
          <div className="space-y-4">
            <Link href="/admin/blog" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:translate-x-[-4px] transition-transform">
              <ArrowLeft size={14} strokeWidth={3} />
              Return to Directory
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-100/50">Production Ready</span>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">ID: {blogId.slice(-6).toUpperCase()}</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Blog Article</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-16 px-8 rounded-2xl border-gray-200 hover:bg-gray-50 text-gray-600 font-black uppercase tracking-widest text-xs border-2"
              asChild
            >
              <Link href="/admin/blog">Cancel</Link>
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={isLoading}
              className="h-16 px-8 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-black uppercase tracking-widest text-xs border-0"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Sync Updates
            </Button>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert variant="destructive" className="rounded-3xl border-rose-100 bg-rose-50 text-rose-600 p-6 flex items-center gap-4">
              <AlertCircle className="h-6 w-6" />
              <AlertDescription className="font-bold text-lg">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Core Details Card */}
              <Card className="border-0 shadow-2xl shadow-gray-200/50 bg-white/70 backdrop-blur-md rounded-[3rem] overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-gray-900 to-gray-400" />
                <CardHeader className="pt-10 px-10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
                      <Type className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight">Modify Identity</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-10 px-10 pb-10">
                  {/* Featured Image Section */}
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Backdrop Overlay</Label>
                    <div className="relative group">
                      {formData.featuredImage ? (
                        <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
                          <img src={formData.featuredImage} alt="Cover" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                              className="bg-white text-rose-600 rounded-2xl px-6 py-3 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 size={16} />
                              Purge Backdrop
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full aspect-video border-4 border-dashed border-gray-200 rounded-[2.5rem] cursor-pointer bg-gray-50/50 hover:bg-white hover:border-primary/50 transition-all duration-300 group shadow-inner">
                          <div className="flex flex-col items-center justify-center p-10 text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                              <ImageIcon className="h-10 w-10 text-primary" />
                            </div>
                            <p className="text-xl font-black text-gray-900 tracking-tight">Relink Visual Asset</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({ ...prev, featuredImage: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Article Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Define your narrative here..."
                      className="h-16 text-2xl font-black px-6 bg-gray-50/50 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-[1.5rem] transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="excerpt" className="text-[10px] font-black uppercase tracking-widest text-gray-400">The Abstract (Excerpt)</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Write a summary that demands recognition..."
                      className="resize-none bg-gray-50/50 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-[1.5rem] transition-all p-8 text-lg font-medium min-h-[140px]"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Editor Section */}
              <Card className="border-0 shadow-2xl shadow-gray-200/50 bg-white/70 backdrop-blur-md rounded-[3rem] overflow-hidden">
                <CardHeader className="pt-10 px-10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
                      <AlignLeft className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight">Main Manuscript</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-10 pb-10">
                  <div className="rounded-[2rem] overflow-hidden border-2 border-gray-100 bg-white shadow-inner">
                    <RichTextEditor
                      content={formData.content}
                      onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-10">
              {/* Control Panel Stickyness */}
              <div className="sticky top-24 space-y-10">

                {/* Deployment Control */}
                <Card className="border-0 shadow-2xl shadow-primary/10 bg-gradient-to-br from-indigo-900 via-gray-900 to-black rounded-[2.5rem] overflow-hidden group">
                  <CardHeader className="pt-10 px-8 pb-4">
                    <CardTitle className="text-xl font-black text-white tracking-widest uppercase">System Sync</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 px-8 pb-10">
                    <Button
                      type="button"
                      variant="default"
                      className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:shadow-2xl hover:shadow-primary/40 text-base font-black uppercase tracking-[0.1em] transition-all hover:-translate-y-1 border-0"
                      disabled={isLoading}
                      onClick={(e) => handleSubmit(e, "published")}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin h-6 w-6" />
                      ) : (
                        <>
                          <Globe className="h-5 w-5 mr-3" />
                          Update Live Record
                        </>
                      )}
                    </Button>

                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibility</p>
                        <div className={`w-3 h-3 rounded-full ${formData.status === 'published' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-amber-500 shadow-amber-500/50'} shadow-lg animate-pulse`} />
                      </div>
                      <select
                        id="status"
                        name="status"
                        title="Publication status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full bg-transparent text-white font-black uppercase tracking-widest text-xs outline-none cursor-pointer"
                      >
                        <option value="draft" className="bg-gray-900 text-white">Private Draft</option>
                        <option value="published" className="bg-gray-900 text-white">Public Archive</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Taxonomy Control */}
                <Card className="border-0 shadow-2xl shadow-gray-200/50 bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="pt-8 px-8 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                        <LayoutList size={18} />
                      </div>
                      <CardTitle className="font-black text-sm uppercase tracking-widest text-gray-400">Class & Tags</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 px-8 pb-8">
                    <div className="space-y-4">
                      <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category Sphere</Label>
                      <Input
                        id="category" name="category" value={formData.category} onChange={handleInputChange}
                        className="h-12 bg-gray-100/5 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Taxonomy Tags</Label>
                      <Input
                        id="tags" name="tags" value={formData.tags} onChange={handleInputChange}
                        className="h-12 bg-gray-100/5 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-xl font-medium"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Ranking Engine Control */}
                <Card className="border-0 shadow-2xl shadow-gray-200/50 bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden border-t-4 border-t-primary">
                  <CardHeader className="pt-8 px-8 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                        <SearchIcon size={18} />
                      </div>
                      <CardTitle className="font-black text-sm uppercase tracking-widest text-gray-400">SEO Stack</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 px-8 pb-8">
                    <div className="space-y-4">
                      <Label htmlFor="seoTitle" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Meta Title</Label>
                      <Input
                        id="seoTitle" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange}
                        className="bg-gray-100/5 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-xl h-12 font-bold"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="metaDescription" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Search Abstract</Label>
                      <Textarea
                        id="metaDescription" name="metaDescription" value={formData.metaDescription} onChange={handleInputChange}
                        className="resize-none bg-gray-100/5 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-xl p-4 text-sm font-medium h-24"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
