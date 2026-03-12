"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, CheckCircle2, User, Phone, Mail, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AskExpertSection() {
  const [division, setDivision] = useState<string>("finance");
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });

  useEffect(() => {
    const handleSync = () => {
      setDivision(localStorage.getItem("user_division") || "finance");
    };
    handleSync();
    window.addEventListener("storage", handleSync);
    window.addEventListener("division-change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("division-change", handleSync);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");

    // Simulate API call
    setTimeout(() => {
      setFormState("success");
      setFormData({ name: "", contact: "", message: "" });
    }, 1500);
  };

  return (
    <section className="my-12 relative group">
      {/* Decorative Glows */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[120px] rounded-full -z-20 scale-110 opacity-50 transition-opacity group-hover:opacity-100 ${division === 'taxation' ? 'bg-emerald-600/5' : 'bg-blue-600/5'}`} />

      <div className="bg-white border border-slate-100 rounded-[3rem] shadow-[0_40px_100px_rgba(15,23,42,0.08)] overflow-hidden relative">
        <div className="grid lg:grid-cols-5 items-stretch min-h-[550px]">

          {/* Left Panel: Expert Identity */}
          <div className={`lg:col-span-2 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden transition-colors duration-700 ${division === 'taxation' ? 'bg-emerald-950' : 'bg-[#111827]'}`}>
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -mr-40 -mt-40 ${division === 'taxation' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Available Now</span>
                </div>
              </div>

              <div className="space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-black leading-none tracking-tighter uppercase whitespace-pre-line">
                  Direct <br />
                  <span className={division === 'taxation' ? 'text-emerald-400' : 'text-blue-400'}>Consulting</span>
                </h2>
                <div className={`h-1 w-12 rounded-full ${division === 'taxation' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <p className="text-slate-400 font-medium text-[13px] leading-relaxed max-w-[240px]">
                  {division === "taxation"
                    ? "Speak with our statutory experts for legal, GST, and audit clarity."
                    : "Connect directly with our panel of financial analysts for tailored capital advisory."}
                </p>
              </div>

              {/* Expert Cards */}
              <div className="space-y-6">
                {(division === "taxation"
                  ? [
                    { name: "Rahul S. Mehta", role: "Certified CA - Taxation", seeds: "CA" },
                    { name: "Meera Iyer", role: "Legal Associate", seeds: "Legal" }
                  ] : [
                    { name: "Siddharth V.", role: "Financial Advisor", seeds: "Finance" },
                    { name: "Ankit Jain", role: "MSME Funding Expert", seeds: "MSME" }
                  ]).map((expert, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/5 p-4 rounded-2xl group/exp hover:bg-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.seeds}`} alt="Expert" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-black uppercase tracking-widest text-white transition-colors ${division === 'taxation' ? 'group-hover/exp:text-emerald-400' : 'group-hover/exp:text-blue-400'}`}>{expert.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{expert.role}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="relative z-10 pt-10 mt-10 border-t border-white/5">
              <div className="flex items-center gap-6 opacity-60">
                <div className="flex flex-col gap-1">
                  <span className="text-[20px] font-black text-white">12k+</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Resolved Cases</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col gap-1">
                  <span className="text-[20px] font-black text-white">99%</span>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Client Trust</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Premium Form */}
          <div className="lg:col-span-3 p-10 md:p-14 relative bg-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-40 pointer-events-none" />

            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/5 border border-emerald-100 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Request Logged</h3>
                  <p className="text-slate-500 font-bold text-sm max-w-xs mx-auto mb-10 uppercase tracking-wide">
                    Priority consulting request has been placed. We'll reach out shortly.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setFormState("idle")}
                    className={`rounded-2xl px-10 h-14 border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] transition-all shadow-lg shadow-current/0 ${division === 'taxation' ? 'hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-emerald-500/20' : 'hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-blue-500/20'}`}
                  >
                    Send Another Request
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  <div className="space-y-10">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 flex items-center gap-2">
                          <User className={`w-3.5 h-3.5 ${division === 'taxation' ? 'text-emerald-500' : 'text-blue-500'}`} /> Professional Identity
                        </label>
                        <Input
                          required
                          placeholder="Your Name"
                          className={`bg-slate-50 border-0 border-b border-slate-100 rounded-none h-14 px-0 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-0 transition-all ${division === 'taxation' ? 'focus:border-emerald-600' : 'focus:border-blue-600'}`}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 flex items-center gap-2">
                          <Send className={`w-3.5 h-3.5 ${division === 'taxation' ? 'text-emerald-500' : 'text-blue-500'}`} /> Channel of Contact
                        </label>
                        <Input
                          required
                          placeholder="Email or WhatsApp"
                          className={`bg-slate-50 border-0 border-b border-slate-100 rounded-none h-14 px-0 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-0 transition-all ${division === 'taxation' ? 'focus:border-emerald-600' : 'focus:border-blue-600'}`}
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 flex items-center gap-2">
                        <MessageSquare className={`w-3.5 h-3.5 ${division === 'taxation' ? 'text-emerald-500' : 'text-blue-500'}`} /> Consultation Requirements
                      </label>
                      <Textarea
                        required
                        placeholder="Explain your situation in brief..."
                        className={`bg-slate-50 border-0 border-b border-slate-100 rounded-none min-h-[140px] px-0 py-4 resize-none text-slate-900 font-bold placeholder:text-slate-300 focus:ring-0 transition-all text-base ${division === 'taxation' ? 'focus:border-emerald-600' : 'focus:border-blue-600'}`}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button
                    disabled={formState === "loading"}
                    className={`group/btn w-full font-black uppercase tracking-[0.2em] py-10 rounded-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 h-auto text-xs ${division === 'taxation' ? 'bg-emerald-600 hover:bg-slate-900 text-white shadow-emerald-500/30' : 'bg-blue-600 hover:bg-slate-900 text-white shadow-blue-500/30'}`}
                  >
                    {formState === "loading" ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Initialize Consultation
                        <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${division === 'taxation' ? 'bg-emerald-500' : 'bg-blue-500'} animate-bounce`} />
                    <p className="text-[9px] text-slate-800 font-black uppercase tracking-[0.25em]">
                      Senior Team Response Time &lt; 2 Hours
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
