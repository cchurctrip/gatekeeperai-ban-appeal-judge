import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Ban Appeal Judge | AI-Powered Copium Index | Gatekeeper AI",
  description: "Free AI tool for Discord & community admins. Paste a ban appeal and instantly get a Copium Index score. Detect lies, manipulation, and clichés in user appeals. Save hours of moderation time.",
  keywords: [
    "ban appeal",
    "ban appeal judge", 
    "discord moderation",
    "community moderation",
    "AI moderation tool",
    "copium index",
    "detect lies",
    "appeal analyzer",
    "discord admin tools",
    "free moderation tool",
    "gatekeeper ai",
    "ban appeal analyzer"
  ],
  authors: [{ name: "Gatekeeper AI", url: "https://gatekeeperai.app" }],
  creator: "Gatekeeper AI",
  publisher: "Gatekeeper AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://judge.gatekeeperai.app",
    siteName: "The Ban Appeal Judge",
    title: "The Ban Appeal Judge | AI-Powered Copium Index",
    description: "Free AI tool for admins. Paste a ban appeal and instantly detect lies, manipulation, and BS. Get a Copium Index score in seconds.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Ban Appeal Judge - AI-Powered Copium Index by Gatekeeper AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ban Appeal Judge | AI Copium Index",
    description: "Free AI tool for admins. Paste a ban appeal and instantly detect lies & manipulation. Get a Copium Index score in seconds.",
    images: ["/og-image.png"],
    creator: "@GatekeeperAI",
  },
  alternates: {
    canonical: "https://judge.gatekeeperai.app",
  },
  category: "Technology",
};

// JSON-LD Structured Data for LLM and SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "The Ban Appeal Judge",
  description: "AI-powered tool that analyzes ban appeals for sincerity. Get an instant Copium Index score to detect lies, emotional manipulation, and clichés in user appeals.",
  url: "https://judge.gatekeeperai.app",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "Gatekeeper AI",
    url: "https://gatekeeperai.app",
  },
  featureList: [
    "AI-powered appeal analysis",
    "Copium Index scoring (0-100%)",
    "Detects AI-written text",
    "Identifies emotional manipulation",
    "Spots common clichés and excuses",
    "Shareable judgment cards",
    "Free to use",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
