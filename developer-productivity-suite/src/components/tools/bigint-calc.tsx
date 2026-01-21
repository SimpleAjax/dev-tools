"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BigIntCalc() {
    const [numA, setNumA] = useState("");
    const [numB, setNumB] = useState("");
    const [op, setOp] = useState("add");
    const [result, setResult] = useState("");
    const [error, setError] = useState<string | null>(null);

    const calculate = () => {
        if (!numA || !numB) {
            setResult("");
            setError(null);
            return;
        }

        try {
            const a = BigInt(numA);
            const b = BigInt(numB);
            let res = 0n;

            switch (op) {
                case "add": res = a + b; break;
                case "sub": res = a - b; break;
                case "mul": res = a * b; break;
                case "div":
                    if (b === 0n) throw new Error("Division by zero");
                    res = a / b;
                    break;
                case "mod":
                    if (b === 0n) throw new Error("Division by zero");
                    res = a % b;
                    break;
                case "pow":
                    // Safety check for power
                    if (b > 10000n) throw new Error("Exponent too large for safe calc");
                    res = a ** b;
                    break;
            }
            setResult(res.toString());
            setError(null);
        } catch (e: any) {
            setError(e.message || "Invalid calculation");
            setResult("");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Big Integer Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-[1fr,auto,1fr,auto] items-end">
                    <div className="space-y-2">
                        <Label>Number A</Label>
                        <Input
                            value={numA}
                            onChange={(e) => setNumA(e.target.value)}
                            placeholder="12345678901234567890"
                            className="font-mono text-sm"
                        />
                    </div>

                    <Select value={op} onValueChange={setOp}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="add">Add (+)</SelectItem>
                            <SelectItem value="sub">Subtract (-)</SelectItem>
                            <SelectItem value="mul">Multiply (×)</SelectItem>
                            <SelectItem value="div">Divide (/)</SelectItem>
                            <SelectItem value="mod">Modulo (%)</SelectItem>
                            <SelectItem value="pow">Power (**)</SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="space-y-2">
                        <Label>Number B</Label>
                        <Input
                            value={numB}
                            onChange={(e) => setNumB(e.target.value)}
                            placeholder="98765432109876543210"
                            className="font-mono text-sm"
                        />
                    </div>

                    <Button onClick={calculate} className="mb-0.5">Calculate</Button>
                </div>

                <div className="space-y-2">
                    <Label>Result</Label>
                    <div className="relative">
                        <Input
                            value={result}
                            readOnly
                            className={`font-mono pr-10 ${error ? 'border-red-500 text-red-500' : ''}`}
                            placeholder={error || "Result will appear here"}
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1 h-7 w-7"
                            onClick={() => navigator.clipboard.writeText(result)}
                            disabled={!result || !!error}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
