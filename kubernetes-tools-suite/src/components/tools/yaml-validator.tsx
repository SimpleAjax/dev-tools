"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, FileCode, Copy, Trash2, AlertTriangle } from "lucide-react"
import yaml from "js-yaml"

export function YamlValidator() {
    const [input, setInput] = useState("")
    const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle")
    const [errors, setErrors] = useState<string[]>([])
    const [warnings, setWarnings] = useState<string[]>([])

    const validateYaml = () => {
        if (!input.trim()) {
            setStatus("idle")
            setErrors([])
            setWarnings([])
            return
        }

        const newErrors: string[] = []
        const newWarnings: string[] = []
        let parsed: any = null

        // 1. Syntax Check
        try {
            parsed = yaml.load(input)
        } catch (e: any) {
            newErrors.push(`Syntax Error: ${e.message}`)
            setStatus("invalid")
            setErrors(newErrors)
            setWarnings([])
            return
        }

        // 2. Schema/Structure Checks (Basic K8s)
        if (!parsed) {
            newErrors.push("Document is empty")
        } else if (typeof parsed !== 'object') {
            newErrors.push("Document must be an object")
        } else {
            // Check for required K8s root fields
            if (!parsed.apiVersion) newErrors.push("Missing required field: 'apiVersion'")
            if (!parsed.kind) newErrors.push("Missing required field: 'kind'")

            if (!parsed.metadata) {
                newErrors.push("Missing required field: 'metadata'")
            } else {
                if (!parsed.metadata.name) newErrors.push("Missing required field: 'metadata.name'")
                if (parsed.metadata.namespace === "default") newWarnings.push("Explicitly defining 'default' namespace is redundant but allowed.")
            }

            // Specific Kind Checks
            if (parsed.kind === "Deployment") {
                if (!parsed.spec) newErrors.push("Deployment missing 'spec'")
                else {
                    if (!parsed.spec.selector) newErrors.push("Deployment spec.selector is required")
                    if (!parsed.spec.template) newErrors.push("Deployment spec.template is required")
                }
            }

            if (parsed.kind === "Service") {
                if (!parsed.spec) newErrors.push("Service missing 'spec'")
                else {
                    if (!parsed.spec.ports) newErrors.push("Service spec.ports is required")
                }
            }

            // Best Practice Warnings
            if (parsed.kind === "Pod" || (parsed.spec?.template?.spec?.containers)) {
                const containers = parsed.spec?.template?.spec?.containers || parsed.spec?.containers || []
                containers.forEach((c: any, i: number) => {
                    if (!c.resources) newWarnings.push(`Container '${c.name || i}' is missing resource limits/requests`)
                    if (!c.livenessProbe) newWarnings.push(`Container '${c.name || i}' is missing livenessProbe`)
                    if (!c.readinessProbe) newWarnings.push(`Container '${c.name || i}' is missing readinessProbe`)
                    if (c.imageHtmlTag === "latest") newWarnings.push(`Container '${c.name || i}' is using 'latest' tag. Pin a version for production stability.`)
                })
            }
        }

        setErrors(newErrors)
        setWarnings(newWarnings)
        setStatus(newErrors.length > 0 ? "invalid" : "valid")
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-250px)] min-h-[500px]">
            <Card className="flex flex-col h-full border-primary/20 shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FileCode className="w-5 h-5 text-primary" />
                            Input YAML
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setInput("")} disabled={!input}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 relative">
                    <Textarea
                        placeholder="Paste your Kubernetes YAML here..."
                        className="h-full resize-none border-0 focus-visible:ring-0 font-mono text-sm p-4 leading-relaxed"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </CardContent>
                <CardFooter className="border-t p-3 bg-muted/20">
                    <Button onClick={validateYaml} className="w-full font-bold">
                        Validate YAML
                    </Button>
                </CardFooter>
            </Card>

            <div className="space-y-6">
                <Card className="h-full border-muted flex flex-col">
                    <CardHeader>
                        <CardTitle>Validation Results</CardTitle>
                        <CardDescription>
                            {status === "idle" && "Waiting for input..."}
                            {status === "valid" && <span className="text-green-600 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Valid Kubernetes YAML</span>}
                            {status === "invalid" && <span className="text-red-500 font-bold flex items-center gap-2"><XCircle className="w-4 h-4" /> Validation Failed</span>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 overflow-auto flex-1">
                        {status === "idle" && (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                                <FileCode className="w-16 h-16 mb-4" />
                                <p>Paste YAML to begin validation</p>
                            </div>
                        )}

                        {errors.map((err, i) => (
                            <Alert variant="destructive" key={i}>
                                <XCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{err}</AlertDescription>
                            </Alert>
                        ))}

                        {warnings.map((warn, i) => (
                            <Alert key={i} className="border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                <AlertTitle>Suggestion</AlertTitle>
                                <AlertDescription>{warn}</AlertDescription>
                            </Alert>
                        ))}

                        {status === "valid" && warnings.length === 0 && (
                            <div className="text-center py-12 space-y-4">
                                <div className="mx-auto bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">No Issues Found</h3>
                                    <p className="text-muted-foreground">Syntax is correct and required fields are present.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
