"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Ieee754Vis() {
    const [value, setValue] = useState<string>("0.1");
    const [bits, setBits] = useState<{ sign: string; exponent: string; mantissa: string; full: string }>({
        sign: "0", exponent: "0", mantissa: "0", full: "0"
    });
    const [reconstructed, setReconstructed] = useState("");

    useEffect(() => {
        try {
            const num = parseFloat(value);
            if (isNaN(num)) return;

            const buffer = new ArrayBuffer(8); // Double precision (64-bit)
            const view = new DataView(buffer);
            view.setFloat64(0, num, false); // Big Endian

            let bin = "";
            for (let i = 0; i < 8; i++) {
                bin += view.getUint8(i).toString(2).padStart(8, "0");
            }

            setBits({
                sign: bin.substring(0, 1),
                exponent: bin.substring(1, 12),
                mantissa: bin.substring(12),
                full: bin
            });

            // Show the "Why 0.1 + 0.2 != 0.3" effect by checking strict equality logic visualization
            // 0.1 in float is actually 0.10000000000000000555...
            setReconstructed(num.toPrecision(60)); // Show deep precision

        } catch (e) {
            // ignore
        }
    }, [value]);

    return (
        <div className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader><CardTitle>Double Precision Input</CardTitle></CardHeader>
                <CardContent>
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        step="0.1"
                        className="text-2xl font-mono text-center h-16"
                    />
                    <p className="text-center text-sm text-muted-foreground mt-2">Enter a number like 0.1 or 0.3 to see representation.</p>
                </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader><CardTitle>64-bit Binary Representation</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-1 font-mono text-xs justify-center break-all">
                        {/* Sign */}
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded bg-red-900/50 border border-red-500 flex items-center justify-center text-white font-bold">{bits.sign}</div>
                            <span className="text-[10px] text-red-400 mt-1">Sign</span>
                        </div>
                        {/* Exponent */}
                        <div className="flex flex-col items-center mx-2">
                            <div className="flex gap-[1px]">
                                {bits.exponent.split("").map((b, i) => (
                                    <div key={i} className="w-6 h-8 bg-blue-900/50 border-y border-blue-500 first:border-l last:border-r first:rounded-l last:rounded-r flex items-center justify-center text-white">
                                        {b}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] text-blue-400 mt-1">Exponent (11 bits)</span>
                        </div>
                        {/* Mantissa */}
                        <div className="flex flex-col items-center">
                            <div className="flex flex-wrap gap-[1px] max-w-full justify-center">
                                {bits.mantissa.split("").map((b, i) => (
                                    <div key={i} className="w-4 h-8 bg-green-900/20 border-y border-green-500/50 first:border-l last:border-r flex items-center justify-center text-slate-400">
                                        {b}
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] text-green-400 mt-1">Fraction / Mantissa (52 bits)</span>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                        <Label className="text-yellow-500">Actual Stored Value</Label>
                        <p className="font-mono text-sm break-all text-muted-foreground">
                            {reconstructed}
                        </p>
                        <p className="text-xs text-slate-500">
                            This is why <code>0.1 + 0.2 !== 0.3</code> in JavaScript.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
