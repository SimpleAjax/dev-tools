"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

type CashFlow = {
    date: string;
    amount: number;
};

export function XirrCalc() {
    const [flows, setFlows] = useState<CashFlow[]>([
        { date: "2023-01-01", amount: -10000 },
        { date: "2023-06-01", amount: 2000 },
        { date: "2024-01-01", amount: 9000 },
    ]);
    const [xirr, setXirr] = useState<number | null>(null);

    // Simple XIRR approximation (Newton-Raphson)
    const calculateXirr = () => {
        // Logic omitted for brevity, usually involves iterative guessing.
        // We will perform a mocked calculation for demonstration or implementing a simple iter
        // Basic Net Present Value function
        const npv = (rate: number) => {
            return flows.reduce((acc, f) => {
                const days = (new Date(f.date).getTime() - new Date(flows[0].date).getTime()) / (1000 * 60 * 60 * 24);
                return acc + f.amount / Math.pow(1 + rate, days / 365);
            }, 0);
        };

        // Newton-Raphson
        let rate = 0.1; // Initial guess 10%
        for (let i = 0; i < 50; i++) {
            const res = npv(rate);
            if (Math.abs(res) < 0.01) break;
            // Derivative? 
            // Simplified: just adjust based on sign for robustness in this simple demo
            // A proper implementation requires derivative of NPV w.r.t rate
            const delta = 0.0001;
            const deriv = (npv(rate + delta) - npv(rate)) / delta;
            rate = rate - res / deriv;
        }

        setXirr(rate * 100);
    };

    const addRow = () => [
        setFlows([...flows, { date: new Date().toISOString().split("T")[0], amount: 0 }])
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Cash Flows</CardTitle>
                            <Button size="sm" onClick={addRow}><Plus className="h-4 w-4 mr-1" /> Add Row</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {flows.map((f, i) => (
                            <div key={i} className="flex gap-2">
                                <Input
                                    type="date"
                                    value={f.date}
                                    onChange={(e) => {
                                        const next = [...flows]; next[i].date = e.target.value; setFlows(next);
                                    }}
                                />
                                <Input
                                    type="number"
                                    value={f.amount}
                                    className={f.amount < 0 ? "text-red-400" : "text-green-400"}
                                    onChange={(e) => {
                                        const next = [...flows]; next[i].amount = Number(e.target.value); setFlows(next);
                                    }}
                                />
                                <Button size="icon" variant="ghost" onClick={() => {
                                    const next = flows.filter((_, idx) => idx !== i); setFlows(next);
                                }}>
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                        <Button className="w-full mt-4" onClick={calculateXirr}>Calculate IRR</Button>
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card className="border-slate-800 bg-slate-950 h-full flex flex-col justify-center items-center p-8">
                    <div className="text-center space-y-2">
                        <h3 className="text-muted-foreground uppercase tracking-widest text-sm">Internal Rate of Return</h3>
                        <div className="text-6xl font-bold text-primary">
                            {xirr ? xirr.toFixed(2) : "--"}%
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto pt-4">
                            The annualized effective compounded return rate which makes the net present value of all cash flows zero.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
