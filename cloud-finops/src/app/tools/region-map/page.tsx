"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { REGION_PRICING, getPricingColor, RegionData } from "@/lib/data/region-pricing";


export default function RegionMapPage() {
    // Group regions by continent
    const grouped = REGION_PRICING.reduce((acc, region) => {
        if (!acc[region.continent]) acc[region.continent] = [];
        acc[region.continent].push(region);
        return acc;
    }, {} as Record<string, RegionData[]>);

    // Sort cheapest first within groups
    Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => a.priceIndex - b.priceIndex);
    });

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Global Region Cost Arbitrage</h1>
                <p className="text-slate-400 mt-2">
                    Prices for the same EC2 instance vary wildly by location. Moving from São Paulo to Virginia can save 54%.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(grouped).map(([continent, regions]) => (
                    <Card key={continent} className="bg-slate-900 border-slate-800">
                        <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                            <h3 className="font-bold text-slate-200">{continent}</h3>
                        </div>
                        <CardContent className="p-0">
                            {regions.map((region) => {
                                const color = getPricingColor(region.priceIndex);
                                const diff = region.priceIndex - 100;
                                const diffDisplay = diff === 0 ? "Base" : diff > 0 ? `+${diff}%` : `${diff}%`;

                                return (
                                    <div key={region.id} className="flex items-center justify-between p-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition">
                                        <div className="space-y-1">
                                            <div className="font-medium text-slate-200 flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${color}`} />
                                                {region.location}
                                            </div>
                                            <div className="text-xs text-slate-500 font-mono">{region.id}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className={`border-0 ${color} text-black font-bold`}>
                                                {diffDisplay}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg text-center space-y-4">
                <h2 className="text-xl font-bold text-slate-200">The "latency vs cost" trade-off</h2>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-400">Discount Zone (Cheaper than US-East)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-slate-400">Baseline (US-East-1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-slate-400">Premium (+20%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-slate-400">Expensive (+50%+)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
