"use client"

import * as React from "react"
import { Copy, Terminal } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function BurnRateAlertGenerator() {
    const [metric, setMetric] = React.useState("http_requests_total")
    const [slo, setSlo] = React.useState(99.9)
    const [windowShort, setWindowShort] = React.useState("1h")
    const [windowLong, setWindowLong] = React.useState("6h")
    const [burnRate, setBurnRate] = React.useState(14.4)
    const [errorLabel, setErrorLabel] = React.useState('code=~"5.."')

    // Based on Google SRE Workbook formula
    // burn_rate > (1-SLO) * burn_rate_factor

    const generateQuery = () => {
        // Multi-window multi-burn-rate alert
        // outputting a basic one for now based on inputs
        const shortRate = `rate(${metric}{${errorLabel}}[${windowShort}]) / rate(${metric}[${windowShort}])`
        const longRate = `rate(${metric}{${errorLabel}}[${windowLong}]) / rate(${metric}[${windowLong}])`

        // Formula: error_rate > (1 - SLO) * BurnRateFactor
        const threshold = (1 - (slo / 100)) * burnRate

        return `
# Alert: High Error Budget Burn Rate
# Condition: Error rate is ${burnRate}x higher than allowed for ${windowShort} and ${windowLong} windows

expr: (
  ${shortRate} > ${threshold.toFixed(5)}
) and (
  ${longRate} > ${threshold.toFixed(5)}
)
for: 2m
labels:
  severity: page
annotations:
  summary: High Burn Rate detected
  description: "Error budget is burning ${burnRate}x faster than allowed. At this rate, the budget will be exhausted in ${windowShort}."
`.trim()
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateQuery())
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Alert Configuration</CardTitle>
                        <CardDescription>Configure Multi-Window Multi-Burn-Rate Alerts (Google SRE Style).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Metric Name</Label>
                            <Input value={metric} onChange={(e) => setMetric(e.target.value)} placeholder="http_requests_total" />
                        </div>

                        <div className="grid gap-2">
                            <Label>Error Label Filter</Label>
                            <Input value={errorLabel} onChange={(e) => setErrorLabel(e.target.value)} placeholder='code=~"5.."' />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>SLO Target (%)</Label>
                                <Input type="number" value={slo} onChange={(e) => setSlo(Number(e.target.value))} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Burn Rate Factor</Label>
                                <Input type="number" value={burnRate} onChange={(e) => setBurnRate(Number(e.target.value))} />
                                <p className="text-[10px] text-muted-foreground">14.4x for 1h window usually.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Short Window</Label>
                                <Select value={windowShort} onValueChange={setWindowShort}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5m">5m</SelectItem>
                                        <SelectItem value="30m">30m</SelectItem>
                                        <SelectItem value="1h">1h</SelectItem>
                                        <SelectItem value="6h">6h</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Long Window</Label>
                                <Select value={windowLong} onValueChange={setWindowLong}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1h">1h</SelectItem>
                                        <SelectItem value="6h">6h</SelectItem>
                                        <SelectItem value="3d">3d</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full bg-slate-950 text-slate-50">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 bg-slate-900/50">
                        <div className="flex items-center gap-2">
                            <Terminal className="size-4" />
                            <CardTitle className="text-sm font-mono">prometheus_rule.yaml</CardTitle>
                        </div>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 text-xs hover:bg-slate-800 hover:text-white">
                            <Copy className="mr-2 size-3" /> Copy
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <pre className="overflow-x-auto p-4 text-xs font-mono md:text-sm leading-relaxed">
                            <code>{generateQuery()}</code>
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
