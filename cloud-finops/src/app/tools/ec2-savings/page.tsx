"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Define type here since we're fetching it
interface InstanceType {
    type: string;
    vCPU: number;
    memoryGB: number;
    onDemandPrice: number;
    spotPriceEst: number;
    reserved1Yr: number;
    architecture: string;
    family: string;
}

export default function EC2SavingsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [infraSize, setInfraSize] = useState(1); // How many instances?
    const [instances, setInstances] = useState<InstanceType[]>([]);
    const [loading, setLoading] = useState(true);

    // Load the expanded dataset
    useEffect(() => {
        fetch('/data/ec2-pricing.json')
            .then(res => res.json())
            .then(data => {
                setInstances(data);
                setLoading(false);
            })
            .catch(err => console.error("Failed to load pricing", err));
    }, []);

    const filtered = instances.filter(i =>
        i.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.family.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">EC2 Spot Savings Finder</h1>
                <p className="text-slate-400 mt-2">
                    Compare On-Demand vs. Spot prices. Identify arbitrage opportunities for fault-tolerant workloads.
                </p>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search instance (e.g., m5.large, arm)..."
                        className="pl-10 bg-slate-900 border-slate-700 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Count:</span>
                    <Input
                        type="number"
                        min={1}
                        value={infraSize}
                        onChange={(e) => setInfraSize(Number(e.target.value))}
                        className="w-20 bg-slate-900 border-slate-700"
                    />
                </div>
            </div>

            {/* RESULTS GRID */}
            <div className="grid gap-4">
                {filtered.map((instance) => (
                    <InstanceRow key={instance.type} instance={instance} count={infraSize} />
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-10 text-slate-500">
                        No instances found. Try "t3" or "compute".
                    </div>
                )}
            </div>
        </div>
    );
}

function InstanceRow({ instance, count }: { instance: InstanceType, count: number }) {
    const onDemandTotal = instance.onDemandPrice * 730 * count;
    const spotTotal = instance.spotPriceEst * 730 * count;
    const reservedTotal = instance.reserved1Yr * 730 * count;

    const savings = onDemandTotal - spotTotal;
    const savingsPct = ((instance.onDemandPrice - instance.spotPriceEst) / instance.onDemandPrice) * 100;

    return (
        <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

                    {/* COL 1: INFO */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-white">{instance.type}</span>
                            <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                                {instance.vCPU} vCPU
                            </Badge>
                            <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                                {instance.memoryGB} GB
                            </Badge>
                        </div>
                        <div className="text-xs text-slate-500">{instance.family} • {instance.architecture}</div>
                    </div>

                    {/* COL 2: PRICING */}
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">On-Demand:</span>
                            <span className="text-slate-200">${(instance.onDemandPrice * count).toFixed(4)}/hr</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-violet-400">Spot (Est):</span>
                            <span className="text-violet-200 font-bold">${(instance.spotPriceEst * count).toFixed(4)}/hr</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Reserved (1y):</span>
                            <span className="text-slate-400">${(instance.reserved1Yr * count).toFixed(4)}/hr</span>
                        </div>
                    </div>

                    {/* COL 3: SAVINGS */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                        <div className="text-xs text-green-500/80 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                            Spot Savings
                        </div>
                        <div className="text-2xl font-bold text-green-500">
                            {savingsPct.toFixed(0)}%
                        </div>
                        <div className="text-xs text-green-400">
                            Save ${(savings).toFixed(0)}/mo
                        </div>
                    </div>

                    {/* COL 4: MINI VIZ */}
                    <div className="h-16 w-full opacity-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={[
                                { name: "OD", val: onDemandTotal, fill: "#334155" },
                                { name: "Spot", val: spotTotal, fill: "#10b981" },
                            ]} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" hide width={1} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ display: 'none' }} />
                                <Bar dataKey="val" barSize={8} radius={4}>
                                    {[0, 1].map((entry, index) => (
                                        <Cell key={index} fill={index === 0 ? "#475569" : "#22c55e"} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}
