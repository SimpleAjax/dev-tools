"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { tools, categories } from "@/lib/tool-metadata";
import { ShieldAlert } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const groupedTools = tools.reduce((acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
    }, {} as Record<string, typeof tools>);

    return (
        <div className="w-64 border-r bg-slate-50/50 dark:bg-slate-950/50 h-screen overflow-y-auto hidden md:block shrink-0 sticky top-0">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-slate-50">
                    <ShieldAlert className="h-6 w-6 text-blue-600" />
                    <span>SecTools</span>
                </Link>
                <p className="text-xs text-slate-500 mt-2">
                    Engineering as Marketing
                    <br />
                    Security & Networking Suite
                </p>
            </div>

            <nav className="px-4 pb-8 space-y-8">
                {(Object.entries(categories) as [keyof typeof categories, string][]).map(([key, label]) => {
                    const catTools = groupedTools[key];
                    if (!catTools?.length) return null;

                    return (
                        <div key={key}>
                            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                {label}
                            </h3>
                            <div className="space-y-1">
                                {catTools.map((tool) => {
                                    const isActive = pathname === `/tools/${tool.slug}`;
                                    const Icon = tool.icon;
                                    return (
                                        <Link
                                            key={tool.slug}
                                            href={`/tools/${tool.slug}`}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {tool.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}
