import type { Metadata, Viewport } from "next";
import AudienceEngagementLayer from "@/app/components/AudienceEngagementLayer";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bharatjankari.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport configuration for theme and scalin
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bharat Jankari | Latest India News, Business, Technology & Trading Stories",
    template: "%s | Bharat Jankari",
  },
  description: "Bharat Jankari publishes timely India-focused stories across health, business, technology, travel, entertainment, politics, esports, and trading.",
  keywords: [
    "Bharat Jankari",
    "Latest India news blogs",
    "Bharat Jankari updates",
    "best news blogs in India",
    "Latest Blogs From India",
    "India story writers",
    "Bharat technology blogs"
  ],
  alternates: {
    canonical: "/",
  },
  applicationName: "Bharat Jankari",
  category: "news",
  manifest: "/favicon/manifest.json",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Bharat Jankari",
    title: "Bharat Jankari | Latest India News, Business, Technology & Trading Stories",
    description: "Bharat Jankari publishes timely India-focused stories across health, business, technology, travel, entertainment, politics, esports, and trading.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bharat Jankari | Latest India News, Business, Technology & Trading Stories",
    description: "Bharat Jankari publishes timely India-focused stories across health, business, technology, travel, entertainment, politics, esports, and trading.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "Cc_M7OweT8JamtpZbslaPfRNed-G_VvPhgEmAUJoags",
  },
  other: {
    "msapplication-TileColor": "#ffffff",
    "msapplication-TileImage": "/favicon/ms-icon-144x144.png",
  },

  icons: {
    icon: [
      { url: "/favicon/fav.png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.png",
    apple: [
      { url: "/favicon/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/favicon/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/favicon/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/favicon/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/favicon/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/favicon/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/favicon/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/favicon/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/favicon/apple-icon-180x180.png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            try {
              var storedTheme = localStorage.getItem('bj_theme');
              var preferredTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.setAttribute('data-theme', preferredTheme);
              document.addEventListener('DOMContentLoaded', function () {
                document.body.setAttribute('data-theme', preferredTheme);
                document.body.classList.toggle('theme-dark', preferredTheme === 'dark');
                document.body.classList.toggle('theme-light', preferredTheme === 'light');
              });
            } catch (error) {
              document.documentElement.setAttribute('data-theme', 'light');
              document.addEventListener('DOMContentLoaded', function () {
                document.body.setAttribute('data-theme', 'light');
                document.body.classList.add('theme-light');
                document.body.classList.remove('theme-dark');
              });
            }
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DE6SV1BETD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DE6SV1BETD');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <AudienceEngagementLayer />
      </body>
    </html>
  );
}
