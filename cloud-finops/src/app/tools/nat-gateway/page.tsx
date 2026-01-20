"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { calculateNatCost, NetworkConfig } from "@/lib/pricing/networking";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { ArrowDown, AlertTriangle } from "lucide-react";

export default function NatGatewayPage() {
    const [config, setConfig] = useState<NetworkConfig>({
        dataProcessedGB: 5000,
        natGatewaysCount: 3, // Typical HA setup (1 per AZ)
    });

    const result = useMemo(() => calculateNatCost(config), [config]);

    const updateConfig = (key: keyof NetworkConfig, value: number) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    const chartData = [
        { name: "Current Cost", pv: result.current.total, fill: "#ef4444" },
        { name: "With S3 Endpoint", pv: result.optimized.total, fill: "#22c55e" },
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">NAT Gateway "Hidden Tax" Calculator</h1>
                <p className="text-slate-400 mt-2">
                    Visualize how much you are paying for NAT vs. data processing, and estimate savings with VPC Endpoints.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* CONFIGURATION */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle>Usage Config</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-white">NAT Gateways Running</Label>
                                    <span className="text-sm text-orange-500 font-mono">{config.natGatewaysCount}</span>
                                </div>
                                <Slider
                                    min={1} max={10} step={1}
                                    value={[config.natGatewaysCount]}
                                    onValueChange={(v) => updateConfig("natGatewaysCount", v[0])}
                                />
                                <p className="text-xs text-slate-500">
                                    Usually 1 per Availability Zone (AZ).
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label className="text-white">Data Processed (GB/mo)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={config.dataProcessedGB}
                                            onChange={(e) => updateConfig("dataProcessedGB", Number(e.target.value))}
                                            className="h-8 w-24 bg-slate-950 border-slate-700 text-right"
                                        />
                                        <span className="text-xs text-slate-500">GB</span>
                                    </div>
                                </div>
                                <Slider
                                    min={0} max={100000} step={100}
                                    value={[config.dataProcessedGB]}
                                    onValueChange={(v) => updateConfig("dataProcessedGB", v[0])}
                                />
                            </div>

                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-orange-500">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                The "AWS Tax"
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-400 text-sm mb-4">
                                AWS charges <span className="text-white font-mono">$0.045/GB</span> just to pass data through a NAT Gateway.
                            </p>
                            <div className="bg-slate-800 p-3 rounded-lg">
                                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Your Processing Fee</span>
                                <span className="text-xl font-bold text-white font-mono">${result.current.processing.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* VISUALIZATION */}
                <div className="lg:col-span-2 space-y-6">

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-200">Potential Savings</CardTitle>
                            <CardDescription>
                                Scenario: Routing 50% of traffic (e.g. S3 dumps) through a free Gateway Endpoint.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Cost']}
                                    />
                                    <Bar dataKey="pv" barSize={40} radius={[0, 4, 4, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-slate-400">Current Monthly Bill</span>
                                </div>
                                <div className="text-3xl font-bold text-white">
                                    ${result.current.total.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-500/10 border-green-500/20 border">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-green-400">Potential S3 Savings</span>
                                    <ArrowDown className="h-4 w-4 text-green-500" />
                                </div>
                                <div className="text-3xl font-bold text-green-500">
                                    ${result.optimized.savings.toFixed(2)}
                                </div>
                                <p className="text-xs text-green-400/60 mt-2">
                                    If 50% of your traffic is S3/DynamoDB
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
