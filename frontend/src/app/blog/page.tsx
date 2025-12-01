"use client";

import { useEffect, useState } from "react";
import { contentService } from "@/lib/content-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  Search,
  Tag,
  FileText,
  BarChart2,
  PieChart,
  DollarSign,
  TrendingUp,
  BookOpen,
  Users,
} from "lucide-react";
import { DynamicCTASection } from "@/components/DynamicCTASection";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  slug: string;
  category: string;
  createdAt: string;
  featuredImage?: string;
}

// Icon mapping for blog posts
const categoryIcons: Record<string, React.ReactNode> = {
  Business: <BarChart2 className="w-full h-48 text-primary/60" />,
  Analytics: <TrendingUp className="w-full h-48 text-primary/60" />,
  Finance: <DollarSign className="w-full h-48 text-primary/60" />,
  Strategy: <PieChart className="w-full h-48 text-primary/60" />,
  Default: <FileText className="w-full h-48 text-primary/60" />,
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
        // Fetch page content
        const data = await contentService.getPageContent("blog");

        if (data.hero) setHeroContent(data.hero);
        if (data.stats) setStatsContent(data.stats);
        if (data.sidebar) setSidebarContent(data.sidebar);

        // Transform categories from flat keys
        if (data.categories) {
          const transformedCategories = [];
          for (let i = 1; i <= 5; i++) {
            const cat = {
              name: data.categories[`category_${i}_name`],
              count: parseInt(data.categories[`category_${i}_count`]) || 0,
            };
            if (cat.name) transformedCategories.push(cat);
          }
          if (transformedCategories.length > 0)
            setCategories(transformedCategories);
        }

        // Transform tags from flat keys
        if (data.tags) {
          const transformedTags = [];
          for (let i = 1; i <= 8; i++) {
            const tag = data.tags[`tag_${i}`];
            if (tag) transformedTags.push(tag);
          }
          if (transformedTags.length > 0) setTags(transformedTags);
        }

        // Fetch actual blog posts from backend
        try {
          const API_BASE =
            typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL
              ? process.env.NEXT_PUBLIC_API_URL
              : "http://localhost:5000/api";
          const response = await fetch(`${API_BASE}/blog?status=published`);
          if (response.ok) {
            const blogData = await response.json();
            // Backend returns { data: { blogs: [...], pagination: {...} } }
            const blogs = blogData.data?.blogs || blogData.data || [];
            if (Array.isArray(blogs)) {
              setBlogPosts(blogs.slice(0, 6)); // Show max 6 posts
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

  // Get recent posts (last 3)
  const recentPosts = blogPosts.slice(0, 3);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="blog-page-container animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#eaf6fa] via-[#f7fbfd] to-[#f2f8fc] border-b">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {heroContent.title || "Blog & Insights"}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-6">
            {heroContent.subtitle ||
              "Stay updated with the latest insights, trends, and news in the world of finance and business."}
          </p>
          <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 gap-4 w-full max-w-xs">
              <FileText className="text-primary" size={64} />
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {statsContent.stat_1_value || "50+"}
                </span>
                <span className="block text-muted-foreground">
                  {statsContent.stat_1_label || "Articles Published"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 gap-4 w-full max-w-xs">
              <TrendingUp className="text-primary" size={64} />
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {statsContent.stat_2_value || "10K+"}
                </span>
                <span className="block text-muted-foreground">
                  {statsContent.stat_2_label || "Monthly Readers"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 gap-4 w-full max-w-xs">
              <BarChart2 className="text-primary" size={64} />
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {statsContent.stat_3_value || "Weekly"}
                </span>
                <span className="block text-muted-foreground">
                  {statsContent.stat_3_label || "Fresh Content"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Blog Posts */}
            <div className="lg:col-span-2 space-y-8">
              {blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <Card
                    key={post._id}
                    className="blog-post-card bg-white overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-center h-64 w-full bg-primary/10">
                      {categoryIcons[post.category] || categoryIcons.Default}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.author || "Admin"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                        <Link href={`/blog/${post._id}`}>{post.title}</Link>
                      </h2>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary font-semibold"
                        asChild
                      >
                        <Link href={`/blog/${post._id}`}>
                          Read More <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground">
                    Check back soon for new articles and insights.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Categories */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    {sidebarContent.categories_title || "Categories"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="hover:text-primary transition-colors cursor-pointer">
                        {category.name}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({category.count})
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    {sidebarContent.recent_posts_title || "Recent Posts"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
                      <div
                        key={post._id}
                        className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <Link href={`/blog/${post._id}`}>
                            <h4 className="font-semibold text-sm leading-tight mb-2 hover:text-primary transition-colors cursor-pointer">
                              {post.title}
                            </h4>
                          </Link>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No recent posts available.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Work with us CTA */}
              <Card className="bg-primary text-white overflow-hidden relative">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">
                    {sidebarContent.cta_title || "Work with us"}
                  </h3>
                  <p className="text-sm mb-4 opacity-90">
                    {sidebarContent.cta_description ||
                      "All your business solutions and consulting needs in one convenient, accessible place"}
                  </p>
                  <Button variant="secondary" size="sm" asChild>
                    <Link href="/contact">
                      {sidebarContent.cta_button || "Contact us"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    {sidebarContent.tags_title || "Tags"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 hover:bg-primary hover:text-white transition-colors"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <DynamicCTASection />
    </div>
  );
}
