"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Trash2, Plus, Server, Box, Calculator } from "lucide-react"

// Types
type Pod = {
    id: string
    name: string
    cpu: number // in cores
    ram: number // in GB
    count: number
    color: string
}

type NodeSpec = {
    cpu: number // in cores
    ram: number // in GB
    cost: number // per month
}

type NodeAllocation = {
    id: string
    spec: NodeSpec
    pods: Pod[]
    usedCpu: number
    usedRam: number
}

// Colors for pods
const POD_COLORS = [
    "bg-red-400", "bg-blue-400", "bg-green-400", "bg-yellow-400",
    "bg-purple-400", "bg-pink-400", "bg-indigo-400", "bg-orange-400"
]

export function NodeBinPacker() {
    // State
    const [pods, setPods] = useState<Pod[]>([
        { id: '1', name: 'Frontend', cpu: 0.5, ram: 1, count: 5, color: POD_COLORS[0] },
        { id: '2', name: 'Backend', cpu: 1, ram: 2, count: 3, color: POD_COLORS[1] },
        { id: '3', name: 'Database', cpu: 2, ram: 8, count: 1, color: POD_COLORS[2] },
    ])

    const [nodeSpec, setNodeSpec] = useState<NodeSpec>({
        cpu: 4,
        ram: 16,
        cost: 40
    })

    // Algorithm Logic
    const result = useMemo(() => {
        // Flatten pod list based on counts
        let allPods: Pod[] = []
        pods.forEach(p => {
            for (let i = 0; i < p.count; i++) {
                allPods.push({ ...p, id: `${p.id}-${i}` })
            }
        })

        // Sort pods by dominant resource (simple heuristic: CPU and RAM magnitude)
        // Larger pods first (First Fit Decreasing / Best Fit Decreasing)
        allPods.sort((a, b) => (b.cpu * 1000 + b.ram) - (a.cpu * 1000 + a.ram))

        const nodes: NodeAllocation[] = []

        allPods.forEach(pod => {
            // Find a node that fits
            let bestNodeIndex = -1

            // Best Fit: Find node with tightest fit (min remaining space after placement)
            // This is a simplified "First Fit" for now which is often good enough for visualization
            // We can improve to Best Fit by tracking fragmentation.

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i]
                if (node.usedCpu + pod.cpu <= node.spec.cpu && node.usedRam + pod.ram <= node.spec.ram) {
                    bestNodeIndex = i
                    break
                }
            }

            if (bestNodeIndex >= 0) {
                // Add to existing node
                nodes[bestNodeIndex].pods.push(pod)
                nodes[bestNodeIndex].usedCpu += pod.cpu
                nodes[bestNodeIndex].usedRam += pod.ram
            } else {
                // Create new node
                nodes.push({
                    id: `node-${nodes.length + 1}`,
                    spec: nodeSpec,
                    pods: [pod],
                    usedCpu: pod.cpu,
                    usedRam: pod.ram
                })
            }
        })

        return {
            nodes,
            totalCost: nodes.length * nodeSpec.cost,
            totalCpu: nodes.length * nodeSpec.cpu,
            totalRam: nodes.length * nodeSpec.ram,
            utilizationCpu: (allPods.reduce((acc, p) => acc + p.cpu, 0) / (nodes.length * nodeSpec.cpu)) * 100,
            utilizationRam: (allPods.reduce((acc, p) => acc + p.ram, 0) / (nodes.length * nodeSpec.ram)) * 100,
        }
    }, [pods, nodeSpec])

    // Handlers
    const addPod = () => {
        const newId = (Math.max(...pods.map(p => parseInt(p.id))) + 1).toString()
        setPods([...pods, {
            id: newId,
            name: 'New Service',
            cpu: 0.5,
            ram: 1,
            count: 1,
            color: POD_COLORS[pods.length % POD_COLORS.length]
        }])
    }

    const removePod = (id: string) => {
        setPods(pods.filter(p => p.id !== id))
    }

    const updatePod = (id: string, field: keyof Pod, value: any) => {
        setPods(pods.map(p => p.id === id ? { ...p, [field]: value } : p))
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Controls */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Box className="w-5 h-5 text-primary" />
                            Pod Requirements
                        </CardTitle>
                        <CardDescription>Define your workload resources</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {pods.map((pod) => (
                            <div key={pod.id} className="p-3 bg-muted rounded-lg space-y-3 relative group">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => removePod(pod.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>

                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${pod.color}`} />
                                    <Input
                                        value={pod.name}
                                        onChange={(e) => updatePod(pod.id, 'name', e.target.value)}
                                        className="h-8 text-sm font-medium"
                                        placeholder="Service Name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="text-xs">CPU (Cores)</Label>
                                        <Input
                                            type="number"
                                            min={0.1}
                                            step={0.1}
                                            value={pod.cpu}
                                            onChange={(e) => updatePod(pod.id, 'cpu', parseFloat(e.target.value) || 0)}
                                            className="h-8"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">RAM (GB)</Label>
                                        <Input
                                            type="number"
                                            min={0.1}
                                            step={0.1}
                                            value={pod.ram}
                                            onChange={(e) => updatePod(pod.id, 'ram', parseFloat(e.target.value) || 0)}
                                            className="h-8"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label className="text-xs">Count: {pod.count}</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => updatePod(pod.id, 'count', Math.max(1, pod.count - 1))}
                                        >
                                            -
                                        </Button>
                                        <span className="text-sm w-4 text-center">{pod.count}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => updatePod(pod.id, 'count', pod.count + 1)}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button onClick={addPod} className="w-full" variant="outline">
                            <Plus className="w-4 h-4 mr-2" /> Add Service
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Server className="w-5 h-5 text-primary" />
                            Node Spec
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>CPU (Cores)</Label>
                                <Input
                                    type="number"
                                    value={nodeSpec.cpu}
                                    onChange={(e) => setNodeSpec({ ...nodeSpec, cpu: parseFloat(e.target.value) || 1 })}
                                />
                            </div>
                            <div>
                                <Label>RAM (GB)</Label>
                                <Input
                                    type="number"
                                    value={nodeSpec.ram}
                                    onChange={(e) => setNodeSpec({ ...nodeSpec, ram: parseFloat(e.target.value) || 1 })}
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Cost per Month ($)</Label>
                            <Input
                                type="number"
                                value={nodeSpec.cost}
                                onChange={(e) => setNodeSpec({ ...nodeSpec, cost: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Visualization */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{result.nodes.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Est. Monthly Cost</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${result.totalCost}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground">
                                CPU: {result.utilizationCpu.toFixed(1)}% <br />
                                RAM: {result.utilizationRam.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {result.nodes.map((node, idx) => (
                        <Card key={node.id} className="relative overflow-hidden border-2 border-muted hover:border-primary transition-colors">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex justify-between">
                                    <span>Node {idx + 1}</span>
                                    <span className="text-xs font-normal text-muted-foreground">
                                        {nodeSpec.cpu} vCPU / {nodeSpec.ram} GB
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {/* Visual Representation of Resource Usage */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>CPU Usage</span>
                                        <span>{((node.usedCpu / node.spec.cpu) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-4 bg-secondary rounded-full overflow-hidden flex">
                                        {node.pods.map((pod, pIdx) => (
                                            <div
                                                key={`${pod.id}-${pIdx}`}
                                                className={`h-full border-r border-background/20 ${pod.color}`}
                                                style={{ width: `${(pod.cpu / node.spec.cpu) * 100}%` }}
                                                title={`${pod.name}: ${pod.cpu} cores`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>RAM Usage</span>
                                        <span>{((node.usedRam / node.spec.ram) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-4 bg-secondary rounded-full overflow-hidden flex">
                                        {node.pods.map((pod, pIdx) => (
                                            <div
                                                key={`${pod.id}-${pIdx}`}
                                                className={`h-full border-r border-background/20 ${pod.color}`}
                                                style={{ width: `${(pod.ram / node.spec.ram) * 100}%` }}
                                                title={`${pod.name}: ${pod.ram} GB`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-border">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">Deployed Pods:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {node.pods.map((pod, pIdx) => (
                                            <Badge key={`${pod.id}-${pIdx}`} variant="secondary" className="text-[10px] h-5 px-1.5">
                                                {pod.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {result.nodes.length === 0 && (
                    <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-xl bg-muted/20">
                        <Server className="w-12 h-12 mb-4 opacity-20" />
                        <p>No nodes required. Add pods to see calculation.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
