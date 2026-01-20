import { NodeBinPacker } from "@/components/tools/node-bin-packer"

export const metadata = {
    title: 'Kubernetes Node Bin-Packing Calculator | K8s Tools',
    description: 'Calculate the optimal number of nodes required for your Kubernetes workloads to minimize waste and cost.',
}

export default function NodeBinPackerPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Kubernetes Node Bin-Packing Calculator</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Visualizing how your pods fit into nodes. Stop guessing standard node sizes and start optimizing for efficiency.
                    Add your services, define your node specs, and see the fragmentation instantly.
                </p>
            </div>

            <NodeBinPacker />
        </div>
    )
}
