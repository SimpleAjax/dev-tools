"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calculator, Cloud, Zap, DollarSign, BarChart3 } from "lucide-react"

export function ServerlessCostCalculator() {
    const [invocations, setInvocations] = useState(1000000)
    const [duration, setDuration] = useState(100) // ms
    const [memory, setMemory] = useState(512) // MB, scaled differently per provider
    const [ephemeralStorage, setEphemeralStorage] = useState(512) // MB

    const [costs, setCosts] = useState<{
        aws: number;
        azure: number;
        gcp: number;
    }>({ aws: 0, azure: 0, gcp: 0 })

    useEffect(() => {
        calculateCosts()
    }, [invocations, duration, memory, ephemeralStorage])

    const calculateCosts = () => {
        // AWS Lambda Pricing (Approximate - us-east-1)
        // Request charge: $0.20 per 1M requests
        // Compute charge: $0.0000166667 for every GB-second
        const awsRequestCost = (invocations / 1000000) * 0.20
        const awsComputeSeconds = (invocations * duration) / 1000
        const awsGBSeconds = awsComputeSeconds * (memory / 1024)
        // Architecture x86 price
        const awsComputeCost = awsGBSeconds * 0.0000166667
        const awsTotal = awsRequestCost + awsComputeCost

        // Azure Functions (Consumption Plan)
        // Request charge: $0.20 per 1M executions
        // Resource Consumption: $0.000016 / GB-s
        // Free grant: 400,000 GB-s and 1M requests (ignored for total cost view usually, but good to note)
        // We will calculate raw cost without free tier for comparison or with? Let's show raw cost.
        const azureRequestCost = (invocations / 1000000) * 0.20
        const azureGBSeconds = (invocations * duration / 1000) * (memory / 1024)
        const azureComputeCost = azureGBSeconds * 0.000016
        const azureTotal = azureRequestCost + azureComputeCost

        // Google Cloud Functions (Gen 2)
        // Invocation: $0.40 per million (tier 1) ?? Changes. Let's use standard $0.40
        // GB-second: $0.0000165 (Tier 1)
        // GHz-second: $0.0000100 (Tier 1) - GCP charges for CPU separately in Gen2 often, but simplified to v1 for comparable Model or blended
        // Let's use simplified Gen 1 model for direct comparison or simple Gen 2
        // GCP Gen 1: $0.40/million calls. $0.0000165/GB-s
        const gcpRequestCost = (invocations / 1000000) * 0.40
        const gcpGBSeconds = (invocations * duration / 1000) * (memory / 1024)
        const gcpComputeCost = gcpGBSeconds * 0.0000165
        const gcpTotal = gcpRequestCost + gcpComputeCost

        setCosts({
            aws: awsTotal,
            azure: azureTotal,
            gcp: gcpTotal
        })
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4 }).format(val)
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-full border-blue-500/20 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <SettingsSliderIcon />
                        Configuration
                    </CardTitle>
                    <CardDescription>Adjust your workload parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="invocations" className="text-base font-semibold">Monthly Invocations</Label>
                            <span className="font-mono text-sm bg-secondary px-2 py-1 rounded-md">{invocations.toLocaleString()}</span>
                        </div>
                        <Slider
                            id="invocations"
                            min={10000}
                            max={100000000}
                            step={10000}
                            value={[invocations]}
                            onValueChange={(v) => setInvocations(v[0])}
                            className="py-4"
                        />
                        <div className="flex gap-2">
                            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setInvocations(100000)}>100k</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setInvocations(1000000)}>1M</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setInvocations(50000000)}>50M</Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="duration" className="text-base font-semibold">Avg. Duration (ms)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="duration-input"
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-20 text-right h-8"
                                />
                                <span className="text-muted-foreground text-sm">ms</span>
                            </div>
                        </div>
                        <Slider
                            id="duration"
                            min={10}
                            max={15000} // 15 mins is max for Lambda, but usually slider for ms
                            step={10}
                            value={[duration]}
                            onValueChange={(v) => setDuration(v[0])}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="memory" className="text-base font-semibold">Memory Allocated (MB)</Label>
                            <span className="font-mono text-sm bg-secondary px-2 py-1 rounded-md">{memory} MB</span>
                        </div>
                        <Slider
                            id="memory"
                            min={128}
                            max={10240}
                            step={128}
                            value={[memory]}
                            onValueChange={(v) => setMemory(v[0])}
                            className="py-4"
                        />
                        <div className="flex gap-2">
                            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setMemory(128)}>128MB</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setMemory(1024)}>1GB</Badge>
                            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setMemory(2048)}>2GB</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="bg-gradient-to-br from-card to-secondary/10 border-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            Estimated Monthly Cost
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <CostRow label="AWS Lambda" value={costs.aws} color="text-orange-500" />
                        <CostRow label="Azure Functions" value={costs.azure} color="text-blue-500" />
                        <CostRow label="Google Cloud Functions" value={costs.gcp} color="text-red-500" />

                        <div className="mt-8 pt-6 border-t">
                            <p className="text-xs text-muted-foreground italic">
                                * Estimates based on usage-based pricing models (e.g., AWS x86 Price). Does not include free tiers (usually 400k GB-s / month free), data transfer, or additional services.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" /> Cost Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex text-sm justify-between">
                                    <span>Requests Cost (Approx for 1M)</span>
                                    <span className="font-mono text-muted-foreground">~$0.20</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/40 w-[20%]"></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex text-sm justify-between">
                                    <span>Compute Cost</span>
                                    <span className="font-mono text-muted-foreground">{((costs.aws - (invocations / 1000000 * 0.20)) / costs.aws * 100).toFixed(0)}% of total</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[80%]"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function CostRow({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="flex items-end justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
                <Cloud className={`w-5 h-5 ${color}`} />
                <span className="font-medium">{label}</span>
            </div>
            <div className="text-2xl font-bold tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value)}
            </div>
        </div>
    )
}

function SettingsSliderIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-primary"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
            <circle cx="8" cy="18" r="2" />
            <circle cx="16" cy="6" r="2" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    )
}
