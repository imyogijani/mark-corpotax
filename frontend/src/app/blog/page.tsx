"use client";

import { useEffect, useState } from "react";
import { contentService } from "@/lib/content-service";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  FileText,
  BarChart2,
  PieChart,
  DollarSign,
  TrendingUp,
  Sparkles,
  Search,
  ChevronRight,
} from "lucide-react";

import FloatingGraffiti from "@/components/FloatingGraffiti";
import { MotionWrapper } from "@/components/MotionWrapper";
import { AskExpertSection } from "@/components/AskExpertSection";
import { Input } from "@/components/ui/input";

interface BlogPost {
  id: string;
  _id?: string;
  title: string;
  excerpt: string;
  author: string;
  slug: string;
  category: string;
  createdAt: string;
  featuredImage?: string;
}

const getCategoryIcon = (category: string, colorClass: string): React.ReactNode => {
  switch (category) {
    case 'Business': return <BarChart2 className={`w-12 h-12 ${colorClass}`} />;
    case 'Analytics': return <TrendingUp className={`w-12 h-12 ${colorClass}`} />;
    case 'Finance': return <DollarSign className={`w-12 h-12 ${colorClass}`} />;
    case 'Strategy': return <PieChart className={`w-12 h-12 ${colorClass}`} />;
    default: return <FileText className={`w-12 h-12 ${colorClass}`} />;
  }
};

const defaultCategories = [
  { name: "Business", count: 12 },
  { name: "Finance", count: 8 },
  { name: "Tax Planning", count: 15 },
];

const defaultTags = [
  "Finance",
  "Business",
  "Tax Planning",
  "Loans",
  "Investment",
  "MSME",
];

export default function BlogPage() {
  const [division, setDivision] = useState<string>("finance");

  useEffect(() => {
    const handleSync = () => {
      setDivision(localStorage.getItem("user_division") || "finance");
    };
    handleSync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("division-change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("division-change", handleSync);
    };
  }, []);

  const themeTheme = division === 'taxation' ? {
    text: 'text-emerald-600',
    textLight: 'text-emerald-500',
    textFocus: 'group-focus-within:text-emerald-400',
    ring: 'focus:ring-emerald-500/20',
    border: 'focus:border-emerald-500/50',
    gradient: 'from-emerald-600 to-teal-500',
    gradientHover: 'hover:from-emerald-500 hover:to-teal-400',
    shadow: 'shadow-[0_20px_50px_rgba(16,185,129,0.2)]',
    boxHover: 'group-hover:bg-emerald-600 group-hover:border-emerald-500',
    bgLight: 'bg-emerald-100/30',
    bgDark: 'bg-emerald-50/30',
    activeTab: 'bg-emerald-600 border-emerald-500 shadow-emerald-500/20 text-white scale-[1.02]',
    btnSelect: 'hover:bg-emerald-600 hover:text-white focus:bg-emerald-600 focus:text-white',
    progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    bgSolid: 'bg-emerald-600',
    bgHoverSolid: 'hover:bg-emerald-600',
    borderSolid: 'border-emerald-600',
    hoverBorderSolid: 'hover:border-emerald-600',
    badgeBg: 'bg-emerald-50',
    lightBorder: 'border-emerald-100'
  } : {
    text: 'text-blue-600',
    textLight: 'text-blue-500',
    textFocus: 'group-focus-within:text-blue-400',
    ring: 'focus:ring-blue-500/20',
    border: 'focus:border-blue-500/50',
    gradient: 'from-blue-600 to-cyan-500',
    gradientHover: 'hover:from-blue-500 hover:to-cyan-400',
    shadow: 'shadow-[0_20px_50px_rgba(37,99,235,0.2)]',
    boxHover: 'group-hover:bg-blue-600 group-hover:border-blue-500',
    bgLight: 'bg-blue-100/30',
    bgDark: 'bg-blue-50/30',
    activeTab: 'bg-blue-600 border-blue-500 shadow-blue-500/20 text-white scale-[1.02]',
    btnSelect: 'hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
    progressBar: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    bgSolid: 'bg-blue-600',
    bgHoverSolid: 'hover:bg-blue-600',
    borderSolid: 'border-blue-600',
    hoverBorderSolid: 'hover:border-blue-600',
    badgeBg: 'bg-blue-50',
    lightBorder: 'border-blue-100'
  };

  const [heroContent, setHeroContent] = useState<Record<string, any>>({});
  const [statsContent, setStatsContent] = useState<Record<string, any>>({});
  const [sidebarContent, setSidebarContent] = useState<Record<string, any>>({});
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [tags, setTags] = useState(defaultTags);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await contentService.getPageContent("blog");
        if (data.hero) setHeroContent(data.hero);
        if (data.stats) setStatsContent(data.stats);
        if (data.sidebar) setSidebarContent(data.sidebar);

        if (data.categories) {
          const transformedCategories = [];
          for (let i = 1; i <= 5; i++) {
            const cat = {
              name: data.categories[`category_${i}_name`],
              count: parseInt(data.categories[`category_${i}_count`]) || 0,
            };
            if (cat.name) transformedCategories.push(cat);
          }
          if (transformedCategories.length > 0) setCategories(transformedCategories);
        }

        if (data.tags) {
          const transformedTags = [];
          for (let i = 1; i <= 8; i++) {
            const tag = data.tags[`tag_${i}`];
            if (tag) transformedTags.push(tag);
          }
          if (transformedTags.length > 0) setTags(transformedTags);
        }

        try {
          const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
          const response = await fetch(`${API_BASE}/blog?status=published`);
          if (response.ok) {
            const blogData = await response.json();
            const blogs = blogData.data?.blogs || blogData.data || [];
            if (Array.isArray(blogs)) {
              const mappedBlogs = blogs.map((b: any) => ({
                ...b,
                id: b.id || b._id,
              }));
              setBlogPosts(mappedBlogs.slice(0, 6));
            }
          }
        } catch (blogError) {
          console.error("Error fetching blog posts:", blogError);
        }
      } catch (error) {
        console.error("Error fetching blog content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const recentPosts = blogPosts.slice(0, 3);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };



  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="blog-page-wrapper overflow-hidden bg-white"
    >
      {/* Premium Hero Section */}
      <section className="relative pt-48 pb-16 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <FloatingGraffiti />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className={`absolute top-0 right-0 w-[800px] h-[800px] ${themeTheme.bgLight} rounded-full blur-[120px] -mr-64 -mt-64`} 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className={`absolute bottom-0 left-0 w-[600px] h-[600px] ${themeTheme.bgDark} rounded-full blur-[100px] -ml-48 -mb-48`} 
          />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <MotionWrapper direction="up" delay={0.1}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border ${themeTheme.lightBorder} shadow-[0_10px_30px_rgba(37,99,235,0.08)] ${themeTheme.text} text-[10px] font-black uppercase tracking-[0.4em] mb-10`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Knowledge Hub</span>
              </motion.div>
            </MotionWrapper>

            <MotionWrapper direction="up" delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-10">
                Financial <br />
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={themeTheme.text}
                >
                  Insights.
                </motion.span>
              </h1>
            </MotionWrapper>

            <MotionWrapper direction="up" delay={0.3}>
              <p className="text-base md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed mb-8 italic-none">
                {heroContent.subtitle ||
                  "Stay updated with the latest insights, trends, and news in the world of finance and business."}
              </p>
            </MotionWrapper>


          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="pt-16 pb-32 bg-white relative">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header Section above grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-20 border-b border-slate-50 pb-8"
          >
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Latests Insights</h2>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
               <motion.div 
                 animate={{ scale: [1, 1.5, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className={`w-2 h-2 rounded-full ${themeTheme.bgSolid}`} 
               />
               <span>{blogPosts.length} total articles</span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Blog Post List */}
            <div className="lg:col-span-8 space-y-12">

              {blogPosts.length > 0 ? (
                blogPosts.map((post, index) => (
                  <motion.div
                    key={post.id || post._id || index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className={`group bg-white border-0 rounded-[3.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(37,99,235,0.12)] transition-all duration-700 overflow-hidden relative border border-transparent hover:${themeTheme.lightBorder}`}>
                      <div className="flex flex-col md:flex-row min-h-[380px]">
                        {/* Visual Area */}
                        <div className="md:w-[40%] relative bg-[#111827] overflow-hidden flex items-center justify-center border-r border-[#111827]">
                          <motion.div 
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ duration: 0.7 }}
                            className="transition-all duration-700 opacity-60"
                          >
                            {getCategoryIcon(post.category, themeTheme.text)}
                          </motion.div>
                          <div className="absolute top-10 left-10">
                            <span className={`px-6 py-2 bg-white/10 backdrop-blur-md ${themeTheme.text} text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg border border-white/10`}>
                              {post.category || "General"}
                            </span>
                          </div>
                          <div className={`absolute inset-0 ${themeTheme.bgSolid}/10 opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>

                        {/* Content Area */}
                        <div className="md:w-[60%] p-10 lg:p-14 flex flex-col justify-between italic-none">
                          <div>
                            <div className="flex items-center gap-6 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                              <div className="flex items-center gap-2">
                                <User className={`w-3.5 h-3.5 ${themeTheme.textLight}`} /> 
                                <span>{post.author || "Global Head"}</span>
                              </div>
                              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                              <div className="flex items-center gap-2">
                                <Calendar className={`w-3.5 h-3.5 ${themeTheme.textLight}`} />
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                            </div>

                            <Link href={`/blog/${post.slug || post.id || post._id}`}>
                              <h3 className={`text-3xl lg:text-4xl font-black text-slate-900 leading-[1.05] uppercase tracking-tighter mb-6 group-hover:${themeTheme.text} transition-colors`}>
                                {post.title}
                              </h3>
                            </Link>

                            <p className="text-slate-700 font-medium leading-relaxed mb-10 line-clamp-3">
                              {post.excerpt}
                            </p>
                          </div>

                          <Button
                            asChild
                            variant="link"
                            className={`p-0 h-auto ${themeTheme.text} text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-4 w-fit no-underline hover:no-underline group/btn transition-colors`}
                          >
                            <Link href={`/blog/${post.slug || post.id || post._id}`}>
                              Open Investigation
                              <div className={`w-12 h-12 rounded-full border ${themeTheme.lightBorder} flex items-center justify-center transition-all group-hover/btn:${themeTheme.bgSolid} group-hover/btn:text-white group-hover/btn:${themeTheme.borderSolid} group-hover/btn:translate-x-2`}>
                                <ArrowRight className="w-5 h-5" />
                              </div>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100 italic-none"
                >
                  <FileText className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Under Construction</h3>
                  <p className="text-slate-400 font-medium mt-2 tracking-tight uppercase text-xs">Awaiting fresh market intelligence</p>
                </motion.div>
              )}

              {/* Consultation Section - Aligned with sidebar */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <AskExpertSection />
              </motion.div>
            </div>

            {/* Premium Sidebar */}
            <div className="lg:col-span-4 space-y-12">
              
              {/* Search Widget */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 p-10 rounded-[3rem] relative overflow-hidden group"
              >
                <div className="relative z-10 space-y-6">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Intel Search</h4>
                  <div className="relative">
                    <Input 
                      placeholder="Keyword Investigation..." 
                      className={`bg-white border border-slate-200 rounded-2xl h-14 pl-12 shadow-sm placeholder:text-slate-400 font-bold text-sm text-slate-900 ${themeTheme.ring} ${themeTheme.border}`}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  </div>
                </div>
              </motion.div>

              {/* Categories Navigation */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-50 p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
              >
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                  <PieChart className={`w-5 h-5 ${themeTheme.text}`} />
                  Divisions
                </h4>
                <div className="space-y-3">
                  {categories.map((cat, i) => (
                    <motion.div 
                      key={i} 
                      className={`group flex items-center justify-between p-5 bg-slate-50 rounded-2xl cursor-pointer hover:${themeTheme.bgSolid} hover:shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300`}
                    >
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white">{cat.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white transition-transform group-hover:translate-x-1" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recruitment / Expert CTA */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-[#111827] p-12 rounded-[3.5rem] text-white relative overflow-hidden text-center"
              >
                 <div className={`absolute top-0 right-0 w-64 h-64 ${themeTheme.bgSolid}/10 rounded-full blur-[80px] -mr-32 -mt-32`} />
                 <div className="relative z-10">
                    <motion.div 
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm"
                    >
                       <Sparkles className={`w-8 h-8 ${themeTheme.text}`} />
                    </motion.div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-6">Expert <br /> Clarity</h3>
                    <p className="text-slate-400 font-medium text-sm leading-relaxed mb-10 italic-none">Direct connection to senior chartered accountants.</p>
                    <Button asChild className={`w-full bg-white text-slate-900 hover:${themeTheme.bgSolid} hover:text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all`}>
                       <Link href="/contact">Initial Connection</Link>
                    </Button>
                 </div>
              </motion.div>

              {/* Recent Briefs */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white p-10 items-start"
              >
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-10">Recent Briefs</h4>
                <div className="space-y-8">
                  {recentPosts.map((post, i) => (
                    <motion.div key={i} whileHover={{ x: 5 }}>
                      <Link href={`/blog/${post.slug || post.id}`} className="group block">
                         <h5 className={`font-black text-slate-900 uppercase text-sm leading-snug group-hover:${themeTheme.text} transition-colors line-clamp-2 underline-offset-4 decoration-transparent group-hover:underline`}>{post.title}</h5>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
