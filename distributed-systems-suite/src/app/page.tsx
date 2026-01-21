import { TOOLS } from "@/lib/tools";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Distributed Systems Suite
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive visualizations and calculators for mastering distributed system concepts.
          Built for Senior Engineers.
        </p>
      </div>

      <div className="grid gap-8">
        {TOOLS.map((group) => (
          <div key={group.name} className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">
              {group.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((tool) => (
                <Link key={tool.href} href={tool.href} className="block group">
                  <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 w-fit rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <tool.icon className="h-6 w-6" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                      </div>
                      <CardTitle className="text-xl">{tool.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-3">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
