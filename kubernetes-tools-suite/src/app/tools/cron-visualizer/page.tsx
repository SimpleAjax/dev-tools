import { CronVisualizer } from "@/components/tools/cron-visualizer"

export const metadata = {
    title: 'Kubernetes CronJob Schedule Visualizer | K8s Tools',
    description: 'Visualize your Kubernetes CronJob schedules. Convert cron expressions to human-readable strings and see upcoming run times on a timeline.',
}

export default function CronVisualizerPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Kubernetes CronJob Schedule Visualizer</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Don't guess when your jobs will run. Validate your standard cron expressions and see the exact future execution times.
                    Perfect for debugging timezones and complex intervals.
                </p>
            </div>

            <CronVisualizer />
        </div>
    )
}
