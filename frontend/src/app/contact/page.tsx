"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Mail, MapPin, Phone, Loader2 } from "lucide-react";
import { sendContactMessage } from "@/ai/flows/contact-flow";
import { ContactFormInputSchema } from "@/ai/schemas/contact-schemas";
import React, { useEffect, useState } from "react";
import { contentService } from "@/lib/content-service";

type ContactFormValues = z.infer<typeof ContactFormInputSchema>;

const defaultValues: Partial<ContactFormValues> = {};

// Default content
const defaultContent = {
  hero: {
    title: "Contact Us",
    subtitle:
      "Get in touch with our experts to discuss your financial needs and discover how we can help you achieve your goals.",
    stat_1_value: "24/7",
    stat_1_label: "Support Available",
    stat_2_value: "<24hrs",
    stat_2_label: "Response Time",
    stat_3_value: "Surat",
    stat_3_label: "Head Office",
  },
  form: {
    form_title: "Get in touch",
    form_subtitle: "We are here for you! How can we help?",
    name_label: "Your Name",
    email_label: "Email Here",
    message_label: "Message Here",
    subject_label: "Subject",
    submit_button: "Submit",
  },
  info: {
    address_title: "Address",
    address_line_1: "705, 7th Floor, APMC Building,",
    address_line_2: "Krushi Bazar, Sahara Darwaja,",
    address_line_3: "Ring Road, Surat - 395003",
    email_title: "Mail Us",
    email_1: "markcorpotax@gmail.com",
    email_2: "info@markcorpotax.com",
    phone_title: "Telephone",
    phone_1_label: "Finance Division:",
    phone_1_number: "+91 97120 67891",
    phone_2_label: "Taxation Division:",
    phone_2_number: "+91 97738 22604",
  },
};

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormInputSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const pageContent = await contentService.getPageContent("contact");
        if (pageContent) {
          setContent({
            hero: { ...defaultContent.hero, ...pageContent.hero },
            form: { ...defaultContent.form, ...pageContent.form },
            info: { ...defaultContent.info, ...pageContent.info },
          });
        }
      } catch (error) {
        console.error("Error fetching contact content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const result = await sendContactMessage(data);
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: result.message,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { hero, form: formContent, info } = content;

  return (
    <div className="contact-page-container animate-fade-in">
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
              <Phone className="text-primary" size={64} />
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
              <Mail className="text-primary" size={64} />
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
              <MapPin className="w-16 h-16 text-primary" />
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

      <section className="contact-form-section py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="p-8 bg-secondary/20 border-border/40">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="contact-form-column">
                <h2 className="text-3xl font-bold mb-2">
                  {formContent.form_title}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {formContent.form_subtitle}
                </p>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{formContent.name_label}</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
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
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{formContent.message_label}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Your message..."
                              className="resize-none"
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{formContent.subject_label}</FormLabel>
                          <FormControl>
                            <Input placeholder="Subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>{formContent.submit_button}</>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="contact-info-column space-y-8">
                <div className="contact-detail-item flex items-start gap-4">
                  <div className="contact-icon-wrapper bg-primary/10 p-4 rounded-md">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">
                      {info.address_title}
                    </h3>
                    <p className="text-muted-foreground">
                      {info.address_line_1}
                      <br />
                      {info.address_line_2}
                      <br />
                      {info.address_line_3}
                    </p>
                  </div>
                </div>
                <div className="contact-detail-item flex items-start gap-4">
                  <div className="contact-icon-wrapper bg-primary/10 p-4 rounded-md">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">
                      {info.email_title}
                    </h3>
                    <p className="text-muted-foreground">{info.email_1}</p>
                    <p className="text-muted-foreground">{info.email_2}</p>
                  </div>
                </div>
                <div className="contact-detail-item flex items-start gap-4">
                  <div className="contact-icon-wrapper bg-primary/10 p-4 rounded-md">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">
                      {info.phone_title}
                    </h3>
                    <p className="text-muted-foreground">
                      <strong>{info.phone_1_label}</strong>{" "}
                      {info.phone_1_number}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>{info.phone_2_label}</strong>{" "}
                      {info.phone_2_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
