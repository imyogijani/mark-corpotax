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
    <div className="min-h-screen bg-white italic-none">
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/30 rounded-full blur-[100px] -ml-48 -mb-48" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-10">
              Schedule <br />
              <span className="text-blue-600">Appointment.</span>
            </h1>
            <p className="text-base md:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed mb-20">
              {hero.subtitle}
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { label: hero.stat_1_label, value: hero.stat_1_value, icon: DollarSign },
                { label: hero.stat_2_label, value: hero.stat_2_value, icon: Clock },
                { label: hero.stat_3_label, value: hero.stat_3_value, icon: Users }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_20px_50px_rgba(37,99,235,0.03)] group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <span className="text-4xl font-black text-slate-900 tracking-tighter mb-1 uppercase">
                    {stat.value}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area - Dark Theme for Premium Form */}
      <section className="relative bg-[#111827] py-32 overflow-hidden">
        {/* Large Watermark Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="text-[30vw] font-black tracking-widest text-white uppercase italic">MARK</span>
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-20 items-stretch">
            {/* Form Section */}
            <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/5 p-12 md:p-16 rounded-[3.5rem] shadow-2xl relative">
              <div className="mb-16">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                  {formContent.form_title}
                </h2>
                <div className="h-1 w-12 bg-blue-600 rounded-full" />
              </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-10">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-blue-500" /> {formContent.name_label}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className="bg-white/5 border-0 border-b border-white/10 rounded-none h-14 px-0 text-white font-bold placeholder:text-white/20 focus:ring-0 focus:border-blue-600 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-blue-500" /> {formContent.email_label}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="john.doe@example.com"
                                {...field}
                                className="bg-white/5 border-0 border-b border-white/10 rounded-none h-14 px-0 text-white font-bold placeholder:text-white/20 focus:ring-0 focus:border-blue-600 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-blue-500" /> {formContent.phone_label}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+91 00000 00000"
                                {...field}
                                className="bg-white/5 border-0 border-b border-white/10 rounded-none h-14 px-0 text-white font-bold placeholder:text-white/20 focus:ring-0 focus:border-blue-600 transition-all"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="serviceId"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                              <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Services of Interest
                            </FormLabel>
                            <Select onValueChange={handleServiceChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-0 border-b border-white/10 rounded-none h-14 px-0 text-white font-bold placeholder:text-white/20 focus:ring-0 focus:border-blue-600 transition-all">
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-slate-900 border-white/10 text-white">
                                {services.map((service) => (
                                  <SelectItem key={service.id} value={service.id} className="hover:bg-blue-600 font-bold uppercase text-[10px] tracking-widest pl-10">
                                    {service.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-4">
                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                              <CalendarIcon className="w-3.5 h-3.5 text-blue-500" /> {formContent.date_label}
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "bg-white/5 border-0 border-b border-white/10 rounded-none h-14 px-0 text-white font-bold focus:ring-0 focus:border-blue-600 transition-all w-full text-left",
                                      !field.value && "text-white/20",
                                    )}
                                  >
                                    {field.value ? format(field.value, "PPP") : "Pick a date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-white border-0 shadow-2xl rounded-3xl overflow-hidden" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 mb-4">
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
                                  className="grid grid-cols-2 gap-3"
                                >
                                  {timeSlots.map((slot) => (
                                    <FormItem key={slot} className="flex items-center space-x-0 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value={slot} className="sr-only" />
                                      </FormControl>
                                      <FormLabel className={cn(
                                        "flex-1 flex items-center justify-center p-3 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-tight cursor-pointer transition-all hover:bg-white/10",
                                        field.value === slot ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400"
                                      )}>
                                        {slot.split(' - ')[0]}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                            <BookUser className="w-3.5 h-3.5 text-blue-500" /> {formContent.notes_label}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us anything else that might be helpful."
                              className="bg-white/5 border-0 border-b border-white/10 rounded-none min-h-[120px] px-0 py-4 text-white font-bold placeholder:text-white/20 focus:ring-0 focus:border-blue-600 transition-all resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-white hover:text-[#111827] text-white font-black uppercase tracking-[0.3em] py-10 rounded-2xl shadow-2xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-4 h-auto text-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {formContent.submit_button}
                          <ArrowRight className="w-5 h-5" />
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
                    <h4 className="text-white font-black uppercase tracking-tighter text-2xl mb-2">Priority Selection</h4>
                    <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                      Secure a session with our most senior financial strategists.
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-md">
                   <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Strategic Benefits</h4>
                   <div className="space-y-6">
                      {[content.info.benefit_1, content.info.benefit_2, content.info.benefit_3, content.info.benefit_4].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-600/20 group-hover:bg-blue-600 transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-blue-400 group-hover:text-white" />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">{benefit}</span>
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
