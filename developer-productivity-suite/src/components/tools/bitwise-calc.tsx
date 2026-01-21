"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function BitwiseCalc() {
    const [numA, setNumA] = useState("0");
    const [numB, setNumB] = useState("0");
    const [op, setOp] = useState("AND");

    const parse = (val: string) => {
        try {
            if (!val) return 0;
            // Support hex 0x, bin 0b, etc
            if (val.startsWith("0x") || val.startsWith("0b") || val.startsWith("0o")) return Number(val);
            return Number(val);
        } catch { return 0; }
    };

    const a = parse(numA);
    const b = parse(numB);
    let res = 0;

    switch (op) {
        case "AND": res = a & b; break;
        case "OR": res = a | b; break;
        case "XOR": res = a ^ b; break;
        case "NOT A": res = ~a; break;
        case "LSHIFT": res = a << b; break;
        case "RSHIFT": res = a >> b; break;
        case "ZRSHIFT": res = a >>> b; break;
    }

    const formatBinary = (n: number) => {
        // Show as 32-bit binary
        const bin = (n >>> 0).toString(2).padStart(32, '0');
        const chunks = bin.match(/.{1,4}/g) || [];

        return (
            <div className="flex gap-2 justify-end font-mono">
                {chunks.map((chunk, i) => (
                    <span key={i} className="flex">
                        {chunk.split('').map((bit, j) => (
                            <span
                                key={j}
                                className={`${bit === '1' ? 'text-primary font-bold' : 'text-slate-300 dark:text-slate-700'}`}
                            >
                                {bit}
                            </span>
                        ))}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bitwise Logic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <Label>Number A</Label>
                        <Input value={numA} onChange={(e) => setNumA(e.target.value)} className="font-mono" placeholder="Input A" />
                    </div>

                    <Select value={op} onValueChange={setOp}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AND">A & B (AND)</SelectItem>
                            <SelectItem value="OR">A | B (OR)</SelectItem>
                            <SelectItem value="XOR">A ^ B (XOR)</SelectItem>
                            <SelectItem value="NOT A">~A (NOT)</SelectItem>
                            <SelectItem value="LSHIFT">A &lt;&lt; B (Left)</SelectItem>
                            <SelectItem value="RSHIFT">A &gt;&gt; B (Right)</SelectItem>
                            <SelectItem value="ZRSHIFT">A &gt;&gt;&gt; B (Zero Fill)</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="flex-1 space-y-2">
                        <Label>Number B</Label>
                        <Input
                            value={numB}
                            onChange={(e) => setNumB(e.target.value)}
                            className="font-mono"
                            placeholder="Input B"
                            disabled={op === "NOT A"}
                        />
                    </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-lg space-y-4 font-mono text-sm overflow-x-auto">
                    <div className="min-w-[500px]">
                        <div className="grid grid-cols-[80px,1fr,100px] gap-2 items-center">
                            <div className="text-slate-500 font-semibold">A</div>
                            <div className="text-right">{formatBinary(a)}</div>
                            <div className="text-right text-slate-600 dark:text-slate-400">{a}</div>
                        </div>
                        {op !== "NOT A" && (
                            <div className="grid grid-cols-[80px,1fr,100px] gap-2 items-center border-b border-slate-300 dark:border-slate-700 pb-2 mb-2">
                                <div className="text-slate-500 font-semibold">{op} B</div>
                                <div className="text-right">{formatBinary(b)}</div>
                                <div className="text-right text-slate-600 dark:text-slate-400">{b}</div>
                            </div>
                        )}
                        <div className="grid grid-cols-[80px,1fr,100px] gap-2 items-center font-bold text-lg pt-2">
                            <div className="text-primary">= Result</div>
                            <div className="text-right">{formatBinary(res)}</div>
                            <div className="text-right">{res}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
