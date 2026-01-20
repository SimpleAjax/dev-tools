import { Metadata } from "next"
import { PagerDutyVisualizer } from "@/components/tools/pagerduty-visualizer"

export const metadata: Metadata = {
    title: "On-Call Schedule Visualizer | Reliability Tools",
    description: "Visualize complex on-call rotation patterns like 2-2-3 (Panama), Weekly, or Daily cycles.",
}

export default function Page() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">On-Call Schedule Visualizer</h1>
                <p className="text-muted-foreground text-lg">
                    Plan your team's rotation. See who is on call for the next 5 weeks.
                </p>
            </div>
            <PagerDutyVisualizer />
        </div>
    )
}
