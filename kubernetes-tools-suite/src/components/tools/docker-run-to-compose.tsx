"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Layers, ArrowRight, Copy, Check, Terminal, FileCode } from "lucide-react"
import yaml from "js-yaml"

export function DockerRunToCompose() {
    const [input, setInput] = useState("")
    const [output, setOutput] = useState("")
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState("")

    const convert = () => {
        setError("")
        if (!input.trim().startsWith("docker run")) {
            setError("Command must start with 'docker run'")
            return
        }

        try {
            const composeObj = parseDockerRun(input)
            const yamlStr = yaml.dump(composeObj, { indent: 2, lineWidth: -1 })
            setOutput(yamlStr)
        } catch (e: any) {
            setError(e.message)
        }
    }

    const parseDockerRun = (cmd: string) => {
        // Very basic parser logic
        // 1. Tokenize (respecting quotes)
        const args = cmd.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)?.map(s => s.replace(/^['"]|['"]$/g, '')) || []

        const service: any = {}
        let imageName = ""
        let containerName = "app"

        // Remove 'docker' and 'run'
        const flags = args.slice(2)

        // Iterate flags
        for (let i = 0; i < flags.length; i++) {
            const arg = flags[i]

            if (arg === "-p" || arg === "--publish") {
                if (!service.ports) service.ports = []
                service.ports.push(flags[++i])
            } else if (arg === "-v" || arg === "--volume") {
                if (!service.volumes) service.volumes = []
                service.volumes.push(flags[++i])
            } else if (arg === "-e" || arg === "--env") {
                if (!service.environment) service.environment = [] // List syntax
                service.environment.push(flags[++i])
            } else if (arg === "--name") {
                containerName = flags[++i]
                service.container_name = containerName
            } else if (arg === "--restart") {
                service.restart = flags[++i]
            } else if (arg === "-d" || arg === "--detach") {
                // Ignore
            } else if (arg === "--rm") {
                // Ignore
            } else if (arg === "--network") {
                if (!service.networks) service.networks = []
                service.networks.push(flags[++i])
            } else if (arg.startsWith("-")) {
                // Unknown flag, skip next if it looks like a value? 
                // Simple heuristic: if next doesn't start with -, consume it.
                if (flags[i + 1] && !flags[i + 1].startsWith("-")) {
                    i++
                }
            } else {
                // Likely the image name if strict
                if (!imageName) imageName = arg
                else {
                    // Command after image
                    if (!service.command) service.command = []
                    service.command.push(arg)
                }
            }
        }

        if (!imageName) throw new Error("Could not detect image name")

        service.image = imageName

        // format as compose v3
        return {
            version: '3.8',
            services: {
                [containerName]: service
            }
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-250px)] min-h-[500px]">
            <Card className="flex flex-col h-full border-primary/20 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" />
                        Docker Run Command
                    </CardTitle>
                    <CardDescription>Paste your full <code>docker run</code> command here.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                    <Textarea
                        placeholder="docker run -d -p 80:80 --name web nginx:latest"
                        className="h-full resize-none border-0 focus-visible:ring-0 font-mono text-sm p-4 leading-relaxed bg-muted/10"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </CardContent>
                <CardFooter className="border-t p-3 bg-muted/20">
                    <Button onClick={convert} className="w-full font-bold">
                        Convert to Compose <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>

            <Card className="flex flex-col h-full bg-[#1e1e1e] text-white border-0 shadow-lg">
                <CardHeader className="border-b border-white/10 pb-3">
                    <CardTitle className="flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <FileCode className="w-5 h-5 text-blue-400" />
                            docker-compose.yml
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyToClipboard}
                            disabled={!output}
                            className="text-white hover:bg-white/10"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 font-mono text-sm overflow-auto text-green-400">
                    {error ? (
                        <div className="text-red-400 p-4 border border-red-400/30 rounded bg-red-400/10">
                            Error: {error}
                        </div>
                    ) : (
                        <pre>{output || "# Waiting for input..."}</pre>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
