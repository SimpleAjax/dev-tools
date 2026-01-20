import Link from "next/link"
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
  ArrowRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const tools = [
  {
    title: "Uptime/SLA Calculator",
    description: "Convert 99.9% uptime to allowable downtime per year, month, or week.",
    url: "/tools/uptime-sla-calculator",
    icon: Clock,
  },
  {
    title: "Error Budget Calculator",
    description: "Calculate your allowable error budget based on total requests and SLO target.",
    url: "/tools/error-budget-calculator",
    icon: AlertTriangle,
  },
  {
    title: "Burn Rate Alert Generator",
    description: "Generate complex PromQL queries for multi-window SLO burn rate alerts.",
    url: "/tools/burn-rate-alert-generator",
    icon: Activity,
  },
  {
    title: "Log Volume/Cost Estimator",
    description: "Estimate Datadog/Splunk costs based on log lines per second and retention.",
    url: "/tools/log-cost-estimator",
    icon: DollarSign,
  },
  {
    title: "Load Test User Calculator",
    description: "Use Little's Law to calculate concurrent users from RPS and Latency.",
    url: "/tools/load-testing-calculator",
    icon: BarChart,
  },
  {
    title: "MTTR/MTBF Calculator",
    description: "Calculate Mean Time To Recovery and Between Failures from incident logs.",
    url: "/tools/mttr-mtbf-calculator",
    icon: Clock, // Reusing clock, or could use another icon
  },
  {
    title: "Status Page JSON Generator",
    description: "Generate a standard status.json schema for your health check endpoints.",
    url: "/tools/status-page-generator",
    icon: Code,
  },
  {
    title: "PagerDuty Schedule Visualizer",
    description: "Visualize on-call rotation patterns like 2-2-3 or weekly shifts.",
    url: "/tools/pagerduty-visualizer",
    icon: Calendar,
  },
  {
    title: "Incident Post-Mortem Template",
    description: "Generate a structured Markdown template for RCAs and incident reports.",
    url: "/tools/post-mortem-template",
    icon: FileText,
  },
  {
    title: "Five Nines Visualizer",
    description: "Visual grid showing what 99.999% availability actually looks like.",
    url: "/tools/five-nines-visualizer",
    icon: Grid,
  },
]

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reliability Engineering Suite</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          A collection of premium utility tools for SREs and DevOps professionals.
          Bridge the gap between abstract reliability concepts and concrete metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.url} className="group block h-full">
            <Card className="h-full transition-all hover:bg-muted/50 hover:shadow-sm hover:border-sidebar-primary/50">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary group-hover:bg-sidebar-primary group-hover:text-sidebar-primary-foreground transition-colors">
                  <tool.icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                  Open Tool <ArrowRight className="ml-1 size-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
