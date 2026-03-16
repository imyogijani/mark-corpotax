"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { DotLottiePlayer } from "@dotlottie/react-player";
import FloatingGraffiti from "@/components/FloatingGraffiti";
import {
  ArrowRight,
  Sparkles,
  Search,
  ChevronRight,
} from "lucide-react";
import { servicesData, Service } from "@/constants/servicesData";

interface ServicesTemplateProps {
  division: "finance" | "taxation";
}

const getCategoryId = (cat: string) => cat.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

export default function ServicesTemplate({ division }: ServicesTemplateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(q);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sliderRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const categories = useMemo(() => {
    return division === "taxation"
      ? ["Taxation Division"]
      : ["Retail / Mortgage", "SME / MSME Loans", "Unsecured Loans"];
  }, [division]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(getCategoryId(categories[0]));
    }
  }, [categories, activeCategory]);

  const filteredServices = useMemo(() => {
    return servicesData.filter(service => {
      const matchesQuery = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());

      const isTax = service.category === "Taxation Division";
      const matchesDivision = division === "taxation" ? isTax : !isTax;

      return matchesQuery && matchesDivision;
    });
  }, [division, searchQuery]);

  // Auto-swipe functionality for mobile
  useEffect(() => {
    const servicesInCategory = filteredServices.filter(s => getCategoryId(s.category) === activeCategory);
    if (servicesInCategory.length <= 1) return;

    const interval = setInterval(() => {
      if (window.innerWidth < 1024) {
        setCurrentSwipeIndex((prev) => {
          const next = (prev + 1) % servicesInCategory.length;
          const container = sliderRefs.current[activeCategory || ""];
          if (container) {
            const cardWidth = container.offsetWidth * 0.85;
            container.scrollTo({
              left: next * (cardWidth + 24),
              behavior: "smooth"
            });
          }
          return next;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeCategory, filteredServices]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans pt-16">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className={`absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full blur-[150px] opacity-20 ${division === 'taxation' ? 'bg-emerald-400' : 'bg-blue-400'}`}
        />
        <motion.div
          style={{ y: y2 }}
          className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-20 ${division === 'taxation' ? 'bg-emerald-300' : 'bg-blue-300'}`}
        />
        <FloatingGraffiti division={division} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.4]" />
      </div>

      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >


              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95] md:leading-[0.9] tracking-tighter uppercase mb-4">
                {division === 'taxation' ? 'Tax' : 'Financial'}<br />
                <span className={division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'}>
                  {division === 'taxation' ? 'Expertise' : 'Futures'}
                </span>
              </h1>

              <p className="text-slate-500 text-base md:text-xl font-medium max-w-xl mx-auto md:mx-0 leading-relaxed opacity-80 mb-10 md:mb-12">
                {division === 'taxation'
                  ? "Architecting robust compliance frameworks for global enterprises and evolving SMEs."
                  : "Precision-driven financial consulting to fuel your business expansion and industrial scale."}
              </p>
            </motion.div>

            {/* Hero Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="flex-shrink-0 w-full lg:w-[600px] aspect-square relative flex items-center justify-center p-0"
            >
              <div className={`absolute inset-0 rounded-full opacity-30 blur-[120px] ${division === 'taxation' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
              <div className="relative w-full h-full z-10">
                <DotLottiePlayer
                  src={division === 'taxation' ? "/extrafiles/taxationgreen.json" : "/extrafiles/Service.lottie"}
                  autoplay
                  loop
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16">
              <div className="flex flex-col text-center lg:text-left">

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.95] md:leading-[0.9] tracking-tighter uppercase">Business <br />Architecture</h2>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-3">
                {categories.map((cat) => {
                  const id = getCategoryId(cat);
                  const isActive = activeCategory === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveCategory(id)}
                      className={`px-6 md:px-8 py-4 md:py-5 rounded-[1.25rem] md:rounded-[1.5rem] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-500 relative flex-shrink-0 ${isActive
                          ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-y-[-2px]"
                          : `bg-white text-slate-500 border border-slate-100 hover:text-slate-900 shadow-sm ${division === 'taxation' ? 'hover:border-emerald-200' : 'hover:border-blue-200'}`
                        }`}
                    >
                      {cat}
                      {isActive && (
                        <motion.div
                          layoutId="activeDot"
                          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${division === 'taxation' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  ref={(el) => {
                    if (activeCategory) sliderRefs.current[activeCategory] = el;
                  }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: [0.21, 1.11, 0.81, 0.99] }}
                  className="flex overflow-x-auto lg:grid lg:grid-cols-2 gap-6 lg:gap-10 pb-10 lg:pb-0 snap-x snap-mandatory no-scrollbar md:-mx-0 -mx-6 px-6 md:px-0 scroll-smooth"
                >
                  {filteredServices.filter(s => getCategoryId(s.category) === activeCategory).map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex-shrink-0 w-[80vw] md:w-full snap-center"
                    >
                      <Link href={`/services/${service.id}`}>
                        <div className={`relative bg-white rounded-[2.5rem] md:rounded-[3rem] p-5 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 border border-slate-100 overflow-hidden shadow-sm`}>
                          <div className="w-full md:w-48 flex-shrink-0">
                            <div className="relative aspect-[16/9] md:aspect-square rounded-[2rem] overflow-hidden bg-slate-100">
                              <img src={service.image} alt={service.name} className="absolute inset-0 w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/5" />
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-4 md:mb-6">
                              <div className={`w-8 md:w-10 h-1 rounded-full ${division === 'taxation' ? 'bg-emerald-600/20' : 'bg-blue-600/20'}`} />
                              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Insight 0{index + 1}</span>
                            </div>

                            <h3 className={`text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-2 md:mb-3`}>
                              {service.name}
                            </h3>

                            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed mb-6 md:mb-8 line-clamp-2">
                              {service.description}
                            </p>

                            <div className="flex items-center gap-4 group/btn">
                              <span className={`text-[10px] font-black uppercase tracking-widest ${division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'}`}>Explore Strategic Depth</span>
                              <ArrowRight className={`w-4 h-4 ${division === 'taxation' ? 'text-emerald-600' : 'text-blue-600'}`} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto">
          <div className={`max-w-6xl mx-auto rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden ${division === 'taxation' ? 'bg-emerald-600 shadow-2xl shadow-emerald-600/20' : 'bg-blue-600 shadow-2xl shadow-blue-600/20'}`}>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-10">Ready to Fuel <br />Your Growth?</h2>
              <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed">Connect with our vertical heads today for a tailored financial or legal roadmap designed for your scale.</p>
              <Link href="/appointment">
                <button className="px-8 py-5 md:px-16 md:py-10 bg-white text-slate-900 rounded-full font-black text-base md:text-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-4 md:gap-6 mx-auto group">
                  Consult Experts <ArrowRight className="w-5 h-5 md:w-8 md:h-8 group-hover:translate-x-3 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
