"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import {
  Rocket,
  Building2,
  Globe,
  Network,
  Shield,
  TrendingUp,
  Zap,
  Trophy,
} from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CompanyTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const timelineItems: TimelineItem[] = [
    {
      year: "1991",
      title: "Started Operations",
      description: "Inception of our journey with a vision to consolidate Saudi's financial landscape.",
      icon: <Rocket className="w-5 h-5" />,
    },
    {
      year: "2006-07",
      title: "Multi-Bank Integration",
      description: "Moved to a comprehensive multi-bank platform, expanding choice for new clients.",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      year: "2010-11",
      title: "Regional Expansion",
      description: "Successfully began our strategic expansion beyond Riyadh and Saudi Arabia.",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      year: "2012",
      title: "Network Scaling",
      description: "Launched nationwide data distribution by leveraging advanced agent networks.",
      icon: <Network className="w-5 h-5" />,
    },
    {
      year: "2015",
      title: "Insurance Venture",
      description: "Diversified our portfolio by launching comprehensive corporate insurance solutions.",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      year: "2023",
      title: "Wealth Management",
      description: "Inaugurated our dedicated Wealth Business division for tailored advisory and management.",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      year: "2024",
      title: "Digital & Real Estate",
      description: "Launched our proprietary digital platform and expanded into premier real-estate ventures.",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      year: "2025",
      title: "Scale Milestone",
      description: "Crossed a record 1,000,000 customers, marking our dominance in corporate finance.",
      icon: <Trophy className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.4,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-index") || "0");
          setVisibleItems((prev) => new Set(prev).add(index));

          const content = entry.target.querySelector(".timeline-content");
          const diamond = entry.target.querySelector(".timeline-diamond");

          anime.set(content, { opacity: 0, translateX: -40 });

          anime({
            targets: content,
            opacity: 1,
            translateX: 0,
            duration: 600,
            easing: "easeOutExpo",
            delay: 100,
          });

          anime({
            targets: diamond,
            scale: [0, 1],
            rotate: [45, 0],
            duration: 500,
            easing: "easeOutBack",
          });

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const items = containerRef.current?.querySelectorAll(".timeline-item");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">
            Moments to <br />
            <span className="text-blue-600">Remember</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium mt-6 max-w-2xl mx-auto">
            Three decades of innovation and transformation
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-2xl mx-auto" ref={containerRef}>
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-blue-600 to-blue-300" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {timelineItems.map((item, index) => (
                <div
                  key={index}
                  className="timeline-item"
                  data-index={index}
                >
                  <div className="flex gap-8">
                    {/* Left Content */}
                    <div className="w-5/12 text-right pt-2">
                      <div className="timeline-content">
                        <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">
                          {item.year}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Diamond Icon */}
                    <div className="w-2/12 flex justify-center">
                      <div className="timeline-diamond relative flex items-center justify-center">
                        <div className="w-12 h-12 transformed rotate-45 border-2 border-blue-600 rounded bg-blue-50 flex items-center justify-center shadow-md">
                          <div className="transform -rotate-45 text-blue-600">
                            {item.icon}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="w-5/12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyTimeline;
