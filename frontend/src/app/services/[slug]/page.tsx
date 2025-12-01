import { ArrowRight, CheckCircle, Download, FileText, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SubscribeCta } from '@/components/subscribe-cta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    slug: 'wealth-management',
    title: 'Wealth Management',
    description: 'Our holistic approach to wealth management integrates all aspects of your financial life to create a cohesive strategy for long-term growth and preservation.',
    image: 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=2670&auto=format&fit=crop',
    dataAiHint: 'investment chart',
  },
  {
    slug: 'retirement-planning',
    title: 'Retirement Planning',
    description: 'We help you envision your ideal retirement and create a detailed roadmap to get you there, ensuring a secure and comfortable future.',
    image: 'https://images.unsplash.com/photo-1543286386-71314a4769de?q=80&w=2670&auto=format&fit=crop',
    dataAiHint: 'happy senior couple',
  },
  {
    slug: 'investment-advice',
    title: 'Investment Advice',
    description: 'Navigate the complexities of the market with our expert investment advice, tailored to your risk tolerance and financial objectives.',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2670&auto=format&fit=crop',
    dataAiHint: 'stock market graph',
  },
  {
    slug: 'tax-planning',
    title: 'Tax Planning',
    description: 'Minimize your tax liabilities and maximize your savings with our proactive and strategic tax planning services for individuals and businesses.',
    image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2670&auto=format&fit=crop',
    dataAiHint: 'tax documents',
  },
  {
    slug: 'estate-planning',
    title: 'Estate Planning',
    description: 'Protect your legacy and ensure your assets are distributed according to your wishes with our comprehensive estate planning solutions.',
    image: 'https://images.unsplash.com/photo-1563291074-2c8821617495?q=80&w=2670&auto=format&fit=crop',
    dataAiHint: 'family legacy',
  },
  {
    slug: 'insurance-services',
    title: 'Insurance & Risk Management',
    description: 'Safeguard your family and assets against unforeseen events with a robust insurance strategy tailored to your specific needs.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059ee353?q=80&w=2574&auto=format&fit=crop',
    dataAiHint: 'insurance protection',
  },
];

const downloadLinks = [
    { text: 'Wealth Management Brochure.pdf', href: '#' },
    { text: 'Investment Strategies Guide.pdf', href: '#' },
    { text: 'Retirement Planning Checklist.pdf', href: '#' },
];

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = services.find((s) => s.slug === slug);

    if (!service) {
        notFound();
    }

    return (
        <div className="service-detail-page-container animate-fade-in">
        <section className="page-header-section relative bg-secondary/20 py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl gradient-text">
                Services Details
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Home / <span className="text-primary">{service.title}</span>
            </p>
            </div>
        </section>

        <section className="content-section py-16 md:py-20">
            <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-3">
                <div className="service-main-content space-y-8 lg:col-span-2">
                <div className="image-wrapper relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
                    <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        data-ai-hint={service.dataAiHint}
                    />
                    </div>

                    <h2 className="text-3xl font-bold md:text-4xl">{service.title}</h2>

                    <p className="text-lg text-muted-foreground">
                        {service.description} We offer a comprehensive suite of services designed to address every facet of your financial well-being. Our approach is holistic, ensuring that every piece of advice we provide is part of a larger, cohesive strategy tailored to your life.
                    </p>

                    <p className="text-muted-foreground">
                        Navigating the financial landscape can be complex, but with our team of experts, you can be confident that you are making informed decisions. We stay ahead of market trends and regulatory changes to provide you with the most current and effective advice. Whether you are planning for retirement, looking to grow your wealth, or protecting your assets, we are here to guide you every step of the way.
                    </p>
                    
                    <div className="features-grid grid gap-8 py-6 md:grid-cols-2">
                        <Card className="feature-card bg-secondary/20 border-border/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                    Analysis Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">We leverage cutting-edge data analysis to inform our strategies, ensuring your financial plan is built on a solid foundation of research and insights.</p>
                            </CardContent>
                        </Card>
                        <Card className="feature-card bg-secondary/20 border-border/40">
                             <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                    Delivery Customer
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Our commitment to client satisfaction is unwavering. We deliver personalized service and are dedicated to helping you achieve your financial goals.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="expert-matters-section space-y-6">
                         <h3 className="text-2xl font-bold md:text-3xl">Expert test matters</h3>
                        <div className="grid items-center gap-8 md:grid-cols-2">
                            <div className="text-content order-2 md:order-1">
                                <p className="mb-4 text-muted-foreground">
                                Our team of seasoned professionals undergoes rigorous testing and continuous education to stay at the forefront of the financial industry. This commitment to expertise ensures that you receive the highest quality advice and service.
                                </p>
                                <p className="text-muted-foreground">
                                We believe that expertise is not just about knowledge, but also about the ability to apply it effectively to real-world situations. Our experts are not only certified but also have a proven track record of success in helping clients navigate complex financial challenges.
                                </p>
                            </div>
                            <div className="image-content-inner relative h-64 w-full overflow-hidden rounded-lg order-1 md:order-2">
                                <Image
                                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2670&auto=format&fit=crop"
                                alt="Expert team discussion"
                                fill
                                className="object-cover"
                                data-ai-hint="business meeting"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="sidebar space-y-8">
                    <Card className="services-card bg-secondary/20 border-border/40">
                        <CardHeader>
                        <CardTitle>Our Services</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <ul className="space-y-3">
                            {services.map((s) => (
                            <li key={s.slug}>
                                <Link href={`/services/${s.slug}`} className={`flex items-center justify-between rounded-md p-3 transition-colors ${slug === s.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20'}`}>
                                <span>{s.title}</span>
                                <ArrowRight className="h-4 w-4" />
                                </Link>
                            </li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>

                    <Card className="cta-card relative overflow-hidden border-border/40 bg-secondary/40 p-8 text-center">
                         <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/30 opacity-50"></div>
                         <div className="relative z-10">
                            <Phone className="mx-auto mb-4 h-12 w-12 text-primary" />
                            <h3 className="mb-2 text-xl font-semibold">Requesting a Call</h3>
                            <p className="mb-4 text-4xl font-bold">000 555-0129</p>
                            <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 py-2 font-medium transition-colors">
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                         </div>
                    </Card>

                    <Card className="download-card bg-secondary/20 border-border/40">
                        <CardHeader>
                            <CardTitle>Download Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <ul className="space-y-3">
                            {downloadLinks.map((link, index) => (
                            <li key={index}>
                                <Link href={link.href} className="flex items-center text-muted-foreground transition-colors hover:text-primary">
                                <FileText className="mr-3 h-5 w-5 flex-shrink-0" />
                                <span className="flex-grow">{link.text}</span>
                                <Download className="h-5 w-5" />
                                </Link>
                            </li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>
                </aside>
            </div>
            </div>
        </section>
        
        <SubscribeCta />
        </div>
    );
}
