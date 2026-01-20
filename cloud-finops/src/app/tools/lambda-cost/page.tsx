"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateLambdaCost, LambdaConfig, MEMORY_OPTIONS } from "@/lib/pricing/lambda";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";

export default function LambdaCostPage() {
    const [config, setConfig] = useState<LambdaConfig>({
        region: "us-east-1",
        architecture: "x86",
        memoryMB: 1024,
        ephemeralStorageMB: 512,
        requestsPerMonth: 1000000,
        avgDurationMs: 500,
        includeFreeTier: true,
    });

    const result = useMemo(() => calculateLambdaCost(config), [config]);

    const updateConfig = (key: keyof LambdaConfig, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    const chartData = [
        { name: "Requests", value: result.breakdown.requests, color: "#ec4899" }, // pink-500
        { name: "Compute", value: result.breakdown.compute, color: "#8b5cf6" },   // violet-500
    ].filter(d => d.value > 0);

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AWS Lambda Cost Estimator</h1>
                <p className="text-slate-400 mt-2">
                    Calculate monthly bills based on detailed invocation patterns, memory allocation, and architecture.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Configuration Panel */}
                <div className="lg:col-span-2 text-slate-100">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                            <CardDescription>Adjust usage patterns to see price impact.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Requests Block */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base text-white">Monthly Requests</Label>
                                    <span className="text-sm text-pink-500 font-mono bg-pink-500/10 px-2 py-1 rounded">
                                        {config.requestsPerMonth.toLocaleString()} reqs
                                    </span>
                                </div>
                                <Slider
                                    defaultValue={[1000000]}
                                    max={100000000}
                                    step={100000}
                                    value={[config.requestsPerMonth]}
                                    onValueChange={(vals) => updateConfig("requestsPerMonth", vals[0])}
                                    className="py-4"
                                />
                                <div className="grid grid-cols-4 gap-2">
                                    {[10000, 1000000, 10000000, 50000000].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => updateConfig("requestsPerMonth", val)}
                                            className="text-xs border border-slate-700 rounded px-2 py-1 hover:bg-slate-800 text-slate-400"
                                        >
                                            {val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration Block */}
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base text-white">Avg Duration (ms)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={config.avgDurationMs}
                                            onChange={(e) => updateConfig("avgDurationMs", Number(e.target.value))}
                                            className="w-24 h-8 bg-slate-950 border-slate-700 text-right"
                                        />
                                        <span className="text-xs text-slate-500">ms</span>
                                    </div>
                                </div>
                                <Slider
                                    max={15000}
                                    step={50}
                                    value={[config.avgDurationMs]}
                                    onValueChange={(vals) => updateConfig("avgDurationMs", vals[0])}
                                />
                            </div>

                            {/* Memory Block */}
                            <div className="space-y-4 pt-4 border-t border-slate-800">
                                <Label className="text-base text-white">Memory Allocation</Label>
                                <Select
                                    value={config.memoryMB.toString()}
                                    onValueChange={(val) => updateConfig("memoryMB", Number(val))}
                                >
                                    <SelectTrigger className="w-full bg-slate-950 border-slate-700">
                                        <SelectValue placeholder="Select memory" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                        {MEMORY_OPTIONS.map((mem) => (
                                            <SelectItem key={mem} value={mem.toString()}>
                                                {mem} MB
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-slate-500">
                                    Pro tip: Higher memory often correlates with faster execution (and potentially lower costs).
                                </p>
                            </div>

                            {/* Advanced Settings */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                                <div className="flex flex-col space-y-2">
                                    <Label>Architecture</Label>
                                    <div className="flex items-center gap-2 pt-2">
                                        <button
                                            onClick={() => updateConfig("architecture", "x86")}
                                            className={`flex-1 py-1.5 text-sm rounded transition ${config.architecture === 'x86' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                                        >
                                            x86
                                        </button>
                                        <button
                                            onClick={() => updateConfig("architecture", "arm")}
                                            className={`flex-1 py-1.5 text-sm rounded transition ${config.architecture === 'arm' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                                        >
                                            ARM
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2 justify-center">
                                    <div className="flex items-center justify-between">
                                        <Label>Free Tier Data</Label>
                                        <Switch
                                            checked={config.includeFreeTier}
                                            onCheckedChange={(c) => updateConfig("includeFreeTier", c)}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        Include AWS Free Tier (400k GB-seconds)
                                    </span>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Results Panel */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-violet-600" />
                        <CardHeader>
                            <CardTitle className="text-slate-200">Estimated Cost</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline mb-1">
                                <span className="text-5xl font-extrabold text-white tracking-tight">
                                    ${result.total.toFixed(2)}
                                </span>
                                <span className="text-lg text-slate-500 ml-2">/month</span>
                            </div>

                            <div className="h-[200px] w-full mt-6">
                                {result.total > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                                formatter={(value: any) => [`$${Number(value).toFixed(4)}`, "Cost"]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                        Free Tier Covered
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 mt-6">
                                <div className="flex justify-between text-sm">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full bg-pink-500 mr-2" />
                                        <span className="text-slate-300">Requests</span>
                                    </div>
                                    <span className="font-mono text-slate-200">${result.breakdown.requests.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full bg-violet-500 mr-2" />
                                        <span className="text-slate-300">Compute</span>
                                    </div>
                                    <span className="font-mono text-slate-200">${result.breakdown.compute.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-sm">Usage Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-slate-400">
                            <div className="flex justify-between">
                                <span>Total Compute</span>
                                <span className="text-slate-200">{(result.metrics.totalComputeSeconds / 3600).toFixed(1)} hrs</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Data Processed</span>
                                <span className="text-slate-200">-</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
