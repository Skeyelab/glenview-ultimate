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
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <header className="border-b">
          <Navbar />
        </header>
        <main className="container py-10">{children}</main>
        <footer className="border-t mt-16">
          <div className="container py-8 text-sm text-slate-600">
            © {new Date().getFullYear()} Glenview Ultimate
          </div>
        </footer>
      </body>
    </html>
  );
}
