"use client";

import { useEffect, useState } from "react";
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
  Users
} from "lucide-react";
import anime from "animejs";
import { servicesData, Service } from "@/constants/servicesData";
import { useParams, notFound } from "next/navigation";

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const service = servicesData.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  useEffect(() => {
    // Staggered reveal animations
    anime({
      targets: ".js-reveal",
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1200,
      delay: anime.stagger(150),
      easing: "easeOutExpo",
    });

    anime({
      targets: ".item-reveal",
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 1000,
      delay: anime.stagger(100, { start: 600 }),
      easing: "easeOutExpo",
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 overflow-hidden gpu">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/30 rounded-full animate-blob blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-50/40 rounded-full animate-blob blur-[120px]" style={{ animationDelay: "-5s" }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Navigation */}
        <Link
          href="/services"
          className="js-reveal inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all group mb-12"
        >
          <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-50 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          Back to Services
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-32 items-center">
          <div className="js-reveal space-y-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${service.category === 'Taxation Division' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
              <Sparkles className="w-4 h-4" />
              <span>{service.category} Expertise</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] uppercase">
              {service.name.split(' ').slice(0, -1).join(' ')} <br />
              <span className={`italic ${service.category === 'Taxation Division' ? 'text-emerald-600' : 'text-blue-600'}`}>
                {service.name.split(' ').slice(-1)}
              </span>
            </h1>

            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/appointment">
                <button className={`px-10 py-5 text-white rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-3 ${service.category === 'Taxation Division' ? 'bg-emerald-600 shadow-emerald-200' : 'bg-blue-600 shadow-blue-200'}`}>
                  Book Consultation <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>

          <div className="js-reveal relative">
            <div className="glass-card p-4 border-white bg-white/40 shadow-2xl backdrop-blur-3xl overflow-hidden group h-[500px] relative">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent p-12 flex flex-col justify-end">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 py-2 border-b border-white/10">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-bold uppercase tracking-tight">Rapid Scaling</span>
                  </div>
                  <div className="flex items-center gap-4 py-2 border-b border-white/10">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-white font-bold uppercase tracking-tight">Full Compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Key Features Column */}
          <div className="js-reveal bg-white rounded-[3rem] p-12 lg:p-16 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Key Features</h3>
              </div>

              <div className="space-y-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="item-reveal flex items-start gap-5 p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                    <CheckCircle className="w-6 h-6 text-emerald-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <p className="text-lg font-bold text-slate-700 leading-tight tracking-tight uppercase">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Benefits Column */}
          <div className="js-reveal bg-slate-900 rounded-[3rem] p-12 lg:p-16 text-white border border-slate-800 shadow-2xl relative overflow-hidden h-full">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mb-32" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center border border-white/10">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Core Benefits</h3>
              </div>

              <div className="space-y-6">
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="item-reveal flex items-start gap-5 p-6 bg-white/5 rounded-3xl border border-transparent hover:border-white/10 hover:bg-white/10 transition-all group">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-150 transition-transform" />
                    </div>
                    <p className="text-lg font-bold text-slate-300 leading-tight tracking-tight uppercase">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Support Card */}
        <div className="js-reveal mt-32 bg-gradient-to-br from-slate-50 to-white rounded-[3.5rem] p-12 md:p-20 border border-slate-100 text-center shadow-2xl shadow-slate-200 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <Users className="w-16 h-16 text-blue-600 mx-auto mb-10" />
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">
              Elite Professional <br />
              <span className="text-blue-600">Guidance</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
              Connect with our vertical heads today to craft a precise financial strategy for your unique requirements. 24/7 dedicated support for all premium accounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-10 py-5 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" /> Call Advisor
              </button>
              <button className="px-10 py-5 border-2 border-slate-900 text-slate-900 rounded-full font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                Knowledge Base <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
