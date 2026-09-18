import type { Metadata } from "next";
import { Lora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";

const GA_MEASUREMENT_ID = "G-W3NM96WYJQ";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const SITE_URL = "https://seedbearerfamily.com";
const SITE_NAME = "Seedbearer Family";
const SITE_TAGLINE = "Family Coaching";
const SITE_DESCRIPTION =
  "Helping Christian parents and families rediscover who God made them to be. Free Seed Assessment, one-to-one coaching, and weekly content for parents and teenagers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
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
  founder: {
    "@type": "Person",
    name: "James",
    jobTitle: "Founder",
  },
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
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
