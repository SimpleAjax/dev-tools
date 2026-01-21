import { ServerlessCostCalculator } from "@/components/tools/serverless-cost-calc"

export const metadata = {
    title: 'Serverless Cost Calculator | K8s Tools',
    description: 'Estimate and compare AWS Lambda, Azure Functions, and Google Cloud Functions pricing based on your memory and invocation needs.',
}

export default function ServerlessCostCalculatorPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Serverless Cost Calculator</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Estimate monthly costs for major serverless providers. Adjust invocation counts, execution duration, and memory allocation to see how usage scales.
                </p>
            </div>

            <ServerlessCostCalculator />
        </div>
    )
}
