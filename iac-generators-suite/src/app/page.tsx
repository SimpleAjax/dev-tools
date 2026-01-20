import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Play, FileCode, ArrowRight, Shield, Cloud, Code2, CheckSquare, Router, Activity, ShieldAlert } from 'lucide-react';

const tools = [
  {
    id: 'ops-15',
    name: 'Nginx Config Generator',
    description: 'Visual builder for server blocks, reverse proxies, SSL settings, and header manipulation.',
    href: '/tools/nginx-config-generator',
    icon: Server,
    tags: ['Phase 1', 'High Value']
  },
  {
    id: 'ops-14',
    name: 'Systemd Unit Generator',
    description: 'Web form to generate service.systemd files (ExecStart, Restart policies, User context).',
    href: '/tools/systemd-unit-generator',
    icon: Play,
    tags: ['Phase 1']
  },
  {
    id: 'ops-17',
    name: 'Procfile Generator',
    description: 'Generates Procfile for Heroku/Dokku/Fly.io based on language/framework selection.',
    href: '/tools/procfile-generator',
    icon: FileCode,
    tags: ['Phase 1']
  },
  {
    id: 'ops-18',
    name: 'WireGuard Config',
    description: 'Generate Peer/Interface config blocks & QR codes. Keys generated locally via WASM/JS.',
    href: '/tools/wireguard-generator',
    icon: Shield,
    tags: ['Phase 2', 'Secure', 'Private']
  },
  {
    id: 'ops-20',
    name: 'Cloud-Init Generator',
    description: 'Builder for user-data scripts to bootstrap VMs (users, packages, keys).',
    href: '/tools/cloud-init-generator',
    icon: Cloud,
    tags: ['Phase 2', 'YAML']
  },
  {
    id: 'ops-11',
    name: 'Terraform HCL to JSON',
    description: 'Converts HCL to JSON for programmatic use or debugging.',
    href: '/tools/hcl-json-converter',
    icon: Code2,
    tags: ['Phase 2', 'Converter']
  },
  {
    id: 'ops-13',
    name: 'Ansible Playbook Validator',
    description: 'Checks indentation and basic syntax structure of pasted Playbooks (YAML strictness).',
    href: '/tools/ansible-playbook-validator',
    icon: CheckSquare,
    tags: ['Phase 3', 'Validator']
  },
  {
    id: 'ops-16',
    name: 'Traefik Configuration Builder',
    description: 'Generate Traefik static/dynamic toml/yaml (routers, middlewares, entrypoints).',
    href: '/tools/traefik-config-builder',
    icon: Router,
    tags: ['Phase 3', 'Complex']
  },
  {
    id: 'ops-19',
    name: 'HAProxy Config Calculator',
    description: 'Generates basic load balancer configs based on backend server lists and algorithms.',
    href: '/tools/haproxy-config-calculator',
    icon: Activity,
    tags: ['Phase 3', 'Networking']
  },
  {
    id: 'ops-12',
    name: 'Terraform Policy Gen',
    description: 'Generates basic policy-as-code checks (Sentinel/OPA) based on user checkboxes.',
    href: '/tools/terraform-policy-generator',
    icon: ShieldAlert,
    tags: ['Phase 3', 'Policy', 'Sec']
  }
];

export default function Home() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Infrastructure Generators</h1>
        <p className="text-xl text-slate-500 max-w-2xl">
          Visualizers and generators for complex Infrastructure-as-Code files.
          Privately generate configs in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.id} href={tool.href}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-500/50">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <tool.icon className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {tool.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
