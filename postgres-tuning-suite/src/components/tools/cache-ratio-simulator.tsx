"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PieChart, HardDrive, Cpu, AlertTriangle, TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CacheRatioSimulator() {
    const [dbSizeGB, setDbSizeGB] = useState([100])
    const [ramGB, setRamGB] = useState([16])
    const [workingSetPercent, setWorkingSetPercent] = useState([20]) // 20% of DB is hot

    // Logic
    const hotDataGB = dbSizeGB[0] * (workingSetPercent[0] / 100)

    // OS overhead approx 1GB + shared_buffers/page cache
    // Assume ~80% of RAM is available for PG caching (OS Page Cache + Shared Buffers)
    const effectiveCacheGB = ramGB[0] * 0.8

    // Hit Rate Calculation
    // If Cache > HotData, Hit Rate -> 99%
    // If Cache < HotData, we thrash.
    // Linear degradation for simplicity: Ratio = Cache / HotData
    let cacheHitRate = 100
    if (effectiveCacheGB < hotDataGB) {
        cacheHitRate = (effectiveCacheGB / hotDataGB) * 99
    } else {
        cacheHitRate = 99.9 // Almost perfect
    }

    // Disk IOPS Multiplier
    // Base IOPS (e.g., 1000 requests)
    // If 99% hit, Disk IOPS = 10
    // If 50% hit, Disk IOPS = 500 (50x increase!)
    const baseRequests = 10000
    const diskReqs = baseRequests * ((100 - cacheHitRate) / 100)

    // Visual Helpers
    const isThrashing = cacheHitRate < 80

    return (
        <Card className="w-full max-w-4xl mx-auto border-t-4 border-t-indigo-500">
            <CardHeader>
                <CardTitle className="text-2xl text-indigo-700 dark:text-indigo-400">Cache Hit Ratio Simulator</CardTitle>
                <CardDescription>
                    Visualize the non-linear relationship between RAM and Disk I/O.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {/* Visualizer */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl">

                    {/* RAM Stack */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-32 h-48 bg-slate-200 dark:bg-slate-800 rounded-lg relative overflow-hidden border-2 border-slate-300 flex flex-col justify-end">
                            {/* Hot Data Line */}
                            <div
                                className="absolute w-full border-t-2 border-dashed border-red-500 z-10"
                                style={{ bottom: `${Math.min(100, (hotDataGB / ramGB[0]) * 100)}%` }}
                            >
                                <span className="bg-red-500 text-white text-[10px] px-1 absolute right-0 -top-4">Hot Data ({hotDataGB.toFixed(0)}G)</span>
                            </div>

                            {/* RAM Fill */}
                            <div className="w-full bg-indigo-500 h-full opacity-80 flex items-center justify-center text-white font-bold">
                                RAM ({ramGB[0]}G)
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-2xl">→</div>

                    {/* Hit Rate Circle */}
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                            <circle
                                cx="80" cy="80" r="70"
                                stroke="currentColor"
                                strokeWidth="10"
                                fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * cacheHitRate) / 100}
                                className={`${isThrashing ? 'text-orange-500' : 'text-emerald-500'} transition-all duration-500`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">{cacheHitRate.toFixed(1)}%</span>
                            <span className="text-xs text-muted-foreground uppercase">Hit Rate</span>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-2xl">→</div>

                    {/* Disk Impact */}
                    <div className="flex flex-col items-center gap-2">
                        <div className={`p-4 rounded-xl border-2 flex flex-col items-center ${isThrashing ? 'bg-red-100 border-red-500 text-red-700 animate-pulse' : 'bg-slate-100 border-slate-300 text-slate-700'}`}>
                            <HardDrive className="w-8 h-8 mb-2" />
                            <span className="font-bold text-xl">{diskReqs.toFixed(0)}</span>
                            <span className="text-xs uppercase">IOPS</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Disk Load</span>
                    </div>

                </div>

                {isThrashing && (
                    <Alert variant="destructive">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>Thrashing Detected!</AlertTitle>
                        <AlertDescription>
                            Your active working set ({hotDataGB.toFixed(1)} GB) exceeds available cache.
                            Disk I/O has spiked by a factor of <strong>{((100 - cacheHitRate) * 100).toFixed(0)}x</strong> compared to optimal.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>DB Size (GB)</Label>
                            <Input
                                type="number"
                                value={dbSizeGB[0]}
                                onChange={(e) => setDbSizeGB([Number(e.target.value)])}
                                className="w-20 text-right"
                            />
                        </div>
                        <Slider value={dbSizeGB} onValueChange={setDbSizeGB} min={10} max={1000} step={10} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Working Set (%)</Label>
                            <span className="font-mono font-bold">{workingSetPercent[0]}%</span>
                        </div>
                        <Slider value={workingSetPercent} onValueChange={setWorkingSetPercent} min={1} max={100} step={1} />
                        <p className="text-xs text-muted-foreground">Percent of data accessed frequently.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Total RAM (GB)</Label>
                            <Input
                                type="number"
                                value={ramGB[0]}
                                onChange={(e) => setRamGB([Number(e.target.value)])}
                                className="w-20 text-right"
                            />
                        </div>
                        <Slider value={ramGB} onValueChange={setRamGB} min={1} max={128} step={1} />
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
