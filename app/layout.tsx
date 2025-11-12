import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME || "Glenview Ultimate",
  description: "Youth Ultimate Frisbee in Glenview, IL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <header className="border-b">
          <div className="container py-4 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg">Glenview Ultimate</a>
            <nav className="flex gap-6 text-sm">
              <a href="/about">About</a>
              <a href="/register" className="font-semibold">Register</a>
            </nav>
          </div>
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
