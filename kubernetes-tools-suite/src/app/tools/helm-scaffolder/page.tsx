import { HelmScaffolder } from "@/components/tools/helm-scaffolder"

export const metadata = {
    title: 'Helm Chart Generator | K8s Tools',
    description: 'Generate a standard Helm Chart structure instantly. Download a .zip containing Chart.yaml, values.yaml, and templates for a production-ready start.',
}

export default function HelmScaffolderPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Helm Chart Scaffolder</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Stop deleting boilerplate code. Generate a clean, minimal Helm v3 chart structure for your microservice and download it as a zip file.
                </p>
            </div>

            <HelmScaffolder />
        </div>
    )
}
