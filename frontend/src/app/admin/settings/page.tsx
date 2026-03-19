"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Search,
  Save,
  RefreshCw,
  LayoutDashboard,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Zap,
  ArrowRight,
  Fingerprint,
  Link as LinkIcon,
} from "lucide-react";
import { authFetch } from "@/lib/auth";
import { contentService } from "@/lib/content-service";

interface SiteSettings {
  company_name: string;
  company_tagline: string;
  email: string;
  phone_finance: string;
  phone_taxation: string;
  address: string;
  business_hours: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  whatsapp: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  ga_id: string;
}

export default function SettingsPage() {
  const { setTitle } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SiteSettings>({
    company_name: "MARK GROUP",
    company_tagline: "Shaping Financial Success in the AI Era",
    email: "markcorpotax@gmail.com",
    phone_finance: "97120 67891/92",
    phone_taxation: "97738 22604",
    address: "705, 7th Floor, APMC Building, Krushi Bazar, Sahara Darwaja, Ring Road, Surat - 395003",
    business_hours: "Mon - Sat: 10:00 AM - 7:00 PM",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    whatsapp: "",
    meta_title: "Mark Corpotax | Financial & Taxation Experts",
    meta_description: "Expert financial and taxation solutions in Surat, Gujarat. Dedicated to delivering comprehensive financial and legal solutions.",
    keywords: "finance, taxation, msme loan, surat, gujarat, financial planning",
    ga_id: "",
  });

  useEffect(() => {
    setTitle("System Settings");
  }, [setTitle]);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await authFetch("/admin/content?page=settings");
      if (resp.success && Array.isArray(resp.data)) {
        const found: Partial<SiteSettings> = {};
        resp.data.forEach((item: any) => {
          if (item.key in settings) {
            (found as any)[item.key] = item.value;
          }
        });
        setSettings(prev => ({ ...prev, ...found }));
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => {
        let section = "general";
        if (["facebook", "twitter", "linkedin", "instagram", "whatsapp"].includes(key)) section = "social";
        if (["meta_title", "meta_description", "keywords", "ga_id"].includes(key)) section = "seo";
        if (["phone_finance", "phone_taxation", "email", "address"].includes(key)) section = "contact";
        if (["company_name", "company_tagline"].includes(key)) section = "header";

        return authFetch("/admin/content", {
          method: "PUT",
          body: JSON.stringify({
            page: "settings",
            section,
            key,
            value
          })
        });
      });

      await Promise.all(updates);
      await authFetch("/content/clear-cache", { method: "POST", body: JSON.stringify({ page: "settings" }) });
      contentService.clearCache();

      toast({
        title: "Deployment Successful",
        description: "Your global configurations have been synchronized with the live site.",
        className: "bg-slate-900 border-primary text-white font-bold",
      });
    } catch (err) {
      toast({
        title: "Synchronization Failed",
        description: "An error occurred during the update cycle.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full"
          />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
        </div>
        <p className="text-xl font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Initializing System...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 relative">
      {/* Background Decorative Element */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-[-100px] w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -z-10" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-[1.25rem] shadow-xl shadow-primary/20">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">
              Global Control <span className="text-primary">Center</span>
            </h1>
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[11px] pl-[60px]">
            Master Configuration / Site Wide Intelligence
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm">
          <Button
            variant="ghost"
            onClick={fetchSettings}
            className="rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all"
          >
            <RefreshCw className="h-4 w-4 mr-2 text-slate-400" />
            Reload Data
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-slate-900 border-0 text-white"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2 text-primary" />}
            {saving ? "Deploying..." : "Sync Changes"}
          </Button>
        </div>
      </motion.div>

      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex overflow-hidden">
          <TabsList className="flex md:grid w-full grid-cols-4 h-auto p-1.5 bg-slate-100/80 backdrop-blur-md rounded-[1.5rem] border border-slate-200/50 mb-10 overflow-x-auto no-scrollbar">
            <TabsTrigger value="general" className="py-4 rounded-[1.25rem] data-[state=active]:bg-white data-[state=active]:shadow-[0_8px_30px_rgb(0,0,0,0.06)] data-[state=active]:text-primary font-black uppercase tracking-widest text-[10px] gap-2 transition-all">
              <Building2 className="h-4 w-4" /> <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="py-4 rounded-[1.25rem] data-[state=active]:bg-white data-[state=active]:shadow-[0_8px_30px_rgb(0,0,0,0.06)] data-[state=active]:text-primary font-black uppercase tracking-widest text-[10px] gap-2 transition-all">
              <Phone className="h-4 w-4" /> <span className="hidden sm:inline">Connect</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="py-4 rounded-[1.25rem] data-[state=active]:bg-white data-[state=active]:shadow-[0_8px_30px_rgb(0,0,0,0.06)] data-[state=active]:text-primary font-black uppercase tracking-widest text-[10px] gap-2 transition-all">
              <Globe className="h-4 w-4" /> <span className="hidden sm:inline">Socials</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="py-4 rounded-[1.25rem] data-[state=active]:bg-white data-[state=active]:shadow-[0_8px_30px_rgb(0,0,0,0.06)] data-[state=active]:text-primary font-black uppercase tracking-widest text-[10px] gap-2 transition-all">
              <Search className="h-4 w-4" /> <span className="hidden sm:inline">SEO Edge</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <motion.div
          layout
          className="w-full min-h-[400px] relative"
          transition={{
            layout: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10, filter: "blur(4px)" }}
              transition={{
                duration: 0.25,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="w-full"
            >
              <TabsContent value="general" className="mt-0 outline-none">
                <div className="grid lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 border-0 shadow-[0_25px_80px_rgba(0,0,0,0.03)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardHeader className="p-10 pb-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                          <Fingerprint className="h-5 w-5 text-orange-600" />
                        </div>
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">Core Identity</CardTitle>
                      </div>
                      <CardDescription className="text-[11px] uppercase tracking-widest font-black text-slate-400">Primary Brand Metadata for Mark Corpotax</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 pt-4 space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Official Entity Name</Label>
                          <Input
                            value={settings.company_name}
                            onChange={e => setSettings({ ...settings, company_name: e.target.value })}
                            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Corporate Tagline</Label>
                          <Input
                            value={settings.company_tagline}
                            onChange={e => setSettings({ ...settings, company_tagline: e.target.value })}
                            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between group overflow-hidden relative">
                        <div className="space-y-1 relative z-10">
                          <h4 className="text-lg font-black uppercase tracking-tighter">Site Builder Access</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Update layout & navigation blocks</p>
                        </div>
                        <Button asChild className="relative z-10 rounded-xl bg-primary hover:bg-white hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest h-12 shadow-xl shadow-primary/20 text-white hover:text-primary">
                          <a href="/admin/site-builder" className="flex items-center">Launch Builder <ArrowRight className="h-4 w-4 ml-2" /></a>
                        </Button>
                        <Zap className="absolute right-[-20px] top-[-20px] h-32 w-32 text-white/5 rotate-12" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-xl rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-white overflow-hidden p-8 flex flex-col items-center justify-center text-center gap-6 relative group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary/20" />
                    <div className="w-24 h-24 rounded-[2rem] bg-white shadow-2xl flex items-center justify-center border-4 border-slate-50 relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                      <LayoutDashboard className="h-10 w-10 text-slate-200" />
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-black uppercase tracking-tighter">Brand Asset</h4>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">High Resolution transparency <br />Logo (PNG/SVG/WebP)</p>
                    </div>
                    <Button variant="outline" className="w-full rounded-2xl h-14 font-black uppercase text-[11px] tracking-widest border-2 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                      Upload Package
                    </Button>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-0 outline-none">
                <Card className="border-0 shadow-[0_25px_80px_rgba(0,0,0,0.03)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
                  <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl font-black uppercase tracking-tighter">Reach Intelligence</CardTitle>
                      </div>
                      <CardDescription className="text-[11px] uppercase tracking-widest font-black text-slate-400">Global connectivity settings per division</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 pt-4 space-y-10">
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Finance Hotlines
                            </Label>
                            <span className="text-[9px] font-bold text-blue-600 uppercase">Strategic Loans</span>
                          </div>
                          <Input
                            value={settings.phone_finance}
                            onChange={e => setSettings({ ...settings, phone_finance: e.target.value })}
                            className="h-14 rounded-2xl border-blue-50 bg-blue-50/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Taxation Service
                            </Label>
                            <span className="text-[9px] font-bold text-emerald-600 uppercase">Legal & Audit</span>
                          </div>
                          <Input
                            value={settings.phone_taxation}
                            onChange={e => setSettings({ ...settings, phone_taxation: e.target.value })}
                            className="h-14 rounded-2xl border-emerald-50 bg-emerald-50/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 pl-1">
                            System Email Node
                          </Label>
                          <Input
                            value={settings.email}
                            onChange={e => setSettings({ ...settings, email: e.target.value })}
                            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 pl-1">
                            Operation Timeline
                          </Label>
                          <Input
                            value={settings.business_hours}
                            onChange={e => setSettings({ ...settings, business_hours: e.target.value })}
                            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 pl-1">
                        Global Headquarters Address
                      </Label>
                      <Textarea
                        value={settings.address}
                        onChange={e => setSettings({ ...settings, address: e.target.value })}
                        className="rounded-[2rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-800 min-h-[120px] p-6 text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="mt-0 outline-none">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { id: 'facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Facebook Hub' },
                    { id: 'linkedin', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-100/50', label: 'LinkedIn Professional' },
                    { id: 'twitter', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50', label: 'X / Twitter Feed' },
                    { id: 'instagram', icon: Instagram, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Instagram Visuals' },
                    { id: 'whatsapp', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'WhatsApp Direct' },
                  ].map((platform) => (
                    <Card key={platform.id} className="border-0 shadow-[0_15px_50px_rgba(0,0,0,0.03)] rounded-[2rem] p-8 space-y-4 hover:shadow-xl transition-all duration-500 group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${platform.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                          <platform.icon className={`h-6 w-6 ${platform.color}`} />
                        </div>
                        <div>
                          <h4 className="font-extrabold uppercase tracking-tighter text-slate-900">{platform.label}</h4>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Public Profile URL</p>
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          value={(settings as any)[platform.id]}
                          onChange={e => setSettings({ ...settings, [platform.id]: e.target.value })}
                          placeholder={`https://${platform.id}.com/markcorp`}
                          className="h-12 rounded-xl border-slate-50 bg-slate-50 focus:bg-white transition-all pl-10 text-[13px] font-medium"
                        />
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="seo" className="mt-0 outline-none">
                <Card className="border-0 shadow-[0_25px_80px_rgba(0,0,0,0.03)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
                  <header className="p-10 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-2xl font-black uppercase tracking-tighter text-slate-900">Search Engine Indexing</CardTitle>
                    </div>
                  </header>
                  <CardContent className="p-10 pt-4 space-y-10">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Global Meta Title (Live Search)</Label>
                        <Input
                          value={settings.meta_title}
                          onChange={e => setSettings({ ...settings, meta_title: e.target.value })}
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 transition-all font-bold text-slate-900 border-l-4 border-l-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Global Description Snippet</Label>
                        <Textarea
                          value={settings.meta_description}
                          onChange={e => setSettings({ ...settings, meta_description: e.target.value })}
                          className="rounded-[2.5rem] border-slate-100 bg-slate-50/50 transition-all font-bold text-slate-800 min-h-[140px] p-8 text-sm leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Keywords Library (CSV)</Label>
                        <Input
                          value={settings.keywords}
                          onChange={e => setSettings({ ...settings, keywords: e.target.value })}
                          placeholder="loan, tax, auditor, finance..."
                          className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Google Analytics Payload (G-ID)</Label>
                        <div className="relative">
                          <Input
                            value={settings.ga_id}
                            onChange={e => setSettings({ ...settings, ga_id: e.target.value })}
                            placeholder="G-XXXXXXXXXX"
                            className="h-14 rounded-2xl border-slate-100 bg-slate-800 text-white font-mono tracking-widest pl-10"
                          />
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Tabs>

      {/* Dynamic System Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 py-10 border-t border-slate-100 gap-6"
      >
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2 group cursor-help"><ShieldCheck className="h-4 w-4 text-primary group-hover:scale-125 transition-transform" /> DATA PROTECTED</span>
          <span className="flex items-center gap-2 group cursor-help"><Fingerprint className="h-4 w-4 text-emerald-500 group-hover:scale-125 transition-transform" /> ENCRYPTED NODE</span>
        </div>
        <div className="px-6 py-2 bg-slate-100 rounded-full text-slate-500 opacity-80 backdrop-blur-sm">
          MARK GROUP ADMIN CORE V2.4.0-STABLE
        </div>
      </motion.div>
    </div>
  );
}
