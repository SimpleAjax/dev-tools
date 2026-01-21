import Link from "next/link";
import { toolsCategories } from "@/lib/tools";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Select a tool to get started. All tools run 100% client-side.
        </p>
      </div>

      {toolsCategories.map((category) => (
        <div key={category.name} className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {category.name}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {category.tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group">
                <Card className="h-full transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <tool.icon className="h-5 w-5 text-slate-500 group-hover:text-blue-600" />
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
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
  );
}
