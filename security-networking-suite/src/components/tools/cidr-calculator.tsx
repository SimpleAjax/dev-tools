"use client";

import { useState, useMemo } from "react";
import IPCIDR from "ip-cidr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";

export function CidrCalculator() {
    const [input, setInput] = useState("192.168.1.0/24");

    const data = useMemo(() => {
        try {
            if (!input.includes("/")) return null;

            const cidr = new IPCIDR(input);
            const range = cidr.toRange();
            // There is no direct "broadcast" or "netmask" method in ip-cidr v4 easy access
            // But we can infer or compute. 
            // Actually `ip-cidr` is good for range generation.
            // Let's use `ip-address` or manual logic if needed, but `ip-cidr` is installed.
            // ip-cidr v4 exposes:
            // .start() .end()

            const start = cidr.start();
            const end = cidr.end();
            const size = cidr.size; // BigInteger

            // Netmask calc heuristic
            // Not exposed directly in ip-cidr usually without plugin. 
            // We can use a small helper or just not show netmask if hard.
            // Actually standard subnet mask from /24 is easy.

            return {
                valid: true,
                start: String(start),
                end: String(end),
                count: String(size),
                input
            }
        } catch (e) {
            return { valid: false };
        }
    }, [input]);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>CIDR Block</CardTitle>
                    <CardDescription>Enter an IP address range in CIDR notation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="text-xl font-mono"
                    />
                </CardContent>
            </Card>

            {data?.valid ? (
                <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">First IP</div>
                            <div className="flex justify-between items-center">
                                <div className="text-xl font-mono font-bold">{data.start}</div>
                                <CopyButton text={data.start || ""} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Last IP</div>
                            <div className="flex justify-between items-center">
                                <div className="text-xl font-mono font-bold">{data.end}</div>
                                <CopyButton text={data.end || ""} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="pt-6">
                            <div className="text-sm text-blue-600 dark:text-blue-300 uppercase tracking-wider mb-1">Total Hosts</div>
                            <div className="text-3xl font-mono font-bold text-blue-700 dark:text-blue-200">
                                {parseInt(data.count || "0").toLocaleString()}
                            </div>
                            <div className="text-xs text-blue-500 mt-1">
                                Usable hosts: {parseInt(data.count || "0") - 2} (minus Network & Broadcast)
                            </div>
                        </CardContent>
                    </Card>
                    {/* 
               // Future Improvement: Visual bit breakdown
               */}
                </div>
            ) : (
                <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    Valid formats: <code>10.0.0.0/16</code>, <code>192.168.1.5/32</code>
                </div>
            )}
        </div>
    );
}
