import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Updated import based on previous read
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Security & Networking Toolkit",
  description: "A suite of client-side security and networking utilities for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
