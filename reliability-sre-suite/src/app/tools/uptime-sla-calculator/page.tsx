import { Metadata } from "next"
import { UptimeSlaCalculator } from "@/components/tools/uptime-sla-calculator"

export const metadata: Metadata = {
    title: "Uptime & SLA Calculator | Reliability Tools",
    description: "Calculate allowable downtime for your Service Level Agreements (SLA). Convert 99.9% uptime to concrete time windows.",
}

export default function UptimeSlaCalculatorPage() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Uptime & SLA Calculator</h1>
                <p className="text-muted-foreground text-lg">
                    Translate availability percentages into understandable downtime allowances.
                </p>
            </div>
            <UptimeSlaCalculator />
        </div>
    )
}
