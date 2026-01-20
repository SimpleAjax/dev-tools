"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw } from 'lucide-react'
import { PoolSimulation } from './pool-simulation'

export function ConnectionPoolSizer() {
    const [cpuCores, setCpuCores] = useState([4])
    const [spindles, setSpindles] = useState([0]) // 0 = SSD/None
    const [isPlaying, setIsPlaying] = useState(false)

    // Simulation state
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const coreCount = cpuCores[0]
    const spindleCount = spindles[0]
    const recommendedConnections = (coreCount * 2) + spindleCount

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuration Card */}
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">Hardware Config</CardTitle>
                        <CardDescription>
                            Input your server specifications to calculate the optimal connection pool size.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="cpu-cores" className="text-lg font-medium">CPU Cores</Label>
                                <span className="text-2xl font-bold font-mono">{coreCount}</span>
                            </div>
                            <Slider
                                id="cpu-cores"
                                min={1}
                                max={128}
                                step={1}
                                value={cpuCores}
                                onValueChange={setCpuCores}
                                className="py-4"
                            />
                            <p className="text-sm text-muted-foreground">
                                Physical cores available to Postgres.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="spindles" className="text-lg font-medium">Effective Spindles</Label>
                                <span className="text-2xl font-bold font-mono">{spindleCount}</span>
                            </div>
                            <Slider
                                id="spindles"
                                min={0}
                                max={24}
                                step={1}
                                value={spindles}
                                onValueChange={setSpindles}
                                className="py-4"
                            />
                            <p className="text-sm text-muted-foreground">
                                Number of spinning disks (HDD). Set to 0 for SSD/NVMe.
                            </p>
                        </div>

                    </CardContent>
                </Card>

                {/* Result Card */}
                <Card className="h-full bg-slate-950 text-white border-blue-900 border-2">
                    <CardHeader>
                        <CardTitle className="text-zinc-400">Optimal Pool Size</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-48 space-y-2">
                        <div className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-emerald-400 animate-in zoom-in duration-500">
                            {recommendedConnections}
                        </div>
                        <div className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Max Connections</div>
                    </CardContent>
                    <CardFooter className="bg-slate-900/50 p-6 flex flex-col gap-2">
                        <div className="flex justify-between w-full text-sm">
                            <span className="text-zinc-400">Formula:</span>
                            <span className="font-mono text-blue-300">({coreCount} * 2) + {spindleCount}</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                            Based on the standard PostgreSQL tuning formula. Exceeding this often reduces total throughput due to context switching and cache contention.
                        </p>
                    </CardFooter>
                </Card>
            </div>

            {/* Simulation Section */}
            <Card className="overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Throughput Simulator</CardTitle>
                            <CardDescription>Visualizing Context Switching vs Queuing</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                {isPlaying ? "Pause" : "Simulate"}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {/* reset */ }}>
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Scenario A: Overloaded */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-red-500">Without Pooling</h3>
                                <Badge variant="destructive">100 Connections</Badge>
                            </div>
                            <div className="h-48 bg-slate-100 dark:bg-slate-950 rounded-lg border relative overflow-hidden flex items-center justify-center text-muted-foreground text-sm">
                                <PoolSimulation coreCount={coreCount} mode="overloaded" isPlaying={isPlaying} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                High concurrency forces CPU to context switch.
                                <br /><span className="font-bold">Throughput: Low</span> | <span className="font-bold">Latency: High (Unstable)</span>
                            </p>
                        </div>

                        {/* Scenario B: Optimized */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-emerald-600">With Pooling</h3>
                                <Badge variant="outline" className="border-emerald-500 text-emerald-600">{recommendedConnections} Connections</Badge>
                            </div>
                            <div className="h-48 bg-slate-100 dark:bg-slate-950 rounded-lg border relative overflow-hidden flex items-center justify-center text-muted-foreground text-sm">
                                <PoolSimulation coreCount={coreCount} mode="optimized" isPlaying={isPlaying} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Connections match CPU capacity. Wait time is in the queue, not the kernel.
                                <br /><span className="font-bold">Throughput: Max</span> | <span className="font-bold">Latency: Predictable</span>
                            </p>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
