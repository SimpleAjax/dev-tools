import { PrometheusAlertBuilder } from "@/components/tools/prometheus-alert-builder"

export const metadata = {
    title: 'Prometheus Alert Rule Builder | K8s Tools',
    description: 'Visually build Prometheus Alerting Rules. Generate valid PromQL and YAML configuration without memorizing syntax.',
}

export default function PrometheusBuilderPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Prometheus Alert Builder</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Construct complex PromQL alerting rules with a simple UI. Configure thresholds, severity, and annotations then copy the ready-to-deploy YAML.
                </p>
            </div>

            <PrometheusAlertBuilder />
        </div>
    )
}
