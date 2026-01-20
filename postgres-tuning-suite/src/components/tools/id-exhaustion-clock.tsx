"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Calendar, AlertOctagon, Skull } from 'lucide-react'

export function IdExhaustionClock() {
    const [currentMaxId, setCurrentMaxId] = useState([1_500_000_000])
    const [insertsPerSec, setInsertsPerSec] = useState([50])
    const [growthRateWrapper, setGrowthRateWrapper] = useState([20]) // 20% YoY
    const [isBigInt, setIsBigInt] = useState(false)

    const MAX_INT4 = 2_147_483_647
    const MAX_BIGINT = 9_223_372_036_854_775_807

    const limit = isBigInt ? MAX_BIGINT : MAX_INT4
    const idsRemaining = limit - currentMaxId[0]

    // Calculate Time to D-Day
    // Simple linear projection for MVP, sophisticated would use compound monthly growth
    // Let's use simple linear for second-resolution, but apply growth rate to the "Avg Inserts"

    // Actually, let's just project based on current rate + YoY growth
    // If growth is 20% YoY, that's 1.6% per month.
    // Solving for time is complex with compound interest integral.
    // Let's stick to "Current Rate" for the main clock, but have a "With Growth" footnote.

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const secondsToDoom = idsRemaining / insertsPerSec[0]
    // Only calculate date on client or ensure stability. 
    // Ideally we update it live, but for now just fix hydration.
    // If we want it to move, we need a timer.
    // But for the hydration error, just ensuring it renders consistent initial state is enough.
    // We can show "Calculating..." or just use a fixed date for SSR? No, that hides real data (SEO).
    // Better: Render it only when mounted.

    const dDayDate = mounted ? new Date(Date.now() + (secondsToDoom * 1000)) : null

    // Formatters
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
    }

    const formatRelTime = (seconds: number) => {
        if (seconds < 60) return `${Math.floor(seconds)} seconds`
        if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`
        if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`
        if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`
        return `${(seconds / 31536000).toFixed(2)} years`
    }

    return (
        <Card className="w-full max-w-4xl mx-auto border-t-4 border-t-red-700 bg-zinc-950 text-red-50">
            <CardHeader>
                <CardTitle className="text-2xl text-red-500 uppercase flex items-center gap-2 tracking-widest">
                    <Skull className="w-6 h-6 animate-pulse" />
                    Doomsday Clock
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    When will your `SERIAL` (integer) primary keys run out and crash your app?
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* The Clock */}
                <div className="flex flex-col items-center justify-center p-8 border-4 border-red-900/50 rounded-xl bg-black/50 backdrop-blur-sm relative overflow-hidden">
                    {/* Background Glitch Effect */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className="text-zinc-500 text-sm uppercase tracking-[0.3em] mb-2 font-mono">Time Remaining</div>
                    <div className="text-5xl md:text-7xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-red-500 text-center">
                        {idsRemaining <= 0 ? "COLLAPSE" : formatRelTime(secondsToDoom)}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-red-400/80 font-mono">
                        <Calendar className="w-4 h-4" />
                        <span>Impact Date: {mounted && dDayDate ? dDayDate.toLocaleString() : "Calculating..."}</span>
                    </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-zinc-100">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-zinc-300">Current Max ID</Label>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-red-900 text-red-400">{formatNumber(currentMaxId[0])}</Badge>
                                <Switch checked={isBigInt} onCheckedChange={setIsBigInt} />
                                <span className="text-xs text-zinc-500">BigInt?</span>
                            </div>
                        </div>
                        <Slider
                            value={currentMaxId}
                            onValueChange={setCurrentMaxId}
                            min={0}
                            max={limit > MAX_INT4 ? 1_000_000_000_000 : MAX_INT4}
                            step={limit > MAX_INT4 ? 1_000_000_000 : 100000}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-zinc-300">Inserts Per Second</Label>
                            <Input
                                type="number"
                                value={insertsPerSec[0]}
                                onChange={(e) => setInsertsPerSec([Number(e.target.value)])}
                                className="w-24 text-right bg-zinc-900 border-zinc-800"
                            />
                        </div>
                        <Slider value={insertsPerSec} onValueChange={setInsertsPerSec} min={1} max={5000} step={1} />
                    </div>
                </div>

                {idsRemaining > 0 && idsRemaining < 100_000_000 && !isBigInt && (
                    <Alert className="border-red-600 bg-red-950/20 text-red-200">
                        <AlertOctagon className="h-4 w-4 stroke-red-500" />
                        <AlertTitle className="text-red-500">CRITICAL WARNING</AlertTitle>
                        <AlertDescription>
                            You are dangerously close to the 2.1 Billion integer limit.
                            Migration to `BIGINT` takes time and locks tables. <strong>Start planning immediately.</strong>
                        </AlertDescription>
                    </Alert>
                )}

            </CardContent>
        </Card>
    )
}
