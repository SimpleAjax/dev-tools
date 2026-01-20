import { Metadata } from "next"
import { LoadTestingCalculator } from "@/components/tools/load-testing-calculator"

export const metadata: Metadata = {
    title: "Load Testing (VU) Calculator | Reliability Tools",
    description: "Calculate the number of Concurrent Users (VUs) needed to reach a target RPS based on Little's Law.",
}

export default function Page() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Load Testing User Calculator</h1>
                <p className="text-muted-foreground text-lg">
                    Don't guess your VUser count. Accurately calculate required concurrency using Little's Law.
                </p>
            </div>
            <LoadTestingCalculator />
        </div>
    )
}
