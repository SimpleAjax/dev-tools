import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

export default function Home() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Select a tool to start estimating your cloud infrastructure costs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/tools/lambda-cost">
          <Card className="hover:bg-slate-900 transition cursor-pointer border-slate-800 bg-slate-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">
                Lambda Estimator
              </CardTitle>
              <Calculator className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$0.00</div>
              <p className="text-xs text-slate-400 mt-1">
                Estimate AWS Lambda costs including Free Tier.
              </p>
              <div className="mt-4 flex items-center text-sm text-pink-500">
                Open Tool <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
