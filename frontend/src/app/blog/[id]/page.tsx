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
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { DynamicCTASection } from "@/components/DynamicCTASection";
import { AskExpertSection } from "@/components/AskExpertSection";
import { MotionWrapper } from "@/components/MotionWrapper";

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
  featuredImage?: string;
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
        const response = await apiClient.getBlog(idOrSlug);
        if (response.success && response.data) {
          const data: any = response.data;
          setPost({ ...data, id: data.id || data._id });
        } else {
          setError(response.message || "Blog post not found");
        }
      } catch (err: any) {
        setError("Failed to load blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [idOrSlug]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const getReadTime = (content: string) => {
    if (!content) return "1 min read";
    const words = content.trim().split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Insight Not Found</h2>
        <Button asChild className="bg-blue-600 rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px]">
          <Link href="/blog">Back to Hub</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white italic-none">
      {/* Premium Hero Section */}
      <section className="bg-[#111827] pt-48 pb-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[100px] -ml-48 -mb-48" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl">
            <MotionWrapper direction="up" delay={0.1}>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-3 text-blue-400 hover:text-white mb-12 transition-all group text-[10px] font-black uppercase tracking-[0.4em]"
                >
                  <div className="w-8 h-8 rounded-full border border-blue-400/30 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                  Return to Knowledge Hub
                </Link>
            </MotionWrapper>

            <MotionWrapper direction="up" delay={0.2}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] w-12 bg-blue-500" />
                <span className="px-6 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-[0.3em] backdrop-blur-md">
                  {post.category || "INVESTIGATION"}
                </span>
              </div>
            </MotionWrapper>

            <MotionWrapper direction="up" delay={0.3}>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-12 leading-[0.9] tracking-tighter uppercase max-w-4xl">
                {post.title}
              </h1>
            </MotionWrapper>

            <MotionWrapper direction="up" delay={0.4}>
              <div className="flex flex-wrap items-center gap-10 md:gap-16">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group animate-pulse">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-0.5">Primary Author</p>
                    <p className="text-sm font-black uppercase tracking-tight text-white">{post.author || "ADMIN"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-0.5">Published Date</p>
                    <p className="text-sm font-black uppercase tracking-tight text-white">{formatDate(post.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-0.5">Read Velocity</p>
                    <p className="text-sm font-black uppercase tracking-tight text-white">{post.readTime || getReadTime(post.content || "")}</p>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-32 bg-white relative z-20 -mt-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Content Body */}
            <div className="lg:col-span-8">
              <Card className="border-0 shadow-[0_40px_100px_rgba(0,0,0,0.06)] rounded-[3.5rem] overflow-hidden bg-white mb-16">
                {post.featuredImage && (
                  <div className="aspect-video w-full relative">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-20" />
                  </div>
                )}
                
                <CardContent className="p-10 md:p-20">
                  <div className="prose prose-xl prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-slate-700 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-slate-900 prose-img:rounded-[2rem] text-slate-800">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: post.content || "<p>Analyzing intelligence data...</p>",
                      }}
                    />
                  </div>

                  {post.tags && (
                    <div className="mt-20 pt-12 border-t border-slate-50 flex flex-wrap gap-3">
                      {post.tags.map((tag, i) => (
                        <div key={i} className="flex items-center gap-2 px-6 py-2 bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 rounded-full border border-slate-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-default">
                          <Tag className="w-3.5 h-3.5" />
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <AskExpertSection />
            </div>

            {/* Sidebar Tools */}
            <div className="lg:col-span-4 space-y-12">
              <div className="bg-slate-50 p-12 rounded-[3rem] sticky top-32 border border-slate-100/50">
                <div className="flex flex-col gap-2 mb-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Distribution</span>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Share Insight</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Facebook", icon: Facebook, color: "blue", bg: "bg-blue-600" },
                    { label: "Twitter", icon: Twitter, color: "sky", bg: "bg-sky-500" },
                    { label: "LinkedIn", icon: Linkedin, color: "indigo", bg: "bg-indigo-600" }
                  ].map((social, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full justify-start gap-5 h-16 rounded-2xl border-white bg-white hover:shadow-xl hover:shadow-blue-500/10 transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl ${social.bg} text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg`}>
                        <social.icon className="w-4 h-4" />
                      </div>
                      <span className="font-black uppercase tracking-widest text-[11px] text-slate-600">{social.label}</span>
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-5 h-16 rounded-2xl border-white bg-white hover:shadow-xl hover:shadow-slate-500/10 transition-all group mt-6"
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-active:scale-90 transition-all">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-[11px] text-slate-600">Secure Link</span>
                  </Button>
                </div>

                <div className="mt-16 pt-12 border-t border-slate-200/50 flex flex-col items-center text-center italic-none">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-3 underline underline-offset-8 decoration-blue-500/20">Market Support</h4>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[200px] mb-8">Direct consultation for complex financial analysis available 24/7.</p>
                  <Button asChild variant="link" className="text-blue-600 font-black uppercase tracking-widest text-[10px] no-underline hover:no-underline flex items-center gap-2 group">
                    <Link href="/contact" className="flex items-center gap-3">
                      CONTACT US <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <DynamicCTASection />
    </div>
  );
}
