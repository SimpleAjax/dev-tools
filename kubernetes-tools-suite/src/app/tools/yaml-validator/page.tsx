import { YamlValidator } from "@/components/tools/yaml-validator"

export const metadata = {
    title: 'Kubernetes YAML Validator | Syntax & Schema Check',
    description: 'Validate Kubernetes YAML manifests for syntax errors and schema compliance. Identify missing fields and best practice violations instantly.',
}

export default function YamlValidatorPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Kubernetes YAML Validator</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Paste your K8s manifests below to check for syntax errors, missing required fields (like <code>metadata.name</code>), and security best practices.
                </p>
            </div>

            <YamlValidator />
        </div>
    )
}
