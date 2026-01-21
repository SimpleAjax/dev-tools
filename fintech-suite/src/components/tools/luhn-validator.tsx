"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LuhnValidator() {
    const [input, setInput] = useState("");

    // Logic
    const cleanInput = input.replace(/\D/g, "");
    const digits = cleanInput.split("").map(Number);

    // Luhn Steps
    // 1. Drop check digit? No, usually we validate the whole number including check digit.
    // The check digit is the last one.

    const steps = [];
    let sum = 0;
    let isSecond = false;

    // Process from right to left
    const processedDigits = [];

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];
        let original = digit;
        let breakdown = `${digit}`;

        if (isSecond) {
            digit *= 2;
            breakdown = `${original} × 2 = ${digit}`;
            if (digit > 9) {
                digit -= 9;
                breakdown += ` → ${digit}`;
            }
        } else {
            breakdown = `${original}`;
        }

        sum += digit;
        steps.unshift({ index: i, original, isSecond, value: digit, breakdown });
        isSecond = !isSecond;
    }

    const isValid = digits.length > 0 && sum % 10 === 0;

    return (
        <div className="grid grid-cols-1 gap-6">
            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        Luhn Algorithm Visualizer
                        {digits.length > 0 && (
                            isValid
                                ? <span className="text-green-400 flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4" /> Valid Checksum</span>
                                : <span className="text-red-400 flex items-center gap-2 text-sm"><XCircle className="w-4 h-4" /> Invalid (Sum: {sum})</span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-2 max-w-md mx-auto text-center">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter Card Number"
                            className="text-center text-xl font-mono tracking-[0.2em]"
                            maxLength={19}
                        />
                        <div className="flex justify-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" onClick={() => setInput("453201511283036")}>Visa Test</Button>
                            <Button variant="ghost" size="sm" onClick={() => setInput("542418012345678")}>MC Test</Button>
                        </div>
                    </div>

                    {digits.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex flex-wrap justify-center gap-2">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        {/* Original Digit */}
                                        <div className={`
                                    w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold text-lg
                                    ${step.isSecond ? "border-blue-500/50 text-blue-400 bg-blue-500/10" : "border-slate-700 text-slate-400"}
                                `}>
                                            {step.original}
                                        </div>
                                        <div className="h-4 w-px bg-slate-800"></div>
                                        {/* Transformed Digit */}
                                        <div className={`
                                    w-8 h-8 flex items-center justify-center rounded font-mono text-sm
                                    ${step.isSecond ? "bg-slate-800 text-white" : "text-muted-foreground"}
                                `}>
                                            {step.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-slate-800 pt-6 text-center">
                                <div className="inline-block p-4 rounded-lg bg-slate-950 border border-slate-800">
                                    <div className="text-sm text-muted-foreground mb-1">Total Sum</div>
                                    <div className="text-3xl font-mono font-bold text-primary">{sum}</div>
                                    <div className="text-xs text-muted-foreground mt-2">
                                        {sum} % 10 = <span className={isValid ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{sum % 10}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="prose prose-invert max-w-none text-muted-foreground text-sm">
                <p>
                    The <strong>Luhn Algorithm</strong> (or Modulus 10) ensures that a credit card number is plausible before sending it to the bank.
                    It catches simple typos like swapping two digits.
                </p>
                <ol>
                    <li>Start from the rightmost digit (check digit) and move left.</li>
                    <li>Double the value of every second digit.</li>
                    <li>If doubling a number results in a number greater than 9 (e.g., 8 × 2 = 16), add the digits of the product (e.g., 1 + 6 = 7) or subtract 9.</li>
                    <li>Take the sum of all the digits.</li>
                    <li>If the total modulo 10 is equal to 0, the number is valid.</li>
                </ol>
            </div>
        </div>
    );
}
