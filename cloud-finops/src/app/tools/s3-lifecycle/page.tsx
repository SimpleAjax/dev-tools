"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculateS3Lifecycle, S3LifecycleConfig } from "@/lib/pricing/s3";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from "recharts";
import { ArrowDown } from "lucide-react";

export default function S3LifecyclePage() {
    const [config, setConfig] = useState<S3LifecycleConfig>({
        initialStorageTB: 50,
        growthRatePercent: 0,
        durationMonths: 12,
        transitionIaDays: 30,       // Standard -> IA after 1 month
        transitionGlacierDays: 90,  // IA -> Glacier after 3 months
    });

    const result = useMemo(() => calculateS3Lifecycle(config), [config]);

    const updateConfig = (key: keyof S3LifecycleConfig, value: number) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">S3 Lifecycle Visualizer</h1>
                <p className="text-slate-400 mt-2">
                    Visualize cost decay as data moves from Standard to Infrequent Access to Glacier.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CONTROLS */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle>Lifecycle Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-white">Initial Data (TB)</Label>
                                    <span className="text-blue-500 font-mono">{config.initialStorageTB} TB</span>
                                </div>
                                <Slider
                                    min={1} max={500} step={1}
                                    value={[config.initialStorageTB]}
                                    onValueChange={(v) => updateConfig("initialStorageTB", v[0])}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-white">Move to IA (days)</Label>
                                    <span className="text-teal-500 font-mono">{config.transitionIaDays} days</span>
                                </div>
                                <Slider
                                    min={30} max={365} step={30}
                                    value={[config.transitionIaDays]}
                                    onValueChange={(v) => updateConfig("transitionIaDays", v[0])}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-white">Move to Glacier (days)</Label>
                                    <span className="text-cyan-500 font-mono">{config.transitionGlacierDays} days</span>
                                </div>
                                <Slider
                                    min={30} max={365} step={30}
                                    value={[config.transitionGlacierDays]}
                                    onValueChange={(v) => updateConfig("transitionGlacierDays", v[0])}
                                />
                                <p className="text-xs text-slate-500">Deep Archive pricing applies after this.</p>
                            </div>

                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <Label className="text-slate-300 block mb-2">Duration to Simulate</Label>
                                <div className="flex gap-2">
                                    {[12, 24, 36].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => updateConfig("durationMonths", m)}
                                            className={`px-3 py-1 rounded text-sm transition ${config.durationMonths === m ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                                        >
                                            {m} Months
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* VISUALIZATION */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="pt-6">
                                <div className="text-sm text-slate-400 mb-1">Total Cost (All Standard)</div>
                                <div className="text-2xl font-bold text-slate-200">${result.summary.totalCostNoLifecycle.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900 border-slate-800 border-b-4 border-b-teal-500">
                            <CardContent className="pt-6">
                                <div className="text-sm text-teal-400 mb-1">Total Cost (With Lifecycle)</div>
                                <div className="text-3xl font-bold text-white">${result.summary.totalCostWithLifecycle.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-slate-900 border-slate-800 h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-slate-200">Storage Class Distribution (TB)</CardTitle>
                            <CardDescription>Watch data "cool down" over time.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={result.dataPoints} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorStd" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorIa" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorGla" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b' }} />
                                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} label={{ value: 'TB', angle: -90, position: 'insideLeft' }} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="Standard" stackId="1" stroke="#ef4444" fill="url(#colorStd)" />
                                    <Area type="monotone" dataKey="InfrequentAccess" stackId="1" stroke="#14b8a6" fill="url(#colorIa)" />
                                    <Area type="monotone" dataKey="Glacier" stackId="1" stroke="#06b6d4" fill="url(#colorGla)" />
                                    <Legend />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-center gap-4">
                        <div className="bg-green-500/20 p-2 rounded-full">
                            <ArrowDown className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <div className="text-green-400 font-bold text-lg">
                                {result.summary.savingsPercent.toFixed(1)}% Savings
                            </div>
                            <div className="text-green-400/70 text-sm">
                                You save ${result.summary.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} over {config.durationMonths} months.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
