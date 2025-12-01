import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for FinWeb Dynamic.',
};

export default function TermsOfServicePage() {
  return (
    <div className="terms-of-service-page-container animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#eaf6fa] via-[#f7fbfd] to-[#f2f8fc] border-b">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Terms of Service</h1>
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-6">Please read these terms carefully before using our services.</p>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">Terms of Service</CardTitle>
             <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">2. Use of the Site</h2>
            <p className="text-muted-foreground">
              You agree to use the site for lawful purposes only. You are prohibited from using the site to post or transmit any material that is threatening, defamatory, obscene, or that infringes on the intellectual property rights of others.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">3. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              The information provided on this website is for informational purposes only and does not constitute financial advice. We provide the site on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of the site or the information, content, or materials included on the site.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">4. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              In no event shall FinWeb Dynamic be liable for any damages of any kind arising from the use of this site, including, but not limited to, direct, indirect, incidental, punitive, and consequential damages.
            </p>
          </section>
           <section className="space-y-2">
            <h2 className="text-2xl font-semibold">5. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law principles.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">6. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at contact@finwebdynamic.com.
            </p>
          </section>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
