"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, Zap, Activity } from "lucide-react"

type AppType = 'node' | 'java' | 'go' | 'python' | 'general'
type LoadProfile = 'low' | 'medium' | 'high'

interface Recommendation {
    reqCpu: string
    limCpu: string
    reqMem: string
    limMem: string
    qos: 'Burstable' | 'Guaranteed'
    reason: string
}

export function ResourceCalculator() {
    const [appType, setAppType] = useState<AppType>('node')
    const [load, setLoad] = useState<LoadProfile>('medium')

    const getRecommendation = (type: AppType, load: LoadProfile): Recommendation => {
        let baseCpu = 100 // m
        let baseMem = 128 // Mi
        let cpuFactor = 1
        let memFactor = 1
        let qos: 'Burstable' | 'Guaranteed' = 'Burstable'

        // Load Multipliers
        if (load === 'low') { cpuFactor = 0.5; memFactor = 0.5 }
        if (load === 'high') { cpuFactor = 2; memFactor = 2 }

        // App Specifics
        switch (type) {
            case 'java':
                baseMem = 512 // JVM needs heap
                baseCpu = 200 // Startup heavy
                return {
                    reqCpu: `${Math.floor(baseCpu * cpuFactor)}m`,
                    limCpu: `${Math.floor(baseCpu * cpuFactor * 4)}m`, // Java loves CPU bursts during GC
                    reqMem: `${Math.floor(baseMem * memFactor)}Mi`,
                    limMem: `${Math.floor(baseMem * memFactor)}Mi`, // Guaranteed memory for JVM is best practice
                    qos: 'Burstable', // Technically guaranteed if req==lim, but we usually give little CPU buffer
                    reason: "Java apps require a large initial memory heap. We recommend setting Memory Request = Limit to avoid OOMKilled during heap expansion. CPU can be burstable for GC spikes."
                }
            case 'node':
                baseMem = 128
                baseCpu = 100
                return {
                    reqCpu: `${Math.floor(baseCpu * cpuFactor)}m`,
                    limCpu: `${Math.floor(baseCpu * cpuFactor * 2)}m`,
                    reqMem: `${Math.floor(baseMem * memFactor)}Mi`,
                    limMem: `${Math.floor(baseMem * memFactor * 1.5)}Mi`, // Node can grow a bit
                    qos: 'Burstable',
                    reason: "Node.js is single-threaded. CPU throttling can severely impact event loop latency. We recommend a generous CPU limit (2x request) but strict memory monitoring."
                }
            case 'go':
                baseMem = 64
                baseCpu = 50
                return {
                    reqCpu: `${Math.floor(baseCpu * cpuFactor)}m`,
                    limCpu: `${Math.floor(baseCpu * cpuFactor * 2)}m`,
                    reqMem: `${Math.floor(baseMem * memFactor)}Mi`,
                    limMem: `${Math.floor(baseMem * memFactor * 2)}Mi`,
                    qos: 'Burstable',
                    reason: "Go routines are lightweight. You can run with very low base resources. Memory footprint is usually stable."
                }
            case 'python':
                baseMem = 128
                baseCpu = 100
                return {
                    reqCpu: `${Math.floor(baseCpu * cpuFactor)}m`,
                    limCpu: `${Math.floor(baseCpu * cpuFactor * 1.5)}m`, // Python GIL limits value of high CPU count
                    reqMem: `${Math.floor(baseMem * memFactor)}Mi`,
                    limMem: `${Math.floor(baseMem * memFactor * 1.5)}Mi`,
                    qos: 'Burstable',
                    reason: "Python (CPython) is often memory-heavy per worker. Ensure 1 vCPU limit per worker process to avoid context switching overhead due to GIL."
                }
            default:
                return {
                    reqCpu: `${Math.floor(100 * cpuFactor)}m`,
                    limCpu: `${Math.floor(500 * cpuFactor)}m`,
                    reqMem: `${Math.floor(128 * memFactor)}Mi`,
                    limMem: `${Math.floor(256 * memFactor)}Mi`,
                    qos: 'Burstable',
                    reason: "A standard starting point for generic microservices. Monitor `kubectl top pod` and adjust after 24h."
                }
        }
    }

    const rec = getRecommendation(appType, load)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Application Profile
                        </CardTitle>
                        <CardDescription>Describe your workload</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Runtime / Language</Label>
                            <RadioGroup value={appType} onValueChange={(v) => setAppType(v as AppType)} className="grid grid-cols-2 gap-4">
                                {['node', 'java', 'go', 'python', 'general'].map(t => (
                                    <div key={t}>
                                        <RadioGroupItem value={t} id={t} className="peer sr-only" />
                                        <Label
                                            htmlFor={t}
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary capitalize cursor-pointer transition-all"
                                        >
                                            {t}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-3">
                            <Label>Expected Load</Label>
                            <RadioGroup value={load} onValueChange={(v) => setLoad(v as LoadProfile)} className="grid grid-cols-3 gap-4">
                                {['low', 'medium', 'high'].map(t => (
                                    <div key={t}>
                                        <RadioGroupItem value={t} id={`load-${t}`} className="peer sr-only" />
                                        <Label
                                            htmlFor={`load-${t}`}
                                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent peer-data-[state=checked]:border-primary capitalize cursor-pointer text-sm"
                                        >
                                            {t}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
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
                            Baseline configuration for <b>{appType}</b> at <b>{load}</b> load
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-background border rounded-lg space-y-2">
                                <div className="text-xs text-muted-foreground uppercase font-bold text-center">Requests</div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-sm">CPU</span>
                                    <span className="font-mono font-bold text-green-500">{rec.reqCpu}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm">Memory</span>
                                    <span className="font-mono font-bold text-green-500">{rec.reqMem}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-background border rounded-lg space-y-2">
                                <div className="text-xs text-muted-foreground uppercase font-bold text-center">Limits</div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-sm">CPU</span>
                                    <span className="font-mono font-bold text-red-500">{rec.limCpu}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-sm">Memory</span>
                                    <span className="font-mono font-bold text-red-500">{rec.limMem}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 p-4 rounded-lg text-sm flex gap-3">
                            <Zap className="w-5 h-5 shrink-0" />
                            <p>{rec.reason}</p>
                        </div>

                        <div className="pt-4">
                            <div className="bg-slate-950 p-4 rounded-md font-mono text-xs text-muted-foreground relative">
                                <div className="absolute top-2 right-2 text-[10px] uppercase text-slate-500">YAML</div>
                                <pre className="text-slate-300">
                                    {`resources:
  requests:
    cpu: ${rec.reqCpu}
    memory: ${rec.reqMem}
  limits:
    cpu: ${rec.limCpu}
    memory: ${rec.limMem}`}
                                </pre>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
