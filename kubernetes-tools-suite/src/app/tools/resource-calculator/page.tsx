import { ResourceCalculator } from "@/components/tools/resource-calculator"

export const metadata = {
    title: 'Pod Resource Calculator | K8s Tools',
    description: 'Calculate optimal Kubernetes CPU and Memory requests/limits for Node.js, Java, Go, and Python applications.',
}

export default function ResourceCalculatorPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Pod Resource Calculator</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Stop guessing your resource limits. Get baseline CPU and Memory recommendations based on your application runtime and expected load profile.
                </p>
            </div>

            <ResourceCalculator />
        </div>
    )
}
