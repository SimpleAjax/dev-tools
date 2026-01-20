"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { TriangleAlert, CheckCircle, Info } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function MemoryAllocator() {
    const [totalRamGB, setTotalRamGB] = useState([16])
    const [maxConnections, setMaxConnections] = useState([100])
    const [workMemMB, setWorkMemMB] = useState([4])
    const [sharedBuffersGB, setSharedBuffersGB] = useState([4]) // Default 25% of 16
    const [autoSharedBuffers, setAutoSharedBuffers] = useState(true)

    // Update shared_buffers if auto mode is on
    useEffect(() => {
        if (autoSharedBuffers) {
            setSharedBuffersGB([Math.floor(totalRamGB[0] * 0.25)])
        }
    }, [totalRamGB, autoSharedBuffers])

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Calculations in MB
    const totalRamMB = totalRamGB[0] * 1024
    const osReservedMB = 1024 // 1GB reserved for OS
    const sharedBuffersMB = sharedBuffersGB[0] * 1024
    const connOverheadMB = maxConnections[0] * 2 // ~2MB per connection

    // work_mem can be used MULTIPLE times per query. We assume 1x for simple "Peak" calc, 
    // but sophisticated users know it's N*work_mem.
    // We'll stick to 1x * connections for the "Potentially Active" visualization.
    const activeWorkMemMB = maxConnections[0] * workMemMB[0]

    const totalUsedMB = osReservedMB + sharedBuffersMB + connOverheadMB + activeWorkMemMB
    const isOOM = totalUsedMB > totalRamMB
    const utilizationPercent = (totalUsedMB / totalRamMB) * 100

    // Calculation for Bar Widths (relative to the Max of (TotalRAM, TotalUsed))
    const maxScaleMB = Math.max(totalRamMB, totalUsedMB)
    const getWidth = (mb: number) => (mb / maxScaleMB) * 100

    return (
        <Card className="w-full max-w-4xl mx-auto border-t-4 border-t-purple-500">
            <CardHeader>
                <CardTitle className="text-2xl text-purple-700 dark:text-purple-400 flex items-center gap-2">
                    Visual Memory Allocator
                    {isOOM ?
                        <Badge variant="destructive" className="ml-auto">OOM Risk: HIGH</Badge> :
                        <Badge variant="outline" className="ml-auto border-emerald-500 text-emerald-500">Safe Config</Badge>
                    }
                </CardTitle>
                <CardDescription>
                    Visualize how `shared_buffers` and `work_mem` consume RAM to prevent Out-Of-Memory crashes.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Visual Bar Graph */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium mb-1">
                        <span>Memory Usage Breakdown</span>
                        <span>{formatBytes(totalUsedMB * 1024 * 1024)} / {totalRamGB[0]} GB</span>
                    </div>

                    <div className="h-16 w-full bg-slate-100 dark:bg-slate-900 rounded-md flex overflow-hidden relative border border-slate-200 dark:border-slate-800">
                        {/* Limit Line if Overflown */}
                        {isOOM && (
                            <div
                                className="absolute top-0 bottom-0 border-r-2 border-red-500 border-dashed z-10"
                                style={{ left: `${(totalRamMB / totalUsedMB) * 100}%` }}
                            >
                                <div className="absolute -top-6 -right-3 text-red-500 text-xs font-bold">MAX RAM</div>
                            </div>
                        )}

                        {/* OS */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div style={{ width: `${getWidth(osReservedMB)}%` }} className="h-full bg-slate-400 flex items-center justify-center text-xs text-white font-bold cursor-help hover:opacity-90">OS</div>
                                </TooltipTrigger>
                                <TooltipContent><p>OS Reserved (~1GB)</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Shared Buffers */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div style={{ width: `${getWidth(sharedBuffersMB)}%` }} className="h-full bg-emerald-500 flex items-center justify-center text-xs text-white font-bold cursor-help hover:opacity-90">Buffers</div>
                                </TooltipTrigger>
                                <TooltipContent><p>Shared Buffers ({sharedBuffersGB[0]} GB)</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Connection Overhead */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div style={{ width: `${getWidth(connOverheadMB)}%` }} className="h-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold cursor-help hover:opacity-90">Conn</div>
                                </TooltipTrigger>
                                <TooltipContent><p>Connection Overhead ({formatBytes(connOverheadMB * 1024 * 1024)})</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Work Mem */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div style={{ width: `${getWidth(activeWorkMemMB)}%` }} className={`h-full flex items-center justify-center text-xs text-white font-bold cursor-help hover:opacity-90 transition-colors ${isOOM ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}>Work Mem</div>
                                </TooltipTrigger>
                                <TooltipContent><p>Total Work Mem Potential ({formatBytes(activeWorkMemMB * 1024 * 1024)})</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex gap-4 text-xs text-muted-foreground justify-center">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400 rounded-sm"></div>OS</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>Shared Buffers</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div>Conn. Overhead</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>Query Work Mem</div>
                    </div>
                </div>

                {isOOM && (
                    <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>Danger: Potential OOM</AlertTitle>
                        <AlertDescription>
                            If all {maxConnections[0]} connections execute a complex query simultaneously, you require <strong>{formatBytes(totalUsedMB * 1024 * 1024)}</strong>, but only have <strong>{totalRamGB[0]} GB</strong>.
                            The OS OOM Killer will likely terminate Postgres.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>System RAM (GB)</Label>
                            <Input
                                type="number"
                                value={totalRamGB[0]}
                                onChange={(e) => setTotalRamGB([Number(e.target.value)])}
                                className="w-20 text-right"
                            />
                        </div>
                        <Slider value={totalRamGB} onValueChange={setTotalRamGB} min={1} max={128} step={1} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Max Connections</Label>
                            <Input
                                type="number"
                                value={maxConnections[0]}
                                onChange={(e) => setMaxConnections([Number(e.target.value)])}
                                className="w-20 text-right"
                            />
                        </div>
                        <Slider value={maxConnections} onValueChange={setMaxConnections} min={10} max={2000} step={10} />
                        <p className="text-xs text-muted-foreground">Each connection consumes ~2-3MB just to exist.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Label>Shared Buffers (GB)</Label>
                                <div className="flex items-center gap-2">
                                    <Switch id="auto-buffers" checked={autoSharedBuffers} onCheckedChange={setAutoSharedBuffers} />
                                    <Label htmlFor="auto-buffers" className="text-xs text-muted-foreground font-normal">Auto (25%)</Label>
                                </div>
                            </div>
                            <span className="font-mono font-bold">{sharedBuffersGB[0]} GB</span>
                        </div>
                        <Slider
                            disabled={autoSharedBuffers}
                            value={sharedBuffersGB}
                            onValueChange={setSharedBuffersGB}
                            min={1}
                            max={Math.max(1, totalRamGB[0] - 1)}
                            step={0.5}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Work Mem (MB)</Label>
                            <Input
                                type="number"
                                value={workMemMB[0]}
                                onChange={(e) => setWorkMemMB([Number(e.target.value)])}
                                className="w-20 text-right"
                            />
                        </div>
                        <Slider value={workMemMB} onValueChange={setWorkMemMB} min={1} max={256} step={1} />
                        <p className="text-xs text-muted-foreground">
                            Allocated <strong>per operation</strong> (sort/hash).
                            <br />
                            Total Potential = <code>work_mem</code> × <code>max_connections</code> (or more for complex queries).
                        </p>
                    </div>

                </div>

            </CardContent>
        </Card>
    )
}
