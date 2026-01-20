import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Box, Container, Layers, Settings2, FileCode, Shield, FolderArchive, Bell, Cpu, ShieldCheck, Network, CircleOff } from "lucide-react"

export const metadata = {
  title: 'Kubernetes Engineering Tools | Free DevOps Utilities',
  description: 'A suite of free, client-side tools for Kubernetes engineers, SREs, and Platform Architects. Bin packing, YAML generation, and more.',
}

const TOOLS = [
  {
    id: "INF-11",
    title: "Node Bin-Packing Calculator",
    description: "Calculate optimal node sizes and minimize resource fragmentation for your K8s clusters.",
    href: "/tools/node-bin-packer",
    icon: Box,
    category: "Infrastructure",
    badge: "New"
  },
  {
    id: "OPS-01",
    title: "YAML Generator",
    description: "Generate error-free Deployment, Service, and Ingress manifests in seconds.",
    href: "/tools/deployment-generator",
    icon: FileCode,
    category: "Operations",
    badge: "New"
  },
  {
    id: "OPS-08",
    title: "CronJob Visualizer",
    description: "Visualize K8s CronJob schedules on a calendar to prevent overlap and verify timing.",
    href: "/tools/cron-visualizer",
    icon: Settings2,
    category: "Operations",
    badge: "New"
  },
  {
    id: "OPS-04",
    title: "Docker Compose to K8s",
    description: "Convert docker-compose.yml files into production-ready Kubernetes Deployments and Services.",
    href: "/tools/compose-converter",
    icon: Layers,
    category: "Migration",
    badge: "New"
  },
  {
    id: "OPS-05",
    title: "Dockerfile Linter",
    description: "Analyze Dockerfiles for security risks, build performance issues, and best practices.",
    href: "/tools/dockerfile-linter",
    icon: Shield,
    category: "Security",
    badge: "New"
  },
  {
    id: "OPS-03",
    title: "Helm Chart Scaffolder",
    description: "Instantly generate a valid Helm v3 chart structure with standard templates.",
    href: "/tools/helm-scaffolder",
    icon: FolderArchive,
    category: "Packaging",
    badge: "New"
  },
  {
    id: "OPS-07",
    title: "Prometheus Alert Builder",
    description: "Visually build PromQL alerting rules with thresholds, severity, and descriptions.",
    href: "/tools/prometheus-alert",
    icon: Bell,
    category: "Monitoring",
    badge: "New"
  },
  {
    id: "OPS-09",
    title: "Resource Calculator",
    description: "Calculate optimal CPU/Memory requests and limits based on runtime and load.",
    href: "/tools/resource-calculator",
    icon: Cpu,
    category: "SRE",
    badge: "New"
  },
  {
    id: "OPS-06",
    title: "RBAC Generator",
    description: "Create secure Roles and ClusterRoles by visually selecting resources and verbs.",
    href: "/tools/rbac-generator",
    icon: ShieldCheck,
    category: "Security",
    badge: "New"
  },
  {
    id: "OPS-10",
    title: "Network Policy Visualizer",
    description: "Design and visualize Ingress/Egress traffic rules and generate NetworkPolicies.",
    href: "/tools/network-policy",
    icon: Network,
    category: "Security",
    badge: "New"
  },
  {
    id: "OPS-11",
    title: "Taint & Toleration Visualizer",
    description: "Interactive playground to understand how Node Taints block or allow Pod scheduling.",
    href: "/tools/taint-toleration",
    icon: CircleOff,
    category: "Scheduling",
    badge: "New"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center gap-2 mb-2">
            <Container className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl tracking-tight">K8s.Tools</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Engineering as Marketing <br className="hidden sm:inline" />
            <span className="text-primary">Kubernetes Utility Suite</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            A collection of client-side, privacy-focused tools designed to solve the daily friction points of DevOps Engineers and SREs.
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <Link key={tool.id} href={tool.href} className="group block h-full">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 relative overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <tool.icon className="w-6 h-6" />
                    </div>
                    {tool.badge && (
                      <Badge variant={tool.badge === "New" ? "default" : "secondary"}>
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-sm font-mono text-primary/60 mt-1">
                    {tool.id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {tool.description}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 font-medium">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2026 Cimulink Engineering. Built with Next.js & ShadCN UI.</p>
        </div>
      </footer>
    </div>
  )
}
