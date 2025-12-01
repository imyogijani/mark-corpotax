"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { contentService } from "@/lib/content-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ChevronLeft, ChevronRight } from "lucide-react";

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
  data: Record<string, unknown>
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
  <div
    className="flex items-center justify-center w-20 h-20 rounded-full"
    style={{ backgroundColor: "#0d948820" }}
  >
    <User className="w-10 h-10" style={{ color: "#0d9488" }} />
  </div>
);

export function DynamicTestimonialsSection() {
  const [testimonialsSection, setTestimonialsSection] =
    useState<TestimonialsSectionData>(FALLBACK_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        const testimonialsContent = await contentService.getContentBySection(
          "home",
          "testimonials"
        );
        if (mounted && testimonialsContent?.testimonials_section) {
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
    };

    fetchContent();
    return () => {
      mounted = false;
    };
  }, []);

  const testimonials = useMemo(
    () => testimonialsSection?.testimonials || [],
    [testimonialsSection]
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
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
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
    [isAnimating, currentIndex]
  );

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {testimonialsSection?.title || "What Our Clients Say"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {testimonialsSection?.tagline || "Client Success Stories"}
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-2xl mx-auto">
          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 rounded-full bg-white shadow-lg hover:bg-gray-50 border-gray-200"
                onClick={goToPrev}
                disabled={isAnimating}
              >
                <ChevronLeft className="h-5 w-5" style={{ color: "#0d9488" }} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 rounded-full bg-white shadow-lg hover:bg-gray-50 border-gray-200"
                onClick={goToNext}
                disabled={isAnimating}
              >
                <ChevronRight
                  className="h-5 w-5"
                  style={{ color: "#0d9488" }}
                />
              </Button>
            </>
          )}

          {/* Testimonial Card with Animation */}
          <div className="overflow-hidden">
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                isAnimating
                  ? slideDirection === "right"
                    ? "-translate-x-4 opacity-0"
                    : "translate-x-4 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <Card className="p-8 md:p-10 text-center shadow-lg border-0 bg-white">
                {/* Stars */}
                <div className="flex justify-center mb-6 gap-1">
                  {[...Array(currentTestimonial?.rating || 5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed italic">
                  &quot;
                  {currentTestimonial?.quote || currentTestimonial?.content}
                  &quot;
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <FinanceAvatar />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 text-lg">
                      {currentTestimonial?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentTestimonial?.title ||
                        currentTestimonial?.designation}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Dots Navigation */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-teal-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Progress Indicator */}
          {testimonials.length > 1 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {currentIndex + 1} / {testimonials.length}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
