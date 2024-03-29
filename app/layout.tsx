import "@/app/globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { TopBar } from "@/components/navigation/top-bar";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/constants";
import AppProvider from "@/provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter, Overpass } from "next/font/google";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const over = Overpass({
  subsets: ["latin"],
  variable: "--font-over",
  display: "swap",
  // weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdr = headers();
  const url = hdr.get("x-url");
  const isMatchList = url?.includes("/matches");

  return (
    <html lang="en">
      <body className={`${inter.variable} ${over.variable} dark`}>
        <AppProvider>
          <TopBar />
          <Navbar />
          <main className="min-h-screen flex flex-col bg-dot-white/[0.2] relative">
            {!isMatchList && (
              <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            )}
            {children}
          </main>
          <Toaster />
        </AppProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
