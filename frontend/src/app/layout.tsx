import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { Providers } from "@/components/providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Aimers — Aim higher. Learn smarter.",
    template: "%s | Aimers",
  },
  description:
    "Aimers — online education platform with courses, instructor tools, and AI learning support.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Aimers — Aim higher. Learn smarter.",
    description:
      "Courses, instructor tools, and AI agents for focused online learning.",
    siteName: "Aimers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aimers — Aim higher. Learn smarter.",
    description:
      "Courses, instructor tools, and AI agents for focused online learning.",
  },
  icons: {
    icon: "/favicon.svg",
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
      className={`${outfit.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
