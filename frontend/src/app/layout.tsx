import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { Inter } from "next/font/google";
import { DebugStatus } from "@/components/DebugStatus";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "MARK GROUP - Shaping Financial Success in the AI Era",
    template: "%s | MARK GROUP",
  },
  description:
    "Comprehensive financial and legal solutions designed to address the unique requirements of our clients since 2012. Expert loan consultancy, MSME financing, and business growth solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased",
          inter.variable,
          "min-h-screen bg-background flex flex-col",
        )}
      >
        <AuthProvider>
          <LoadingProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
            <DebugStatus />
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
