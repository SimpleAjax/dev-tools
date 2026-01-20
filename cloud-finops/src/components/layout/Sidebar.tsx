"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Calculator,
    Cloud,
    Database,
    Home,
    Network,
    Server,
    Settings,
    Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: Home,
            href: "/",
            color: "text-sky-500",
        },
        {
            label: "EC2 Savings Finder",
            icon: Server,
            href: "/tools/ec2-savings",
            color: "text-violet-500",
        },
        {
            label: "Azure VM Finder",
            icon: Cloud,
            href: "/tools/azure-vm-finder",
            color: "text-blue-500",
        },
        {
            label: "Lambda Estimator",
            icon: Calculator,
            href: "/tools/lambda-cost",
            color: "text-pink-700",
        },
        {
            label: "Storage",
            icon: Database,
            href: "/tools/ebs-optimizer",
            color: "text-emerald-500",
        },
        {
            label: "S3 Lifecycle Visualizer",
            icon: Database,
            href: "/tools/s3-lifecycle",
            color: "text-teal-400",
        },
        {
            label: "DynamoDB Planner",
            icon: Database,
            href: "/tools/dynamodb-planner",
            color: "text-indigo-400",
        },
        {
            label: "GPU VRAM Finder",
            icon: Server,
            href: "/tools/gpu-finder",
            color: "text-purple-500",
        },
        {
            label: "Global Region Map",
            icon: Globe,
            href: "/tools/region-map",
            color: "text-rose-500",
        },
        {
            label: "SaaS Unit Cost",
            icon: Calculator,
            href: "/tools/unit-cost",
            color: "text-amber-500",
        },
        {
            label: "Networking",
            icon: Network,
            href: "/tools/nat-gateway",
            color: "text-orange-700",
        },
    ];

    return (
        <div className={cn("space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white", className)}>
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Cloud className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        CloudFinOps
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={(route as any).disabled ? "#" : route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                                (route as any).disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <div className="rounded-lg bg-slate-800 p-4">
                    <h3 className="text-sm font-semibold text-zinc-100 mb-2">Phase 1 Beta</h3>
                    <p className="text-xs text-zinc-400">
                        Currently in development. Prices are estimates.
                    </p>
                </div>
            </div>
        </div>
    );
}
