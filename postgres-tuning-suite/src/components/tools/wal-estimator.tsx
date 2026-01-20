"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Wifi, Database } from 'lucide-react'

export function WalEstimator() {
    const [writeTps, setWriteTps] = useState([1000])
    const [rowSize, setRowSize] = useState([200]) // bytes
    const [indexCount, setIndexCount] = useState([2])
    const [networkMbps, setNetworkMbps] = useState([100])

    // Logic
    // WAL generation estimation
    // Base: TPS * RowSize
    // Indexes: Each index adds overhead. Roughly 0.5x row size per index is a conservative "worst case" for random indexing, 
    // but let's stick to a simpler multiplier: 1.0 (Data) + 0.3 * IndexCount
    const walMultiplier = 1.0 + (indexCount[0] * 0.3)
    const bytesPerSecond = writeTps[0] * rowSize[0] * walMultiplier

    const generatedMbps = (bytesPerSecond * 8) / 1_000_000
    const availableMbps = networkMbps[0]

    const utilization = (generatedMbps / availableMbps) * 100
    const isSaturated = generatedMbps > availableMbps
    const lagGrowthMBps = isSaturated ? (generatedMbps - availableMbps) / 8 : 0

    // Animation State for Pipe
    const [flowOffset, setFlowOffset] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setFlowOffset(prev => (prev + 1) % 20)
        }, 50)
        return () => clearInterval(interval)
    }, [])

    return (
        <Card className="w-full max-w-4xl mx-auto border-t-4 border-t-cyan-500">
            <CardHeader>
                <CardTitle className="text-2xl text-cyan-700 dark:text-cyan-400">WAL Bandwidth Estimator</CardTitle>
                <CardDescription>
                    Estimate if your network bandwidth is sufficient for Postgres replication (Physical Streaming Replication).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Visualization */}
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-4">

                        {/* Source */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center border-2 border-slate-400">
                                <Database className="w-8 h-8 text-slate-600" />
                            </div>
                            <div className="text-sm font-semibold">Primary</div>
                            <Badge variant="outline" className="font-mono">{generatedMbps.toFixed(1)} Mbps</Badge>
                        </div>

                        {/* Pipe */}
                        <div className="flex-1 relative h-12 bg-slate-300 dark:bg-zinc-800 rounded-full overflow-hidden border-2 border-slate-400 dark:border-zinc-700">
                            {/* Flow Fill */}
                            <div
                                className={`absolute top-0 bottom-0 left-0 transition-all duration-300 ${isSaturated ? 'bg-red-500' : 'bg-cyan-500'}`}
                                style={{ width: `${Math.min(100, utilization)}%` }}
                            >
                                {/* Flow Lines Animation */}
                                <div
                                    className="absolute inset-0 opacity-30"
                                    style={{
                                        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.5) 10px, rgba(255,255,255,0.5) 20px)`,
                                        transform: `translateX(${flowOffset}px)`
                                    }}
                                />
                            </div>

                            {/* Overflow / Burst Indicator */}
                            {isSaturated && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 animate-pulse">
                                    <span className="text-xs font-bold text-red-600 bg-white/80 px-2 py-1 rounded-sm">LAGGING!</span>
                                </div>
                            )}
                        </div>

                        {/* Destination */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center border-2 border-slate-400">
                                <Database className="w-8 h-8 text-slate-600 opacity-70" />
                            </div>
                            <div className="text-sm font-semibold">Replica</div>
                            <Badge variant="outline" className="font-mono">{availableMbps.toFixed(0)} Mbps</Badge>
                        </div>

                    </div>

                    {/* Analysis Text */}
                    <div className="mt-6 text-center">
                        {isSaturated ? (
                            <p className="text-red-600 font-medium">
                                Warning: Your WAL generation exceeds network capacity.
                                Replication lag will grow at <span className="font-bold underline">{lagGrowthMBps.toFixed(2)} MB/s</span> ({((lagGrowthMBps * 60) / 1024).toFixed(2)} GB/min).
                            </p>
                        ) : (
                            <p className="text-emerald-600 font-medium">
                                Network is healthy. You are using <span className="font-bold">{utilization.toFixed(1)}%</span> of available bandwidth.
                            </p>
                        )}
                    </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Write TPS</Label>
                            <Input
                                type="number"
                                value={writeTps[0]}
                                onChange={(e) => setWriteTps([Number(e.target.value)])}
                                className="w-24 text-right"
                            />
                        </div>
                        <Slider value={writeTps} onValueChange={setWriteTps} min={10} max={10000} step={10} />
                        <p className="text-xs text-muted-foreground">Transactions Per Second (Inserts/Updates/Deletes)</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Network Link (Mbps)</Label>
                            <Input
                                type="number"
                                value={networkMbps[0]}
                                onChange={(e) => setNetworkMbps([Number(e.target.value)])}
                                className="w-24 text-right"
                            />
                        </div>
                        <Slider value={networkMbps} onValueChange={setNetworkMbps} min={10} max={10000} step={10} />
                        <p className="text-xs text-muted-foreground">Bandwidth between Primary and Replica (e.g., AWS Region Peering)</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Avg Row Size (Bytes)</Label>
                            <Input
                                type="number"
                                value={rowSize[0]}
                                onChange={(e) => setRowSize([Number(e.target.value)])}
                                className="w-24 text-right"
                            />
                        </div>
                        <Slider value={rowSize} onValueChange={setRowSize} min={50} max={8000} step={10} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Indexes per Table</Label>
                            <span className="font-mono text-xl font-bold">{indexCount[0]}</span>
                        </div>
                        <Slider value={indexCount} onValueChange={setIndexCount} min={0} max={20} step={1} />
                        <p className="text-xs text-muted-foreground">Indexes significantly increase WAL volume as update pointers must be written.</p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
