import { Metadata } from "next"
import { FiveNinesVisualizer } from "@/components/tools/five-nines-visualizer"

export const metadata: Metadata = {
    title: "Five Nines Visualizer | Reliability Tools",
    description: "Visualize High Availability. See what 99.999% availability actually looks like at scale.",
}

export default function Page() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Five Nines Visualizer</h1>
                <p className="text-muted-foreground text-lg">
                    A visual representation of reliability at scale (10,000 requests).
                </p>
            </div>
            <FiveNinesVisualizer />
        </div>
    )
}
