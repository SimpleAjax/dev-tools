"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function BackoffCalc() {
    const [baseDelay, setBaseDelay] = useState(100); // ms
    const [maxDelay, setMaxDelay] = useState(5000); // ms
    const [retries, setRetries] = useState(10);
    const [multiplier, setMultiplier] = useState(2);
    const [jitter, setJitter] = useState(true);
    const [jitterFactor, setJitterFactor] = useState(0.5); // 50% random
    const [simCount, setSimCount] = useState(1); // Simulate multiple clients?

    // Generate Data
    const data = useMemo(() => {
        const points = [];

        // Single perfect curve
        const perfect = [];
        for (let i = 0; i <= retries; i++) {
            let delay = Math.min(maxDelay, baseDelay * Math.pow(multiplier, i));
            perfect.push({ retry: i, delay });
        }

        // Generate Jittered Simulations
        // Structure: { retry: 0, client1: 100, client2: 120, ... }
        for (let i = 0; i <= retries; i++) {
            const row: any = { retry: i, ideal: perfect[i].delay };

            // Client Sims
            for (let c = 0; c < 5; c++) { // Simulate 5 clients always for vis
                let d = perfect[i].delay;
                if (jitter) {
                    // Full Jitter: random between 0 and cap? 
                    // Or Equal Jitter: base + random portion?
                    // Standard "Full Jitter": sleep = random_between(0, min(cap, base * 2 ** attempt))
                    // Standard "Equal Jitter": temp = min(cap, base * 2 ** attempt); sleep = temp/2 + random_between(0, temp/2)

                    // Let's use a configurable factor.
                    // randomized_delay = delay * (1 - factor) + delay * factor * random()
                    // wait, no, usually jitter reduces collision.
                    // AWS Style Full Jitter: random(0, delay)

                    // Implementation here: Random +/- factor%
                    const spread = d * jitterFactor;
                    const min = d - spread;
                    const max = d + spread;
                    d = min + Math.random() * (max - min);
                }
                row[`client${c}`] = Math.max(0, Math.min(maxDelay, d));
            }
            points.push(row);
        }

        return points;
    }, [baseDelay, maxDelay, retries, multiplier, jitter, jitterFactor]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            <Card className="lg:col-span-1 h-fit">
                <CardContent className="pt-6 space-y-6">
                    <h3 className="font-semibold text-lg">Backoff Strategy</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Base Delay ({baseDelay}ms)</label>
                        <Slider min={10} max={1000} step={10} value={[baseDelay]} onValueChange={v => setBaseDelay(v[0])} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Max Delay (Cap) ({maxDelay}ms)</label>
                        <Slider min={1000} max={30000} step={500} value={[maxDelay]} onValueChange={v => setMaxDelay(v[0])} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Multiplier (x{multiplier})</label>
                        <Slider min={1.1} max={3} step={0.1} value={[multiplier]} onValueChange={v => setMultiplier(v[0])} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Max Retries ({retries})</label>
                        <Slider min={3} max={20} step={1} value={[retries]} onValueChange={v => setRetries(v[0])} />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Add Jitter</label>
                        <Switch checked={jitter} onCheckedChange={setJitter} />
                    </div>

                    {jitter && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Jitter Factor (+/- {jitterFactor * 100}%)</label>
                            <Slider min={0.1} max={1.0} step={0.1} value={[jitterFactor]} onValueChange={v => setJitterFactor(v[0])} />
                        </div>
                    )}

                    <div className="bg-secondary/30 p-4 rounded text-xs text-muted-foreground mt-4">
                        <strong>Why {jitter ? "Jitter" : "Exponential"}?</strong>
                        {jitter
                            ? " Adding randomness helps separate retries from multiple clients, avoiding 'Thundering Herd' problems where everyone retries at the exact same moment."
                            : " Standard Exponential Backoff increases wait time aggressively to let the failing system recover, but assumes single-client isolation."}
                    </div>

                </CardContent>
            </Card>

            <Card className="lg:col-span-2 flex flex-col">
                <CardContent className="pt-6 h-[500px] w-full">
                    <h3 className="font-semibold text-lg mb-4 text-center">Retry Schedule Visualization</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis
                                dataKey="retry"
                                label={{ value: 'Retry Attempt', position: 'insideBottomRight', offset: -10 }}
                            />
                            <YAxis
                                label={{ value: 'Delay (ms)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                formatter={(value: any) => [`${Math.round(value)}ms`, 'Delay']}
                            />

                            {/* Ideal Curve */}
                            <Line
                                type="monotone"
                                dataKey="ideal"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                name="Ideal (No Jitter)"
                                strokeOpacity={jitter ? 0.3 : 1}
                            />

                            {/* Jittered Clients */}
                            {jitter && (
                                <>
                                    <Line type="monotone" dataKey="client0" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Client 1" />
                                    <Line type="monotone" dataKey="client1" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Client 2" />
                                    <Line type="monotone" dataKey="client2" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Client 3" />
                                </>
                            )}

                            {/* Max Delay Line */}
                            <ReferenceLine y={maxDelay} label="Max Cap" stroke="red" strokeDasharray="3 3" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
