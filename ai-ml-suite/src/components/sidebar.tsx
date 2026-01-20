"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { tools } from "@/config/tools";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
            <div className="flex h-14 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Zap className="h-6 w-6 text-primary" />
                    <span>AI Stack</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium">
                    {tools.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === tool.href
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <tool.icon className="h-4 w-4" />
                            {tool.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto border-t p-4">
                <p className="text-xs text-muted-foreground">
                    &copy; 2026 AI Utils
                </p>
            </div>
        </div>
    );
}
