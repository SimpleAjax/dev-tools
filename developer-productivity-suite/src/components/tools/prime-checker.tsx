"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PrimeChecker() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState<{ isPrime: boolean; message: string; factors?: string[] } | null>(null);

    const checkPrime = () => {
        if (!input) {
            setResult(null);
            return;
        }

        try {
            const n = BigInt(input);
            if (n <= 1n) {
                setResult({ isPrime: false, message: "Numbers <= 1 are not prime." });
                return;
            }
            if (n === 2n || n === 3n) {
                setResult({ isPrime: true, message: "is a prime number." });
                return;
            }
            if (n % 2n === 0n) {
                setResult({ isPrime: false, message: "is divisible by 2.", factors: ["2", (n / 2n).toString()] });
                return;
            }

            // Limit for client-side performance - purely for demo safety
            if (n > 1000000000000n) { // 1 Trillion
                setResult({ isPrime: false, message: "Number too large for client-side deterministic check. (Limit: 1 Trillion)" });
                return;
            }

            const limit = sqrtBigInt(n);
            let isPrime = true;
            let factor = 0n;

            // Simple trial division (only odd numbers)
            for (let i = 3n; i <= limit; i += 2n) {
                if (n % i === 0n) {
                    isPrime = false;
                    factor = i;
                    break;
                }
                // Safety break for loop if it takes too long (though 1T sqrt is 1M, which is fast)
                if (i > 1000000n) {
                    setResult({ isPrime: false, message: "Calculation timed out/aborted for performance." });
                    return;
                }
            }

            if (isPrime) {
                setResult({ isPrime: true, message: "is a prime number." });
            } else {
                setResult({
                    isPrime: false,
                    message: `is divisible by ${factor}.`,
                    factors: [factor.toString(), (n / factor).toString()]
                });
            }

        } catch {
            setResult({ isPrime: false, message: "Invalid integer." });
        }
    };

    const sqrtBigInt = (n: bigint) => {
        if (n < 0n) throw "Negative number";
        if (n < 2n) return n;

        let x0 = n;
        let x1 = (x0 + n / x0) >> 1n;

        while (x1 < x0) {
            x0 = x1;
            x1 = (x0 + n / x0) >> 1n;
        }
        return x0;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Prime Checker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Enter a number (max ~1 Trillion)</Label>
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g. 104729"
                            className="font-mono"
                            onKeyDown={(e) => e.key === 'Enter' && checkPrime()}
                        />
                        <Button onClick={checkPrime}>Check</Button>
                    </div>
                </div>

                {result && (
                    <div className={`p-4 rounded-lg border ${result.isPrime ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'}`}>
                        <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${result.isPrime ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                {result.isPrime ? "PRIME" : "NOT PRIME"}
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">
                                — {input} {result.message}
                            </span>
                        </div>
                        {result.factors && (
                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-mono">
                                Factors: {result.factors[0]} × {result.factors[1]}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
