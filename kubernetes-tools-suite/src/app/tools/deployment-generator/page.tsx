import { DeploymentGenerator } from "@/components/tools/deployment-generator"

export const metadata = {
    title: 'Kubernetes Deployment YAML Generator | K8s Tools',
    description: 'Generate production-ready Kubernetes Deployment manifests in seconds. Configure replicas, resources, and probes without memorizing YAML syntax.',
}

export default function DeploymentGeneratorPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Kubernetes Deployment YAML Generator</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Stop copy-pasting old manifests. Build a clean, valid Deployment YAML for your stateless applications instantly.
                </p>
            </div>

            <DeploymentGenerator />
        </div>
    )
}
