"use client"

import * as React from "react"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ErrorBudgetCalculator() {
    const [requests, setRequests] = React.useState<number>(1000000)
    const [slo, setSlo] = React.useState<number>(99.9)
    const [period, setPeriod] = React.useState<string>("month")
    const [currentErrors, setCurrentErrors] = React.useState<number>(0)

    // Calculate budget
    const errorBudget = requests * (1 - slo / 100)
    const remainingBudget = errorBudget - currentErrors
    const percentUsed = (currentErrors / errorBudget) * 100

    // Format numbers
    const fmt = (n: number) => new Intl.NumberFormat().format(Math.floor(n))

    const getStatusColor = () => {
        if (percentUsed >= 100) return "text-red-500"
        if (percentUsed >= 80) return "text-orange-500"
        return "text-green-500"
    }

    const getProgressColor = () => {
        if (percentUsed >= 100) return "bg-red-500"
        if (percentUsed >= 80) return "bg-orange-500"
        return "bg-green-500"
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>SLO Configuration</CardTitle>
                        <CardDescription>Define your traffic volume and reliability target.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Time Period</Label>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="day">Daily</SelectItem>
                                    <SelectItem value="week">Weekly</SelectItem>
                                    <SelectItem value="month">Monthly</SelectItem>
                                    <SelectItem value="quarter">Quarterly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Total Requests (per {period})</Label>
                            <Input
                                type="number"
                                value={requests}
                                onChange={(e) => setRequests(Number(e.target.value))}
                            />
                            <p className="text-xs text-muted-foreground">
                                Example: 1,000,000 requests
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>SLO Target (%)</Label>
                                <span className="text-sm text-muted-foreground">{slo}%</span>
                            </div>
                            <Slider
                                value={[slo]}
                                min={90}
                                max={99.999}
                                step={0.001}
                                onValueChange={(val) => setSlo(val[0])}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Current Errors (Observed)</Label>
                            <Input
                                type="number"
                                value={currentErrors}
                                onChange={(e) => setCurrentErrors(Number(e.target.value))}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Error Budget Status</CardTitle>
                        <CardDescription>
                            Budget resets every {period}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex flex-col gap-1 rounded-lg border p-4 bg-muted/20">
                            <span className="text-sm text-muted-foreground">Total Allowable Errors</span>
                            <span className="text-3xl font-bold">{fmt(errorBudget)}</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Budget Consumed</span>
                                <span className={getStatusColor()}>{Math.min(percentUsed, 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={Math.min(percentUsed, 100)} className={getProgressColor()} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border p-4 flex flex-col items-center justify-center text-center gap-2">
                                <CheckCircle className="size-8 text-green-500/50" />
                                <div className="text-2xl font-bold">{fmt(Math.max(0, remainingBudget))}</div>
                                <div className="text-xs text-muted-foreground">Errors Remaining</div>
                            </div>
                            <div className="rounded-lg border p-4 flex flex-col items-center justify-center text-center gap-2">
                                <XCircle className="size-8 text-red-500/50" />
                                <div className="text-2xl font-bold">{fmt(currentErrors)}</div>
                                <div className="text-xs text-muted-foreground">Errors Observed</div>
                            </div>
                        </div>

                        {remainingBudget < 0 && (
                            <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-red-900 border border-red-200">
                                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                                <div className="text-sm">
                                    <strong>Budget Exhausted!</strong> You have exceeded your error budget by {fmt(Math.abs(remainingBudget))} errors.
                                    SRE policy suggests freezing new feature deployments until reliability stabilizes.
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
