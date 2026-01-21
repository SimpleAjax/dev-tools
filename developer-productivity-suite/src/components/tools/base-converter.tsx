"use client";

import { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BaseConverter() {
    const [dec, setDec] = useState("");
    const [hex, setHex] = useState("");
    const [bin, setBin] = useState("");
    const [oct, setOct] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Update all fields based on a decimal value
    const updateFromDec = (val: string) => {
        if (val === "") {
            setDec("");
            setHex("");
            setBin("");
            setOct("");
            setError(null);
            return;
        }

        try {
            // Check if valid integer
            if (!/^\d+$/.test(val)) throw new Error("Invalid decimal");

            const num = BigInt(val);
            setDec(val);
            setHex(num.toString(16).toUpperCase());
            setBin(num.toString(2));
            setOct(num.toString(8));
            setError(null);
        } catch {
            setDec(val);
            setError("Invalid decimal format");
        }
    };

    const updateFromHex = (val: string) => {
        const cleanVal = val.replace(/^0x/, "");
        setHex(cleanVal);
        if (cleanVal === "") return updateFromDec("");

        try {
            if (!/^[0-9A-Fa-f]+$/.test(cleanVal)) throw new Error("Invalid hex");
            const num = BigInt("0x" + cleanVal);
            setDec(num.toString());
            setBin(num.toString(2));
            setOct(num.toString(8));
            setError(null);
        } catch {
            setError("Invalid hex format");
        }
    };

    const updateFromBin = (val: string) => {
        const cleanVal = val.replace(/^0b/, "");
        setBin(cleanVal);
        if (cleanVal === "") return updateFromDec("");

        try {
            if (!/^[01]+$/.test(cleanVal)) throw new Error("Invalid binary");
            const num = BigInt("0b" + cleanVal);
            setDec(num.toString());
            setHex(num.toString(16).toUpperCase());
            setOct(num.toString(8));
            setError(null);
        } catch {
            setError("Invalid binary format");
        }
    };

    const updateFromOct = (val: string) => {
        const cleanVal = val.replace(/^0o/, "");
        setOct(cleanVal);
        if (cleanVal === "") return updateFromDec("");

        try {
            if (!/^[0-7]+$/.test(cleanVal)) throw new Error("Invalid octal");
            // custom Octal parsing for BigInt (some envs don't support 0o syntax for string constructor directly or behave weirdly, but 0o prefix usually works)
            const num = BigInt("0o" + cleanVal);
            setDec(num.toString());
            setHex(num.toString(16).toUpperCase());
            setBin(num.toString(2));
            setError(null);
        } catch {
            setError("Invalid octal format");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Number Bases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/10 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Decimal (Base 10)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={dec}
                                onChange={(e) => updateFromDec(e.target.value)}
                                placeholder="123"
                                className="font-mono"
                            />
                            <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(dec)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Hexadecimal (Base 16)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={hex}
                                onChange={(e) => updateFromHex(e.target.value)}
                                placeholder="7B"
                                className="font-mono"
                            />
                            <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(hex)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Binary (Base 2)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={bin}
                                onChange={(e) => updateFromBin(e.target.value)}
                                placeholder="1111011"
                                className="font-mono"
                            />
                            <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(bin)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Octal (Base 8)</Label>
                        <div className="flex gap-2">
                            <Input
                                value={oct}
                                onChange={(e) => updateFromOct(e.target.value)}
                                placeholder="173"
                                className="font-mono"
                            />
                            <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(oct)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
