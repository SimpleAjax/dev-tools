import { ComposeConverter } from "@/components/tools/compose-converter"

export const metadata = {
    title: 'Docker Compose to Kubernetes Converter | K8s Tools',
    description: 'Instantly convert Docker Compose files to Kubernetes Manifests (Deployments & Services). Translate local dev stacks to production K8s YAML.',
}

export default function ComposeConverterPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Docker Compose to Kubernetes Converter</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Migrating from local Docker Compose to a cluster? Paste your <code>docker-compose.yml</code> file below to auto-generate the equivalent Kubernetes Deployments and Services.
                </p>
            </div>

            <ComposeConverter />
        </div>
    )
}
