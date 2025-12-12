import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import Link from "next/link";

export function SubscribeCta() {
  return (
    <section
      className="subscribe-cta-section py-16 md:py-20"
      style={{ backgroundColor: "#fbfbfc" }}
    >
      <div className="container mx-auto px-4 text-center text-gray-900">
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <Logo className="h-10 w-10 text-teal-600" />
          <span className="text-2xl font-bold">Mark Corpotax</span>
        </Link>
        <h2 className="text-3xl md:text-4xl font-bold">
          A financial partner you can trust
        </h2>
        <p className="mt-2 text-lg opacity-70">www.markcorpotax.com</p>

        <form className="mt-8 max-w-lg mx-auto flex items-center gap-4 p-2 bg-white border border-gray-200 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 transition-shadow">
          <Input
            type="email"
            placeholder="Your email address"
            className="flex-grow bg-transparent border-none text-gray-900 placeholder:text-gray-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
          />
          <Button
            type="submit"
            size="lg"
            className="rounded-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 font-medium transition-colors"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
