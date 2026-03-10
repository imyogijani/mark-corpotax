"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Clock,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { SubscribeCta } from "@/components/subscribe-cta";
import { AskExpertSection } from "@/components/AskExpertSection";

// Interface for Blog Post
interface BlogPost {
  id: string;
  _id?: string;
  title: string;
  content: string;
  excerpt: string;
  author?: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
  featuredImage?: string; // Optional image URL
  slug?: string;
  tags?: string[];
  readTime?: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const idOrSlug = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!idOrSlug) return;

      try {
        setLoading(true);
        // Use apiClient to fetch the blog post
        const response = await apiClient.getBlog(idOrSlug);

        if (response.success && response.data) {
          const data: any = response.data;
          setPost({
            ...data,
            id: data.id || data._id, // Normalize ID
          });
          setError(null);
        } else {
          // Fallback or error if not found
          setError(response.message || "Blog post not found");
        }
      } catch (err: any) {
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [idOrSlug]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Estimate read time if not provided
  const getReadTime = (content: string) => {
    if (!content) return "1 min read";
    const wpm = 200;
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return `${time} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Article Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            {error ||
              "The article you are looking for does not exist or has been removed."}
          </p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Premium Hero Section */}
      <div className="bg-slate-900 border-b border-white/5 text-white relative overflow-hidden pt-40 pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px] -ml-48 -mb-48" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-all group text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
              Back to Knowledge Hub
            </Link>

            {post.category && (
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] bg-blue-500" />
                <span className="px-4 py-1.5 bg-blue-600/20 backdrop-blur-md border border-blue-500/20 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-[0.25em]">
                  {post.category}
                </span>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tighter uppercase">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-slate-400 text-xs font-bold uppercase tracking-[0.15em]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[9px] font-black">Author</span>
                  <span className="text-white">{post.author || "Admin"}</span>
                </div>
              </div>
              
              <div className="h-10 w-px bg-slate-800 hidden md:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[9px] font-black">Published</span>
                  <span className="text-white">{formatDate(post.createdAt)}</span>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800 hidden md:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-500 text-[9px] font-black">Reading Time</span>
                  <span className="text-white">{post.readTime || getReadTime(post.content || "")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16 relative z-30">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card className="border border-slate-100 shadow-[0_40px_80px_rgba(0,0,0,0.06)] rounded-[3rem] overflow-hidden mb-12 bg-white">
              {post.featuredImage && (
                <div className="aspect-video w-full relative">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
                </div>
              )}
              <CardContent className="p-8 md:p-16">
                <div className="prose prose-xl prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium prose-a:text-blue-600 prose-strong:text-slate-900">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.content || "<p>No content available.</p>",
                    }}
                  />
                </div>

                {/* Tags Integrated */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-16 pt-10 border-t border-slate-50 flex flex-wrap gap-3">
                    {post.tags.map((tag, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-full border border-slate-100 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <AskExpertSection />
            <div className="mb-20">
              <SubscribeCta />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-slate-50 sticky top-32">
              <div className="flex flex-col gap-2 mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Spread Knowledge</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Share Article</h3>
                <div className="h-1 w-8 bg-blue-100 rounded-full" />
              </div>
              
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-4 h-14 rounded-2xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all border-slate-100 group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm">Facebook</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start gap-4 h-14 rounded-2xl hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200 transition-all border-slate-100 group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm">Twitter</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-4 h-14 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all border-slate-100 group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm">LinkedIn</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-4 h-14 rounded-2xl hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all border-slate-100 group shadow-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm">Copy Link</span>
                </Button>
              </div>

              {/* Sidebar Helper */}
              <div className="mt-10 pt-10 border-t border-slate-50">
                 <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                    <h4 className="text-sm font-black uppercase tracking-widest text-blue-700 mb-2">Need Help?</h4>
                    <p className="text-[13px] text-slate-600 font-medium mb-4">Contact our support for direct financial assistance.</p>
                    <Link href="/contact" className="text-xs font-black text-blue-600 flex items-center gap-2 hover:gap-3 transition-all">
                      CONTACT US <ArrowRight className="w-3 h-3" />
                    </Link>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
