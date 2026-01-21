import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Changing to Inter as per user preference in other prompts usually
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fintech & Compliance Suite",
  description: "Engineering as Marketing tools for Fintech Developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50 antialiased`}>
        <div className="flex relative">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
