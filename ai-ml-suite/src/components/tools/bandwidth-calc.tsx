"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const MODEL_SIZES = [
    { id: "llama-3-8b", name: "Llama 3 8B (Q4)", size: 4.8 }, // GB
    { id: "llama-3-70b", name: "Llama 3 70B (Q4)", size: 40 },
    { id: "mistral-7b", name: "Mistral 7B (Q5)", size: 5.5 },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B (Q4)", size: 26 },
    { id: "grok-1", name: "Grok-1 (Full)", size: 300 },
];

export function BandwidthCalc() {
    const [modelId, setModelId] = useState("llama-3-70b");
    const [speedMbps, setSpeedMbps] = useState(100);

    const model = MODEL_SIZES.find(m => m.id === modelId) || MODEL_SIZES[0];

    // Size in bits = GB * 8 * 1000 * 1000 * 1000 (approx 10^9 for gigabyte decimal)
    // Actually let's do binary GiB -> decimal bits for network?
    // Network speed is usually Mbps (10^6 bits).
    // File size is usually GiB (2^30 bytes).
    // 1 GiB = 8.58 Gb (gigabits). 
    // Let's simplify: 1 GB (file) = 8 Gigabits.

    const sizeBits = model.size * 8 * 1000; // Megabits
    const timeSeconds = sizeBits / speedMbps;

    const minutes = Math.floor(timeSeconds / 60);
    const seconds = Math.floor(timeSeconds % 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Download Settings</CardTitle>
                    <CardDescription>Simulate downloading large model weights.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Model Weights</Label>
                        <Select value={modelId} onValueChange={setModelId}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MODEL_SIZES.map(m => (
                                    <SelectItem key={m.id} value={m.id}>{m.name} (~{m.size} GB)</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Internet Speed (Mbps)</Label>
                            <span className="text-sm text-muted-foreground">{speedMbps} Mbps</span>
                        </div>
                        <Slider
                            value={[speedMbps]}
                            onValueChange={([v]) => setSpeedMbps(v)}
                            max={1000}
                            step={10}
                        />
                        <Input type="number" value={speedMbps} onChange={e => setSpeedMbps(Number(e.target.value))} />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>DSL (10)</span>
                            <span>4G (50)</span>
                            <span>Fiber (1000)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>Estimated Time</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-3/4 items-center gap-2">
                    <div className="text-5xl font-bold text-primary">
                        {hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m ${seconds}s`}
                    </div>
                    <p className="text-muted-foreground">
                        to download {model.size} GB
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
