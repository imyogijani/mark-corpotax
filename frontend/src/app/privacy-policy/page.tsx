import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for FinWeb Dynamic.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="privacy-policy-page-container animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#eaf6fa] via-[#f7fbfd] to-[#f2f8fc] border-b">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="max-w-3xl text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Your privacy is important to us. Learn how we collect, use, and
            protect your information.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">
              Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to FinWeb Dynamic. We are committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">
                2. Information We Collect
              </h2>
              <p className="text-muted-foreground">
                We may collect personal information from you such as your name,
                email address, phone number, and any other information you
                voluntarily provide to us when you fill out a contact or
                appointment form.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">
                3. Use of Your Information
              </h2>
              <p className="text-muted-foreground">
                Having accurate information permits us to provide you with a
                smooth, efficient, and customized experience. Specifically, we
                may use information collected about you via the site to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>
                  Respond to your comments and questions and provide customer
                  service.
                </li>
                <li>
                  Send you administrative information, including technical
                  notices, updates, security alerts, and support messages.
                </li>
                <li>
                  Request feedback and to contact you about your use of the
                  site.
                </li>
              </ul>
            </section>
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">
                4. Disclosure of Your Information
              </h2>
              <p className="text-muted-foreground">
                We do not share your personal information with third parties
                without your consent, except in cases where it is necessary to
                provide you with our services or required by law.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">
                5. Security of Your Information
              </h2>
              <p className="text-muted-foreground">
                We use administrative, technical, and physical security measures
                to help protect your personal information. While we have taken
                reasonable steps to secure the personal information you provide
                to us, please be aware that despite our efforts, no security
                measures are perfect or impenetrable.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-2xl font-semibold">6. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions or comments about this Privacy Policy,
                please contact us at contact@finwebdynamic.com.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
