import { Metadata } from "next"
import { LogCostEstimator } from "@/components/tools/log-cost-estimator"

export const metadata: Metadata = {
    title: "Log Volume & Cost Estimator | Reliability Tools",
    description: "Estimate costs for SaaS logging platforms like Datadog, Splunk, or New Relic based on ingestion volume.",
}

export default function Page() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Log Volume & Cost Estimator</h1>
                <p className="text-muted-foreground text-lg">
                    Predict your log ingestion bills before they explode. Calculate daily and monthly volume in GB.
                </p>
            </div>
            <LogCostEstimator />
        </div>
    )
}
