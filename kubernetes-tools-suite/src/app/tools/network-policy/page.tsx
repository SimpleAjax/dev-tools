import { NetworkPolicyVisualizer } from "@/components/tools/network-policy-visualizer"

export const metadata = {
    title: 'Network Policy Visualizer | K8s Tools',
    description: 'Visually build Kubernetes NetworkPolicies. Understand Ingress and Egress traffic flows and generate secure YAML configurations.',
}

export default function NetworkPolicyPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Network Policy Visualizer</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Visualizing firewall rules is hard. Use this tool to design Ingress (Incoming) and Egress (Outgoing) rules for your pods and generate the YAML instantly.
                </p>
            </div>

            <NetworkPolicyVisualizer />
        </div>
    )
}
