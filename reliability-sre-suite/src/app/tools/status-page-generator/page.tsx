import { Metadata } from "next"
import { StatusPageGenerator } from "@/components/tools/status-page-generator"

export const metadata: Metadata = {
    title: "Status Page JSON Generator | Reliability Tools",
    description: "Generate a standard status.json schema to expose your service health to public status pages.",
}

export default function Page() {
    return (
        <div className="container mx-auto max-w-5xl py-6">
            <div className="mb-8 flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Status Page JSON Generator</h1>
                <p className="text-muted-foreground text-lg">
                    Create a standardized JSON feed for your status page.
                </p>
            </div>
            <StatusPageGenerator />
        </div>
    )
}
