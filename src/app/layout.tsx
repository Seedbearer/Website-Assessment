import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const SITE_URL = "https://seedbearerfamily.com";
const SITE_NAME = "Seedbearer Family";
const SITE_TAGLINE = "Family Coaching";
const SITE_DESCRIPTION =
  "Helping families uncover who they were always meant to be. Free Seed Assessment, one-to-one coaching, and weekly content for parents and teenagers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

// Organization schema, site-wide — gives search engines and AI answer/agent crawlers (Google's
// AI Overviews, ChatGPT/Perplexity/Claude search, etc.) an unambiguous, machine-readable identity
// for the brand to attribute quotes and citations to, independent of on-page prose.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: SITE_DESCRIPTION,
  sameAs: [
    "https://www.youtube.com/@SeedBearerFamily",
    "https://www.instagram.com/seedbearer_family/",
    "https://www.facebook.com/profile.php?id=61591608176436",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lora.variable} antialiased flex min-h-screen flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
