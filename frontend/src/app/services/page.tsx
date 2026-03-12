"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, HelpCircle, Search, X, ChevronRight, ChevronLeft, Filter, Home, Factory, User, Calculator, Briefcase } from "lucide-react";
import { servicesData } from "@/constants/servicesData";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function ServicesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [division, setDivision] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sliderRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const saved = localStorage.getItem("user_division");
    setDivision(saved || "finance");
  }, []);

  const categories = division === "taxation" 
    ? ["Taxation Division"] as const
    : ["Retail / Mortgage", "SME / MSME Loans", "Unsecured Loans"] as const;

  const getCategoryId = (cat: string) => cat.toLowerCase().replace(/[^a-z0-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const filteredServicesData = servicesData.filter(service => {
    if (!division) return false;
    
    const matchesQuery = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDivision = division === "taxation" 
      ? service.category === "Taxation Division"
      : service.category !== "Taxation Division";

    return matchesQuery && matchesDivision;
  });

  // Reset swipe index when category changes
  useEffect(() => {
    setCurrentSwipeIndex(0);
  }, [activeCategory]);

  // Auto-swipe Logic
  useEffect(() => {
    if (!isAutoPlaying || !activeCategory) return;

    const interval = setInterval(() => {
      const slider = sliderRefs.current[activeCategory];
      if (slider) {
        const filteredServices = filteredServicesData.filter(s => getCategoryId(s.category) === activeCategory);
        if (filteredServices.length <= 1) return;
        
        const nextIndex = (currentSwipeIndex + 1) % filteredServices.length;
        
        slider.scrollTo({ 
          left: nextIndex * slider.clientWidth, 
          behavior: 'smooth' 
        });
        setCurrentSwipeIndex(nextIndex);
      }
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSwipeIndex, activeCategory, filteredServicesData]);

  // Default active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      const firstId = getCategoryId(categories[0]);
      setActiveCategory(firstId);
    }
  }, [categories, activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 md:pt-36 pb-20 md:pb-32 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className={`absolute top-[-15%] left-[-10%] w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] ${division === 'taxation' ? 'bg-emerald-100/30' : 'bg-blue-100/30'} rounded-full opacity-50 blur-[100px] md:blur-[140px]`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[700px] md:w-[1100px] h-[700px] md:h-[1100px] ${division === 'taxation' ? 'bg-emerald-50/40' : 'bg-emerald-50/40'} rounded-full opacity-50 blur-[100px] md:blur-[140px]`} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-16 md:mb-24"
        >
          <div className={`inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border ${division === 'taxation' ? 'border-emerald-50 text-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,0.06)]' : 'border-blue-50 text-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.06)]'} text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-8`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{division === 'taxation' ? 'Regulatory Integrity' : 'Financial Mastery'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1] md:leading-[0.85] uppercase mb-8">
            {division === 'taxation' ? 'Tax & Legal' : 'Financial'}<br />
            <span className={division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'}>{division === 'taxation' ? 'Compliance' : 'Guidance'}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed md:leading-loose">
            {division === 'taxation' 
              ? "Comprehensive auditing, legal compliance, and strategic tax planning for robust corporate governance."
              : "Precision-engineered financial strategies for individual growth and large-scale industrial excellence."}
          </p>
        </motion.div>

        {/* Category Navigation (Tabs) */}
        <div className="mb-20 md:mb-24">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.02)] hidden md:block">
               <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {categories.map((cat) => {
                      const id = getCategoryId(cat);
                      const isActive = activeCategory === id;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(id)}
                          className={`whitespace-nowrap px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 relative ${
                            isActive 
                              ? "text-white" 
                              : division === 'taxation' ? "text-slate-500 hover:text-emerald-600" : "text-slate-500 hover:text-blue-600"
                          }`}
                        >
                          <span className="relative z-10">{cat}</span>
                          {isActive && (
                            <motion.div
                              layoutId="navPill"
                              className={`absolute inset-0 rounded-full shadow-lg ${division === 'taxation' ? "bg-emerald-600 shadow-emerald-200/50" : "bg-blue-600 shadow-blue-200/50"}`}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-6 flex items-center gap-4 border-l border-slate-100">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Select Category</span>
                  </div>
               </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x">
              {categories.map((cat) => {
                const id = getCategoryId(cat);
                const isActive = activeCategory === id;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(id)}
                    className={`flex-shrink-0 whitespace-nowrap px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center leading-tight snap-center ${
                      isActive 
                        ? division === 'taxation' ? "bg-emerald-600 text-white shadow-lg" : "bg-blue-600 text-white shadow-lg" 
                        : "bg-white text-slate-600 border border-slate-100 shadow-sm"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Service View */}
        <div className="min-h-[60vh] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory || "none"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {categories.map((cat, catIdx) => {
                const id = getCategoryId(cat);
                if (activeCategory !== id) return null;

                const filteredServices = filteredServicesData.filter(s => s.category === cat);
                if (filteredServices.length === 0) return (
                  <div key="empty" className="py-20 text-center">
                    <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">No Services in this segment</h3>
                  </div>
                );

                return (
                  <div key={cat} className="space-y-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
                      <div className="flex flex-col text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                           <div className={`w-10 h-[1px] ${division === 'taxation' ? 'bg-emerald-600/30' : 'bg-blue-600/30'}`} />
                           <span className={`${division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'} font-black text-xs uppercase tracking-[0.6em] leading-none`}>Module 0{catIdx + 1}</span>
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                          {cat}
                        </h2>
                      </div>
                      <div className="hidden md:block h-[1px] flex-1 bg-slate-200 mb-4 mx-12 opacity-40" />
                      <div className="text-center md:text-right">
                         <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{filteredServices.length} Premium Solutions</p>
                      </div>
                    </div>

                    <div className="relative group/slider">
                      {/* Swipe Hint */}
                      <div className="absolute -top-12 right-2 flex items-center gap-2 text-slate-400 md:hidden">
                        <span className="text-[10px] font-black uppercase tracking-widest">Swipe</span>
                        <ArrowRight className="w-3 h-3 animate-bounce-x" />
                      </div>

                      <div className="relative overflow-visible">
                        {/* Navigation Arrows (Desktop Only) */}
                        <div className="hidden md:flex absolute -left-20 -right-20 top-1/2 -translate-y-1/2 items-center justify-between pointer-events-none z-20">
                          <button 
                            onClick={() => {
                              const slider = sliderRefs.current[id];
                              if (slider) {
                                slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
                              }
                            }}
                            className="p-6 bg-white border border-slate-100 rounded-full shadow-xl text-slate-400 hover:text-blue-600 hover:scale-110 pointer-events-auto transition-all active:scale-90"
                          >
                            <ChevronLeft className="w-8 h-8" />
                          </button>
                          <button 
                            onClick={() => {
                              const slider = sliderRefs.current[id];
                              if (slider) {
                                slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
                              }
                            }}
                            className="p-6 bg-white border border-slate-100 rounded-full shadow-xl text-slate-400 hover:text-blue-600 hover:scale-110 pointer-events-auto transition-all active:scale-90"
                          >
                            <ChevronRight className="w-8 h-8" />
                          </button>
                        </div>

                        {/* Swipe Container */}
                        <div 
                          ref={(el) => { if (id) sliderRefs.current[id] = el; }}
                          onMouseEnter={() => setIsAutoPlaying(false)}
                          onMouseLeave={() => setIsAutoPlaying(true)}
                          onScroll={(e) => {
                            const container = e.currentTarget;
                            const index = Math.round(container.scrollLeft / container.clientWidth);
                            if (index !== currentSwipeIndex) setCurrentSwipeIndex(index);
                          }}
                          className="slider-container flex gap-0 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12 -mx-4 md:-mx-12"
                          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                          {filteredServices.map((service) => (
                            <motion.div 
                              key={service.id} 
                              className="flex-shrink-0 w-full md:max-w-4xl mx-auto px-4 md:px-12 snap-center snap-always"
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              whileHover={{ y: -10 }}
                            >
                              <Link href={`/services/${service.id}`} className="group block h-full">
                                <div className={`bg-white rounded-[3rem] overflow-hidden h-full flex flex-col border border-slate-100 transition-all duration-700 relative shadow-[0_30px_60px_rgba(0,0,0,0.02)] ${division === 'taxation' ? 'hover:border-emerald-200 hover:shadow-[0_50px_100px_rgba(16,185,129,0.08)]' : 'hover:border-blue-200 hover:shadow-[0_50px_100px_rgba(37,99,235,0.08)]'}`}>
                                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                                    <img
                                      src={service.image}
                                      alt={service.name}
                                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                                    
                                    <div className="absolute top-8 right-8">
                                       <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-xl border border-white flex items-center justify-center text-slate-900 shadow-2xl opacity-0 hover:opacity-100 transition-all duration-500 transform translate-x-4 hover:translate-x-0">
                                          <ArrowRight className="w-5 h-5" />
                                       </div>
                                    </div>
                                  </div>

                                  <div className="p-10 pt-2 flex flex-col items-start flex-1 relative z-10 text-center md:text-left">
                                    <h3 className={`w-full text-3xl md:text-5xl font-black text-slate-900 mb-6 ${division === 'taxation' ? 'group-hover:text-emerald-600' : 'group-hover:text-blue-600'} transition-colors uppercase tracking-tighter leading-tight`}>
                                      {service.name}
                                    </h3>
                                    
                                    <p className="w-full text-base md:text-xl text-slate-600 font-medium leading-relaxed mb-12 line-clamp-3">
                                      {service.description}
                                    </p>
                                    
                                    <div className="mt-auto w-full flex items-center justify-center md:justify-start gap-4 group/link">
                                      <span className={`text-xs font-black uppercase tracking-[0.3em] text-slate-500 ${division === 'taxation' ? 'group-hover/link:text-emerald-600' : 'group-hover/link:text-blue-600'} transition-colors`}>Strategic Details</span>
                                      <div className={`w-16 h-[2px] bg-slate-200 ${division === 'taxation' ? 'group-hover/link:bg-emerald-600' : 'group-hover/link:bg-blue-600'} group-hover/link:w-24 transition-all duration-700`} />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Progress Indication (Dots) */}
                      <div className="flex justify-center gap-3 mt-4">
                        {filteredServices.map((_, idx) => (
                          <button 
                            key={idx}
                            onClick={() => {
                              const slider = sliderRefs.current[id];
                              if (slider) {
                                slider.scrollTo({ left: idx * slider.clientWidth, behavior: 'smooth' });
                              }
                            }}
                            className={`h-2 rounded-full transition-all duration-500 ${idx === currentSwipeIndex ? (division === 'taxation' ? 'w-12 bg-emerald-600' : 'w-12 bg-blue-600') : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Strategic Consultation CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 md:mt-48"
        >
          <div className="relative bg-slate-900 rounded-[3rem] md:rounded-[5rem] p-10 md:p-32 overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] -ml-40 -mb-40" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-32">
              <div className="max-w-3xl text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12">
                   <HelpCircle className="w-4 h-4" /> 
                   <span>Strategy Hub</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase mb-10 leading-[0.85]">
                   Ready to <br />
                  <span className={division === 'taxation' ? 'text-emerald-500' : 'text-blue-500'}>Proceed?</span>
                </h2>
                <p className="text-base md:text-xl text-slate-400 font-medium leading-loose max-w-2xl">
                   Consult with our specialized vertical heads for an tailored alignment of our premium solutions to your specific professional needs.
                </p>
              </div>
              
              <div className="flex-shrink-0 w-full lg:w-auto">
                <Link href="/appointment">
                  <button className="w-full lg:w-auto px-12 py-7 md:py-9 bg-white text-slate-900 rounded-full font-black text-lg md:text-2xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-6 group/btn">
                    Consult Expert <ArrowRight className="w-7 h-7 group-hover/btn:translate-x-3 transition-transform duration-500" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Floating Quick Navigator (Dock Style) */}
      <AnimatePresence>
        {showFloatingNav && (
          <motion.div
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 z-[100] w-[92%] max-w-2xl px-1"
          >
            <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-1.5 md:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between gap-1 md:gap-4 overflow-hidden">
              <div className="flex-1 flex items-center justify-center md:justify-start gap-1 md:gap-2">
                {categories.map((cat) => {
                  const id = getCategoryId(cat);
                  const isActive = activeCategory === id;
                  
                  const IconsMap: { [key: string]: any } = {
                    "Retail / Mortgage": Home,
                    "SME / MSME Loans": Factory,
                    "Unsecured Loans": User,
                    "Taxation Division": Calculator,
                  };
                  const CatIcon = IconsMap[cat] || Briefcase;

                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(id)}
                      className={`flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3 px-3 md:px-6 py-2.5 md:py-3.5 rounded-[1.8rem] transition-all duration-300 relative group flex-1 md:flex-none ${
                        isActive 
                          ? division === 'taxation' ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20" : "bg-blue-600 text-white shadow-xl shadow-blue-500/20" 
                          : division === 'taxation' ? "text-slate-500 hover:text-emerald-600 hover:bg-slate-50" : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                    >
                      <CatIcon className={`w-4 h-4 md:w-3.5 md:h-3.5 ${isActive ? "text-white" : division === 'taxation' ? "text-slate-400 group-hover:text-emerald-500" : "text-slate-400 group-hover:text-blue-500"}`} />
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap hidden sm:block">
                        {cat.split(' / ')[0]}
                      </span>
                      {isActive && (
                        <motion.div 
                          layoutId="activePill"
                          className={`absolute inset-0 ${division === 'taxation' ? 'bg-emerald-600' : 'bg-blue-600'} rounded-[1.8rem] -z-10`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center gap-2 border-l border-slate-100 pl-4 pr-2">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-full transition-all"
                  title="Back to Top"
                >
                  <ArrowRight className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Suspense } from "react";

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 pt-36 px-8 text-center font-black uppercase tracking-widest text-slate-400">Loading Intelligence...</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}

