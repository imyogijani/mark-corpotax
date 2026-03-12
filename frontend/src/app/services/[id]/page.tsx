"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
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

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const service = servicesData.find((s) => s.id === id);

  if (!service) {
    notFound();
  }

  const isTaxation = service.category === 'Taxation Division';

  return (
    <div className="min-h-screen bg-slate-50 pt-28 md:pt-36 pb-20 md:pb-32 relative overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-blue-100/30 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-emerald-50/40 rounded-full blur-[100px] md:blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 font-sans">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 md:mb-20"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-blue-600 transition-all group"
          >
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-slate-200 bg-white flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-50 transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            </div>
            Back to Services
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-24 md:mb-40 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8 md:space-y-12"
          >
            <motion.div 
              variants={fadeInUp}
              className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.4em] ${isTaxation ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.08)]'}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{service.category} Excellence</span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1] md:leading-[0.85] uppercase"
            >
              {service.name.split(' ').slice(0, -1).join(' ')} <br />
              <span className={`${isTaxation ? 'text-emerald-600' : 'text-blue-600'}`}>
                {service.name.split(' ').slice(-1)}
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-base md:text-xl text-slate-500 font-medium leading-relaxed md:leading-loose max-w-xl"
            >
              {service.description}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link href="/appointment" className="w-full sm:w-auto block">
                <button className={`w-full sm:w-auto px-12 py-6 md:py-8 text-white rounded-full font-black text-base md:text-xl transition-all shadow-2xl flex items-center justify-center gap-4 group/btn ${isTaxation ? 'bg-emerald-600 shadow-emerald-200/50 hover:bg-emerald-700' : 'bg-blue-600 shadow-blue-200/50 hover:bg-blue-700'}`}>
                  Book Consultation <ArrowRight className="w-5 h-5 md:w-7 md:h-7 group-hover/btn:translate-x-2 transition-transform duration-500" />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="bg-white rounded-[3rem] md:rounded-[5rem] p-3 md:p-4 border border-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.06)] overflow-hidden group h-[450px] md:h-[700px] relative">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover rounded-[2.5rem] md:rounded-[4.5rem] transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-x-6 md:inset-x-12 bottom-6 md:bottom-12 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 border border-white flex flex-col justify-end shadow-2xl">
                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                      <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Rapid Scaling Vertical</span>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                      <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Regulatory Framework Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Details Section */}
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 lg:gap-20">
          {/* Key Features Column */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[3rem] md:rounded-[4.5rem] p-10 md:p-20 border border-slate-100 shadow-[0_40px_80px_rgba(0,0,0,0.03)] relative overflow-hidden group h-full"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[120px] -mr-48 -mt-48 opacity-60" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-12 md:mb-16">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-blue-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-inner">
                  <Zap className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">Key <br /><span className="text-blue-600">Features</span></h3>
              </div>

              <div className="grid gap-6 md:gap-8">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-6 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-slate-50/50 border border-transparent hover:border-blue-100 transition-all group/item">
                    <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs md:text-base font-black text-slate-700 leading-tight tracking-[0.1em] uppercase">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Core Benefits Column */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] md:rounded-[4.5rem] p-10 md:p-20 text-white border border-slate-800 shadow-2xl relative overflow-hidden group h-full"
          >
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mb-48" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-12 md:mb-16">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 text-white rounded-2xl md:rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner">
                  <Award className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">Core <br /><span className="text-blue-400">Benefits</span></h3>
              </div>

              <div className="grid gap-6 md:gap-8">
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-6 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group/benefit">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                       <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                    </div>
                    <p className="text-xs md:text-base font-black text-slate-300 leading-tight tracking-[0.1em] uppercase">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Support Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 md:mt-64"
        >
          <div className="relative bg-white rounded-[3rem] md:rounded-[5rem] p-10 md:p-32 border border-slate-100 text-center shadow-[0_60px_120px_rgba(0,0,0,0.04)] overflow-hidden group">
            <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
               <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 text-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 md:mb-16 shadow-2xl shadow-blue-200 group-hover:rotate-12 transition-transform duration-500">
                  <Users className="w-10 h-10 md:w-12 md:h-12" />
               </div>
               <h2 className="text-4xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter mb-8 md:mb-12 leading-[0.85]">
                 Strategic Vertical <br />
                 <span className="text-blue-600">Guidance</span>
               </h2>
               <p className="text-base md:text-2xl text-slate-500 font-medium mb-12 md:mb-20 leading-relaxed max-w-2xl mx-auto">
                 Connect with our specialized advisors to craft a financial strategy for your unique goals. 24/7 priority support for all corporate accounts.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center">
                  <Link href="tel:+919712067891" className="w-full sm:w-auto">
                    <button className="w-full px-12 py-7 md:py-9 bg-slate-900 text-white rounded-full font-black text-lg md:text-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-6 shadow-2xl">
                        <Phone className="w-6 h-6 md:w-8 md:h-8" /> Call Expert
                    </button>
                  </Link>
                  <Link href="/appointment" className="w-full sm:w-auto">
                    <button className="w-full px-12 py-7 md:py-9 border-2 border-slate-900 text-slate-900 rounded-full font-black text-lg md:text-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-6 group/kb">
                        Book Now <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover/kb:translate-x-3 transition-transform duration-500" />
                    </button>
                  </Link>
               </div>
            </div>
            
            {/* Asset Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

