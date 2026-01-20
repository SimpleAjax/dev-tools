"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Cpu, Zap, Activity, Info } from "lucide-react"

type AppType = 'node' | 'java' | 'go' | 'python' | 'general'

interface Recommendation {
    reqCpu: number // millicores
    limCpu: number
    reqMem: number // MiB
    limMem: number
    qos: 'Burstable' | 'Guaranteed'
    reason: string
}

export function ResourceCalculator() {
    const [appType, setAppType] = useState<AppType>('node')
    const [rps, setRps] = useState([50]) // RPS
    const [isCpuBound, setIsCpuBound] = useState(false)
    const [strictQos, setStrictQos] = useState(false)
    const [rec, setRec] = useState<Recommendation | null>(null)

    // Baseline definitions per Runtime
    // Cost per 10 requests/sec
    const PROFILES = {
        node: {
            baseCpu: 50,
            baseMem: 100,
            cpuPer10Rps: 15,
            memPer10Rps: 5,
            desc: "Node.js (V8) is single-threaded. Low baseline, but CPU usage spikes linearly with request handling. Memory is relatively stable unless you have leaks."
        },
        java: {
            baseCpu: 500, // Startup heavy
            baseMem: 350, // JVM Heap
            cpuPer10Rps: 20, // JIT optimization makes it efficient at scale
            memPer10Rps: 10,
            desc: "Java (JVM) has high startup costs. It needs a large initial memory allocation (Heap) to avoid OOMKilled loops during bootstrap."
        },
        go: {
            baseCpu: 20,
            baseMem: 32,
            cpuPer10Rps: 5, // Extremely efficient
            memPer10Rps: 2,
            desc: "Go is compiled and lightweight. Very low idle footprint and scales efficiently with high concurrency."
        },
        python: {
            baseCpu: 80,
            baseMem: 120,
            cpuPer10Rps: 25, // GIL overhead
            memPer10Rps: 8,
            desc: "Python (CPython) usually runs one request per thread/process. High concurrency often requires more memory (more workers)."
        },
        general: {
            baseCpu: 100,
            baseMem: 128,
            cpuPer10Rps: 15,
            memPer10Rps: 5,
            desc: "Generic breakdown for microservices."
        }
    }

    useEffect(() => {
        calculate()
    }, [appType, rps, isCpuBound, strictQos])

    const calculate = () => {
        const profile = PROFILES[appType]
        const currentRps = rps[0]

        // 1. Calculate Requests (Baseline)
        let rCpu = profile.baseCpu + (currentRps / 10 * profile.cpuPer10Rps)
        let rMem = profile.baseMem + (currentRps / 10 * profile.memPer10Rps)

        // Modifier: CPU Bound?
        if (isCpuBound) {
            rCpu = rCpu * 2.5 // CPU intensive tasks need much more core juice
            rMem = rMem * 1.1 // Slightly more memory mostly for data processing
        }

        // 2. Calculate Limits (Buffer)
        // CPU Limit: Usually open for Burstable, but tight for Guaranteed
        // Mem Limit: Critical to prevent OOM
        let lCpu = rCpu * 2 // Default: nice burst buffer
        let lMem = rMem * 1.5 // Default: 50% buffer

        if (strictQos) {
            // Guaranteed QoS: Requests == Limits
            lCpu = rCpu
            lMem = rMem
        } else if (appType === 'java') {
            // Java specific: Don't give too much Mem buffer, define heap strictly
            lMem = rMem // Ideally Java matches Heap
            lCpu = rCpu * 4 // Java needs huge CPU bursts for GC
        }

        setRec({
            reqCpu: Math.ceil(rCpu),
            limCpu: Math.ceil(lCpu),
            reqMem: Math.ceil(rMem),
            limMem: Math.ceil(lMem),
            qos: strictQos ? 'Guaranteed' : 'Burstable',
            reason: profile.desc
        })
    }

    if (!rec) return null

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Workload Profile
                        </CardTitle>
                        <CardDescription>Select runtime and adjust expected load.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">

                        {/* 1. Runtime Selection */}
                        <div className="space-y-4">
                            <Label>Runtime / Language</Label>
                            <RadioGroup value={appType} onValueChange={(v) => setAppType(v as AppType)} className="grid grid-cols-5 gap-2">
                                {Object.keys(PROFILES).map(t => (
                                    <div key={t}>
                                        <RadioGroupItem value={t} id={t} className="peer sr-only" />
                                        <Label
                                            htmlFor={t}
                                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary capitalize cursor-pointer transition-all text-xs font-bold text-center h-16"
                                        >
                                            {t}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* 2. RPS Slider */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Traffic Load (Requests / sec)</Label>
                                <Badge variant="outline" className="text-lg font-mono">{rps[0]} RPS</Badge>
                            </div>
                            <Slider
                                value={rps}
                                onValueChange={setRps}
                                max={500}
                                step={10}
                                className="py-4"
                            />
                            <p className="text-xs text-muted-foreground">
                                Estimate the average requests per second <b>per single pod</b>.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* 3. CPU Intensive Toggle */}
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">CPU Bound</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Heavy computation (Crypto, Image Proc)
                                    </p>
                                </div>
                                <Switch checked={isCpuBound} onCheckedChange={setIsCpuBound} />
                            </div>

                            {/* 4. Strict QoS Toggle */}
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Guaranteed QoS</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Set Limits == Requests
                                    </p>
                                </div>
                                <Switch checked={strictQos} onCheckedChange={setStrictQos} />
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full border-l-4 border-l-primary bg-muted/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-primary" />
                            Recommended Spec
                        </CardTitle>
                        <CardDescription>
                            Baseline configuration for <b>{appType}</b> at <b>{rps[0]} RPS</b>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="grid grid-cols-2 gap-4">
                            {/* Requests */}
                            <div className="p-4 bg-background border rounded-lg space-y-2 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                <div className="text-xs text-muted-foreground uppercase font-bold text-center mb-4">Requests (Guaranteed)</div>
                                <div className="flex justify-between items-end border-b border-border/50 pb-2">
                                    <span className="text-sm font-medium">CPU</span>
                                    <span className="font-mono font-bold text-xl text-foreground">{rec.reqCpu}m</span>
                                </div>
                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-sm font-medium">Memory</span>
                                    <span className="font-mono font-bold text-xl text-foreground">{rec.reqMem}Mi</span>
                                </div>
                            </div>

                            {/* Limits */}
                            <div className="p-4 bg-background border rounded-lg space-y-2 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                <div className="text-xs text-muted-foreground uppercase font-bold text-center mb-4">Limits (Throttle/OOM)</div>
                                <div className="flex justify-between items-end border-b border-border/50 pb-2">
                                    <span className="text-sm font-medium">CPU</span>
                                    <span className="font-mono font-bold text-xl text-foreground">{rec.limCpu}m</span>
                                </div>
                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-sm font-medium">Memory</span>
                                    <span className="font-mono font-bold text-xl text-foreground">{rec.limMem}Mi</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3 items-start">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-semibold">Logic:</p>
                                <p>{rec.reason}</p>
                                {strictQos && <p className="mt-2 text-xs opacity-80">- <b>Guaranteed QoS</b> active: Pod behaves like a dedicated VM. Best for critical high-uptime services.</p>}
                                {isCpuBound && <p className="mt-2 text-xs opacity-80">- <b>CPU Bound</b> active: Significantly increased CPU estimates to prevent thermal throttling.</p>}
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="bg-slate-950 p-4 rounded-md font-mono text-xs text-muted-foreground relative shadow-inner">
                                <div className="absolute top-2 right-2 text-[10px] uppercase text-slate-500 select-none">resources.yaml</div>
                                <pre className="text-blue-300">
                                    {`resources:
  requests:
    cpu: ${rec.reqCpu}m
    memory: ${rec.reqMem}Mi
  limits:
    cpu: ${rec.limCpu}m
    memory: ${rec.limMem}Mi`}
                                </pre>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
