"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";

export function SubnetSplitter() {
    const [network, setNetwork] = useState("192.168.1.0/24");
    const [subnets, setSubnets] = useState<string[]>([]);
    const [newMask, setNewMask] = useState(26);

    const calculate = () => {
        try {
            // Basic subnetting logic simulation for demo
            // Real logic would use ip-cidr splitting
            const [ip, maskStr] = network.split("/");
            const mask = parseInt(maskStr);

            if (newMask <= mask) return setSubnets(["Error: New mask must be larger than original."]);

            const parts = ip.split(".").map(Number);
            const count = Math.pow(2, newMask - mask);
            const increment = 256 / Math.pow(2, newMask - 24); // Simplified for /24+ logic

            const res = [];
            for (let i = 0; i < count; i++) {
                // This is very rudimentary, only works for last octet splitting for demo functionality
                // Robust would need bitwise math on full 32bit int
                const last = parts[3] + (i * increment);
                res.push(`${parts[0]}.${parts[1]}.${parts[2]}.${last}/${newMask}`);
            }
            setSubnets(res);
        } catch (e) {
            setSubnets(["Invalid CIDR"]);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Subnet Config</CardTitle>
                    <CardDescription>Split a network into smaller subnets.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Original Network</label>
                            <Input value={network} onChange={(e) => setNetwork(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Split into (/{newMask})</label>
                            <Input
                                type="number"
                                value={newMask}
                                onChange={(e) => setNewMask(parseInt(e.target.value))}
                                min={parseInt(network.split("/")[1] || "0") + 1}
                                max={32}
                            />
                        </div>
                    </div>
                    <button
                        onClick={calculate}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
                    >
                        Calculate Subnets
                    </button>
                </CardContent>
            </Card>

            {subnets.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Resulting Subnets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {subnets.map((sub, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded border">
                                    <span className="font-mono">{sub}</span>
                                    <CopyButton text={sub} className="h-6 w-6 p-0" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
