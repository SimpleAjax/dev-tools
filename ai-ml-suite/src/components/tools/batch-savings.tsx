"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

const BATCH_MODELS = [
    { id: "gpt-4o", name: "GPT-4o", input: 5.00, output: 15.00 },
    { id: "gpt-4o-mini", name: "GPT-4o-mini", input: 0.15, output: 0.60 },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", input: 10.00, output: 30.00 },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", input: 0.50, output: 1.50 },
];

export function BatchSavings() {
    const [modelId, setModelId] = useState("gpt-4o");
    const [requests, setRequests] = useState(100000);
    const [tokensPerReq, setTokensPerReq] = useState(1000); // Blended input/output

    const selectedModel = BATCH_MODELS.find(m => m.id === modelId) || BATCH_MODELS[0];

    // Simplified: Assume 70% input, 30% output split for "TokensPerReq" validation
    const inputTokens = tokensPerReq * 0.7;
    const outputTokens = tokensPerReq * 0.3;

    const costPer1k = (inputTokens * selectedModel.input + outputTokens * selectedModel.output) / 1000; // actually pricing is per 1M, so normalize

    const standardCost = (requests * (inputTokens * selectedModel.input + outputTokens * selectedModel.output)) / 1_000_000;

    const batchCost = standardCost * 0.5; // 50% discount
    const savings = standardCost - batchCost;

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Workload Simulation</CardTitle>
                        <CardDescription>Enter your expected Batch API volume.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Model</Label>
                            <Select value={modelId} onValueChange={setModelId}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {BATCH_MODELS.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Daily Requests</Label>
                                <span className="text-sm text-muted-foreground">{requests.toLocaleString()}</span>
                            </div>
                            <Slider
                                value={[requests]}
                                onValueChange={([v]) => setRequests(v)}
                                max={1000000}
                                step={1000}
                            />
                            <Input
                                type="number"
                                value={requests}
                                onChange={(e) => setRequests(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Avg Tokens / Request</Label>
                                <span className="text-sm text-muted-foreground">{tokensPerReq.toLocaleString()}</span>
                            </div>
                            <Slider
                                value={[tokensPerReq]}
                                onValueChange={([v]) => setTokensPerReq(v)}
                                max={10000}
                                step={100}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground">
                            *Assuming 70/30 Input/Output split.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20 h-full">
                    <CardHeader>
                        <CardTitle>Projected Value</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 justify-center h-full">
                        <div className="text-center space-y-2">
                            <p className="text-muted-foreground">Daily Standard Cost</p>
                            <div className="text-3xl font-mono decoration-destructive/50 line-through text-muted-foreground">
                                ${standardCost.toFixed(2)}
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-muted-foreground">Daily Batch Cost</p>
                            <div className="text-4xl font-bold font-mono text-primary">
                                ${batchCost.toFixed(2)}
                            </div>
                        </div>

                        <Separator />

                        <div className="text-center space-y-2 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                            <p className="text-sm font-medium text-green-500">Monthly Savings (30 Days)</p>
                            <div className="text-5xl font-extrabold text-green-600 dark:text-green-400">
                                ${(savings * 30).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                            <p className="text-xs text-green-700/70 dark:text-green-400/70">
                                That's ${(savings * 365).toLocaleString(undefined, { maximumFractionDigits: 0 })} per year!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
