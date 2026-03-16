"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient } from "@/lib/api-client";
import { Save, Eye, ArrowLeft, FileText, Type, AlignLeft, Tags, LayoutList, Image as ImageIcon, Search, User, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
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
          setError("Error fetching blog details");
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
        setError(response.error || "Failed to create blog post");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout title="Edit Blog Post">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 max-w-6xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin/blog">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Edit Article</h2>
              <p className="text-sm text-gray-500">Update your piece of content</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Type className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">Article Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 block">Featured Cover Image</Label>
                    <div className="flex flex-col gap-4">
                      {formData.featuredImage ? (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border shadow-sm">
                          <img src={formData.featuredImage} alt="Cover" className="object-cover w-full h-full" />
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({...prev, featuredImage: ''}))} 
                            className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-full p-2 transition-colors shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary/50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="h-8 w-8 text-primary/50 mb-2" />
                            <p className="text-sm text-gray-600 font-medium font-sans">Click to upload cover photo</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG or WebP (Max 2MB)</p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({...prev, featuredImage: reader.result as string}));
                              };
                              reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Article Title <span className="text-rose-500">*</span></Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. 10 Tax Saving Tips for MSMEs in 2026"
                      className="h-12 text-lg font-medium px-4 bg-gray-50/50 focus:bg-white rounded-xl transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-sm font-semibold text-gray-700">Short Excerpt <span className="text-rose-500">*</span></Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="A brief summary that will appear on blog preview cards..."
                      className="resize-none bg-gray-50/50 focus:bg-white rounded-xl transition-all p-4"
                      rows={3}
                      required
                    />
                    <p className="text-xs text-gray-500 text-right">Recommended: 120-160 characters</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <AlignLeft className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">Main Content</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <RichTextEditor
                      content={formData.content}
                      onChange={(html) => setFormData(prev => ({...prev, content: html}))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <Search className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">SEO & Google Ranking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle" className="text-sm font-semibold text-gray-700">SEO Title</Label>
                    <Input
                      id="seoTitle" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange}
                      placeholder="Title specifically optimized for search engines..."
                      className="bg-gray-50/50 focus:bg-white rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription" className="text-sm font-semibold text-gray-700">Meta Description</Label>
                    <Textarea
                      id="metaDescription" name="metaDescription" value={formData.metaDescription} onChange={handleInputChange}
                      placeholder="Catchy description that shows up in Google results..."
                      className="resize-none bg-gray-50/50 focus:bg-white rounded-xl p-4" rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords" className="text-sm font-semibold text-gray-700">Keywords Focus</Label>
                    <Input
                      id="keywords" name="keywords" value={formData.keywords} onChange={handleInputChange}
                      placeholder="startup, taxes, funding (comma separated)"
                      className="bg-gray-50/50 focus:bg-white rounded-xl h-11"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm overflow-hidden">
                 <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <User className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">Author Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                   <div className="space-y-2">
                    <Label htmlFor="authorName" className="text-sm font-semibold text-gray-700">Author Name</Label>
                    <Input
                      id="authorName" name="authorName" value={formData.authorName} onChange={handleInputChange}
                      placeholder="e.g. Adv. John Doe"
                      className="bg-gray-50/50 focus:bg-white rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="authorBio" className="text-sm font-semibold text-gray-700">Author Bio</Label>
                    <Textarea
                      id="authorBio" name="authorBio" value={formData.authorBio} onChange={handleInputChange}
                      placeholder="Expertise, qualifications, and background..."
                      className="resize-none bg-gray-50/50 focus:bg-white rounded-xl p-4" rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* Publishing Controls Sticky Wrapper */}
              <div className="sticky top-24 space-y-6">
                
                <Card className="border-0 shadow-sm overflow-hidden border-t-4 border-t-primary">
                  <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <CardTitle className="text-lg">Publish</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <Button
                      type="button"
                      variant="default"
                      className="w-full rounded-xl py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] hover:shadow-primary/30 transition-all"
                      disabled={isLoading}
                      onClick={(e) => handleSubmit(e, "published")}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Eye className="h-5 w-5 mr-2" />
                          Update Article
                        </>
                      )}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        type="submit" 
                        variant="secondary"
                        className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700" 
                        disabled={isLoading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl border-gray-200 text-gray-500 hover:text-gray-700"
                        asChild
                      >
                        <Link href="/admin/blog">Cancel</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <LayoutList className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-lg">Organization</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-semibold text-gray-700">Set Status</Label>
                      <select
                        id="status"
                        name="status"
                        title="Publication status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full h-11 px-4 border-0 bg-gray-50/50 rounded-xl font-medium focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      >
                        <option value="draft">Draft (Hidden)</option>
                        <option value="published">Published (Live)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g. Finance"
                        className="h-11 bg-gray-50/50 focus:bg-white rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Tags className="h-4 w-4 text-gray-400" /> Tags
                      </Label>
                      <Input
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="tax, savings, smb"
                        className="h-11 bg-gray-50/50 focus:bg-white rounded-xl"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </AdminLayout>
  );
}
