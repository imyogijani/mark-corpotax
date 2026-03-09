"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { contentService } from "@/lib/content-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TestimonialItem {
  quote?: string;
  content?: string;
  name: string;
  title?: string;
  designation?: string;
  rating?: number;
}

interface TestimonialsSectionData {
  tagline?: string;
  title?: string;
  description?: string;
  testimonials?: TestimonialItem[];
}

// Static fallback content
const FALLBACK_TESTIMONIALS: TestimonialsSectionData = {
  tagline: "Testimonials",
  title: "What Our Clients Say",
  testimonials: [
    {
      name: "Rajesh Patel",
      title: "CEO, Patel Industries",
      quote:
        "MARK GROUP has been instrumental in my business growth. Their personalized approach and expert financial solutions have made all the difference.",
      rating: 5,
    },
    {
      name: "Priya Shah",
      title: "Director, Shah Enterprises",
      quote:
        "The team at MARK GROUP is incredibly knowledgeable and supportive. I feel confident knowing my business financing is in good hands.",
      rating: 5,
    },
  ],
};

// Transform flat keys from database into the expected structure
// This merges individual keys (testimonial_1_quote) with existing arrays
function transformTestimonialsData(
  data: Record<string, unknown>,
): TestimonialsSectionData {
  const section = (data.testimonials_section || {}) as Record<string, unknown>;

  // Start with existing testimonials array or empty
  let testimonials: TestimonialItem[] = Array.isArray(section.testimonials)
    ? section.testimonials.map((t: TestimonialItem) => ({ ...t }))
    : [];

  // Override with individual keys if they exist (editor saves these)
  for (let i = 1; i <= 10; i++) {
    const quote = section[`testimonial_${i}_quote`] as string;
    const name = section[`testimonial_${i}_name`] as string;
    const title = section[`testimonial_${i}_title`] as string;
    const rating = section[`testimonial_${i}_rating`];

    if (quote !== undefined || name !== undefined || title !== undefined) {
      // Ensure the array has enough elements
      while (testimonials.length < i) {
        testimonials.push({ name: "", quote: "" });
      }
      // Update the testimonial at position i-1
      if (quote !== undefined && quote !== "") {
        testimonials[i - 1].quote = quote;
        testimonials[i - 1].content = quote;
      }
      if (name !== undefined && name !== "") {
        testimonials[i - 1].name = name;
      }
      if (title !== undefined && title !== "") {
        testimonials[i - 1].title = title;
        testimonials[i - 1].designation = title;
      }
      if (typeof rating === "number") {
        testimonials[i - 1].rating = rating;
      }
    }
  }

  // Remove any testimonials with empty quote and name
  testimonials = testimonials.filter((t) => t.quote || t.name);

  return {
    tagline: (section.tagline as string) || undefined,
    title: (section.title as string) || undefined,
    description: (section.description as string) || undefined,
    testimonials: testimonials.length > 0 ? testimonials : undefined,
  };
}

const FinanceAvatar = () => (
  <motion.div
    className="flex items-center justify-center w-20 h-20 rounded-full"
    style={{ backgroundColor: "#0b4c8020" }}
    whileHover={{ scale: 1.15, rotate: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <User className="w-10 h-10" style={{ color: "#0b4c80" }} />
    </motion.div>
  </motion.div>
);

export function DynamicTestimonialsSection() {
  const [testimonialsSection, setTestimonialsSection] =
    useState<TestimonialsSectionData>(FALLBACK_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );

  const fetchContent = useCallback(async () => {
    try {
      const testimonialsContent = await contentService.getContentBySection(
        "home",
        "testimonials",
      );
      if (testimonialsContent?.testimonials_section) {
        const transformedContent =
          transformTestimonialsData(testimonialsContent);
        setTestimonialsSection(() => ({
          ...FALLBACK_TESTIMONIALS,
          ...transformedContent,
        }));
      }
    } catch (error) {
      console.error("Error loading testimonials content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    // Subscribe to cache invalidation events
    const unsubscribe = contentService.onCacheInvalidated(() => {
      fetchContent();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchContent]);

  const testimonials = useMemo(
    () => testimonialsSection?.testimonials || [],
    [testimonialsSection],
  );

  const goToNext = useCallback(() => {
    if (isAnimating || testimonials.length <= 1) return;
    setIsAnimating(true);
    setSlideDirection("right");
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, testimonials.length]);

  // Auto-slide functionality
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, goToNext]);

  const goToPrev = useCallback(() => {
    if (isAnimating || testimonials.length <= 1) return;
    setIsAnimating(true);
    setSlideDirection("left");
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, testimonials.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentIndex) return;
      setIsAnimating(true);
      setSlideDirection(index > currentIndex ? "right" : "left");
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, currentIndex],
  );

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-28 bg-[#F8FAFC] relative overflow-hidden">
      {/* Premium Light Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10"></div>

      <div className="container mx-auto px-4 mb-20">
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Animated Watermark - Light Theme */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5rem] md:text-[9rem] opacity-[0.08] font-black text-slate-200 whitespace-nowrap select-none pointer-events-none tracking-tighter uppercase"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.15, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            STORIES
          </motion.div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="w-8 h-[2px] bg-blue-600"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">
                {testimonialsSection?.tagline || "Testimonials"}
              </span>
              <span className="w-8 h-[2px] bg-blue-600"></span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-black mb-6 text-slate-900 uppercase tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {testimonialsSection?.title || "What Our Clients Say"}
            </motion.h2>

            <motion.p
              className="text-lg text-slate-600 max-w-2xl mx-auto font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              Real stories from businesses we've helped grow.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Slider Container */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          {/* Navigation Arrows - Light Theme */}
          {testimonials.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-20 z-10 w-12 h-12 rounded-full bg-white shadow-xl hover:bg-blue-600 border-slate-100 hover:border-blue-500 transition-all duration-300 group"
                onClick={goToPrev}
                disabled={isAnimating}
              >
                <ChevronLeft className="h-6 w-6 text-slate-400 group-hover:text-white" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-20 z-10 w-12 h-12 rounded-full bg-white shadow-xl hover:bg-blue-600 border-slate-100 hover:border-blue-500 transition-all duration-300 group"
                onClick={goToNext}
                disabled={isAnimating}
              >
                <ChevronRight className="h-6 w-6 text-slate-400 group-hover:text-white" />
              </Button>
            </>
          )}

          {/* Testimonial Card with Animation - Light Theme */}
          <div className="overflow-hidden px-4 md:px-0">
            <div
              className={`transition-all duration-700 ease-in-out transform ${isAnimating
                ? slideDirection === "right"
                  ? "-translate-x-8 opacity-0"
                  : "translate-x-8 opacity-0"
                : "translate-x-0 opacity-100"
                }`}
            >
              <Card className="p-10 md:p-16 text-center shadow-[0_45px_100px_rgba(0,0,0,0.05)] border-0 bg-white rounded-[3.5rem] relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <motion.div
                  className="absolute top-12 left-12 opacity-[0.05] group-hover:opacity-10 transition-opacity"
                  animate={{
                    scale: [1, 1.1, 1],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Quote className="w-24 h-24 text-blue-600" />
                </motion.div>

                {/* Stars - Animated */}
                <div className="flex justify-center mb-10 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                      className="text-yellow-400 text-2xl"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Author Info - Modern Light Layout */}
                <div className="flex flex-col items-center justify-center gap-6 mb-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                    <FinanceAvatar />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-slate-900 text-2xl mb-1 tracking-tight uppercase">
                      {currentTestimonial?.name}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                      {currentTestimonial?.title || currentTestimonial?.designation}
                    </div>
                  </div>
                </div>

                {/* Quote with Better Typography */}
                <blockquote className="text-xl md:text-3xl text-slate-700 mb-6 leading-snug font-bold tracking-tight max-w-2xl mx-auto italic">
                  &quot;{currentTestimonial?.quote || currentTestimonial?.content}&quot;
                </blockquote>
              </Card>
            </div>
          </div>

          {/* Dots Navigation - Light Theme */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${index === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Progress Indicator */}
          {testimonials.length > 1 && (
            <div className="mt-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              {currentIndex + 1} / {testimonials.length}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
