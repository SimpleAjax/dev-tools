import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Distributed Systems Suite",
  description: "Engineering-as-Marketing Tools for Distributed Systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <div className="flex h-screen overflow-hidden bg-background font-sans antialiased text-foreground">
          <aside className="hidden w-64 flex-col border-r bg-background md:flex">
            <Sidebar />
          </aside>
          <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950/50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
