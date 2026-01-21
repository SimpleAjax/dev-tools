"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function LoanAmortization() {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(5.0);
    const [years, setYears] = useState(30);
    const [schedule, setSchedule] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);

    const calculate = () => {
        let balance = principal;
        const monthlyRate = rate / 100 / 12;
        const numPayments = years * 12;

        // PMT Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
        const pmt = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

        let totalInterest = 0;
        const newSchedule = [];

        for (let i = 1; i <= numPayments; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = pmt - interestPayment;
            balance -= principalPayment;
            if (balance < 0) balance = 0;

            totalInterest += interestPayment;

            if (i <= 24 || i % 12 === 0 || i === numPayments) { // Limit rows for performance in demo
                newSchedule.push({
                    month: i,
                    pmt: pmt.toFixed(2),
                    principal: principalPayment.toFixed(2),
                    interest: interestPayment.toFixed(2),
                    balance: balance.toFixed(2)
                });
            }
        }

        setSummary({
            monthlyPayment: pmt.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            totalCost: (principal + totalInterest).toFixed(2)
        });
        setSchedule(newSchedule);
    };

    useEffect(() => {
        calculate();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Controls */}
            <div className="col-span-1 space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader><CardTitle>Loan Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Principal Amount ($)</Label>
                            <Input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Interest Rate (%)</Label>
                            <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Loan Term (Years)</Label>
                            <Input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
                        </div>
                        <Button onClick={calculate} className="w-full">Recalculate</Button>
                    </CardContent>
                </Card>

                {summary && (
                    <Card className="border-slate-800 bg-slate-950">
                        <CardHeader><CardTitle className="text-lg">Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Monthly Pmt</span>
                                <span className="font-bold text-xl text-primary">${summary.monthlyPayment}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Interest</span>
                                <span className="font-mono text-red-400">${summary.totalInterest}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-800">
                                <span className="text-muted-foreground">Total Cost</span>
                                <span className="font-mono text-white">${summary.totalCost}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Table */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
                <Card className="border-slate-800 bg-slate-900/50 h-full max-h-[600px] flex flex-col">
                    <CardHeader><CardTitle>Amortization Schedule</CardTitle></CardHeader>
                    <CardContent className="flex-1 overflow-auto p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="w-[80px]">Month</TableHead>
                                    <TableHead>Principal</TableHead>
                                    <TableHead>Interest</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedule.map((row) => (
                                    <TableRow key={row.month} className="border-slate-800/50 hover:bg-slate-900">
                                        <TableCell className="font-mono text-xs">{row.month}</TableCell>
                                        <TableCell className="font-mono text-xs text-green-400">{row.principal}</TableCell>
                                        <TableCell className="font-mono text-xs text-red-400">{row.interest}</TableCell>
                                        <TableCell className="font-mono text-xs text-right text-muted-foreground">{row.balance}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
