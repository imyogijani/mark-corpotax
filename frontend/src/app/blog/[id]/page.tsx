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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-300 hover:text-white mb-8 transition-colors group text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          <div className="max-w-4xl">
            {post.category && (
              <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-6">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center border border-slate-600">
                  <User className="w-4 h-4" />
                </div>
                <span>{post.author || "Admin"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime || getReadTime(post.content || "")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden mb-12 bg-white">
              {post.featuredImage && (
                <div className="h-64 md:h-96 w-full relative">
                  {/* Standard img tag for external urls usually easier than Image for dynamics */}
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600">
                  {/* 
                               Rendering HTML content. 
                            */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.content || "<p>No content available.</p>",
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-12">
                {post.tags.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-default"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </div>
                ))}
              </div>
            )}

            <SubscribeCta />
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Share this article
              </h3>
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                >
                  <Facebook className="w-4 h-4" /> Share on Facebook
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200 transition-colors"
                >
                  <Twitter className="w-4 h-4" /> Share on Twitter
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> Share on LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  <Share2 className="w-4 h-4" /> Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
