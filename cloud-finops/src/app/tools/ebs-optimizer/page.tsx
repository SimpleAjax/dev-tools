"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { calculateEBSCost, generateBreakEvenData, EBSConfig } from "@/lib/pricing/ebs";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, Cell
} from "recharts";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function EBSOptimizerPage() {
    const [config, setConfig] = useState<EBSConfig>({
        storageGB: 100,
        iops: 3000,
        throughputMBs: 125,
    });

    const result = useMemo(() => calculateEBSCost(config), [config]);
    const graphData = useMemo(() => generateBreakEvenData(config.storageGB, config.throughputMBs), [config.storageGB, config.throughputMBs]);

    const updateConfig = (key: keyof EBSConfig, value: number) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    const costComparisonData = [
        { name: "gp3", cost: result.gp3.total, color: "#10b981" }, // emerald-500
        { name: "io2", cost: result.io2.total, color: "#3b82f6" }, // blue-500
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">EBS Optimizer: gp3 vs io2</h1>
                <p className="text-slate-400 mt-2">
                    Find the most cost-effective storage class. Compare General Purpose (gp3) against Provisioned IOPS (io2).
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CONFIGURATION */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle>Volume Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">

                            {/* Storage */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-white">Storage Size</Label>
                                    <span className="text-sm text-emerald-500 font-mono">{config.storageGB} GB</span>
                                </div>
                                <Slider
                                    min={1} max={16000} step={10}
                                    value={[config.storageGB]}
                                    onValueChange={(v) => updateConfig("storageGB", v[0])}
                                />
                            </div>

                            {/* IOPS */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-white">Provisioned IOPS</Label>
                                    <span className="text-sm text-emerald-500 font-mono">{config.iops}</span>
                                </div>
                                <Slider
                                    min={3000} max={64000} step={100}
                                    value={[config.iops]}
                                    onValueChange={(v) => updateConfig("iops", v[0])}
                                />
                                <p className="text-xs text-slate-500">
                                    gp3 includes 3,000 IOPS free. io2 charges for all.
                                </p>
                            </div>

                            {/* Throughput */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-800 p-2 rounded">
                                    <div>
                                        <Label className="text-white block">Throughput</Label>
                                        <span className="text-[10px] text-slate-400">gp3 only</span>
                                    </div>
                                    <span className="text-sm text-emerald-500 font-mono">{config.throughputMBs} MB/s</span>
                                </div>
                                <Slider
                                    min={125} max={1000} step={25}
                                    value={[config.throughputMBs]}
                                    onValueChange={(v) => updateConfig("throughputMBs", v[0])}
                                />
                            </div>

                        </CardContent>
                    </Card>

                    {/* RECOMMENDATION CARD */}
                    <Card className={`border-l-4 ${result.recommendation === 'gp3' ? 'border-l-emerald-500' : 'border-l-blue-500'} bg-slate-900 border-t-0 border-r-0 border-b-0`}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                                {result.recommendation === 'gp3' ? (
                                    <CheckCircle className="text-emerald-500 h-6 w-6" />
                                ) : (
                                    <AlertCircle className="text-blue-500 h-6 w-6" />
                                )}
                                <h3 className="text-lg font-bold text-white capitalize">
                                    Use {result.recommendation}
                                </h3>
                            </div>
                            <p className="text-slate-400 text-sm">
                                You save <span className="text-white font-mono font-bold">${result.savings.toFixed(2)}/mo</span> by choosing {result.recommendation}.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* VISUALIZATION */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Main Bar Chart Comparison */}
                    <div className="grid grid-cols-2 gap-4">
                        {costComparisonData.map((item) => (
                            <Card key={item.name} className="bg-slate-900 border-slate-800">
                                <CardContent className="pt-6">
                                    <div className="text-slate-400 text-sm uppercase tracking-wider mb-1">
                                        AWS {item.name}
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">
                                        ${item.cost.toFixed(2)}
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                                        <div
                                            className="h-full transition-all duration-500"
                                            style={{
                                                width: `${(item.cost / Math.max(result.gp3.total, result.io2.total)) * 100}%`,
                                                backgroundColor: item.color
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Break Even Chart */}
                    <Card className="bg-slate-900 border-slate-800 h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-slate-200">Cost vs IOPS Scaling</CardTitle>
                            <CardDescription>At which point does io2 become cheaper?</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                    <XAxis
                                        dataKey="iops"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        label={{ value: 'Provisioned IOPS', position: 'insideBottomRight', offset: -5 }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(val: any) => [`$${Number(val).toFixed(0)}`, 'Cost']}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="gp3"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="io2"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Details Table */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-sm">Cost Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 text-sm font-mono border-b border-slate-800 pb-2 mb-2 text-slate-500">
                                <div>COMPONENT</div>
                                <div className="text-right">gp3 COST</div>
                                <div className="text-right">io2 COST</div>
                            </div>
                            {[
                                { label: 'Storage', k: 'storage' },
                                { label: 'IOPS', k: 'iops' },
                                { label: 'Throughput', k: 'throughput' }
                            ].map((row) => (
                                <div key={row.label} className="grid grid-cols-3 gap-4 text-sm py-1 border-b border-slate-800/50 last:border-0">
                                    <div className="text-slate-300">{row.label}</div>
                                    <div className="text-right text-emerald-400">
                                        ${(result.gp3.breakdown as any)[row.k].toFixed(2)}
                                    </div>
                                    <div className="text-right text-blue-400">
                                        ${(result.io2.breakdown as any)[row.k].toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
