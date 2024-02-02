import "@/app/globals.css";
import { Navbar } from "@/components/navbar";
import { PageHeader } from "@/components/page-header";
import { TopBar } from "@/components/top-bar";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/lib/constants";
import AppProvider from "@/provider";
import type { Metadata } from "next";
import { Bebas_Neue, Inter, Rubik } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });
const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
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
      <body className={`${inter.variable} ${rubik.variable} ${bebas.variable}`}>
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
