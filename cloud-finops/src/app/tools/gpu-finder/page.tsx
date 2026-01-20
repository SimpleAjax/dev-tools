"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { GPU_DATA } from "@/lib/data/gpu-pricing";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function GPUFinderPage() {
    const [minVRAM, setMinVRAM] = useState(16);
    const [providers, setProviders] = useState<Record<string, boolean>>({
        AWS: true, Azure: true, GCP: true, Lambda: true
    });

    const toggleProvider = (p: string) => {
        setProviders(prev => ({ ...prev, [p]: !prev[p] }));
    };

    const filtered = GPU_DATA.filter(g =>
        g.totalVRAM >= minVRAM && providers[g.provider]
    ).sort((a, b) => a.pricePerGBVRAM - b.pricePerGBVRAM); // Best value first

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">GPU VRAM Arbitrage</h1>
                <p className="text-slate-400 mt-2">
                    Find the cheapest way to fit your LLM into memory. Prices are normalized per GB of VRAM.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* FILTERS */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="pt-6 space-y-6">

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="text-white">Min Total VRAM</Label>
                                    <span className="text-purple-500 font-mono">{minVRAM} GB</span>
                                </div>
                                <Slider
                                    min={8} max={320} step={8}
                                    value={[minVRAM]}
                                    onValueChange={(v) => setMinVRAM(v[0])}
                                />
                                <p className="text-xs text-slate-500">
                                    Llama-7B needs ~16GB (fp16). Llama-70B needs ~140GB.
                                </p>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-800">
                                <Label className="text-white">Providers</Label>
                                {["AWS", "Azure", "GCP", "Lambda"].map(p => (
                                    <div key={p} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={p}
                                            checked={providers[p]}
                                            onCheckedChange={() => toggleProvider(p)}
                                            className="border-slate-600 data-[state=checked]:bg-purple-600"
                                        />
                                        <label htmlFor={p} className="text-sm font-medium text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {p}
                                        </label>
                                    </div>
                                ))}
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* LIST */}
                <div className="lg:col-span-3 space-y-4">
                    {filtered.map((gpu, idx) => (
                        <Card key={`${gpu.provider}-${gpu.name}`} className={`bg-slate-900 transition hover:border-purple-500/50 ${idx === 0 ? 'border-2 border-green-500/50' : 'border-slate-800'}`}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-950">
                                                {gpu.provider}
                                            </Badge>
                                            <span className="font-bold text-lg text-white">{gpu.name}</span>
                                            {gpu.notes && <span className="text-xs text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">{gpu.notes}</span>}
                                        </div>
                                        <div className="text-sm text-slate-400 flex gap-4">
                                            <span>{gpu.gpuCount}x <span className="text-slate-200 font-bold">{gpu.gpu}</span></span>
                                            <span>Total: <span className="text-purple-400 font-bold">{gpu.totalVRAM} GB</span></span>
                                        </div>
                                    </div>

                                    <div className="flex gap-8 text-right">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-widest">Price</div>
                                            <div className="text-xl font-bold text-white">${gpu.priceHourly.toFixed(2)}<span className="text-xs text-slate-500">/hr</span></div>
                                        </div>
                                        <div className="min-w-[100px]">
                                            <div className="text-xs text-purple-400/80 uppercase tracking-widest font-bold">Cost / GB</div>
                                            <div className="text-2xl font-bold text-purple-400">
                                                ${gpu.pricePerGBVRAM.toFixed(3)}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filtered.length === 0 && (
                        <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
                            No GPUs found. Try lowering VRAM requirements.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
