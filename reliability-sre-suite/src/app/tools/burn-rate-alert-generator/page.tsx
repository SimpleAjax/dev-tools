import { Metadata } from "next"
import { BurnRateAlertGenerator } from "@/components/tools/burn-rate-alert-generator"

export const metadata: Metadata = {
    title: "SLO Burn Rate Alert Generator | Reliability Tools",
    description: "Generate PromQL queries for Multi-Window Multi-Burn-Rate alerting based on Google SRE workbook practices.",
}

export default function Page() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">SLO Burn Rate Alert Generator</h1>
                <p className="text-muted-foreground text-lg">
                    Create Prometheus/VictoriaMetrics alerting rules that fire only when your error budget is actually in danger.
                </p>
            </div>
            <BurnRateAlertGenerator />
        </div>
    )
}
