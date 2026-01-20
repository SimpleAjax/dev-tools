"use client"

import React, { useState, useEffect } from 'react'
import { CronExpressionParser } from 'cron-parser'
import cronstrue from 'cronstrue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

export function CronVisualizer() {
    const [expression, setExpression] = useState('*/5 * * * *')
    const [nextRuns, setNextRuns] = useState<Date[]>([])
    const [description, setDescription] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Interactive segments
    const [segments, setSegments] = useState({
        minute: '*/5',
        hour: '*',
        dom: '*',
        month: '*',
        dow: '*'
    })

    useEffect(() => {
        // Update expression when segments change (if user uses the builder)
        // For now, we just parse the raw expression string
        calculateCron(expression)
    }, [expression])

    const calculateCron = (cronInput: string) => {
        // Normalize spaces: replace multiple spaces with single space and trim
        const cron = cronInput.trim().replace(/\s+/g, ' ')

        if (!cron) {
            setNextRuns([])
            setDescription('')
            setError(null)
            return
        }

        let hasError = false

        // 1. Try to get Human Description (Cosmetic)
        try {
            const desc = cronstrue.toString(cron, { verbose: true })
            setDescription(desc)
        } catch (e) {
            setDescription('')
            // We don't block execution here, maybe cron-parser is more lenient
        }

        // 2. Try to Calculate Next Runs (Critical)
        try {
            const interval = CronExpressionParser.parse(cron)
            const runs = []
            for (let i = 0; i < 5; i++) {
                runs.push(interval.next().toDate())
            }
            setNextRuns(runs)
            setError(null)

            // 3. Update segments if valid (simple split)
            const parts = cron.split(' ')
            if (parts.length >= 5) {
                setSegments({
                    minute: parts[0],
                    hour: parts[1],
                    dom: parts[2],
                    month: parts[3],
                    dow: parts[4]
                })
            }

        } catch (err: any) {
            console.error("Cron Error:", err)
            setError(err.message || "Invalid cron expression")
            setNextRuns([])
            hasError = true
        }
    }

    const handleSegmentChange = (field: keyof typeof segments, value: string) => {
        const newSegments = { ...segments, [field]: value }
        setSegments(newSegments)
        setExpression(`${newSegments.minute} ${newSegments.hour} ${newSegments.dom} ${newSegments.month} ${newSegments.dow}`)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Input & Builder */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            Cron Expression
                        </CardTitle>
                        <CardDescription>
                            Enter a standard 5-part cron string
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative">
                            <Input
                                value={expression}
                                onChange={(e) => setExpression(e.target.value)}
                                className="text-2xl font-mono p-6 h-16 tracking-wider text-center"
                                placeholder="* * * * *"
                            />
                            <div className="flex justify-between px-6 mt-2 text-xs text-muted-foreground font-mono">
                                <span className="text-center w-1/5">MIN</span>
                                <span className="text-center w-1/5">HOUR</span>
                                <span className="text-center w-1/5">DOM</span>
                                <span className="text-center w-1/5">MON</span>
                                <span className="text-center w-1/5">DOW</span>
                            </div>
                        </div>

                        {error ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : (
                            <Alert className="bg-primary/10 border-primary/20">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <AlertTitle className="text-primary font-bold">Schedule</AlertTitle>
                                <AlertDescription className="text-primary/90 font-medium">
                                    "{description}"
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Visual Builder */}
                        <div className="grid grid-cols-5 gap-2 pt-4 border-t">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-center block">Minute</Label>
                                <Input
                                    value={segments.minute}
                                    onChange={(e) => handleSegmentChange('minute', e.target.value)}
                                    className="font-mono text-center text-sm"
                                />
                                <p className="text-[10px] text-muted-foreground text-center">0-59</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-center block">Hour</Label>
                                <Input
                                    value={segments.hour}
                                    onChange={(e) => handleSegmentChange('hour', e.target.value)}
                                    className="font-mono text-center text-sm"
                                />
                                <p className="text-[10px] text-muted-foreground text-center">0-23</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-center block">Day (Month)</Label>
                                <Input
                                    value={segments.dom}
                                    onChange={(e) => handleSegmentChange('dom', e.target.value)}
                                    className="font-mono text-center text-sm"
                                />
                                <p className="text-[10px] text-muted-foreground text-center">1-31</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-center block">Month</Label>
                                <Input
                                    value={segments.month}
                                    onChange={(e) => handleSegmentChange('month', e.target.value)}
                                    className="font-mono text-center text-sm"
                                />
                                <p className="text-[10px] text-muted-foreground text-center">1-12</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-center block">Day (Week)</Label>
                                <Input
                                    value={segments.dow}
                                    onChange={(e) => handleSegmentChange('dow', e.target.value)}
                                    className="font-mono text-center text-sm"
                                />
                                <p className="text-[10px] text-muted-foreground text-center">0-6 (Sun-Sat)</p>
                            </div>
                        </div>

                        <div className="prose prose-sm text-muted-foreground">
                            <h4 className="text-sm font-semibold">Common Examples</h4>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { l: 'Every Minute', v: '* * * * *' },
                                    { l: 'Every 5 Mins', v: '*/5 * * * *' },
                                    { l: 'Hourly', v: '0 * * * *' },
                                    { l: 'Daily (Midnight)', v: '0 0 * * *' },
                                    { l: 'Weekdays', v: '0 0 * * 1-5' },
                                ].map((ex) => (
                                    <Badge
                                        key={ex.l}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                        onClick={() => setExpression(ex.v)}
                                    >
                                        {ex.l}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Right: Next Runs */}
            <div className="lg:col-span-1">
                <Card className="h-full border-l-4 border-l-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Upcoming Runs
                        </CardTitle>
                        <CardDescription>
                            Expected execution times
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {nextRuns.length > 0 ? (
                            <ul className="space-y-4 relative">
                                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />
                                {nextRuns.map((run, idx) => (
                                    <li key={idx} className="relative pl-6">
                                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-background ${idx === 0 ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                                        <div className="flex flex-col">
                                            <span className={`font-mono text-sm ${idx === 0 ? 'font-bold text-foreground' : 'text-muted-foreground '}`}>
                                                {run.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {run.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </span>
                                            {idx === 0 && (
                                                <Badge variant="secondary" className="w-fit mt-1 text-[10px]">
                                                    Next Run
                                                </Badge>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                No schedule calculated
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
