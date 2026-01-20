"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Clock, TrendingUp, AlertTriangle, TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AutovacuumTuner() {
    const [tableRows, setTableRows] = useState([1_000_000])
    const [updatesPerSec, setUpdatesPerSec] = useState([50])
    const [scaleFactor, setScaleFactor] = useState([0.20]) // 20%
    const [threshold, setThreshold] = useState([50])
    const [rowSize, setRowSize] = useState([100]) // bytes
    const [isHyperScale, setIsHyperScale] = useState(false) // Toggle for larger ranges

    // Logic
    const currentThreshold = threshold[0] + (scaleFactor[0] * tableRows[0])
    const bloatRatePerMin = updatesPerSec[0] * 60

    // Time to reach threshold
    // Rate * Time = Threshold -> Time = Threshold / Rate
    const minutesToVacuum = currentThreshold / bloatRatePerMin

    // Peak Bloat Size
    // Dead tuples * Row Size
    const peakBloatBytes = currentThreshold * rowSize[0]

    // Format helpers
    const formatTime = (mins: number) => {
        if (mins < 1) return `${(mins * 60).toFixed(0)} seconds`
        if (mins < 60) return `${mins.toFixed(1)} minutes`
        if (mins < 1440) return `${(mins / 60).toFixed(1)} hours`
        return `${(mins / 1440).toFixed(1)} days`
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
    }

    // Draw Graph
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const w = canvas.width
        const h = canvas.height
        const padding = 40

        // Coordinate logic
        // We want to show at least 2 cycles
        // Cycle length in X pixels?
        // Let's say we map "Time" to X. 
        // We render 2.5 cycles.
        const cycleWidth = (w - padding * 2) / 2.5
        const peakHeight = h - padding * 2

        ctx.beginPath()
        ctx.strokeStyle = '#3b82f6' // Blue-500
        ctx.lineWidth = 3
        ctx.lineJoin = 'round'

        const cycles = 3
        let x = padding
        let y = h - padding

        ctx.moveTo(x, y)

        for (let i = 0; i < cycles; i++) {
            // Go Up to Peak
            x += cycleWidth
            y = padding // Top
            ctx.lineTo(x, y)

            // Drop (Vacuum runs)
            // Vacuum takes time, but relative to accumulation it's usually instant for this chart
            // Unless we want to show "Long Vacuum"
            // Let's drop instantly for MVP
            y = h - padding // Bottom
            ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Add dashed line for Threshold
        ctx.beginPath()
        ctx.strokeStyle = '#ef4444' // Red-500
        ctx.setLineDash([5, 5])
        ctx.moveTo(padding, padding)
        ctx.lineTo(w - padding, padding)
        ctx.stroke()
        ctx.setLineDash([])

        // Labels
        ctx.fillStyle = '#64748b'
        ctx.font = '12px sans-serif'
        ctx.fillText('Dead Tuples', 10, 20)
        ctx.fillText('Vacuum Trigger', w - 100, padding - 10)

        // Y-Axis Max
        ctx.fillText(formatNumber(currentThreshold), 5, padding + 5)
        // Y-Axis Min
        ctx.fillText('0', 25, h - padding)

        // X-Axis Time
        ctx.fillText(formatTime(minutesToVacuum), padding + cycleWidth - 20, h - 10)

    }, [currentThreshold, minutesToVacuum]) // Redraw on change

    return (
        <Card className="w-full max-w-4xl mx-auto border-t-4 border-t-pink-500">
            <CardHeader>
                <CardTitle className="text-2xl text-pink-700 dark:text-pink-400">Autovacuum Frequency Tuner</CardTitle>
                <CardDescription>
                    Visualize how often autovacuum runs and how much bloat accumulates between runs.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border flex flex-col items-center justify-center text-center">
                        <Clock className="w-6 h-6 text-slate-500 mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Vacuum Frequency</div>
                        <div className="text-2xl font-bold">Every {formatTime(minutesToVacuum)}</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border flex flex-col items-center justify-center text-center">
                        <TrendingUp className="w-6 h-6 text-slate-500 mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Trigger Threshold</div>
                        <div className="text-2xl font-bold">{formatNumber(currentThreshold)} tuples</div>
                        <div className="text-xs text-muted-foreground">Dead rows before cleanup</div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="w-6 h-6 text-slate-500 mb-2" />
                        <div className="text-sm font-medium text-muted-foreground">Peak Bloat Size</div>
                        <div className="text-2xl font-bold">{formatBytes(peakBloatBytes)}</div>
                        <div className="text-xs text-muted-foreground">Wasted disk space at peak</div>
                    </div>
                </div>

                {/* Graph */}
                <div className="w-full h-64 bg-white dark:bg-slate-950 border rounded-lg relative flex items-center justify-center">
                    <canvas ref={canvasRef} width={600} height={256} className="w-full h-full max-w-2xl" />
                </div>

                {/* Recommendation */}
                {peakBloatBytes > 1024 * 1024 * 1024 && ( // > 1GB
                    <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>High Bloat Warning</AlertTitle>
                        <AlertDescription>
                            You are accumulating over <strong>{formatBytes(peakBloatBytes)}</strong> of dead space before cleanup.
                            This can cause massive I/O spikes when vacuum finally runs.
                            Consider <strong>lowering `autovacuum_vacuum_scale_factor`</strong> (e.g., to 0.05 or 0.1) to run vacuum more frequently on smaller batches.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Table Size (Rows)</Label>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{formatNumber(tableRows[0])}</Badge>
                                <Switch checked={isHyperScale} onCheckedChange={setIsHyperScale} />
                                <span className="text-xs text-muted-foreground">Hyperscale</span>
                            </div>
                        </div>
                        <Slider
                            value={tableRows}
                            onValueChange={setTableRows}
                            min={1000}
                            max={isHyperScale ? 100_000_000 : 5_000_000}
                            step={1000}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Updates/Deletes per Sec</Label>
                            <Input
                                type="number"
                                value={updatesPerSec[0]}
                                onChange={(e) => setUpdatesPerSec([Number(e.target.value)])}
                                className="w-24 text-right"
                            />
                        </div>
                        <Slider value={updatesPerSec} onValueChange={setUpdatesPerSec} min={1} max={5000} step={1} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Scale Factor (default 0.2)</Label>
                            <Input
                                type="number"
                                value={scaleFactor[0]}
                                onChange={(e) => setScaleFactor([Number(e.target.value)])}
                                step={0.01}
                                className="w-24 text-right"
                            />
                        </div>
                        <Slider value={scaleFactor} onValueChange={setScaleFactor} min={0.00} max={1.0} step={0.01} />
                        <p className="text-xs text-muted-foreground">Percentage of table size to trigger vacuum.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Threshold (default 50)</Label>
                            <Input
                                type="number"
                                value={threshold[0]}
                                onChange={(e) => setThreshold([Number(e.target.value)])}
                                className="w-24 text-right"
                            />
                        </div>
                        <Slider value={threshold} onValueChange={setThreshold} min={0} max={1000} step={10} />
                        <p className="text-xs text-muted-foreground">Minimum number of dead tuples.</p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
