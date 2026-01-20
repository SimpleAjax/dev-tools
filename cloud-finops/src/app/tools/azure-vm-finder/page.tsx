"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AZURE_INSTANCES } from "@/lib/data/azure-instances";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function AzureVMFinder() {
    const [minCpu, setMinCpu] = useState(2);
    const [minRam, setMinRam] = useState(4);

    const filtered = AZURE_INSTANCES.filter(i =>
        i.vCPUs >= minCpu && i.memoryGB >= minRam
    ).sort((a, b) => a.priceHourly - b.priceHourly); // Cheapest first

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Azure VM SKU Finder</h1>
                <p className="text-slate-400 mt-2">
                    "I need at least X CPU and Y RAM." We find the cheapest SKU that fits.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* FILTERS */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="text-white">Min vCPU</Label>
                                    <span className="text-blue-500 font-bold">{minCpu}</span>
                                </div>
                                <Slider
                                    min={1} max={32} step={1}
                                    value={[minCpu]}
                                    onValueChange={(v) => setMinCpu(v[0])}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="text-white">Min RAM (GB)</Label>
                                    <span className="text-blue-500 font-bold">{minRam}</span>
                                </div>
                                <Slider
                                    min={1} max={128} step={1}
                                    value={[minRam]}
                                    onValueChange={(v) => setMinRam(v[0])}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                        <h4 className="text-sm font-bold text-blue-400 mb-2">Did you know?</h4>
                        <p className="text-xs text-blue-300/80">
                            Azure B-Series (Burstable) are often 50% cheaper but throttle CPU. Only use them for sporadic workloads.
                        </p>
                    </div>
                </div>

                {/* RESULTS */}
                <div className="lg:col-span-3 space-y-4">
                    {filtered.map((vm, idx) => (
                        <Card key={vm.name} className={`bg-slate-900 hover:border-blue-500/50 transition ${idx === 0 ? 'border-2 border-green-500/50 relative overflow-hidden' : 'border-slate-800'}`}>
                            {idx === 0 && (
                                <div className="absolute top-0 right-0 bg-green-500 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wide rounded-bl">
                                    Best Value
                                </div>
                            )}
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-white">{vm.name}</h3>
                                        <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-800">
                                            {vm.family}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {vm.vCPUs} vCPU • {vm.memoryGB} GB RAM
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">
                                        ${vm.priceHourly.toFixed(3)}<span className="text-xs text-slate-500 font-normal">/hr</span>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        ~${(vm.priceHourly * 730).toFixed(0)}/mo
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
                            No VMs match these criteria. Try lowering the CPU/RAM requirements.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
