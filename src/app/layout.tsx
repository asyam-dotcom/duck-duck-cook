import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://duckduckcook.com"),
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [
    "bebek panggang",
    "duck duck cook",
    "kuliner bebek jakarta",
    "artisanal roasted duck",
    "katering bebek",
    "bebek halal",
  ],
  authors: [{ name: siteConfig.name }],
  icons: {
    icon: siteConfig.logo,
    apple: siteConfig.logo,
  },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.headline}`,
    description: siteConfig.description,
    url: "https://duckduckcook.com",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.logo,
        width: 800,
        height: 600,
        alt: siteConfig.name,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-surface-cream text-on-surface antialiased selection:bg-surface-mint-tint selection:text-on-surface min-h-screen flex flex-col font-jakarta">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
