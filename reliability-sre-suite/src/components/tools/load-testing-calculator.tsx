"use client"

import * as React from "react"
import { Users, Gauge, Activity } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export function LoadTestingCalculator() {
    const [targetRps, setTargetRps] = React.useState(1000)
    const [latency, setLatency] = React.useState(200) // ms
    const [thinkTime, setThinkTime] = React.useState(0) // ms

    // Little's Law: N = X * (R + Z)
    // N = Users
    // X = Throughput (RPS)
    // R = Response Time (Latency)
    // Z = Think Time (delays)

    // Latency in seconds
    const rSec = latency / 1000
    const zSec = thinkTime / 1000

    const concurrentUsers = Math.ceil(targetRps * (rSec + zSec))

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Load Test Parameters</CardTitle>
                        <CardDescription>
                            Based on Little's Law: <code>Users = RPS * (Latency + Think Time)</code>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Target Throughput (RPS)</Label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    value={targetRps}
                                    onChange={(e) => setTargetRps(Number(e.target.value))}
                                />
                            </div>
                            <Slider
                                value={[targetRps]}
                                min={1}
                                max={10000}
                                step={10}
                                onValueChange={(val) => setTargetRps(val[0])}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Average Latency (ms)</Label>
                            <div className="relative">
                                <Activity className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="number"
                                    className="pl-8"
                                    value={latency}
                                    onChange={(e) => setLatency(Number(e.target.value))}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Response time of your API.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Think Time / Pacing (ms)</Label>
                            <Input
                                type="number"
                                value={thinkTime}
                                onChange={(e) => setThinkTime(Number(e.target.value))}
                            />
                            <p className="text-xs text-muted-foreground">Delay between requests per user (0 for stress testing).</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full bg-slate-900 text-slate-50 border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="size-5" />
                            Required Concurrency
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Configure your load generator (k6, JMeter, Locust) with this VUser count.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-8 py-8">

                        <div className="text-center space-y-2">
                            <div className="text-7xl font-bold tracking-tighter text-blue-400">
                                {new Intl.NumberFormat().format(concurrentUsers)}
                            </div>
                            <div className="text-sm font-medium uppercase tracking-widest text-slate-400">
                                Virtual Users (VUs)
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4 pt-8 border-t border-slate-800">
                            <div className="text-center space-y-1">
                                <div className="text-2xl font-bold text-slate-200">{targetRps}</div>
                                <div className="text-xs text-slate-500">RPS Target</div>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="text-2xl font-bold text-slate-200">{latency + thinkTime}ms</div>
                                <div className="text-xs text-slate-500">Total Roundtrip</div>
                            </div>
                        </div>

                        <div className="rounded-md bg-slate-800 p-4 text-xs text-slate-400 w-full font-mono">
                // k6 example<br />
                            export const options = {'{'}<br />
                            &nbsp;&nbsp;vus: {concurrentUsers},<br />
                            &nbsp;&nbsp;duration: '5m',<br />
                            {'}'};
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
