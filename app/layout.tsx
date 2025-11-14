import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";
import { getDirectusAssetUrl, getLogoImageId, getNavigationLinks, getWebsiteSettings } from "@/lib/directus";
import { LOGO_ID } from "@/lib/config";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME ?? "Glenview Ultimate",
  description: "Youth Ultimate Frisbee in Glenview, IL",
};

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const [websiteSettings, navigation, logoImageId] = await Promise.all([
    getWebsiteSettings(),
    getNavigationLinks(),
    getLogoImageId(),
  ]);

  const navLinks = navigation.filter((link) => !link.is_primary_cta).map((link) => ({
    href: link.href,
    label: link.label,
  }));
  const ctaLink = navigation.find((link) => link.is_primary_cta);
  const logoUrl = getDirectusAssetUrl(logoImageId ?? LOGO_ID);
  const siteName = websiteSettings.site_name ?? "Glenview Ultimate";

  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-brand-green text-white">
        <Script
          src="https://umami.apps.stereorail.com/script.js"
          data-website-id="12909e0c-7500-4496-9a7d-498e13ceac79"
          strategy="afterInteractive"
        />
        <header className="border-b border-white/20">
          <Navbar
            siteName={siteName}
            logoUrl={logoUrl}
            links={navLinks}
            ctaLabel={ctaLink?.label ?? websiteSettings.hero_cta_label}
            ctaHref={ctaLink?.href ?? websiteSettings.hero_cta_url}
          />
        </header>
        <main className="container py-10">{children}</main>
        <Footer siteName={siteName} footerText={websiteSettings.footer_text} />
      </body>
    </html>
  );
}
