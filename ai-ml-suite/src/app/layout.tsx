import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI & Machine Learning Stack",
  description: "Engineering-as-Marketing Tools for AI/ML Ops",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "flex h-screen bg-background text-foreground overflow-hidden")} suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
