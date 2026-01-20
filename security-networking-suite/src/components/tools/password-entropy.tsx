"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Check, X, Eye, EyeOff } from "lucide-react";

export function PasswordEntropy() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Analysis Logic
    const analysis = useMemo(() => {
        let poolSize = 0;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^a-zA-Z0-9]/.test(password);

        if (hasLower) poolSize += 26;
        if (hasUpper) poolSize += 26;
        if (hasNumber) poolSize += 10;
        if (hasSymbol) poolSize += 32; // Approx symbol count

        const length = password.length;
        // E = L * log2(R)
        const entropy = length > 0 && poolSize > 0
            ? Math.round(length * Math.log2(poolSize))
            : 0;

        return {
            length,
            poolSize,
            entropy,
            hasLower,
            hasUpper,
            hasNumber,
            hasSymbol
        };
    }, [password]);

    // Strength Classification
    const getStrength = (bits: number) => {
        if (bits < 28) return { label: "Very Weak", color: "text-red-600", val: 10, barColor: "bg-red-600" };
        if (bits < 36) return { label: "Weak", color: "text-orange-600", val: 30, barColor: "bg-orange-600" };
        if (bits < 60) return { label: "Good", color: "text-yellow-600", val: 60, barColor: "bg-yellow-500" };
        if (bits < 128) return { label: "Strong", color: "text-green-600", val: 85, barColor: "bg-green-500" };
        return { label: "Very Strong", color: "text-green-700", val: 100, barColor: "bg-green-600" };
    };

    const strength = getStrength(analysis.entropy);

    // Time to crack estimate (very rough heuristics)
    // Assuming 1 Trillion guesses per second (high end GPU array)
    const getTimeToCrack = (bits: number) => {
        if (bits === 0) return "Instant";
        const seconds = Math.pow(2, bits) / 1000000000000;

        if (seconds < 1) return "Instantly";
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
        if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
        return "Centuries";
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Test Password</CardTitle>
                        <CardDescription>Enter a password to analyze its entropy. No data is sent to any server.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Type your password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10 text-lg py-6"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <div className="mt-6 space-y-3">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Character Mix</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-sm">
                                    {analysis.hasLower ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-slate-300" />}
                                    Lowercase
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    {analysis.hasUpper ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-slate-300" />}
                                    Uppercase
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    {analysis.hasNumber ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-slate-300" />}
                                    Numbers
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    {analysis.hasSymbol ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-slate-300" />}
                                    Symbols
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm text-muted-foreground">Entropy Score</span>
                                <span className={`text-2xl font-bold ${strength.color}`}>{strength.label}</span>
                            </div>
                            <Progress value={strength.val} className={`h-3 ${strength.barColor.replace("bg-", "text-")}`} />
                            <p className="text-xs text-muted-foreground mt-2 text-right">
                                {analysis.entropy} bits of entropy
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <div className="text-sm text-muted-foreground mb-1">Length</div>
                                <div className="text-xl font-bold">{analysis.length} chars</div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                <div className="text-sm text-muted-foreground mb-1">Pool Size</div>
                                <div className="text-xl font-bold">{analysis.poolSize} chars</div>
                            </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
                            <div className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">
                                Estimated Crack Time
                            </div>
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                {getTimeToCrack(analysis.entropy)}
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                                *Assuming a high-end cracking rig (1 Trillion guesses/sec).
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
