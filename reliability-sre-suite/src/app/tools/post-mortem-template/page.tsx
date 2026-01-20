import { Metadata } from "next"
import { PostMortemTemplate } from "@/components/tools/post-mortem-template"

export const metadata: Metadata = {
    title: "Incident Post-Mortem Template | Reliability Tools",
    description: "Generate a structured markdown template for standardizing your RCA (Root Cause Analysis) documents.",
}

export default function Page() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Incident Post-Mortem Generator</h1>
                <p className="text-muted-foreground text-lg">
                    Don't start from a blank page. Generate a best-practice outage report in seconds.
                </p>
            </div>
            <PostMortemTemplate />
        </div>
    )
}
