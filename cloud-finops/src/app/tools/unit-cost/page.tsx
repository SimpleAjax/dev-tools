"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Users, TrendingUp, AlertTriangle } from "lucide-react";

interface SaaSConfig {
    monthlyServerCost: number;
    monthlyDevOpsSalary: number; // Part of COGS?
    activeCustomers: number;
    avgRevenuePerUser: number; // ARPU
    requestsPerMonth: number;
}

export default function UnitCostPage() {
    const [config, setConfig] = useState<SaaSConfig>({
        monthlyServerCost: 500,
        monthlyDevOpsSalary: 0,
        activeCustomers: 100,
        avgRevenuePerUser: 29,
        requestsPerMonth: 1000000,
    });

    const updateConfig = (key: keyof SaaSConfig, value: number) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    const metrics = useMemo(() => {
        const totalCOGS = config.monthlyServerCost + config.monthlyDevOpsSalary;
        const costPerCustomer = config.activeCustomers > 0 ? totalCOGS / config.activeCustomers : 0;
        const costPerMillionReq = config.requestsPerMonth > 0 ? (totalCOGS / config.requestsPerMonth) * 1000000 : 0;

        const totalRevenue = config.activeCustomers * config.avgRevenuePerUser;
        const grossMargin = totalRevenue - totalCOGS;
        const grossMarginPercent = totalRevenue > 0 ? (grossMargin / totalRevenue) * 100 : 0;

        return {
            totalCOGS,
            costPerCustomer,
            costPerMillionReq,
            grossMargin,
            grossMarginPercent,
            breakEvenUsers: totalCOGS / config.avgRevenuePerUser
        };
    }, [config]);

    const chartData = [
        { name: "Cost", val: metrics.totalCOGS, fill: "#ef4444" },
        { name: "Profit", val: metrics.grossMargin > 0 ? metrics.grossMargin : 0, fill: "#22c55e" }
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">SaaS Unit Economics Modeler</h1>
                <p className="text-slate-400 mt-2">
                    Do you know your Cost of Goods Sold (COGS)? Find out if your pricing covers your infrastructure.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* INPUTS */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle>Business Inputs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="space-y-3">
                                <Label className="text-white">Monthly Cloud Bill ($)</Label>
                                <Input
                                    type="number"
                                    className="bg-slate-950 border-slate-700"
                                    value={config.monthlyServerCost}
                                    onChange={(e) => updateConfig("monthlyServerCost", Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-white">DevOps/Support Salaries (Allocated to COGS)</Label>
                                <Input
                                    type="number"
                                    className="bg-slate-950 border-slate-700"
                                    value={config.monthlyDevOpsSalary}
                                    onChange={(e) => updateConfig("monthlyDevOpsSalary", Number(e.target.value))}
                                />
                                <p className="text-xs text-slate-500">Only include portion dedicated to keeping servers running.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="text-white">Active Customers</Label>
                                    <span className="text-blue-500 font-bold">{config.activeCustomers}</span>
                                </div>
                                <Slider
                                    min={10} max={10000} step={10}
                                    value={[config.activeCustomers]}
                                    onValueChange={(v) => updateConfig("activeCustomers", v[0])}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label className="text-white">Avg Revenue / User (ARPU)</Label>
                                    <span className="text-green-500 font-bold">${config.avgRevenuePerUser}</span>
                                </div>
                                <Slider
                                    min={5} max={500} step={1}
                                    value={[config.avgRevenuePerUser]}
                                    onValueChange={(v) => updateConfig("avgRevenuePerUser", v[0])}
                                />
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* METRICS */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="pt-6">
                                <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Cost per Customer
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    ${metrics.costPerCustomer.toFixed(2)}
                                    <span className="text-xs text-slate-500 font-normal"> /mo</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`bg-slate-900 border-slate-800 ${metrics.grossMarginPercent < 70 ? 'border-amber-500/50' : 'border-green-500/50'}`}>
                            <CardContent className="pt-6">
                                <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" /> Gross Margin
                                </div>
                                <div className={`text-2xl font-bold ${metrics.grossMargin < 0 ? 'text-red-500' : 'text-white'}`}>
                                    {metrics.grossMarginPercent.toFixed(1)}%
                                </div>
                                <div className="text-xs text-slate-500">Target > 80% for SaaS</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800">
                            <CardContent className="pt-6">
                                <div className="text-sm text-slate-400 mb-1">Break-Even Point</div>
                                <div className="text-2xl font-bold text-white">
                                    {Math.ceil(metrics.breakEvenUsers)}
                                    <span className="text-xs text-slate-500 font-normal"> users</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* MARGIN CHART */}
                        <Card className="bg-slate-900 border-slate-800 h-[300px]">
                            <CardHeader>
                                <CardTitle>Revenue Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis type="category" dataKey="name" width={60} tick={{ fill: '#94a3b8' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none' }} itemStyle={{ color: '#fff' }} />
                                        <Bar dataKey="val" radius={[0, 4, 4, 0]}>
                                            {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* ADVICE BOX */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="text-amber-500 w-5 h-5" />
                                    Diagnostics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {metrics.costPerCustomer > config.avgRevenuePerUser ? (
                                    <div className="text-red-400 text-sm bg-red-900/10 p-3 rounded">
                                        🚨 <strong>Negative Contribution Margin:</strong> You lose money on every customer you sign. Raise prices or cut costs immediately.
                                    </div>
                                ) : metrics.grossMarginPercent < 70 ? (
                                    <div className="text-amber-400 text-sm bg-amber-900/10 p-3 rounded">
                                        ⚠️ <strong>Low Margins:</strong> Your infrastructure is eating too much profit. Typical SaaS margins are 80%+. Optimize your architecture.
                                    </div>
                                ) : (
                                    <div className="text-green-400 text-sm bg-green-900/10 p-3 rounded">
                                        ✅ <strong>Healthy Economics:</strong> Your unit economics are solid. Focus on scaling user acquisition ($CAC).
                                    </div>
                                )}

                                <div className="text-xs text-slate-500">
                                    <strong>Cost per Million Requests:</strong> ${metrics.costPerMillionReq.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
