"use client";

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  Users,
  Award,
  Globe,
  CheckCircle,
  Eye,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import anime from "animejs";
import Image from "next/image";
import CompanyTimeline from "@/components/CompanyTimeline";

interface HeroData {
  title?: string;
  subtitle?: string;
}

interface MissionData {
  mission?: {
    title?: string;
    description?: string;
  };
  vision?: {
    title?: string;
    description?: string;
  };
}

interface StatsData {
  years_experience?: string;
  happy_clients?: string;
  projects_completed?: string;
  success_rate?: string;
}

interface AboutPageContent {
  hero?: HeroData;
  mission?: MissionData;
  stats?: StatsData;
}

const StatCard = ({ icon, value, label, className = "", delay = 0 }: { icon: React.ReactNode, value: string, label: string, className?: string, delay?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = parseInt(value) || 0;
  const isNumeric = !isNaN(target);

  useEffect(() => {
    if (!isNumeric) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [target, isNumeric]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`p-8 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:translate-y-[-5px] transition-all duration-300 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter">
        {isNumeric ? `${displayValue}${value.includes('+') ? '+' : ''}` : value}
      </div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-4 py-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {label}
      </div>
    </motion.div>
  );
};

const ExcellenceItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4 py-4 group">
    <div className="w-10 h-10 rounded-full border-2 border-blue-100 flex items-center justify-center flex-shrink-0 group-hover:border-blue-600 transition-colors">
      <CheckCircle className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
    </div>
    <span className="text-lg font-bold text-slate-700 tracking-tight">
      {text}
    </span>
  </div>
);

export default function AboutPage() {
  const [content, setContent] = useState<AboutPageContent>({});
  const [loading, setLoading] = useState(true);
  const [division, setDivision] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user_division");
    setDivision(saved);

    const fetchContent = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_BASE}/content/about`);
        const data = await response.json();
        if (data.success && data.data) {
          setContent(data.data);
        }
      } catch (error) {
        console.error("Error loading about page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (!loading) {
      anime({
        targets: '.js-reveal',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: anime.stagger(150),
        easing: 'easeOutExpo'
      });
    }
  }, [loading]);

  const excellencePoints = division === "taxation" 
    ? [
        "Specialized in GST & Income Tax Advisory",
        "Expert ROC & Corporate Law Compliance",
        "Transparent Audit & Assurance Services",
        "Strategic Financial Planning & Budgeting",
        "Certified Professionals at your service",
        "Accuracy and Integrity in every filing",
        "Timely updates on regulatory changes",
        "Trusted by 500+ Corporate Clients"
      ]
    : [
        "12+ years associated with top banks",
        "2500+ satisfied clients across India",
        "Lowest and affordable interest rates",
        "Fast and hassle-free loan processing",
        "Quick decision-making for timely funding",
        "Tailored strategic financial advice",
        "Commitment to transparency and integrity",
        "Making business financing simple"
      ];

  const primaryColor = division === "taxation" ? "text-emerald-600" : "text-blue-600";
  const primaryBg = division === "taxation" ? "bg-emerald-50" : "bg-blue-50";
  const primaryBorder = division === "taxation" ? "border-emerald-100" : "border-blue-100";
  const primaryIcon = division === "taxation" ? "text-emerald-400" : "text-blue-400";
  const primaryHoverBorder = division === "taxation" ? "group-hover:border-emerald-600" : "group-hover:border-blue-600";
  const primaryHoverText = division === "taxation" ? "group-hover:text-emerald-600" : "group-hover:text-blue-600";

  return (
    <div className={`min-h-screen bg-slate-50 font-sans selection:${division === 'taxation' ? 'bg-emerald-100' : 'bg-blue-100'} italic-none`}>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className={`inline-flex items-center gap-2 px-6 py-2 ${primaryBg} rounded-full border ${primaryBorder} text-[10px] font-black uppercase tracking-[0.4em] ${primaryColor}`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{division === 'taxation' ? 'Regulatory Mastery' : 'Financial Excellence'}</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase"
              >
                Building <br />
                <span className={primaryColor}>{division === 'taxation' ? 'Integrity.' : 'Legacy.'}</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-base md:text-xl text-slate-600 font-medium leading-relaxed max-w-lg"
              >
                {division === 'taxation' 
                  ? "Providing specialized audit, tax compliance, and legal advisory services to ensure your business remains resilient and compliant in a dynamic regulatory landscape."
                  : "Dedicated to delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients across India."}
              </motion.p>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              <StatCard
                icon={<Clock className={`w-8 h-8 ${primaryColor}`} />}
                value="12+"
                label="years experience"
                delay={0.1}
                className={division === 'taxation' ? 'hover:shadow-emerald-200/50' : 'hover:shadow-blue-200/50'}
              />
              <StatCard
                icon={<Users className="w-8 h-8 text-emerald-500" />}
                value={division === 'taxation' ? "1000+" : "2500+"}
                label="Corporate Clients"
                delay={0.2}
                className={division === 'taxation' ? 'hover:shadow-emerald-200/50' : 'hover:shadow-blue-200/50'}
              />
              <StatCard
                icon={<Award className="w-8 h-8 text-amber-500" />}
                value={division === 'taxation' ? "100" : "Lowest"}
                label={division === 'taxation' ? "Accuracy %" : "interest rates"}
                delay={0.3}
                className={division === 'taxation' ? 'hover:shadow-emerald-200/50' : 'hover:shadow-blue-200/50'}
              />
              <StatCard
                icon={<Globe className="w-8 h-8 text-purple-500" />}
                value="Pan"
                label="India"
                delay={0.4}
                className={division === 'taxation' ? 'hover:shadow-emerald-200/50' : 'hover:shadow-blue-200/50'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 relative bg-white/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="p-12 lg:p-16 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col items-start translate-y-12"
            >
              <div className={`w-16 h-16 rounded-2xl ${primaryBg} flex items-center justify-center mb-8 transform group-hover:rotate-12 transition-transform`}>
                <Eye className={`w-8 h-8 ${primaryColor}`} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Our Vision</h2>
              <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed">
                {division === 'taxation' 
                  ? "To be the standard-bearer of fiscal transparency and regulatory excellence, helping businesses navigate the complexities of tax and law with absolute confidence."
                  : "To be the most trusted partner in providing innovative loan consultancy and financial solutions, enabling businesses to unlock sustainable growth."}
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="p-12 lg:p-16 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col items-start"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Our Mission</h2>
              <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed">
                {division === 'taxation' 
                  ? "Safeguarding corporate integrity through meticulous audit practices and strategic compliance management, ensuring every client achieves statutory excellence."
                  : "Empowering businesses to achieve their growth ambitions by providing expert, client-focused loan consultancy. We simplify the complex process of securing capital."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pure Excellence Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20 lg:mb-24">
            <h2 className="js-reveal text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
              {division === 'taxation' ? 'Filing Accuracy.' : 'Pure Excellence.'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-4 max-w-6xl mx-auto">
            {excellencePoints.map((point, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 py-4 group"
              >
                <div className={`w-10 h-10 rounded-full border-2 ${primaryBorder} flex items-center justify-center flex-shrink-0 ${primaryHoverBorder} transition-colors group-hover:bg-slate-50`}>
                  <CheckCircle className={`w-5 h-5 ${primaryIcon} ${primaryHoverText} transition-colors`} />
                </div>
                <span className="text-lg font-bold text-slate-700 tracking-tight group-hover:text-slate-900 transition-colors">
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline Section */}
      <CompanyTimeline />

      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-40">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] ${division === 'taxation' ? 'bg-emerald-100' : 'bg-blue-100'} rounded-full blur-[120px]`} 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-50 rounded-full blur-[100px]" 
        />
      </div>
    </div>
  );
}
