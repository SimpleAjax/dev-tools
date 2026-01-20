import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IaC Generators Suite',
  description: 'DevOps Configuration Generators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50`}>
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto h-screen w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
