import "@/app/globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { TopBar } from "@/components/navigation/top-bar";
import { PageHeader } from "@/components/page-header";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/constants";
import AppProvider from "@/provider";
import type { Metadata } from "next";
import { Inter, Overpass } from "next/font/google";

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
  return (
    <html lang="en">
      <body className={`${inter.variable} ${over.variable}`}>
        <AppProvider>
          <TopBar />
          <Navbar />
          <main className="min-h-screen flex flex-col relative">
            <PageHeader />
            {children}
          </main>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
