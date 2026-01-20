import Link from "next/link";
import { tools } from "@/config/tools";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Engineering Suite</h1>
        <p className="text-muted-foreground mt-2">
          Interactive tools for AI Engineers, ML Ops, and Backend Developers.
          Calculate costs, estimate VRAM, and visualize tokens directly in your browser.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.filter(t => t.href !== "/").map((tool) => (
          <Link key={tool.href} href={tool.href} className="group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <tool.icon className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  {tool.highlight && <Badge variant="secondary">Popular</Badge>}
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {tool.name}
                </CardTitle>
                <CardDescription>
                  {tool.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
