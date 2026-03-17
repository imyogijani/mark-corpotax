"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
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
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function NewBlogPage() {
  const router = useRouter();
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

      const response = await apiClient.createBlog(blogData);

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
    <AdminLayout title="Create Blog Post">
      <div className="max-w-[1400px] mx-auto pb-32 relative">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 border-b border-gray-100 pb-12">
            <div className="space-y-4">
              <Link href="/admin/blog" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:translate-x-[-4px] transition-transform">
                <ArrowLeft size={14} strokeWidth={3} />
                Back to Archive
              </Link>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                Create New <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Article</span>
              </h1>
              <p className="text-gray-500 text-lg font-medium mt-1">Draft your next masterpiece and publish to the world.</p>
            </div>

            <div className="flex items-center gap-4">
               <Button
                type="button"
                variant="outline"
                className="h-16 px-8 rounded-2xl border-gray-200 hover:bg-gray-50 text-gray-600 font-black uppercase tracking-widest text-xs border-2"
                asChild
              >
                <Link href="/admin/blog">Discard</Link>
              </Button>
               <Button
                type="button"
                onClick={(e) => handleSubmit(e, "draft")}
                disabled={isLoading}
                className="h-16 px-8 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-black uppercase tracking-widest text-xs border-0"
              >
                <Save className="h-4 w-4 mr-2" />
                Save to Vault
              </Button>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
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
                  <div className="h-2 bg-gradient-to-r from-primary to-blue-600" />
                  <CardHeader className="pt-10 px-10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
                        <Type className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-2xl font-black tracking-tight">Vitals & Cover</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-10 px-10 pb-10">
                    {/* Featured Image Section */}
                    <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Featured Backdrop</Label>
                      <div className="relative group">
                        {formData.featuredImage ? (
                          <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
                            <img src={formData.featuredImage} alt="Cover" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                               <button 
                                type="button" 
                                onClick={() => setFormData(prev => ({...prev, featuredImage: ''}))} 
                                className="bg-white text-rose-600 rounded-2xl px-6 py-3 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 size={16} />
                                Remove Image
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full aspect-video border-4 border-dashed border-gray-200 rounded-[2.5rem] cursor-pointer bg-gray-50/50 hover:bg-white hover:border-primary/50 transition-all duration-300 group shadow-inner">
                            <div className="flex flex-col items-center justify-center p-10 text-center">
                              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
                                <ImageIcon className="h-10 w-10 text-primary" />
                              </div>
                              <p className="text-xl font-black text-gray-900 tracking-tight">Upload Production Cover</p>
                              <p className="text-gray-500 mt-2 font-medium">Drag and drop or click to browse (Max 2MB)</p>
                              <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {['WEBP', 'JPEG', 'PNG'].map(ext => (
                                  <span key={ext} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-black text-gray-400">{ext}</span>
                                ))}
                              </div>
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

                    <div className="space-y-4">
                      <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Heroic Title</Label>
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
                      <Label htmlFor="excerpt" className="text-[10px] font-black uppercase tracking-widest text-gray-400">The Hook (Excerpt)</Label>
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
                      <CardTitle className="text-2xl font-black tracking-tight">Primary Narrative</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-10 pb-10">
                    <div className="rounded-[2rem] overflow-hidden border-2 border-gray-100 bg-white shadow-inner">
                      <RichTextEditor
                        content={formData.content}
                        onChange={(html) => setFormData(prev => ({...prev, content: html}))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Authority Section */}
                <Card className="border-0 shadow-2xl shadow-gray-200/50 bg-white/70 backdrop-blur-md rounded-[3rem] overflow-hidden">
                  <CardHeader className="pt-10 px-10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-2xl font-black tracking-tight">Authorship Signature</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-10 px-10 pb-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                        <Label htmlFor="authorName" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Creator Identity</Label>
                        <Input
                          id="authorName" name="authorName" value={formData.authorName} onChange={handleInputChange}
                          placeholder="Adv. Expert Name"
                          className="bg-gray-50/50 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl h-14 font-black"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="authorBio" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Identity Bio</Label>
                        <Input
                          id="authorBio" name="authorBio" value={formData.authorBio} onChange={handleInputChange}
                          placeholder="Professional Credentials"
                          className="bg-gray-50/50 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-2xl h-14 font-medium"
                        />
                      </div>
                     </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-10">
                {/* Control Panel Stickyness */}
                <div className="sticky top-24 space-y-10">
                  
                  {/* Deployment Control */}
                  <Card className="border-0 shadow-2xl shadow-primary/10 bg-gradient-to-br from-indigo-900 via-gray-900 to-black rounded-[2.5rem] overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="pt-10 px-8 pb-4">
                      <CardTitle className="text-xl font-black text-white tracking-widest uppercase">Deployment</CardTitle>
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
                            Launch to Public
                          </>
                        )}
                      </Button>
                      
                      <div className="flex flex-col gap-3">
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-between border border-white/5">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibility</p>
                            <p className="text-sm font-black text-white">{formData.status === 'published' ? 'Public Domain' : 'Encrypted Draft'}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${formData.status === 'published' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-amber-500 shadow-amber-500/50'} shadow-lg animate-pulse`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimization Control */}
                  <Card className="border-0 shadow-2xl shadow-gray-200/50 bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="pt-8 px-8 pb-2">
                       <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                          <SearchIcon size={18} />
                        </div>
                        <CardTitle className="font-black text-sm uppercase tracking-widest text-gray-400">Ranking Engine</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8 pb-8">
                       <div className="space-y-4">
                        <Label htmlFor="seoTitle" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alt Search Title</Label>
                        <Input
                          id="seoTitle" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange}
                          placeholder="Optimized slug/title..."
                          className="bg-gray-100/5 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-xl h-12 font-bold"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label htmlFor="metaDescription" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Search Snippet</Label>
                        <Textarea
                          id="metaDescription" name="metaDescription" value={formData.metaDescription} onChange={handleInputChange}
                          placeholder="The preview description for search results..."
                          className="resize-none bg-gray-100/5 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-xl p-4 text-sm font-medium h-24"
                        />
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
                        <CardTitle className="font-black text-sm uppercase tracking-widest text-gray-400">Taxonomy</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 px-8 pb-8">
                      <div className="space-y-4">
                        <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sphere / Category</Label>
                        <Input
                          id="category" name="category" value={formData.category} onChange={handleInputChange}
                          placeholder="e.g. Finance"
                          className="h-12 bg-gray-100/5 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-xl font-bold"
                        />
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="tags" className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-between">
                          <span>Metadata Tags</span>
                          <Tags size={14} className="text-gray-300" />
                        </Label>
                        <Input
                          id="tags" name="tags" value={formData.tags} onChange={handleInputChange}
                          placeholder="tax, finance, startup"
                          className="h-12 bg-gray-100/5 border-0 focus:bg-white focus:ring-4 focus:ring-primary/5 rounded-xl font-medium"
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
    </AdminLayout>
  );
}
