"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, HelpCircle, ShoppingBag, Receipt } from "lucide-react";
import anime from "animejs";
import { servicesData } from "@/constants/servicesData";

export default function ServicesPage() {
  const headerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Initial entry animations
    anime({
      targets: ".js-reveal",
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      delay: anime.stagger(100),
      easing: "easeOutExpo",
    });

    // Staggered letters for the main title
    const textWrapper = headerRef.current;
    if (textWrapper) {
      textWrapper.innerHTML = textWrapper.textContent?.replace(
        /\S/g,
        "<span class='letter inline-block'>$&</span>"
      ) || "";

      anime({
        targets: ".letter",
        translateY: [40, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1200,
        delay: (el, i) => 500 + 30 * i,
      });
    }
  }, []);

  const categories = [
    "Retail / Mortgage",
    "SME / MSME Loans",
    "Unsecured Loans",
    "Taxation Division",
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 overflow-hidden gpu">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full animate-blob opacity-40" />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-50 rounded-full animate-blob opacity-40" 
          style={{ animationDelay: "-5s" }} 
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="js-reveal inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm text-blue-600 text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Our Expertise</span>
          </div>
          
          <h1 
            ref={headerRef}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none uppercase mb-8"
          >
            Solutions for Every Scale
          </h1>
          
          <p className="js-reveal text-xl text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            From individual home dreams to enterprise-level taxation, our multi-division experts provide the precision your financial future demands.
          </p>
        </div>

        {/* Division Selection Hub */}
        <div className="js-reveal flex flex-wrap justify-center gap-4 md:gap-8 mt-16 mb-24 max-w-5xl mx-auto group">
          <button 
            onClick={() => document.getElementById('retail-mortgage')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 min-w-[220px] glass-card p-10 flex flex-col items-center gap-6 group/btn hover:scale-105 active:scale-95 transition-all duration-500 border-white shadow-2xl bg-white/40 backdrop-blur-3xl hover:bg-white"
          >
            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 text-blue-600 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all duration-500 shadow-inner">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-black uppercase tracking-widest text-sm text-slate-900 mb-1">Finance Hub</span>
              <span className="text-xs text-slate-500 font-bold">Loans & Mortgages</span>
            </div>
          </button>

          <button 
            onClick={() => document.getElementById('taxation-division')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 min-w-[220px] glass-card p-10 flex flex-col items-center gap-6 group/btn hover:scale-105 active:scale-95 transition-all duration-500 border-white shadow-2xl bg-white/40 backdrop-blur-3xl hover:bg-white"
          >
            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover/btn:bg-emerald-600 group-hover/btn:text-white transition-all duration-500 shadow-inner">
              <Receipt className="w-8 h-8" />
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-black uppercase tracking-widest text-sm text-slate-900 mb-1">Taxation Hub</span>
              <span className="text-xs text-slate-500 font-bold">Legal & Compliance</span>
            </div>
          </button>
        </div>

        {/* Categories Loop */}
        <div className="space-y-32">
          {categories.map((cat) => {
            const filteredServices = servicesData.filter(s => s.category === cat);
            if (filteredServices.length === 0) return null;

            return (
              <div 
                key={cat} 
                id={cat.toLowerCase().replace(/[^a-z0-t]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')} 
                className="space-y-12 scroll-mt-32"
              >
                <div className="js-reveal flex items-center gap-6">
                  <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter ${cat === 'Taxation Division' ? 'decoration-tax text-emerald-900' : 'decoration-finance text-slate-900'}`}>
                    {cat}
                  </h2>
                  <div className="h-[2px] flex-1 bg-slate-200" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices.map((service) => {
                    const Icon = service.icon;
                    return (
                      <Link 
                        href={`/services/${service.id}`} 
                        key={service.id}
                        className="group"
                      >
                        <div className="js-reveal glass-card overflow-hidden h-full flex flex-col transition-all duration-500 border border-white hover:border-blue-100 shadow-xl hover:shadow-2xl">
                          {/* Service Image Section */}
                          <div className="relative h-64 w-full overflow-hidden">
                            <img 
                              src={service.image} 
                              alt={service.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                          </div>

                          <div className="p-10 pt-8 flex flex-col items-start flex-1">
                            <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                              {service.name}
                            </h3>
                        
                        <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                          {service.description}
                        </p>
                        
                        <div className="mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500 group-hover:text-blue-600 transition-all font-black">
                          Learn More <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Can't Decide CTA */}
        <div className="js-reveal mt-40 relative bg-slate-900 rounded-[3rem] p-12 md:p-24 overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:scale-110" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 mx-auto md:mx-0">
                <HelpCircle className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                Can't Decide?
              </h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                Our strategic advisors are ready to help you navigate through our complex financial landscape to find the perfect solution for you.
              </p>
            </div>
            
            <Link href="/appointment">
              <button className="px-12 py-6 bg-white text-slate-900 rounded-full font-black text-xl hover:scale-105 transition-transform flex items-center gap-3">
                Free Consultation <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
