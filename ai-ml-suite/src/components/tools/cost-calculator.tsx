"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

interface PricingModel {
    provider: string;
    name: string;
    inputPrice: number; // per 1M
    outputPrice: number; // per 1M
    color: string;
}

const PRICING_DATA: PricingModel[] = [
    { provider: "OpenAI", name: "GPT-4o", inputPrice: 5.00, outputPrice: 15.00, color: "#10a37f" },
    { provider: "OpenAI", name: "GPT-4o-mini", inputPrice: 0.15, outputPrice: 0.60, color: "#5436da" },
    { provider: "Anthropic", name: "Claude 3.5 Sonnet", inputPrice: 3.00, outputPrice: 15.00, color: "#d97757" },
    { provider: "Anthropic", name: "Claude 3 Haiku", inputPrice: 0.25, outputPrice: 1.25, color: "#f2a289" },
    { provider: "Google", name: "Gemini 1.5 Pro", inputPrice: 3.50, outputPrice: 10.50, color: "#4285f4" },
    { provider: "Google", name: "Gemini 1.5 Flash", inputPrice: 0.075, outputPrice: 0.30, color: "#ea4335" },
    { provider: "Groq", name: "Llama 3 70B", inputPrice: 0.59, outputPrice: 0.79, color: "#f55036" },
];

export function CostCalculator() {
    const [inputTokens, setInputTokens] = useState<number>(1000);
    const [outputTokens, setOutputTokens] = useState<number>(500);
    const [requests, setRequests] = useState<number>(10000);

    const calculateCost = (model: PricingModel) => {
        const inputCost = (inputTokens / 1_000_000) * model.inputPrice;
        const outputCost = (outputTokens / 1_000_000) * model.outputPrice;
        const costPerReq = inputCost + outputCost;
        const monthlyCost = costPerReq * requests;
        return { ...model, costPerReq, monthlyCost };
    };

    const data = PRICING_DATA.map(calculateCost).sort((a, b) => b.monthlyCost - a.monthlyCost);

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Controls */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Usage Parameters</CardTitle>
                    <CardDescription>Adjust tokens and request volume.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Input Tokens / Req</Label>
                            <span className="text-sm text-muted-foreground">{inputTokens.toLocaleString()}</span>
                        </div>
                        <Slider
                            value={[inputTokens]}
                            onValueChange={([v]) => setInputTokens(v)}
                            max={128000}
                            step={100}
                        />
                        <Input
                            type="number"
                            value={inputTokens}
                            onChange={(e) => setInputTokens(Number(e.target.value))}
                            className="mt-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Output Tokens / Req</Label>
                            <span className="text-sm text-muted-foreground">{outputTokens.toLocaleString()}</span>
                        </div>
                        <Slider
                            value={[outputTokens]}
                            onValueChange={([v]) => setOutputTokens(v)}
                            max={16000}
                            step={100}
                        />
                        <Input
                            type="number"
                            value={outputTokens}
                            onChange={(e) => setOutputTokens(Number(e.target.value))}
                            className="mt-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Monthly Requests</Label>
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
                            className="mt-2"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="lg:col-span-8 space-y-6">
                {/* Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Cost Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={140}
                                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                />
                                <RechartsTooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Monthly Cost"]}
                                />
                                <Bar dataKey="monthlyCost" radius={[0, 4, 4, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead className="text-right">Price/1M In</TableHead>
                                    <TableHead className="text-right">Price/1M Out</TableHead>
                                    <TableHead className="text-right">Cost/Req</TableHead>
                                    <TableHead className="text-right">Monthly</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((model) => (
                                    <TableRow key={model.name}>
                                        <TableCell className="font-medium text-muted-foreground">{model.provider}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
                                                {model.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">${model.inputPrice}</TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">${model.outputPrice}</TableCell>
                                        <TableCell className="text-right font-mono">${model.costPerReq.toFixed(4)}</TableCell>
                                        <TableCell className="text-right font-bold font-mono text-primary">
                                            ${model.monthlyCost.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
