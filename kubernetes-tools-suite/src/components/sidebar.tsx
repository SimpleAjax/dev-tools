"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
    Box,
    Clock,
    FileCode,
    LayoutDashboard,
    Menu,
    Settings2,
    Shield,
    FolderArchive,
    Bell,
    Cpu,
    ShieldCheck,
    Network,
    CircleOff
} from "lucide-react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        variant: "default"
    },
    {
        title: "Bin Packer",
        href: "/tools/node-bin-packer",
        icon: Box,
        variant: "ghost"
    },
    {
        title: "YAML Generator",
        href: "/tools/deployment-generator",
        icon: FileCode,
        variant: "ghost"
    },
    {
        title: "Cron Visualizer",
        href: "/tools/cron-visualizer",
        icon: Clock,
        variant: "ghost"
    },
    {
        title: "Compose to K8s",
        href: "/tools/compose-converter",
        icon: FileCode,
        variant: "ghost"
    },
    {
        title: "Dockerfile Linter",
        href: "/tools/dockerfile-linter",
        icon: Shield,
        variant: "ghost"
    },
    {
        title: "Helm Scaffolder",
        href: "/tools/helm-scaffolder",
        icon: FolderArchive,
        variant: "ghost"
    },
    {
        title: "Prometheus Alerts",
        href: "/tools/prometheus-alert",
        icon: Bell,
        variant: "ghost"
    },
    {
        title: "Resource Calculator",
        href: "/tools/resource-calculator",
        icon: Cpu,
        variant: "ghost"
    },
    {
        title: "RBAC Generator",
        href: "/tools/rbac-generator",
        icon: ShieldCheck,
        variant: "ghost"
    },
    {
        title: "Network Policy",
        href: "/tools/network-policy",
        icon: Network,
        variant: "ghost"
    },
    {
        title: "Taint Visualizer",
        href: "/tools/taint-toleration",
        icon: CircleOff,
        variant: "ghost"
    }
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mb-2 px-4 text-lg font-bold tracking-tight flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-primary" />
                        K8s Tools
                    </div>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                asChild
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MobileNav() {
    const pathname = usePathname()

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pl-1 pr-0">
                <div className="px-7">
                    <Link
                        href="/"
                        className="flex items-center"
                    >
                        <Settings2 className="mr-2 h-4 w-4" />
                        <span className="font-bold">K8s Tools</span>
                    </Link>
                </div>
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                    <div className="flex flex-col space-y-3">
                        {sidebarItems.map(
                            (item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center text-sm font-medium text-muted-foreground",
                                        pathname === item.href && "text-primary font-bold"
                                    )}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            )
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
