"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateDynamoCost, DynamoConfig } from "@/lib/pricing/dynamodb";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { Check, Info } from "lucide-react";

export default function DynamoDBPlanner() {
    const [config, setConfig] = useState<DynamoConfig>({
        avgItemSizeKB: 1,
        readConsistency: "eventual",
        writeType: "standard",
        readsPerSecond: 100,
        writesPerSecond: 10,
        storageGB: 10,
        percentageUtilization: 70,
    });

    const result = useMemo(() => calculateDynamoCost(config), [config]);

    const updateConfig = (key: keyof DynamoConfig, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    const chartData = [
        { mode: "On-Demand", cost: result.onDemand.total },
        { mode: "Provisioned", cost: result.provisioned.total },
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">DynamoDB Capacity Planner</h1>
                <p className="text-slate-400 mt-2">
                    Math out the complexity of Read/Write Units (RCU/WCU) vs On-Demand Pay-per-Request.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CONFIGURATION */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle>Workload Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Traffic */}
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-white">Avg Reads / sec</Label>
                                    <span className="text-indigo-400 font-mono">{config.readsPerSecond}</span>
                                </div>
                                <Slider
                                    min={1} max={5000} step={10}
                                    value={[config.readsPerSecond]}
                                    onValueChange={(v) => updateConfig("readsPerSecond", v[0])}
                                />

                                <div className="flex justify-between">
                                    <Label className="text-white">Avg Writes / sec</Label>
                                    <span className="text-rose-400 font-mono">{config.writesPerSecond}</span>
                                </div>
                                <Slider
                                    min={1} max={1000} step={5}
                                    value={[config.writesPerSecond]}
                                    onValueChange={(v) => updateConfig("writesPerSecond", v[0])}
                                />
                            </div>

                            {/* Item Size */}
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <div className="flex justify-between">
                                    <Label className="text-white">Avg Item Size (KB)</Label>
                                    <span className="text-slate-400 font-mono">{config.avgItemSizeKB} KB</span>
                                </div>
                                <Slider
                                    min={1} max={400} step={1}
                                    value={[config.avgItemSizeKB]}
                                    onValueChange={(v) => updateConfig("avgItemSizeKB", v[0])}
                                />
                                <p className="text-xs text-slate-500">Affects unit consumption (4KB chunks for read, 1KB for write).</p>
                            </div>

                            {/* Consistency */}
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <Label>Read Consistency</Label>
                                <Select value={config.readConsistency} onValueChange={(v: any) => updateConfig("readConsistency", v)}>
                                    <SelectTrigger className="bg-slate-950 border-slate-700">
                                        <SelectValue placeholder="Consistency" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 text-white border-slate-700">
                                        <SelectItem value="eventual">Eventual (0.5x RCU)</SelectItem>
                                        <SelectItem value="strong">Strongly Consistent (1x RCU)</SelectItem>
                                        <SelectItem value="transactional">Transactional (2x RCU)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* RESULTS */}
                <div className="lg:col-span-2 space-y-6">

                    {/* COMPARISON CHART */}
                    <div className="grid grid-cols-2 gap-4">
                        {["On-Demand", "Provisioned"].map((mode) => (
                            <Card key={mode} className={`bg-slate-900 border-slate-800 ${result.recommendation === mode ? 'border-green-500 border-2 relative' : ''}`}>
                                {result.recommendation === mode && (
                                    <div className="absolute top-2 right-2 text-green-500 flex gap-1 items-center bg-green-900/20 px-2 py-1 rounded text-xs font-bold">
                                        <Check className="w-3 h-3" /> Recommended
                                    </div>
                                )}
                                <CardContent className="pt-6 text-center">
                                    <div className="text-slate-400 text-sm mb-2">{mode} Mode</div>
                                    <div className="text-3xl font-bold text-white">
                                        ${(mode === "On-Demand" ? result.onDemand.total : result.provisioned.total).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2">per month</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-200">Needed Provisioned Capacity</CardTitle>
                            <CardDescription>
                                If you choose provisioned, you'd need to set your table to:
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-8 text-center">
                                <div className="space-y-1">
                                    <div className="text-4xl font-bold text-indigo-400">{result.provisioned.units.rcu}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-widest">RCU</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-4xl font-bold text-rose-400">{result.provisioned.units.wcu}</div>
                                    <div className="text-xs text-slate-400 uppercase tracking-widest">WCU</div>
                                </div>
                            </div>
                            <div className="mt-8 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-500 mt-1" />
                                <div className="text-sm text-blue-200">
                                    Calculation assumes <span className="font-bold text-white">{config.percentageUtilization}% target utilization</span>.
                                    This buffer protects against traffic spikes, which is why your required capacity is higher than your average traffic.
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
