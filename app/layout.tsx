import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? "Glenview Ultimate",
  description: "Youth Ultimate Frisbee in Glenview, IL",
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-brand-green text-white">
        <Script
          src="https://umami.apps.stereorail.com/script.js"
          data-website-id="12909e0c-7500-4496-9a7d-498e13ceac79"
          strategy="afterInteractive"
        />
        <header className="border-b border-white/20">
          <Navbar />
        </header>
        <main className="container py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
