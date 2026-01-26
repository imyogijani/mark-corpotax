import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function SubscribeCta() {
  return (
    <section
      className="subscribe-cta-section py-12 md:py-14"
      style={{ backgroundColor: "#fbfbfc" }}
    >
      <div className="container mx-auto px-4 text-center text-gray-900">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800">
          A financial partner you can trust
        </h2>

        <form className="max-w-md mx-auto flex items-center gap-2 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
          <Input
            type="email"
            placeholder="Your email address"
            className="flex-grow bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none pl-5 h-10"
          />
          <Button
            type="submit"
            className="rounded-full bg-[#0b4c80] hover:bg-[#093e69] text-white px-6 h-10 text-sm font-medium transition-colors"
          >
            Subscribe
          </Button>
        </form>
        <p className="text-xs text-slate-400 mt-3 font-medium">
          Join 2,000+ businesses growing with us.
        </p>
      </div>
    </section>
  );
}
