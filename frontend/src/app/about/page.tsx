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
import anime from "animejs";
import Image from "next/image";

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

const StatCard = ({ icon, value, label, className = "" }: { icon: React.ReactNode, value: string, label: string, className?: string }) => (
  <div className={`p-8 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:translate-y-[-5px] transition-all duration-300 ${className}`}>
    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tighter">
      {value}
    </div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
      {label}
    </div>
  </div>
);

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

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Story...</p>
        </div>
      </div>
    );
  }

  const excellencePoints = [
    "12+ years associated with top banks",
    "2500+ satisfied clients across India",
    "Lowest and affordable interest rates",
    "Fast and hassle-free loan processing",
    "Quick decision-making for timely funding",
    "Tailored strategic financial advice",
    "Commitment to transparency and integrity",
    "Making business financing simple"
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 italic-none">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Column */}
            <div className="js-reveal space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-tighter">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Established 2012</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase">
                The Mark <br />
                <span className="italic text-blue-600">Legacy.</span>
              </h1>
              
              <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
                Dedicated to delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients across India.
              </p>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="js-reveal grid grid-cols-2 gap-6 md:gap-8">
              <StatCard 
                icon={<Clock className="w-8 h-8 text-blue-600" />}
                value="12+"
                label="years experience"
              />
              <StatCard 
                icon={<Users className="w-8 h-8 text-emerald-500" />}
                value="2500+"
                label="satisfied clients"
              />
              <StatCard 
                icon={<Award className="w-8 h-8 text-amber-500" />}
                value="Lowest"
                label="interest rates"
              />
              <StatCard 
                icon={<Globe className="w-8 h-8 text-purple-500" />}
                value="Hassle-free"
                label="process"
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
            <div className="js-reveal p-12 lg:p-16 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col items-start translate-y-12">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-8">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Our Vision</h2>
              <p className="text-xl text-slate-500 font-medium leading-[1.6]">
                "To be the most trusted partner in providing innovative loan consultancy and financial solutions, enabling businesses to unlock sustainable growth."
              </p>
            </div>

            {/* Mission */}
            <div className="js-reveal p-12 lg:p-16 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col items-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Our Mission</h2>
              <p className="text-xl text-slate-500 font-medium leading-[1.6]">
                Empowering businesses to achieve their growth ambitions by providing expert, client-focused loan consultancy. We simplify the complex process of securing capital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pure Excellence Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20 lg:mb-24">
            <h2 className="js-reveal text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Pure Excellence.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-4 max-w-6xl mx-auto">
            {excellencePoints.map((point, i) => (
              <div key={i} className="js-reveal">
                <ExcellenceItem text={point} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-100 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-50 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
