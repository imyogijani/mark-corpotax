"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  Phone,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  ChevronRight
} from "lucide-react";
import { servicesData } from "@/constants/servicesData";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem, MotionWrapper } from "@/components/MotionWrapper";
import ScrollWatermark from "@/components/ScrollWatermark";
import Magnetic from "@/components/Magnetic";

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const service = servicesData.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  const isTaxation = service.category === 'Taxation Division';

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 overflow-hidden gpu relative">
      <ScrollWatermark text={service.id.toUpperCase()} className="top-40 right-10 opacity-30 text-slate-200" />
      
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-100/30 rounded-full animate-blob blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[900px] h-[900px] bg-emerald-50/40 rounded-full animate-blob blur-[150px]" style={{ animationDelay: "-5s" }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        {/* Navigation */}
        <MotionWrapper direction="right" delay={0.1}>
          <Magnetic strength={0.2}>
            <Link
              href="/services"
              className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-blue-600 transition-all group mb-16"
            >
              <div className="w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-50 transition-all shadow-sm">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </div>
              Back to Services
            </Link>
          </Magnetic>
        </MotionWrapper>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-32 items-center">
          <div className="space-y-10">
            <MotionWrapper direction="down" delay={0.2}>
              <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.4em] ${isTaxation ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.08)]'}`}>
                <Sparkles className="w-4 h-4" />
                <span>{service.category} Expertise</span>
              </div>
            </MotionWrapper>
            
            <MotionWrapper direction="up" delay={0.3}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase">
                {service.name.split(' ').slice(0, -1).join(' ')} <br />
                <span className={`${isTaxation ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {service.name.split(' ').slice(-1)}
                </span>
              </h1>
            </MotionWrapper>
            
            <MotionWrapper direction="up" delay={0.4}>
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                {service.description}
              </p>
            </MotionWrapper>

            <MotionWrapper direction="up" delay={0.5} className="flex flex-wrap gap-6 pt-4">
              <Magnetic strength={0.1}>
                <Link href="/appointment" className="w-full sm:w-auto block">
                  <button className={`w-full sm:w-auto px-10 py-6 text-white rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center gap-4 group/btn ${isTaxation ? 'bg-emerald-600 shadow-emerald-200/50' : 'bg-blue-600 shadow-blue-200/50'}`}>
                    Book Consultation <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </Magnetic>
            </MotionWrapper>
          </div>

          <MotionWrapper direction="left" delay={0.4} className="relative">
            <div className="bg-white rounded-[4rem] p-4 border border-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.05)] overflow-hidden group h-[550px] relative">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover rounded-[3.5rem] transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-x-8 bottom-8 bg-white/90 backdrop-blur-2xl rounded-[3rem] p-10 border border-white flex flex-col justify-end shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-slate-900 font-black uppercase tracking-widest text-xs">Rapid Scaling Solutions</span>
                  </div>
                  <div className="flex items-center gap-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-slate-900 font-black uppercase tracking-widest text-xs">Full Regulatory Compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>
        </div>

        {/* Details Grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Key Features Column */}
          <MotionWrapper direction="right" className="bg-white rounded-[4rem] p-10 md:p-16 border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] relative overflow-hidden h-full group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110" />

            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-12">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-[360deg] transition-transform duration-700">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Key <br />Features</h3>
              </div>

              <StaggerContainer className="grid gap-6">
                {service.features.map((feature, idx) => (
                  <StaggerItem key={idx}>
                    <div className="flex items-start gap-6 p-6 rounded-[2rem] border border-transparent hover:border-blue-100 hover:bg-slate-50/50 transition-all group/item">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                      <p className="text-sm font-black text-slate-700 leading-tight tracking-[0.05em] uppercase">
                        {feature}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </MotionWrapper>

          {/* Core Benefits Column */}
          <MotionWrapper direction="left" className="bg-slate-900 rounded-[4rem] p-10 md:p-16 text-white border border-slate-800 shadow-2xl relative overflow-hidden h-full group">
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mb-40 transition-transform duration-1000 group-hover:scale-110" />

            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-12">
                <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-[360deg] transition-transform duration-700">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">Core <br />Benefits</h3>
              </div>

              <StaggerContainer className="grid gap-6">
                {service.benefits.map((benefit, idx) => (
                  <StaggerItem key={idx}>
                    <div className="flex items-start gap-6 p-6 rounded-[2rem] border border-transparent hover:border-white/10 hover:bg-white/5 transition-all group/benefit">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                         <div className="w-2 h-2 rounded-full bg-blue-400 group-hover/benefit:scale-150 transition-transform" />
                      </div>
                      <p className="text-sm font-black text-slate-300 leading-tight tracking-[0.05em] uppercase">
                        {benefit}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </MotionWrapper>
        </div>

        {/* Global Support Card */}
        <MotionWrapper direction="up" className="mt-40">
          <div className="relative bg-white rounded-[4rem] p-10 md:p-24 border border-slate-100 text-center shadow-[0_50px_100px_rgba(0,0,0,0.03)] overflow-hidden group">
            <div className="absolute inset-0 bg-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
               <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-blue-200 group-hover:rotate-[360deg] transition-transform duration-1000">
                  <Users className="w-10 h-10" />
               </div>
               <h2 className="text-3xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">
                 Elite Vertical <br />
                 <span className="text-blue-600 font-black">Guidance</span>
               </h2>
               <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                 Connect with our vertical heads today to craft a precise financial strategy for your unique requirements. 24/7 dedicated support for all premium accounts.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Magnetic strength={0.1}>
                    <button className="w-full sm:w-auto px-10 py-6 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-xl">
                       <Phone className="w-6 h-6" /> Call Advisor
                    </button>
                  </Magnetic>
                  <Magnetic strength={0.1}>
                    <button className="w-full sm:w-auto px-10 py-6 border-2 border-slate-900 text-slate-900 rounded-full font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-4 group/kb">
                       Knowledge Base <ChevronRight className="w-6 h-6 group-hover/kb:translate-x-2 transition-transform" />
                    </button>
                  </Magnetic>
               </div>
            </div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
        </MotionWrapper>
      </div>
    </div>
  );
}
