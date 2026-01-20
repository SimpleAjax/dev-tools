'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, FileCode, Server, Play, Shield, Code2, Cloud, CheckSquare, Router, Activity, ShieldAlert } from 'lucide-react';
import { usePathname } from 'next/navigation';

const tools = [
    {
        name: 'Nginx Config',
        href: '/tools/nginx-config-generator',
        icon: Server,
        phase: 1
    },
    {
        name: 'Systemd Unit',
        href: '/tools/systemd-unit-generator',
        icon: Play,
        phase: 1
    },
    {
        name: 'Procfile',
        href: '/tools/procfile-generator',
        icon: FileCode,
        phase: 1
    },
    {
        name: 'WireGuard',
        href: '/tools/wireguard-generator',
        icon: Shield,
        phase: 2
    },
    {
        name: 'Cloud-Init',
        href: '/tools/cloud-init-generator',
        icon: Cloud,
        phase: 2
    },
    {
        name: 'HCL to JSON',
        href: '/tools/hcl-json-converter',
        icon: Code2,
        phase: 2
    },
    {
        name: 'Ansible Validator',
        href: '/tools/ansible-playbook-validator',
        icon: CheckSquare,
        phase: 3
    },
    {
        name: 'Traefik Builder',
        href: '/tools/traefik-config-builder',
        icon: Router,
        phase: 3
    },
    {
        name: 'HAProxy Calc',
        href: '/tools/haproxy-config-calculator',
        icon: Activity,
        phase: 3
    },
    {
        name: 'Policy Generator',
        href: '/tools/terraform-policy-generator',
        icon: ShieldAlert,
        phase: 3
    }
];

export function Sidebar() {
    return (
        <div className="w-64 border-r bg-slate-50/40 dark:bg-slate-900/40 h-screen flex flex-col sticky top-0 hidden md:flex">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Cloud className="h-6 w-6 text-blue-600" />
                    <span>IaC Suite</span>
                </Link>
            </div>
            <ScrollArea className="flex-1 py-4">
                <div className="px-4 space-y-6">
                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Phase 1: Generators
                        </h3>
                        {tools.filter(t => t.phase === 1).map((tool) => (
                            <Button key={tool.href} variant="ghost" asChild className="w-full justify-start">
                                <Link href={tool.href}>
                                    <tool.icon className="mr-2 h-4 w-4" /> {tool.name}
                                </Link>
                            </Button>
                        ))}
                    </div>

                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Phase 2: Complex
                        </h3>
                        {tools.filter(t => t.phase === 2).map((tool) => (
                            <Button key={tool.href} variant="ghost" asChild className="w-full justify-start">
                                <Link href={tool.href}>
                                    <tool.icon className="mr-2 h-4 w-4" /> {tool.name}
                                </Link>
                            </Button>
                        ))}
                    </div>

                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Phase 3: Niche
                        </h3>
                        {tools.filter(t => t.phase === 3).map((tool) => (
                            <Button key={tool.href} variant="ghost" asChild className="w-full justify-start">
                                <Link href={tool.href}>
                                    <tool.icon className="mr-2 h-4 w-4" /> {tool.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
