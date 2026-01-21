"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TOOLS } from "@/lib/tools";
import { LayoutGrid } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const tools = TOOLS;

    return (
        <div className={cn("pb-12 h-screen border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        DistSys Suite
                    </h2>
                    <ScrollArea className="h-[calc(100vh-100px)] px-1">
                        <div className="space-y-1">
                            <Button asChild variant={pathname === "/" ? "secondary" : "ghost"} className="w-full justify-start">
                                <Link href="/">
                                    <LayoutGrid className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                        </div>
                        {tools.map((group) => (
                            <div key={group.name} className="py-2">
                                <h3 className="mb-1 px-4 text-sm font-semibold text-muted-foreground">
                                    {group.name}
                                </h3>
                                <div className="space-y-1">
                                    {group.items.map((item) => (
                                        <Button
                                            key={item.href}
                                            asChild
                                            variant={pathname === item.href ? "secondary" : "ghost"}
                                            className="w-full justify-start"
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="mr-2 h-4 w-4" />
                                                {item.name}
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
