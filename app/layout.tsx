import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "Glenview Ultimate",
  description: "Youth Ultimate Frisbee in Glenview, IL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ backgroundColor: '#175230', color: '#ffffff' }}>
        <header className="border-b border-white/20">
          <Navbar />
        </header>
        <main className="container py-10">{children}</main>
        <footer className="border-t border-white/20 mt-16">
          <div className="container py-8 text-sm text-white/70">
            © {new Date().getFullYear()} Glenview Ultimate
          </div>
        </footer>
      </body>
    </html>
  );
}
