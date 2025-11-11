import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glenview Ultimate",
  description: "Monorepo bootstrap using Next.js and Payload CMS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}



