"use client"

import React, { useState, useEffect } from 'react'
import yaml from 'js-yaml'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileCode, Copy, Check, Server } from "lucide-react"

export function DeploymentGenerator() {
    const [formData, setFormData] = useState({
        name: 'my-app',
        image: 'nginx:latest',
        replicas: 3,
        port: 80,
        namespace: 'default',
        requestsCpu: '100m',
        requestsMem: '128Mi',
        limitsCpu: '500m',
        limitsMem: '512Mi',
        hasLivenessProbe: true,
        hasReadinessProbe: true,
        generateService: true,
        generateIngress: false,
        ingressHost: 'example.com',
    })

    const [generatedYaml, setGeneratedYaml] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const deployment = {
            apiVersion: 'apps/v1',
            kind: 'Deployment',
            metadata: {
                name: formData.name,
                namespace: formData.namespace,
                labels: {
                    app: formData.name
                }
            },
            spec: {
                replicas: formData.replicas,
                selector: {
                    matchLabels: {
                        app: formData.name
                    }
                },
                template: {
                    metadata: {
                        labels: {
                            app: formData.name
                        }
                    },
                    spec: {
                        containers: [
                            {
                                name: formData.name,
                                image: formData.image,
                                ports: [
                                    {
                                        containerPort: formData.port
                                    }
                                ],
                                resources: {
                                    requests: {
                                        cpu: formData.requestsCpu,
                                        memory: formData.requestsMem
                                    },
                                    limits: {
                                        cpu: formData.limitsCpu,
                                        memory: formData.limitsMem
                                    }
                                },
                                ...(formData.hasLivenessProbe ? {
                                    livenessProbe: {
                                        httpGet: {
                                            path: '/',
                                            port: formData.port
                                        },
                                        initialDelaySeconds: 15,
                                        periodSeconds: 20
                                    }
                                } : {}),
                                ...(formData.hasReadinessProbe ? {
                                    readinessProbe: {
                                        httpGet: {
                                            path: '/',
                                            port: formData.port
                                        },
                                        initialDelaySeconds: 5,
                                        periodSeconds: 10
                                    }
                                } : {})
                            }
                        ]
                    }
                }
            }
        }

        const docs: any[] = [deployment]

        if (formData.generateService) {
            docs.push({
                apiVersion: 'v1',
                kind: 'Service',
                metadata: {
                    name: formData.name,
                    namespace: formData.namespace
                },
                spec: {
                    selector: {
                        app: formData.name
                    },
                    ports: [
                        {
                            protocol: 'TCP',
                            port: formData.port,
                            targetPort: formData.port
                        }
                    ],
                    type: 'ClusterIP'
                }
            })
        }

        if (formData.generateIngress) {
            docs.push({
                apiVersion: 'networking.k8s.io/v1',
                kind: 'Ingress',
                metadata: {
                    name: formData.name,
                    namespace: formData.namespace,
                    annotations: {
                        'nginx.ingress.kubernetes.io/rewrite-target': '/'
                    }
                },
                spec: {
                    rules: [
                        {
                            host: formData.ingressHost,
                            http: {
                                paths: [
                                    {
                                        path: '/',
                                        pathType: 'Prefix',
                                        backend: {
                                            service: {
                                                name: formData.name,
                                                port: {
                                                    number: formData.port
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            })
        }

        try {
            setGeneratedYaml(docs.map(doc => yaml.dump(doc)).join('\n---\n'))
        } catch (e) {
            console.error(e)
        }
    }, [formData])

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedYaml)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="w-5 h-5 text-primary" />
                            Configuration
                        </CardTitle>
                        <CardDescription>Define your deployment specs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>App Name</Label>
                                <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Namespace</Label>
                                <Input value={formData.namespace} onChange={(e) => handleChange('namespace', e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Image</Label>
                            <Input value={formData.image} onChange={(e) => handleChange('image', e.target.value)} placeholder="nginx:latest" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Replicas</Label>
                                <Input type="number" min={1} value={formData.replicas} onChange={(e) => handleChange('replicas', parseInt(e.target.value) || 1)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Container Port</Label>
                                <Input type="number" value={formData.port} onChange={(e) => handleChange('port', parseInt(e.target.value) || 80)} />
                            </div>
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <Label className="font-semibold">Resources</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Req CPU</Label>
                                    <Input className="h-8" value={formData.requestsCpu} onChange={(e) => handleChange('requestsCpu', e.target.value)} />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Limit CPU</Label>
                                    <Input className="h-8" value={formData.limitsCpu} onChange={(e) => handleChange('limitsCpu', e.target.value)} />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Req Mem</Label>
                                    <Input className="h-8" value={formData.requestsMem} onChange={(e) => handleChange('requestsMem', e.target.value)} />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Limit Mem</Label>
                                    <Input className="h-8" value={formData.limitsMem} onChange={(e) => handleChange('limitsMem', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="liveness">Liveness Probe</Label>
                                <Switch id="liveness" checked={formData.hasLivenessProbe} onCheckedChange={(c) => handleChange('hasLivenessProbe', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="readiness">Readiness Probe</Label>
                                <Switch id="readiness" checked={formData.hasReadinessProbe} onCheckedChange={(c) => handleChange('hasReadinessProbe', c)} />
                            </div>
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="service">Generate Service</Label>
                                <Switch id="service" checked={formData.generateService} onCheckedChange={(c) => handleChange('generateService', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="ingress">Generate Ingress</Label>
                                <Switch id="ingress" checked={formData.generateIngress} onCheckedChange={(c) => handleChange('generateIngress', c)} />
                            </div>
                            {formData.generateIngress && (
                                <div className="pt-2">
                                    <Label>Ingress Host</Label>
                                    <Input value={formData.ingressHost} onChange={(e) => handleChange('ingressHost', e.target.value)} placeholder="example.com" />
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>
            </div>

            <div className="h-full">
                <Card className="h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Generated YAML</CardTitle>
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 pt-4">
                        <div className="relative h-full min-h-[500px] w-full bg-slate-950 rounded-md overflow-hidden">
                            <textarea
                                className="w-full h-full bg-transparent text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
                                value={generatedYaml}
                                onChange={(e) => setGeneratedYaml(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
