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
    <div className="appointment-page-container animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#eaf6fa] via-[#f7fbfd] to-[#f2f8fc] border-b">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {hero.title}
          </h1>
          <p className="max-w-3xl text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            {hero.subtitle}
          </p>
          <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 gap-4 w-full max-w-xs">
              <DollarSign className="text-primary" size={64} />
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {hero.stat_1_value}
                </span>
                <span className="block text-muted-foreground">
                  {hero.stat_1_label}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 gap-4 w-full max-w-xs">
              <Clock className="text-primary" size={64} />
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {hero.stat_2_value}
                </span>
                <span className="block text-muted-foreground">
                  {hero.stat_2_label}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 gap-4 w-full max-w-xs">
              <Users className="text-primary" size={64} />
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {hero.stat_3_value}
                </span>
                <span className="block text-muted-foreground">
                  {hero.stat_3_label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="appointment-layout-grid grid lg:grid-cols-2 gap-12 items-start">
          <div className="appointment-form-wrapper">
            <Card className="w-full bg-secondary/20 border-border/40">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {formContent.form_title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{formContent.name_label}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="John Doe"
                                  {...field}
                                  className="pl-9"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{formContent.email_label}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="john.doe@example.com"
                                  {...field}
                                  className="pl-9"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{formContent.phone_label}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="(123) 456-7890"
                                  {...field}
                                  className="pl-9"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="serviceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{formContent.service_label}</FormLabel>
                            <Select
                              onValueChange={handleServiceChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem
                                    key={service.id}
                                    value={service.id}
                                  >
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

                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{formContent.date_label}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-medium border-primary text-primary hover:bg-blue-50 rounded-full px-6 py-2 transition-colors",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{formContent.time_label}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                              {timeSlots.map((slot) => (
                                <FormItem
                                  key={slot}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={slot} />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {slot}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{formContent.notes_label}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us anything else that might be helpful."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <BookUser className="mr-2 h-4 w-4" />
                          {formContent.submit_button}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="appointment-image-wrapper hidden lg:block">
            <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2511&auto=format&fit=crop"
                alt="Professional scheduling an appointment"
                fill
                className="object-cover"
                data-ai-hint="calendar planning"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
