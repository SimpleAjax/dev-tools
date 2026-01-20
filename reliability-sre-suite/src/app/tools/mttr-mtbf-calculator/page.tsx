import { Metadata } from "next"
import { MttrMtbfCalculator } from "@/components/tools/mttr-mtbf-calculator"

export const metadata: Metadata = {
    title: "MTTR & MTBF Calculator | Reliability Tools",
    description: "Calculate Mean Time To Recovery (MTTR) and Mean Time Between Failures (MTBF) from your incident logs.",
}

export default function Page() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">MTTR & MTBF Calculator</h1>
                <p className="text-muted-foreground text-lg">
                    Measure system stability and recovery speed. Input incident durations to derive key reliability metrics.
                </p>
            </div>
            <MttrMtbfCalculator />
        </div>
    )
}
