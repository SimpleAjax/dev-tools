import { RbacGenerator } from "@/components/tools/rbac-generator"

export const metadata = {
    title: 'RBAC Policy Generator | K8s Tools',
    description: 'Create Kubernetes Roles and ClusterRoles visually. Select resources and verbs to generate secure Least Privilege policies.',
}

export default function RbacGeneratorPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">RBAC Policy Generator</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Don't write RoleBindings by hand. Visually construct specific permission sets for your ServiceAccounts and generate the exact YAML you need.
                </p>
            </div>

            <RbacGenerator />
        </div>
    )
}
