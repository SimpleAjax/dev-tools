"use client"

import React, { useState } from 'react'
import yaml from 'js-yaml'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileCode, ArrowRight, Upload, Download, AlertCircle, Check } from "lucide-react"

export function ComposeConverter() {
    const [inputCompose, setInputCompose] = useState('')
    const [outputK8s, setOutputK8s] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'input' | 'output'>('input')

    const EXAMPLE_COMPOSE = `version: '3'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    environment:
      - ENV=production
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"`

    const convertToK8s = () => {
        try {
            setError(null)
            const compose: any = yaml.load(inputCompose)

            if (!compose || !compose.services) {
                throw new Error("Invalid Docker Compose: 'services' key missing")
            }

            const k8sManifests: any[] = []

            Object.entries(compose.services).forEach(([serviceName, serviceConfig]: [string, any]) => {
                // 1. Create Deployment
                const deployment = {
                    apiVersion: 'apps/v1',
                    kind: 'Deployment',
                    metadata: {
                        name: serviceName,
                        labels: { app: serviceName }
                    },
                    spec: {
                        replicas: 1,
                        selector: { matchLabels: { app: serviceName } },
                        template: {
                            metadata: { labels: { app: serviceName } },
                            spec: {
                                containers: [{
                                    name: serviceName,
                                    image: serviceConfig.image || 'nginx:latest', // fallback
                                    ports: serviceConfig.ports?.map((p: string) => ({
                                        containerPort: parseInt(p.split(':')[1]) || 80
                                    })),
                                    env: serviceConfig.environment ?
                                        (Array.isArray(serviceConfig.environment)
                                            ? serviceConfig.environment.map((e: string) => {
                                                const [k, v] = e.split('=')
                                                return { name: k, value: v }
                                            })
                                            : Object.entries(serviceConfig.environment).map(([k, v]) => ({ name: k, value: v }))
                                        ) : undefined
                                }]
                            }
                        }
                    }
                }
                k8sManifests.push(deployment)

                // 2. Create Service if ports exist
                if (serviceConfig.ports && serviceConfig.ports.length > 0) {
                    const service = {
                        apiVersion: 'v1',
                        kind: 'Service',
                        metadata: {
                            name: serviceName
                        },
                        spec: {
                            selector: { app: serviceName },
                            ports: serviceConfig.ports.map((p: string) => {
                                const [host, container] = p.split(':')
                                return {
                                    protocol: 'TCP',
                                    port: parseInt(host),
                                    targetPort: parseInt(container)
                                }
                            }),
                            type: 'ClusterIP'
                        }
                    }
                    k8sManifests.push(service)
                }
            })

            const output = k8sManifests.map(doc => yaml.dump(doc)).join('\n---\n')
            setOutputK8s(output)
            setActiveTab('output')

        } catch (err: any) {
            setError(err.message || "Failed to parse YAML")
        }
    }

    const loadExample = () => {
        setInputCompose(EXAMPLE_COMPOSE)
        setError(null)
    }

    return (
        <div className="grid grid-cols-1 gap-6">

            {/* Input Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
                <Card className="flex flex-col h-full">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Upload className="w-5 h-5 text-blue-500" />
                                Docker Compose
                            </div>
                            <Button variant="ghost" size="sm" onClick={loadExample}>
                                Load Example
                            </Button>
                        </CardTitle>
                        <CardDescription>Paste your docker-compose.yml here</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 relative">
                        <textarea
                            className="w-full h-full p-6 font-mono text-sm bg-muted/20 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="paste your content here..."
                            value={inputCompose}
                            onChange={(e) => setInputCompose(e.target.value)}
                            spellCheck={false}
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col h-full border-l-4 border-l-primary/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FileCode className="w-5 h-5 text-green-500" />
                                Kubernetes Manifests
                            </div>
                            <Button
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(outputK8s)
                                }}
                                disabled={!outputK8s}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        </CardTitle>
                        <CardDescription>Generated Deployments & Services</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 bg-slate-950 relative overflow-hidden">
                        {error && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 backdrop-blur-sm">
                                <Alert variant="destructive" className="max-w-md">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Conversion Failed</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            </div>
                        )}
                        <textarea
                            readOnly
                            className="w-full h-full p-6 font-mono text-sm bg-transparent text-green-400 resize-none focus:outline-none"
                            value={outputK8s}
                            placeholder="# Kubernetes YAML will appear here..."
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center">
                <Button size="lg" onClick={convertToK8s} className="px-8 text-lg gap-2">
                    Convert to Kubernetes <ArrowRight className="w-5 h-5" />
                </Button>
            </div>

        </div>
    )
}
