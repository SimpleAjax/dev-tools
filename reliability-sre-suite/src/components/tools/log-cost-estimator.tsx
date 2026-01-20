"use client"

import * as React from "react"
import { DollarSign, HardDrive } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function LogCostEstimator() {
    const [logRate, setLogRate] = React.useState(100) // lines per sec
    const [avgSize, setAvgSize] = React.useState(500) // bytes
    const [retention, setRetention] = React.useState("30") // days
    const [costPerGb, setCostPerGb] = React.useState(1.50) // $ per GB ingested

    // Calculations
    const bytesPerSec = logRate * avgSize
    const bytesPerDay = bytesPerSec * 60 * 60 * 24
    const gbPerDay = bytesPerDay / (1024 * 1024 * 1024)
    const gbPerMonth = gbPerDay * 30

    const dailyCost = gbPerDay * costPerGb
    const monthlyCost = gbPerMonth * costPerGb

    // Retention cost multiplier (simplified model, many vendors charge separately for retention vs ingestion)
    // We'll stick to Ingestion Cost for simplicity unless we add a specific retention field
    // Let's assume standard index cost is included or add an extra field.
    // For now, let's keep it to Ingestion Volume cost focus which is the main pain point.

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Log Volume Parameters</CardTitle>
                        <CardDescription>Input your logging throughput and sizing.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Log Rate (lines/sec)</Label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    value={logRate}
                                    onChange={(e) => setLogRate(Number(e.target.value))}
                                />
                            </div>
                            <Slider
                                value={[logRate]}
                                min={0}
                                max={10000}
                                step={10}
                                onValueChange={(val) => setLogRate(val[0])}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Avg. Log Line Size (bytes)</Label>
                            <Input
                                type="number"
                                value={avgSize}
                                onChange={(e) => setAvgSize(Number(e.target.value))}
                            />
                            <p className="text-xs text-muted-foreground">A typical JSON log is often 300-800 bytes.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Vendor Cost per GB (Ingestion)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="number"
                                    className="pl-8"
                                    value={costPerGb}
                                    onChange={(e) => setCostPerGb(Number(e.target.value))}
                                    step="0.01"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Datadog ~$0.10 - $1.70, Splunk varies. Defaulting to high-perf index.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full bg-slate-50 dark:bg-slate-900 border-sidebar-primary/20">
                    <CardHeader>
                        <CardTitle>Estimated Costs</CardTitle>
                        <CardDescription>Projected spend based on continuous volume.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-sm font-medium text-muted-foreground">Daily Volume</span>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    <HardDrive className="size-5 text-sidebar-primary" />
                                    {formatSize(bytesPerDay)}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm font-medium text-muted-foreground">Monthly Volume</span>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    <HardDrive className="size-5 text-sidebar-primary" />
                                    {formatSize(gbPerMonth * 1024 * 1024 * 1024)}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-background rounded-lg border shadow-sm">
                                <span className="font-medium">Daily Cost</span>
                                <span className="text-xl font-bold font-mono">{formatCurrency(dailyCost)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-sidebar-primary/10 rounded-lg border border-sidebar-primary/20 shadow-sm">
                                <span className="font-medium text-sidebar-primary-foreground/90">Monthly Cost</span>
                                <span className="text-3xl font-bold text-sidebar-primary font-mono">{formatCurrency(monthlyCost)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-background rounded-lg border shadow-sm opacity-75">
                                <span className="font-medium">Yearly Run Rate</span>
                                <span className="text-xl font-bold font-mono">{formatCurrency(monthlyCost * 12)}</span>
                            </div>
                        </div>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            *Estimates only. Does not include retention storage costs, rehydration, or custom metrics derived from logs.
                        </p>

                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
