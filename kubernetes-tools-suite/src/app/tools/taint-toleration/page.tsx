import { TaintTolerationVisualizer } from "@/components/tools/taint-toleration"

export const metadata = {
    title: 'Taint & Toleration Visualizer | K8s Tools',
    description: 'Interactive visualizer for Kubernetes Node Taints and Pod Tolerations. Understand why your pods are pending or rejected.',
}

export default function TaintVisualizerPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Taint & Toleration Visualizer</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Taints are "locks" on nodes, and Tolerations are "keys" on pods. Visualizing how they interact helps debug scheduling issues instantly.
                </p>
            </div>

            <TaintTolerationVisualizer />
        </div>
    )
}
