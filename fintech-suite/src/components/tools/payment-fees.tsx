"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export function PaymentFees() {
    const [sale, setSale] = useState(100);
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        // Simplified Fee Structure (Standard US Online)
        // Stripe: 2.9% + 0.30
        // PayPal: 3.49% + 0.49 (Standard Checkout)
        // Square: 2.9% + 0.30
        // Wise / ACH: 0.x% (Hypothetical low cost comparison)

        const val = Math.max(0, sale);

        const calcs = [
            { name: "Stripe", rate: 0.029, fixed: 0.30, color: "bg-indigo-500" },
            { name: "PayPal", rate: 0.0349, fixed: 0.49, color: "bg-blue-600" },
            { name: "Square", rate: 0.029, fixed: 0.30, color: "bg-slate-500" },
            { name: "ACH / Direct", rate: 0.008, fixed: 0.00, cap: 5.00, color: "bg-green-500" } // Cap example
        ];

        const computed = calcs.map(p => {
            let fee = (val * p.rate) + p.fixed;
            if (p.cap && fee > p.cap) fee = p.cap;
            const net = val - fee;
            return {
                ...p,
                fee: fee.toFixed(2),
                net: net.toFixed(2),
                percent: (net / val) * 100
            };
        });

        setResults(computed.sort((a, b) => parseFloat(b.net) - parseFloat(a.net))); // Sort best to worst

    }, [sale]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-1 space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader><CardTitle>Transaction Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Sale Amount ($)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={sale}
                                onChange={(e) => setSale(Number(e.target.value))}
                                className="text-2xl h-14"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="col-span-1 lg:col-span-2 space-y-4">
                {results.map((prov) => (
                    <Card key={prov.name} className="border-slate-800 bg-slate-900/50">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">{prov.name}</h3>
                                    <p className="text-xs text-muted-foreground">Fee: ${(parseFloat(prov.fee)).toFixed(2)} ({((parseFloat(prov.fee) / sale) * 100).toFixed(2)}%)</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-400">${prov.net}</div>
                                    <div className="text-xs text-muted-foreground">Net Profit</div>
                                </div>
                            </div>
                            <Progress value={prov.percent} className={`h-2 ${prov.color}`} />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
