"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft, Share2, ShieldCheck, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ToolShellProps {
    children: React.ReactNode;
    toolName: string;
    description: string;
    className?: string;
    icon?: React.ReactNode;
}

export function ToolShell({ children, toolName, description, className, icon }: ToolShellProps) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="border-b bg-white dark:bg-black py-6">
                <div className="container px-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground hover:underline transition-all flex items-center gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            {icon && (
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hidden sm:block">
                                    {icon}
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    {toolName}
                                </h1>
                                <p className="text-muted-foreground mt-1 text-lg max-w-2xl">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium border border-green-200 dark:border-green-800">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-xs">Client-Side Only</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={cn("flex-1 container py-8 px-6 max-w-7xl mx-auto", className)}>
                {children}
            </main>
        </div>
    );
}

// Reusable Copy Button Component
export function CopyButton({ text, className }: { text: string; className?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            className={cn("transition-all", className)}
            onClick={handleCopy}
        >
            {copied ? (
                <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Copied
                </>
            ) : (
                <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                </>
            )}
        </Button>
    );
}
