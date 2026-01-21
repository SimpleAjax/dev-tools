"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toolsCategories } from "@/lib/tools";

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-slate-50/50 dark:bg-slate-950/50">
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    DevTools
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Productivity Suite
                </p>
            </div>
            <ScrollArea className="flex-1 px-3 min-h-0">
                <div className="space-y-6 pb-6">
                    {toolsCategories.map((category) => (
                        <div key={category.name}>
                            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                {category.name}
                            </h2>
                            <div className="space-y-1">
                                {category.tools.map((tool) => (
                                    <Button
                                        key={tool.href}
                                        variant={pathname === tool.href ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start",
                                            pathname === tool.href && "bg-slate-200 dark:bg-slate-800"
                                        )}
                                        asChild
                                    >
                                        <Link href={tool.href}>
                                            <tool.icon className="mr-2 h-4 w-4" />
                                            {tool.name}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
