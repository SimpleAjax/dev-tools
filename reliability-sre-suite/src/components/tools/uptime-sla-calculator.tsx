"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function UptimeSlaCalculator() {
    const [sla, setSla] = React.useState<number>(99.9)
    const [customDays, setCustomDays] = React.useState<number>(30)

    // Helper to format duration
    const formatDuration = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60)
        const minutes = Math.floor((ms / (1000 * 60)) % 60)
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
        const days = Math.floor(ms / (1000 * 60 * 60 * 24))

        const parts = []
        if (days > 0) parts.push(`${days}d`)
        if (hours > 0) parts.push(`${hours}h`)
        if (minutes > 0) parts.push(`${minutes}m`)
        if (seconds > 0) parts.push(`${seconds}s`)
        if (parts.length === 0) return `${ms.toFixed(0)}ms`

        return parts.join(" ")
    }

    const calculateDowntime = (days: number, percentage: number) => {
        const totalMs = days * 24 * 60 * 60 * 1000
        const downtimeMs = totalMs * ((100 - percentage) / 100)
        return formatDuration(downtimeMs)
    }

    const periods = [
        { label: "Daily", days: 1 },
        { label: "Weekly", days: 7 },
        { label: "Monthly", days: 30 },
        { label: "Quarterly", days: 90 },
        { label: "Yearly", days: 365 },
    ]

    const predefinedSlas = [99, 99.5, 99.9, 99.95, 99.99, 99.999]

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Controls */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>
                            Set your target Service Level Agreement (SLA) percentage.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="sla-input">Target Availability (%)</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    id="sla-input"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.001"
                                    value={sla}
                                    onChange={(e) => setSla(Number(e.target.value))}
                                    className="text-lg font-bold"
                                />
                            </div>
                            <Slider
                                value={[sla]}
                                min={90}
                                max={99.999}
                                step={0.001}
                                onValueChange={(val) => setSla(val[0])}
                                className="py-4"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Quick Presets</Label>
                            <div className="flex flex-wrap gap-2">
                                {predefinedSlas.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setSla(preset)}
                                        className={cn(
                                            "rounded-md border px-3 py-1 text-sm font-medium transition-colors hover:bg-muted",
                                            sla === preset
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background"
                                        )}
                                    >
                                        {preset}%
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="border-l-4 border-l-blue-500 bg-blue-50/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CheckCircle2 className="size-5 text-blue-500" />
                            What does {sla}% mean?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            An SLA of <strong>{sla}%</strong> means your service can be down for at most
                            <strong className="text-foreground"> {calculateDowntime(365, sla)} </strong>
                            in a year before violating the agreement.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Results */}
            <div className="space-y-6">
                <h2 className="text-lg font-semibold">Allowable Downtime Budget</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {periods.map((period) => (
                        <Card key={period.label} className="overflow-hidden">
                            <CardHeader className="bg-muted/50 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {period.label} ({period.days} days)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="text-2xl font-bold tracking-tight">
                                    {calculateDowntime(period.days, sla)}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <Card className="sm:col-span-2 border-dashed">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Custom Duration ({customDays} days)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex items-end justify-between gap-4">
                                <div className="w-full max-w-[120px]">
                                    <Label className="text-xs">Days</Label>
                                    <Input
                                        type="number"
                                        value={customDays}
                                        onChange={(e) => setCustomDays(Number(e.target.value))}
                                        className="h-8"
                                    />
                                </div>
                                <div className="text-2xl font-bold tracking-tight">
                                    {calculateDowntime(customDays, sla)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
