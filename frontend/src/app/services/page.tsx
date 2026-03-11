"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, HelpCircle, ShoppingBag, Receipt, ChevronRight } from "lucide-react";
import { servicesData } from "@/constants/servicesData";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem, MotionWrapper } from "@/components/MotionWrapper";
import ScrollWatermark from "@/components/ScrollWatermark";
import Magnetic from "@/components/Magnetic";

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = [
    "Retail / Mortgage",
    "SME / MSME Loans",
    "Unsecured Loans",
    "Taxation Division",
  ] as const;

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 pt-32 pb-24 overflow-hidden gpu relative">
      <ScrollWatermark text="SERVICES" className="top-40 right-10 opacity-30 text-slate-200" />
      <ScrollWatermark text="EXPERTISE" className="bottom-40 left-10 opacity-30 text-slate-200" />

      {/* Background Orbs & Waves */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-100/40 rounded-full animate-blob opacity-40 blur-[120px]" />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-emerald-50/40 rounded-full animate-blob opacity-40 blur-[120px]" 
          style={{ animationDelay: "-7s" }} 
        />
        
        {/* Animated Wave SVGs */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden h-96 opacity-20">
          <svg
            className="absolute bottom-0 w-[200%] h-full animate-wave"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,1.42,1200,0V120H0Z"
              className="fill-blue-600/10"
            ></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <MotionWrapper delay={0.1} direction="down">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-blue-100 shadow-[0_10px_30px_rgba(37,99,235,0.08)] text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
              <Sparkles className="w-4 h-4" />
              <span>Our Expertise</span>
            </div>
          </MotionWrapper>

          <MotionWrapper delay={0.2} direction="up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-10">
              Financial Solutions <br />
              <span className="text-blue-600">For Every Scale</span>
            </h1>
          </MotionWrapper>

          <MotionWrapper delay={0.3} direction="up">
            <p className="text-base md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              From individual dreams to enterprise-level excellence, our multi-division experts provide the precision your financial future demands.
            </p>
          </MotionWrapper>
        </div>

        {/* Division Selection Hub */}
        <div className="grid md:grid-cols-2 gap-8 mb-40 max-w-5xl mx-auto">
          <MotionWrapper delay={0.4} direction="right" className="h-full">
            <button 
              onClick={() => document.getElementById('retail-mortgage')?.scrollIntoView({ behavior: 'smooth' })}
              className="group/hub w-full h-full text-left bg-white border border-slate-100 p-10 md:p-14 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(37,99,235,0.15)] transition-all duration-700 hover:-translate-y-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-50/40 opacity-0 group-hover/hub:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex flex-col gap-10">
                <div className="w-20 h-20 rounded-[2rem] bg-blue-50 text-blue-600 flex items-center justify-center group-hover/hub:bg-blue-600 group-hover/hub:text-white transition-all duration-700 shadow-inner group-hover/hub:rotate-[360deg]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <span className="font-black uppercase tracking-[0.4em] text-[10px] text-blue-600 mb-3 block">Finance Division</span>
                  <h3 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter mb-4">Loans & <br />Mortgages</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">
                    Tailored personal and business credit solutions for your growth.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mt-4">
                  Explore Now <ChevronRight className="w-4 h-4 group-hover/hub:translate-x-2 transition-transform" />
                </div>
              </div>
            </button>
          </MotionWrapper>

          <MotionWrapper delay={0.5} direction="left" className="h-full">
            <button
              onClick={() => document.getElementById('taxation-division')?.scrollIntoView({ behavior: 'smooth' })}
              className="group/hub w-full h-full text-left bg-white border border-slate-100 p-10 md:p-14 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(16,185,129,0.15)] transition-all duration-700 hover:-translate-y-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-50/40 opacity-0 group-hover/hub:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex flex-col gap-10">
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/hub:bg-emerald-600 group-hover/hub:text-white transition-all duration-700 shadow-inner group-hover/hub:rotate-[360deg]">
                  <Receipt className="w-10 h-10" />
                </div>
                <div>
                  <span className="font-black uppercase tracking-[0.4em] text-[10px] text-emerald-600 mb-3 block">Taxation Division</span>
                  <h3 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tighter mb-4">Legal & <br />Compliance</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs">
                    Expert tax planning and regulatory support for your business.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mt-4">
                  Explore Now <ChevronRight className="w-4 h-4 group-hover/hub:translate-x-2 transition-transform" />
                </div>
              </div>
            </button>
          </MotionWrapper>
        </div>

        {/* Categories Loop */}
        <div className="space-y-40">
          {categories.map((cat, catIdx) => {
            const filteredServices = servicesData.filter(s => s.category === cat);
            if (filteredServices.length === 0) return null;

            return (
              <div
                key={cat}
                id={cat.toLowerCase().replace(/[^a-z0-t]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}
                className="scroll-mt-32"
              >
                <MotionWrapper direction="right" className="flex items-end gap-6 mb-16 px-2">
                  <div className="flex flex-col">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-2 leading-none">Category {catIdx + 1}</span>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                      {cat}
                    </h2>
                  </div>
                  <div className="h-[2px] flex-1 bg-slate-200 mb-2 opacity-50" />
                </MotionWrapper>

                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredServices.map((service) => (
                    <StaggerItem key={service.id}>
                      <Link href={`/services/${service.id}`} className="group block h-full">
                        <div className="bg-white rounded-[3rem] overflow-hidden h-full flex flex-col transition-all duration-700 border border-slate-100 group-hover:border-blue-200 shadow-[0_15px_40px_rgba(0,0,0,0.02)] group-hover:shadow-[0_40px_80px_rgba(37,99,235,0.1)] relative">
                          {/* Service Image Section */}
                          <div className="relative h-72 w-full overflow-hidden">
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                            <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="p-10 pt-4 flex flex-col items-start flex-1 relative z-10">
                            <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">
                              {service.name}
                            </h3>
                            
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                              {service.description}
                            </p>
                            
                            <div className="mt-auto pt-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-all">
                              View Details
                              <div className="w-8 h-[2px] bg-slate-200 group-hover:bg-blue-600 group-hover:w-12 transition-all duration-500" />
                            </div>
                          </div>
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/[0.01] transition-colors pointer-events-none" />
                        </div>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            );
          })}
        </div>

        {/* Can't Decide CTA */}
        <MotionWrapper direction="up" className="mt-40">
          <div className="relative bg-slate-900 rounded-[4rem] p-10 md:p-24 overflow-hidden group">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48 transition-all duration-1000 group-hover:scale-125" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] -ml-24 -mb-24 transition-all duration-1000 group-hover:scale-125" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
              <div className="max-w-2xl text-center lg:text-left">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-[1.5rem] flex items-center justify-center mb-8 mx-auto lg:mx-0">
                  <HelpCircle className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-[0.9]">
                  Still figuring <br />
                  <span className="text-blue-400">things out?</span>
                </h2>
                <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed">
                  Our strategic advisors are ready to help you navigate through our complex financial landscape to find the perfect solution for you.
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <Magnetic strength={0.2}>
                  <Link href="/appointment">
                    <button className="px-10 py-6 bg-white text-slate-900 rounded-full font-black text-lg md:text-xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_30px_60px_rgba(255,255,255,0.2)] transition-all flex items-center gap-4 group/btn">
                      Book Consultation <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                  </Link>
                </Magnetic>
              </div>
            </div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
        </MotionWrapper>
      </div>
    </div>
  );
}
