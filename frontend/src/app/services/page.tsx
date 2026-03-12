"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, HelpCircle, Search, X, ChevronRight, Filter, Home, Factory, User, Calculator, Briefcase } from "lucide-react";
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
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const saved = localStorage.getItem("user_division");
    setDivision(saved || "finance");
  }, []);

  const categories = division === "taxation" 
    ? ["Taxation Division"] as const
    : ["Retail / Mortgage", "SME / MSME Loans", "Unsecured Loans"] as const;

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      // Show/Hide Floating Nav
      setShowFloatingNav(window.scrollY > 600);

      let currentSection = null;
      for (const cat of categories) {
        const id = cat.toLowerCase().replace(/[^a-z0-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const element = sectionRefs.current[id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 250) {
            currentSection = id;
          }
        }
      }
      setActiveCategory(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 180;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

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

  const hasAnyResults = filteredServicesData.length > 0;

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

        {/* Category Navigation (Static at top) */}
        <div className="mb-20 md:mb-32">
          <div className="max-w-5xl mx-auto">

            {/* Premium Category Filter Container */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.02)] hidden md:block">
               <div className="flex items-center justify-between">
                  <div className="flex gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                    {categories.map((cat) => {
                      const id = cat.toLowerCase().replace(/[^a-z0-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                      const isActive = activeCategory === id;
                      return (
                        <button
                          key={cat}
                          onClick={() => scrollToSection(id)}
                          className={`whitespace-nowrap px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                            isActive 
                              ? division === 'taxation' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200/50" : "bg-blue-600 text-white shadow-lg shadow-blue-200/50" 
                              : division === 'taxation' ? "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50" : "text-slate-500 hover:text-blue-600 hover:bg-blue-50/50"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  <div className="px-6 flex items-center gap-4 border-l border-slate-100">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter By Sector</span>
                  </div>
               </div>
            </div>

            {/* Mobile Category List (No Scroll) */}
            <div className="md:hidden grid grid-cols-2 gap-3 px-1 gpu">
              {categories.map((cat) => {
                const id = cat.toLowerCase().replace(/[^a-z0-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                const isActive = activeCategory === id;
                return (
                  <button
                    key={cat}
                    onClick={() => scrollToSection(id)}
                    className={`px-4 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center leading-tight gpu ${
                      isActive 
                        ? division === 'taxation' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-blue-600 text-white shadow-lg shadow-blue-200" 
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


        {/* Main Services Grid */}
        <div className="space-y-40 md:space-y-64 min-h-[60vh]">
          {hasAnyResults ? (
            categories.map((cat, catIdx) => {
              const filteredServices = filteredServicesData.filter(s => s.category === cat);
              if (filteredServices.length === 0) return null;

              const id = cat.toLowerCase().replace(/[^a-z0-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

              return (
                <div
                  key={cat}
                  id={id}
                  ref={el => { sectionRefs.current[id] = el; }}
                  className="scroll-mt-48"
                >
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2"
                  >
                    <div className="flex flex-col text-center md:text-left">
                      <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                         <div className={`w-10 h-[1px] ${division === 'taxation' ? 'bg-emerald-600/30' : 'bg-blue-600/30'}`} />
                         <span className={`${division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'} font-black text-[10px] uppercase tracking-[0.6em] leading-none`}>Sector Profile 0{catIdx + 1}</span>
                      </div>
                      <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                        {cat}
                      </h2>
                    </div>
                    <div className="hidden md:block h-[1px] flex-1 bg-slate-200 mb-4 mx-12 opacity-40" />
                    <div className="text-center md:text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredServices.length} Active Solutions</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredServices.map((service) => (
                        <motion.div 
                          key={service.id} 
                          variants={itemVariants}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <Link href={`/services/${service.id}`} className="group block h-full gpu">
                            <div className={`bg-white rounded-[3rem] overflow-hidden h-full flex flex-col border border-slate-100 transition-all duration-700 relative shadow-[0_30px_60px_rgba(0,0,0,0.02)] gpu ${division === 'taxation' ? 'group-hover:border-emerald-200 group-hover:shadow-[0_50px_100px_rgba(16,185,129,0.08)]' : 'group-hover:border-blue-200 group-hover:shadow-[0_50px_100px_rgba(37,99,235,0.08)]'}`}>
                              {/* Service Asset Interface */}
                              <div className="relative h-64 sm:h-72 w-full overflow-hidden gpu">
                                <img
                                  src={service.image}
                                  alt={service.name}
                                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 gpu"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                                
                                <div className="absolute top-8 right-8">
                                   <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-xl border border-white flex items-center justify-center text-slate-900 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                                      <ArrowRight className="w-5 h-5" />
                                   </div>
                                </div>
                              </div>

                              <div className="p-10 pt-2 flex flex-col items-start flex-1 relative z-10">
                                <h3 className={`text-2xl md:text-3xl font-black text-slate-900 mb-5 ${division === 'taxation' ? 'group-hover:text-emerald-600' : 'group-hover:text-blue-600'} transition-colors uppercase tracking-tighter leading-none`}>
                                  {service.name}
                                </h3>
                                
                                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3">
                                  {service.description}
                                </p>
                                
                                <div className="mt-auto flex items-center gap-4 group/link">
                                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ${division === 'taxation' ? 'group-hover/link:text-emerald-600' : 'group-hover/link:text-blue-600'} transition-colors`}>Strategic Details</span>
                                  <div className={`w-12 h-[1.5px] bg-slate-100 ${division === 'taxation' ? 'group-hover/link:bg-emerald-600' : 'group-hover/link:bg-blue-600'} group-hover/link:w-20 transition-all duration-700`} />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-24 h-24 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] flex items-center justify-center mb-10 relative overflow-hidden">
                <Search className="w-10 h-10 text-slate-300 relative z-10" />
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">No parameters matched</h3>
              <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                Refine your search parameters. Try broad terms like "Loan", "GST", or specific sectors like "SME".
              </p>
              <button 
                onClick={() => router.push('/services')}
                className="mt-12 px-12 py-5 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all"
              >
                Reset Parameters
              </button>
            </motion.div>
          )}
        </div>

        {/* Strategic Consultation CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 md:mt-64"
        >
          <div className="relative bg-slate-900 rounded-[3rem] md:rounded-[5rem] p-10 md:p-32 overflow-hidden group">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] -ml-40 -mb-40" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-32">
              <div className="max-w-3xl text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12">
                   <HelpCircle className="w-4 h-4" /> 
                   <span>Strategy Hub</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-[1.1] uppercase mb-10 leading-[0.85] tracking-tighter">
                  Not sure where <br />
                  <span className={division === 'taxation' ? 'text-emerald-500' : 'text-blue-500'}>to begin?</span>
                </h2>
                <p className="text-base md:text-xl text-slate-400 font-medium leading-loose max-w-2xl">
                  {division === 'taxation' 
                    ? "Engage with our compliance heads for a precise alignment between your statutory requirements and our legal solutions."
                    : "Engage with our strategic vertical heads for a precise alignment between your capital requirements and our financial solutions."}
                </p>
              </div>
              
              <div className="flex-shrink-0 w-full lg:w-auto">
                <Link href="/appointment">
                  <button className="w-full lg:w-auto px-12 py-7 md:py-9 bg-white text-slate-900 rounded-full font-black text-lg md:text-2xl shadow-2xl hover:shadow-[0_40px_100px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-6 group/btn">
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
            className="fixed bottom-6 left-1/2 z-[100] w-[92%] max-w-2xl px-1 gpu"
          >
            <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] p-1.5 md:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-between gap-1 md:gap-4 overflow-hidden gpu">
              <div className="flex-1 flex items-center justify-center md:justify-start gap-1 md:gap-2">
                {categories.map((cat) => {
                  const id = cat.toLowerCase().replace(/[^a-z0-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
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
                      onClick={() => scrollToSection(id)}
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

