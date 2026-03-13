"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Mail,
  Phone,
  User,
  BookUser,
  Loader2,
  DollarSign,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  BarChart2,
  Briefcase,
} from "lucide-react";
import { Logo } from "@/components/logo-image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { contentService } from "@/lib/content-service";

// Default CMS content
const defaultContent = {
  hero: {
    title: "Schedule an Appointment",
    subtitle:
      "Fill out the form below to request an appointment with one of our financial experts.",
    stat_1_value: "Free",
    stat_1_label: "Consultation",
    stat_2_value: "30 Min",
    stat_2_label: "Session Duration",
    stat_3_value: "Expert",
    stat_3_label: "Financial Advisors",
  },
  form: {
    form_title: "Your Information",
    form_subtitle: "Fill in the details below to book your appointment",
    name_label: "Full Name",
    email_label: "Email Address",
    phone_label: "Phone Number (Optional)",
    service_label: "Service of Interest",
    date_label: "Preferred Date",
    time_label: "Preferred Time",
    notes_label: "Additional Notes (Optional)",
    submit_button: "Submit Request",
  },
  info: {
    info_title: "Why Book With Us?",
    benefit_1: "Expert Financial Advisors",
    benefit_2: "Personalized Solutions",
    benefit_3: "Flexible Scheduling",
    benefit_4: "Confidential Consultation",
    contact_title: "Need Help?",
    contact_phone: "+91 97120 67891",
    contact_email: "appointments@markcorpotax.com",
  },
};

// Service options
const services = [
  { id: "msme-project-finance", name: "MSME Project Finance" },
  { id: "working-capital", name: "Working Capital Solutions" },
  { id: "home-mortgage-loans", name: "Home & Mortgage Loans" },
  { id: "tax-planning", name: "Taxation Services" },
  { id: "business-loans", name: "Business Loans" },
  { id: "government-schemes", name: "Government Schemes" },
  { id: "wealth-management", name: "Wealth Management" },
  { id: "investment-advice", name: "Investment Advice" },
];

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
];

const appointmentFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  serviceId: z.string().min(1, "Please select a service."),
  serviceName: z.string(),
  preferredDate: z.date({
    required_error: "A date is required.",
  }),
  preferredTime: z.string().min(1, "Please select a time slot."),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

const defaultValues: Partial<AppointmentFormValues> = {
  fullName: "",
  email: "",
  phone: "",
  serviceId: "",
  serviceName: "",
  preferredTime: "",
  notes: "",
};

export default function AppointmentPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState(defaultContent);

  const API_URL =
    typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:5000/api";

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues,
  });

  // Fetch CMS content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const pageContent = await contentService.getPageContent("appointment");
        if (pageContent) {
          setContent({
            hero: { ...defaultContent.hero, ...pageContent.hero },
            form: { ...defaultContent.form, ...pageContent.form },
            info: { ...defaultContent.info, ...pageContent.info },
          });
        }
      } catch (error) {
        console.error("Error fetching appointment content:", error);
      }
    };
    fetchContent();
  }, []);

  async function onSubmit(data: AppointmentFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone || "",
          serviceId: data.serviceId,
          serviceName: data.serviceName,
          date: format(data.preferredDate, "yyyy-MM-dd"),
          time: data.preferredTime,
          message: data.notes || "",
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Appointment Request Submitted!",
          description:
            "We have received your appointment request. Our team will contact you shortly to confirm.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: result.message,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle service selection to also set serviceName
  const handleServiceChange = (serviceId: string) => {
    const selectedService = services.find((s) => s.id === serviceId);
    form.setValue("serviceId", serviceId);
    form.setValue("serviceName", selectedService?.name || "");
  };

  const { hero, form: formContent } = content;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/30 rounded-full blur-[100px] -ml-48 -mb-48" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-10 font-outfit">
              Schedule <span className="text-blue-600">Appointment.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed mb-20 font-sans">
              {hero.subtitle}
            </p>

          </div>
        </div>
      </section>

      {/* Main Content Area - Dark Theme for Premium Form */}
      <section className="relative bg-[#111827] py-32 overflow-hidden">
        {/* Large Watermark Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[30vw] font-black tracking-widest text-white uppercase italic">MARK</span>
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-20 items-stretch">
            {/* Form Section */}
            <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/5 p-12 md:p-16 rounded-[3.5rem] shadow-2xl relative">
              <div className="mb-16">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 font-outfit">
                  {formContent.form_title}
                </h2>
                <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                  <div className="grid md:grid-cols-2 gap-10">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2 mb-3 group-focus-within:text-blue-400 transition-colors font-outfit">
                            <User className="w-3.5 h-3.5 text-blue-500" /> {formContent.name_label}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/[0.03] backdrop-blur-sm transition-all font-sans"
                            />
                          </FormControl>
                          <FormMessage className="text-rose-500 font-bold text-[10px] uppercase tracking-wider" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2 mb-3 group-focus-within:text-blue-400 transition-colors font-outfit">
                            <Mail className="w-3.5 h-3.5 text-blue-500" /> {formContent.email_label}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john.doe@example.com"
                              {...field}
                              className="bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/[0.03] backdrop-blur-sm transition-all font-sans"
                            />
                          </FormControl>
                          <FormMessage className="text-rose-500 font-bold text-[10px] uppercase tracking-wider" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2 mb-3 group-focus-within:text-blue-400 transition-colors font-outfit">
                            <Phone className="w-3.5 h-3.5 text-blue-500" /> {formContent.phone_label}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+91 00000 00000"
                              {...field}
                              className="bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/[0.03] backdrop-blur-sm transition-all font-sans"
                            />
                          </FormControl>
                          <FormMessage className="text-rose-500 font-bold text-[10px] uppercase tracking-wider" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serviceId"
                      render={({ field }) => (
                        <FormItem className="group">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2 mb-3 group-focus-within:text-blue-400 transition-colors font-outfit">
                            <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Services of Interest
                          </FormLabel>
                          <Select onValueChange={handleServiceChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/[0.03] backdrop-blur-sm transition-all">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl overflow-hidden">
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id} className="hover:bg-blue-600 font-bold uppercase text-[10px] tracking-widest pl-10 focus:bg-blue-600 transition-colors">
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-rose-500 font-bold text-[10px] uppercase tracking-wider" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col group">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2 mb-3 group-focus-within:text-blue-400 transition-colors font-outfit">
                            <CalendarIcon className="w-3.5 h-3.5 text-blue-500" /> {formContent.date_label}
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/[0.03] backdrop-blur-sm transition-all w-full text-left font-sans hover:bg-white/10 hover:text-white",
                                    !field.value && "text-white/20",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border-0 shadow-2xl rounded-[2rem] overflow-hidden" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-rose-500 font-bold text-[10px] uppercase tracking-wider" />
                        </FormItem>
                      )}
                    />

                    <div className="group">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2 mb-4 group-focus-within:text-blue-400 transition-colors font-outfit">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> {formContent.time_label}
                      </label>
                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                {timeSlots.map((slot) => (
                                  <FormItem key={slot} className="flex items-center space-x-0 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={slot} className="sr-only" />
                                    </FormControl>
                                    <FormLabel className={cn(
                                      "flex-1 flex items-center justify-center p-4 rounded-2xl border border-white/10 bg-white/[0.03] text-[10px] font-black uppercase tracking-tight cursor-pointer transition-all hover:bg-white/10 hover:border-white/20",
                                      field.value === slot ? "bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20 scale-[1.02]" : "text-slate-400"
                                    )}>
                                      {slot.split(' - ')[0]}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage className="text-rose-500 font-bold text-[10px] uppercase tracking-wider" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2 mb-3 group-focus-within:text-blue-400 transition-colors font-outfit">
                          <BookUser className="w-3.5 h-3.5 text-blue-500" /> {formContent.notes_label}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us anything else that might be helpful."
                            className="bg-white/5 border border-white/10 rounded-[2rem] min-h-[140px] px-6 py-6 text-white font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 bg-white/[0.03] backdrop-blur-sm transition-all resize-none font-sans"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-rose-500 font-bold text-[10px] uppercase tracking-wider" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-black uppercase tracking-[0.3em] py-10 rounded-[2rem] shadow-[0_20px_50px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-4 h-auto text-xs border border-white/10 font-outfit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="animate-pulse">Processing...</span>
                      </>
                    ) : (
                      <>
                        {formContent.submit_button}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Sidebar Info/Expert Section */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              <div className="relative h-[450px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2511&auto=format&fit=crop"
                  alt="Professional appointment"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-10 left-10 right-10">
                  <h4 className="text-white font-black uppercase tracking-tighter text-2xl mb-2 font-outfit">Priority Selection</h4>
                  <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Secure a session with our most senior financial strategists.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-md">
                 <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-8 font-outfit opacity-60">Strategic Benefits</h4>
                 <div className="space-y-6">
                    {[content.info.benefit_1, content.info.benefit_2, content.info.benefit_3, content.info.benefit_4].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-600/20 group-hover:bg-blue-600 transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 group-hover:text-white" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-300 font-outfit">{benefit}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
