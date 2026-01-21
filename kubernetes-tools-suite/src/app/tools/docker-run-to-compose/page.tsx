import { DockerRunToCompose } from "@/components/tools/docker-run-to-compose"

export const metadata = {
    title: 'Docker Run to Compose Converter | Migration Tool',
    description: 'Convert complex docker run commands into clean, reproducible docker-compose.yml files instantly.',
}

export default function DockerRunToComposePage() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Docker Run to Compose Converter</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Stop manually rewriting run commands. Paste your <code>docker run</code> CLI string below to generate a valid <code>docker-compose.yml</code> file.
                </p>
            </div>

            <DockerRunToCompose />
        </div>
    )
}
