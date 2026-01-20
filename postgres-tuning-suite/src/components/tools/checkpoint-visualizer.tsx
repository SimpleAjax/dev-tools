"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Activity, HardDrive } from 'lucide-react'

export function CheckpointVisualizer() {
    const [maxWalSizeGB, setMaxWalSizeGB] = useState([1])
    const [timeoutMins, setTimeoutMins] = useState([5])
    const [writeLoadMBps, setWriteLoadMBps] = useState([10])
    const [completionTarget, setCompletionTarget] = useState([0.5]) // Default 0.5, recommended 0.9

    // Logic
    const walCapacityMB = maxWalSizeGB[0] * 1024

    // What triggers first?
    // Time Trigger: writeLoad * (timeout * 60)
    const accumulatedWalInTimeout = writeLoadMBps[0] * (timeoutMins[0] * 60)

    const triggerCause = accumulatedWalInTimeout > walCapacityMB ? 'WAL_SIZE' : 'TIMEOUT'

    // Animation Canvas
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        // Simulation State
        let currentWalMB = 0
        let currentTimeSec = 0
        let isFlushing = false
        let flushProgress = 0 // 0 to 1

        // Render Loop
        const render = () => {
            // Clear
            ctx.fillStyle = '#18181b' // zinc-950
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const w = canvas.width
            const h = canvas.height

            // 1. Draw Container (Bucket)
            const bucketX = w / 2 - 50
            const bucketY = h - 20
            const bucketW = 100
            const bucketH = 150

            ctx.strokeStyle = '#52525b' // zinc-600
            ctx.lineWidth = 4
            ctx.beginPath()
            ctx.moveTo(bucketX, bucketY - bucketH)
            ctx.lineTo(bucketX, bucketY)
            ctx.lineTo(bucketX + bucketW, bucketY)
            ctx.lineTo(bucketX + bucketW, bucketY - bucketH)
            ctx.stroke()

            // 2. Fill Logic
            if (!isFlushing) {
                currentWalMB += writeLoadMBps[0] * 0.1 // 100ms simulation step
                currentTimeSec += 0.1

                // Check Trigger
                if (currentWalMB >= walCapacityMB || currentTimeSec >= (timeoutMins[0] * 60)) {
                    isFlushing = true
                    flushProgress = 0
                }
            } else {
                // Flush Logic
                // The speed of flush depends on completion_target
                // Higher target = Slower flush (Spread out)
                // Lower target = Fast flush (Spike)
                const flushSpeed = 0.05 + ((1.0 - completionTarget[0]) * 0.2)
                flushProgress += flushSpeed

                // Visual drain
                currentWalMB = walCapacityMB * (1 - flushProgress)

                if (flushProgress >= 1) {
                    isFlushing = false
                    currentWalMB = 0
                    currentTimeSec = 0
                }
            }

            // 3. Draw Fluid
            const fillPercent = Math.min(1, currentWalMB / walCapacityMB)
            const fluidHeight = bucketH * fillPercent

            ctx.fillStyle = isFlushing ? '#ef4444' : '#3b82f6' // Red if flushing, Blue if filling
            ctx.fillRect(bucketX + 2, bucketY - fluidHeight, bucketW - 4, fluidHeight)

            // 4. Draw I/O Activity Graph (Right Side)
            // ... simplistic scrolling line ...

            // Overlay Stat
            ctx.fillStyle = '#fff'
            ctx.font = '12px sans-serif'
            ctx.fillText(`WAL: ${currentWalMB.toFixed(0)} MB`, bucketX + 10, bucketY - 10)

            if (isFlushing) {
                ctx.fillStyle = '#ef4444'
                ctx.font = 'bold 14px sans-serif'
                ctx.fillText("FLUSHING!", bucketX + 15, bucketY - fluidHeight - 10)

                // Checkpoint IO Spike Visualization
                // If completion target is low (0.5), we draw a HUGE spike
                const spikeH = (1 - completionTarget[0]) * 50
                ctx.fillStyle = '#fbbf24' // Agentic Orange/Yellow
                ctx.fillRect(bucketX + bucketW + 20, h - 50 - spikeH, 20, 10 + spikeH)
                ctx.fillText("I/O", bucketX + bucketW + 20, h - 30)
            }

            animationFrameId = requestAnimationFrame(render)
        }

        render()
        return () => cancelAnimationFrame(animationFrameId)

    }, [maxWalSizeGB, timeoutMins, writeLoadMBps, completionTarget])

    return (
        <Card className="w-full max-w-4xl mx-auto border-t-4 border-t-yellow-500">
            <CardHeader>
                <CardTitle className="text-2xl text-yellow-700 dark:text-yellow-400">Checkpoint Spike Visualizer</CardTitle>
                <CardDescription>
                    Visualize why `checkpoint_completion_target` matters for smoothing out I/O spikes.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 bg-black rounded-xl overflow-hidden shadow-inner border border-zinc-800">
                        <canvas ref={canvasRef} width={400} height={250} className="w-full h-full object-contain" />
                    </div>

                    <div className="w-full md:w-64 space-y-4 pt-4">
                        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Current Trigger</span>
                            <div className="text-xl font-bold flex items-center gap-2">
                                {triggerCause === 'WAL_SIZE' ? <HardDrive className="h-5 w-5 text-blue-500" /> : <Activity className="h-5 w-5 text-green-500" />}
                                {triggerCause === 'WAL_SIZE' ? 'Max WAL Size' : 'Timeout'}
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {triggerCause === 'WAL_SIZE'
                                ? `You are filling WAL segments faster than the ${timeoutMins[0]}min timeout. Checkpoints happen frequently.`
                                : `Load is light enough that checkpoints happen exactly every ${timeoutMins[0]} minutes.`
                            }
                        </p>
                    </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Max WAL Size (GB)</Label>
                            <Input
                                type="number"
                                value={maxWalSizeGB[0]}
                                onChange={(e) => setMaxWalSizeGB([Number(e.target.value)])}
                                className="w-20 text-right"
                            />
                        </div>
                        <Slider value={maxWalSizeGB} onValueChange={setMaxWalSizeGB} min={1} max={50} step={1} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Checkpoint Timeout (min)</Label>
                            <Input
                                type="number"
                                value={timeoutMins[0]}
                                onChange={(e) => setTimeoutMins([Number(e.target.value)])}
                                className="w-20 text-right"
                            />
                        </div>
                        <Slider value={timeoutMins} onValueChange={setTimeoutMins} min={1} max={60} step={1} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Write Load (MB/s)</Label>
                            <Input
                                type="number"
                                value={writeLoadMBps[0]}
                                onChange={(e) => setWriteLoadMBps([Number(e.target.value)])}
                                className="w-20 text-right"
                            />
                        </div>
                        <Slider value={writeLoadMBps} onValueChange={setWriteLoadMBps} min={1} max={500} step={5} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Completion Target (0.5 - 0.9)</Label>
                            <span className="font-mono font-bold">{completionTarget[0]}</span>
                        </div>
                        <Slider value={completionTarget} onValueChange={setCompletionTarget} min={0.1} max={1.0} step={0.1} />
                        <p className="text-xs text-muted-foreground">
                            Higher (0.9) = Smoother. Lower (0.5) = Faster Flush but Spiky.
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
