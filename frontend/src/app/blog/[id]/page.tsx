import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  BarChart2,
  PieChart,
  DollarSign,
} from "lucide-react";
import type { Metadata } from "next";
import { SubscribeCta } from "@/components/subscribe-cta";

interface BlogDetailProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Blog Details",
  description:
    "Read the full article and insights about financial planning and business strategies.",
};

const categories = [
  { name: "Agency", count: 12 },
  { name: "E-commerce", count: 8 },
  { name: "Business", count: 15 },
];

const recentPosts = [
  {
    title: "Revolutionizing businesses for the digital age",
    date: "October 31, 2023",
    icon: <DollarSign className="w-12 h-12 text-primary" />,
  },
  {
    title: "Unlocking the potential of your business data",
    date: "October 28, 2023",
    icon: <BarChart2 className="w-12 h-12 text-primary" />,
  },
  {
    title: "Navigating challenges in each business growth",
    date: "October 25, 2023",
    icon: <PieChart className="w-12 h-12 text-primary" />,
  },
];

const tags = ["Best Blogs", "Consultation", "Legal", "Services", "Strategy"];

const comments = [
  {
    id: 1,
    name: "Suara Isbita",
    date: "January 10, 2023",
    message:
      "When first time I headed the direction and then how heart he turned a game. Within about have chance because.",
    avatar: <User className="w-10 h-10 text-primary" />,
    replies: [
      {
        id: 2,
        name: "Nick Jonas",
        date: "January 15, 2023",
        message:
          "When first time I headed the direction and then how heart he turned a game. Within about have chance because.",
        avatar: <User className="w-10 h-10 text-primary" />,
      },
    ],
  },
  {
    id: 3,
    name: "Dan etnuk",
    date: "January 20, 2023",
    message:
      "When first time I headed the direction and then how heart he turned a game. Within about have chance because.",
    avatar: <User className="w-10 h-10 text-primary" />,
    replies: [],
  },
];

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  // Await params to extract id for future use if needed
  const resolvedParams = await params;
  void resolvedParams.id;
  return (
    <div className="blog-detail-page-container animate-fade-in">
      {/* Page Header */}
      <section className="page-header-section py-16 md:py-24 bg-gradient-to-br from-[#2c3e50] to-[#34495e] text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Blog Details
          </h1>
          <nav className="flex items-center justify-center space-x-2 text-sm">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <span>&gt;</span>
            <span>Blog Details</span>
          </nav>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-8 w-4 h-4 bg-white rounded-full opacity-20"></div>
        <div className="absolute bottom-1/3 left-16 w-6 h-6 bg-white rounded-full opacity-30"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-primary rounded-full"></div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Blog Content */}
            <div className="lg:col-span-2">
              <Card className="bg-white overflow-hidden">
                {/* Featured Image */}
                <div className="flex items-center justify-center h-80 w-full bg-primary/10">
                  <BarChart2 className="w-32 h-32 text-primary" />
                </div>

                <CardContent className="p-8">
                  {/* Meta Info */}
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>By Admin</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>October 31, 2023</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Comments (5)</span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                    Industry slam Women We make small
                  </h1>

                  {/* Article Content */}
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Aliquam erat elit, pretium vitae ligula nec, pellentesque
                      aliquam dui. Proin venenatis purus pretium accumsan. Donec
                      tincidunt fermentum gravida accumsan cursus interdum
                      luctus eget dapibus lorem. Mauris luctus ligula sed elit
                      rutrum rutrum. Donec at molestie mi, at rutrum mauris. Sed
                      convallis ipsum quis mi rutrum.
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Aliquam erat elit, pretium vitae ligula nec, pellentesque
                      aliquam dui. Proin venenatis purus pretium accumsan. Donec
                      tincidunt fermentum gravida accumsan cursus interdum
                      luctus eget dapibus lorem.
                    </p>

                    {/* Two Column Section */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">
                          Best Implementation
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Proin enim diam, blandit sit amet metus mollis, maxim
                          pretium libero. Vivamus volutpat lorem lectus, eget
                          dictum neque molestie eu. Praesent mollis ante eu
                          magna in euismod.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-primary">
                          Follow Your Concept
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Donec accumsan velit id odio congue porta. Vestibulum
                          consequat dolor quis odio. Mauris eleifend lorem non
                          mauris blandit, et rutrum libero molestie.
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Aliquam erat elit, pretium vitae ligula nec, pellentesque
                      aliquam dui. Proin venenatis purus pretium accumsan. Donec
                      tincidunt fermentum gravida accumsan cursus interdum
                      luctus eget dapibus lorem. Mauris luctus ligula sed elit
                      rutrum rutrum. Donec at molestie mi, at rutrum mauris. Sed
                      convallis ipsum quis mi rutrum.
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Aliquam erat elit, pretium vitae ligula nec, pellentesque
                      aliquam dui. Proin venenatis purus pretium accumsan. Donec
                      tincidunt fermentum gravida accumsan cursus interdum
                      luctus eget dapibus lorem. Mauris luctus ligula sed elit
                      rutrum rutrum. Donec at molestie mi, at rutrum mauris. Sed
                      convallis ipsum quis mi rutrum.
                    </p>
                  </div>

                  {/* Tags and Social Share */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">Tags:</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Best Blogs
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Consultation
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Legal
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">Share:</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          <Facebook className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          <Instagram className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="bg-white mt-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Comments ({comments.length + 1})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          {comment.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h4 className="font-semibold">{comment.name}</h4>
                            <span className="text-sm text-muted-foreground">
                              {comment.date}
                            </span>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-primary p-0 h-auto"
                            >
                              REPLY
                            </Button>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {comment.message}
                          </p>
                        </div>
                      </div>

                      {/* Replies */}
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="ml-16 flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            {reply.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h4 className="font-semibold">{reply.name}</h4>
                              <span className="text-sm text-muted-foreground">
                                {reply.date}
                              </span>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-primary p-0 h-auto"
                              >
                                REPLY
                              </Button>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {reply.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Comment Form */}
              <Card className="bg-white mt-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    Leave a comment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input placeholder="Your Name*" className="w-full" />
                      </div>
                      <div>
                        <Input
                          placeholder="Your Email*"
                          type="email"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input placeholder="Phone number" className="w-full" />
                      </div>
                      <div>
                        <Input placeholder="Subject" className="w-full" />
                      </div>
                    </div>
                    <div>
                      <Textarea
                        placeholder="Message"
                        rows={6}
                        className="w-full"
                      />
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                      Submit Now
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Search */}
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-2">
                    <Input placeholder="Search..." className="flex-1" />
                    <Button size="sm" className="px-4">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    Categories
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
                    Recent Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <div
                      key={index}
                      className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                        {post.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm leading-tight mb-2 hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Work with us CTA */}
              <Card className="bg-primary text-white overflow-hidden relative">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Work with us</h3>
                  <p className="text-sm mb-4 opacity-90">
                    All your business solutions and consulting needs in one
                    convenient, accessible place
                  </p>
                  <Button variant="secondary" size="sm">
                    Contact us
                  </Button>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Tags</CardTitle>
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
      <SubscribeCta />
    </div>
  );
}
