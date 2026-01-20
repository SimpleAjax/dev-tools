"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

export function TemperatureVisualizer() {
    const [temperature, setTemperature] = useState(1.0);
    const [topP, setTopP] = useState(1.0);

    // Simulated probability distribution for next token
    // Token Candidates: A, B, C, D, E with raw logits
    const rawLogits = [
        { token: "apple", logit: 10 },
        { token: "banana", logit: 8 },
        { token: "cherry", logit: 6 },
        { token: "date", logit: 4 },
        { token: "elderberry", logit: 2 },
    ];

    // Apply Temperature
    const applyTemp = (logits: typeof rawLogits, temp: number) => {
        // Avoid div by zero
        const t = Math.max(temp, 0.01);
        const exps = logits.map(l => Math.exp(l.logit / t));
        const sumExps = exps.reduce((a, b) => a + b, 0);
        return logits.map((l, i) => ({
            ...l,
            prob: exps[i] / sumExps
        }));
    };

    // Apply Top-P (Nucleus Sampling)
    // 1. Sort by prob desc
    // 2. Cumulative sum
    // 3. Cut off when sum >= topP
    const applyTopP = (probs: ReturnType<typeof applyTemp>, p: number) => {
        const sorted = [...probs].sort((a, b) => b.prob - a.prob);
        let cumulative = 0;
        return sorted.map(item => {
            cumulative += item.prob;
            return {
                ...item,
                // If the previous cumulative sum was already >= p, this item is excluded (prob becomes 0 for vis)
                // But we must keep at least one token.
                active: (cumulative - item.prob) < p || cumulative <= p || item === sorted[0]
            };
        }).sort((a, b) => rawLogits.findIndex(x => x.token === a.token) - rawLogits.findIndex(x => x.token === b.token)); // Restore original order for consistent chart
    };

    const probs = applyTemp(rawLogits, temperature);
    const finalData = applyTopP(probs, topP);

    return (
        <div className="grid gap-6 lg:grid-cols-12 h-[calc(100vh-12rem)]">
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Sampling Parameters</CardTitle>
                    <CardDescription>Adjust randomness and nucleus sampling.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Temperature: {temperature}</Label>
                            <span className="text-xs text-muted-foreground">
                                {temperature < 0.3 ? "Deterministic" : temperature > 1.5 ? "Chaotic" : "Creative"}
                            </span>
                        </div>
                        <Slider
                            value={[temperature]}
                            onValueChange={([v]) => setTemperature(v)}
                            min={0}
                            max={2}
                            step={0.1}
                        />
                        <p className="text-xs text-muted-foreground">
                            Controls randomness. Lower values make the model more confident/repetitive. Higher values flatten the distribution.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Top P: {topP}</Label>
                        </div>
                        <Slider
                            value={[topP]}
                            onValueChange={([v]) => setTopP(v)}
                            min={0}
                            max={1}
                            step={0.05}
                        />
                        <p className="text-xs text-muted-foreground">
                            Nucleus sampling. Restricts the candidate pool to the top X% cumulative probability mass.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-8 flex flex-col">
                <CardHeader>
                    <CardTitle>Token Probability Distribution</CardTitle>
                    <CardDescription>
                        Simulated next-token probabilities for: "The fruit bowl contains a..."
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={finalData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <XAxis dataKey="token" />
                            <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-card border p-2 rounded shadow-sm text-sm">
                                                <p className="font-bold">{data.token}</p>
                                                <p>Prob: {(data.prob * 100).toFixed(1)}%</p>
                                                <p className={data.active ? "text-green-500" : "text-red-500"}>
                                                    {data.active ? "Selected" : "Pruned by Top-P"}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="prob" animationDuration={300}>
                                {finalData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.active ? `hsl(var(--primary))` : `hsl(var(--muted))`}
                                        opacity={entry.active ? 1 : 0.3}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
