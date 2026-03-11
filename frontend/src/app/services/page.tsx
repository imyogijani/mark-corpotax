"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, HelpCircle, ShoppingBag, Receipt, ChevronRight } from "lucide-react";
import { servicesData } from "@/constants/servicesData";

export default function ServicesPage() {
  const categories = [
    "Retail / Mortgage",
    "SME / MSME Loans",
    "Unsecured Loans",
    "Taxation Division",
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 relative">
      {/* Static Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-slate-50">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-100/40 rounded-full opacity-40 blur-[120px]" />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] bg-emerald-50/40 rounded-full opacity-40 blur-[120px]" 
        />
        
        {/* Wave SVG (Static) */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden h-96 opacity-20">
          <svg
            className="absolute bottom-0 w-[200%] h-full"
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
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white rounded-full border border-blue-100 shadow-[0_10px_30px_rgba(37,99,235,0.08)] text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-10">
            <Sparkles className="w-4 h-4" />
            <span>Our Expertise</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-10">
            Financial Solutions <br />
            <span className="text-blue-600">For Every Scale</span>
          </h1>

          <p className="text-base md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            From individual dreams to enterprise-level excellence, our multi-division experts provide the precision your financial future demands.
          </p>
        </div>


        {/* Categories Loop */}
        <div className="space-y-40">
          {categories.map((cat, catIdx) => {
            const filteredServices = servicesData.filter(s => s.category === cat);
            if (filteredServices.length === 0) return null;

            return (
              <div
                key={cat}
                id={cat.toLowerCase().replace(/[^a-z0-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}
                className="scroll-mt-32"
              >
                <div className="flex items-end gap-6 mb-16 px-2">
                  <div className="flex flex-col">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.5em] mb-2 leading-none">Category {catIdx + 1}</span>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
                      {cat}
                    </h2>
                  </div>
                  <div className="h-[2px] flex-1 bg-slate-200 mb-2 opacity-50" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredServices.map((service) => (
                    <div key={service.id}>
                      <Link href={`/services/${service.id}`} className="group block h-full">
                        <div className="bg-white rounded-[3rem] overflow-hidden h-full flex flex-col border border-slate-100 group-hover:border-blue-200 shadow-[0_15px_40px_rgba(0,0,0,0.02)] group-hover:shadow-[0_40px_80px_rgba(37,99,235,0.1)] relative">
                          {/* Service Image Section */}
                          <div className="relative h-72 w-full overflow-hidden">
                            <img
                              src={service.image}
                              alt={service.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-lg opacity-0 group-hover:opacity-100">
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
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Can't Decide CTA */}
        <div className="mt-40">
          <div className="relative bg-slate-900 rounded-[4rem] p-10 md:p-24 overflow-hidden group">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] -ml-24 -mb-24" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
              <div className="max-w-2xl text-center lg:text-left">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-8 mx-auto lg:mx-0">
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
                <Link href="/appointment">
                  <button className="px-10 py-6 bg-white text-slate-900 rounded-full font-black text-lg md:text-xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_30px_60px_rgba(255,255,255,0.2)] transition-all flex items-center gap-4 group/btn">
                    Book Consultation <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
        </div>
      </div>
    </div>
  );
}
