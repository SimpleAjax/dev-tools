"use client"

import * as React from "react"
import {
    Activity,
    AlertTriangle,
    BarChart,
    Calendar,
    Clock,
    Code,
    DollarSign,
    FileText,
    Grid,
    ShieldCheck,
    Terminal,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

const tools = [
    {
        title: "Uptime/SLA Calculator",
        url: "/tools/uptime-sla-calculator",
        icon: Clock,
    },
    {
        title: "Error Budget Calculator",
        url: "/tools/error-budget-calculator",
        icon: AlertTriangle,
    },
    {
        title: "Burn Rate Alert Gen",
        url: "/tools/burn-rate-alert-generator",
        icon: Activity,
    },
    {
        title: "Log Cost Estimator",
        url: "/tools/log-cost-estimator",
        icon: DollarSign,
    },
    {
        title: "Load Test Calculator",
        url: "/tools/load-testing-calculator",
        icon: BarChart,
    },
    {
        title: "MTTR/MTBF Calculator",
        url: "/tools/mttr-mtbf-calculator",
        icon: TimerIcon,
    },
    {
        title: "Status Page Generator",
        url: "/tools/status-page-generator",
        icon: Code,
    },
    {
        title: "On-Call Visualizer",
        url: "/tools/pagerduty-visualizer",
        icon: Calendar,
    },
    {
        title: "Post-Mortem Template",
        url: "/tools/post-mortem-template",
        icon: FileText,
    },
    {
        title: "Five Nines Visualizer",
        url: "/tools/five-nines-visualizer",
        icon: Grid,
    },
]

function TimerIcon(props: React.ComponentProps<typeof Clock>) {
    return <Clock {...props} />
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <ShieldCheck className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">SRE Utils</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Reliability Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {tools.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
