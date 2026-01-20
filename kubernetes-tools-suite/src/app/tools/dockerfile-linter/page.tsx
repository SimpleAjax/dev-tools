import { DockerfileLinter } from "@/components/tools/dockerfile-linter"

export const metadata = {
    title: 'Dockerfile Linter & Optimizer | K8s Tools',
    description: 'Analyze your Dockerfile for security risks and performance antipatterns. Real-time static analysis with fix suggestions.',
}

export default function DockerfileLinterPage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dockerfile Linter</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Secure your containers before you build. Detect issues like running as root, using <code>:latest</code> tags, or inefficient layer caching.
                </p>
            </div>

            <DockerfileLinter />
        </div>
    )
}
