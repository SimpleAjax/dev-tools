import { Metadata } from "next"
import { ErrorBudgetCalculator } from "@/components/tools/error-budget-calculator"

export const metadata: Metadata = {
    title: "Error Budget Calculator | Reliability Tools",
    description: "Calculate your request-based error budget based on SLO targets and request volume.",
}

export default function Page() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Error Budget Calculator</h1>
                <p className="text-muted-foreground text-lg">
                    Determine how many requests can fail without violating your Service Level Objective (SLO).
                </p>
            </div>
            <ErrorBudgetCalculator />
        </div>
    )
}
