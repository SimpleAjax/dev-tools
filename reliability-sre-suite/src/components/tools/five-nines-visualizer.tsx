"use client"

import * as React from "react"
import { Grid } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function FiveNinesVisualizer() {
    const [nines, setNines] = React.useState("99.9")

    // Grid config
    // We want to visualize Total Requests vs Failed Requests
    // Let's conceptually show a grid of 10,000 blocks. 
    // 100 x 100 = 10,000 blocks.

    // calculate failures per 10,000 requests
    const getFailures = (sla: string) => {
        const val = parseFloat(sla)
        const failureRate = 100 - val // e.g. 0.1% or 0.01%
        const failuresPer10k = 10000 * (failureRate / 100)
        return Math.ceil(failuresPer10k)
    }

    const failures = getFailures(nines)

    // We can't render 10,000 divs easily, it might lag. 
    // Canvas is better, but since we need "simple", let's render a 100x100 SVG.
    // Or just 2500 blocks (50x50) 

    // Let's use canvas approach for performance
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    React.useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const size = 600
        // Fix DPI
        const dpr = window.devicePixelRatio || 1
        canvas.width = size * dpr
        canvas.height = size * dpr
        canvas.style.width = `${size}px`
        canvas.style.height = `${size}px`
        ctx.scale(dpr, dpr)

        // Clear
        ctx.clearRect(0, 0, size, size)

        // Draw 10,000 dots
        // Grid 100 x 100
        const cols = 100
        const rows = 100
        const gap = 1
        const dotSize = (size - (cols * gap)) / cols

        let failureCount = failures

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = j * (dotSize + gap)
                const y = i * (dotSize + gap)

                ctx.fillStyle = "#e2e8f0" // slate-200

                // Randomly scatter fail dots or put them at start? 
                // Put at start (top-left) for visibility or scatter? 
                // Random scatter is better visualization of "it happens anytime"
                // But for consistency let's scatter deterministically based on seed/index
                // Or just make the FIRST N red.

                // Actually, scattered is visually confusing if you want to COUNT them.
                // Let's make the first N red.
                const index = i * cols + j
                if (index < failureCount) {
                    ctx.fillStyle = "#ef4444" // red-500
                } else {
                    // ctx.fillStyle = "#e2e8f0" // default
                    // dark mode handling? 
                    // We can just use hardcoded for canvas
                }

                ctx.fillRect(x, y, dotSize, dotSize)
            }
        }

    }, [failures])

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Availability Visualizer</CardTitle>
                        <CardDescription>
                            Visualize what 99.9% vs 99.999% actually looks like at scale.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup value={nines} onValueChange={setNines} className="grid grid-cols-1 gap-2">
                            <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:bg-muted [&:has(:checked)]:border-primary">
                                <RadioGroupItem value="99" id="r1" />
                                <div className="flex-1">
                                    <Label htmlFor="r1" className="cursor-pointer font-bold">99% (Two Nines)</Label>
                                    <p className="text-sm text-muted-foreground">1 failure in 100 requests.</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:bg-muted [&:has(:checked)]:border-primary">
                                <RadioGroupItem value="99.9" id="r2" />
                                <div className="flex-1">
                                    <Label htmlFor="r2" className="cursor-pointer font-bold">99.9% (Three Nines)</Label>
                                    <p className="text-sm text-muted-foreground">1 failure in 1,000 requests. (Standard SLA)</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:bg-muted [&:has(:checked)]:border-primary">
                                <RadioGroupItem value="99.99" id="r3" />
                                <div className="flex-1">
                                    <Label htmlFor="r3" className="cursor-pointer font-bold">99.99% (Four Nines)</Label>
                                    <p className="text-sm text-muted-foreground">1 failure in 10,000 requests. (High Availability)</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:bg-muted [&:has(:checked)]:border-primary">
                                <RadioGroupItem value="99.999" id="r4" />
                                <div className="flex-1">
                                    <Label htmlFor="r4" className="cursor-pointer font-bold">99.999% (Five Nines)</Label>
                                    <p className="text-sm text-muted-foreground">1 failure in 100,000 requests. (Mission Critical)</p>
                                </div>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Visualization (10k Requests)</CardTitle>
                        <CardDescription>
                            Red pixels represent failed requests in a batch of 10,000.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center p-6 bg-slate-50 dark:bg-slate-900 overflow-hidden">
                        <canvas ref={canvasRef} className="rounded shadow-sm max-w-full" />
                    </CardContent>
                    <div className="p-6 pt-0 text-center">
                        <div className="text-2xl font-bold">{failures} Failures</div>
                        <div className="text-sm text-muted-foreground">per 10,000 requests</div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
