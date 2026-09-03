import type { Metadata } from "next";
import Script from "next/script";
import { Lexend } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";
import { getNavLinks } from "@/components/navbar/get-nav-links";

const lexend = Lexend({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? "Glenview Ultimate",
  description: "Youth Ultimate Frisbee in Glenview, IL",
};

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const filteredLinks = await getNavLinks();

  return (
    <html lang="en" className={lexend.variable}>
      <body className={`${lexend.className} min-h-dvh antialiased bg-brand-green text-white`}>
        <Script
          src="https://umami.glenview-ultimate.org/script.js"
          data-website-id="c374c9b6-a4c4-4c42-837e-681db5fb70f0"
          strategy="afterInteractive"
        />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <header className="border-b border-white/20">
          <Navbar links={filteredLinks} />
        </header>
        <main id="main-content" className="container py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
