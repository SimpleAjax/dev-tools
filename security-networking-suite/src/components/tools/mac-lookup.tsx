"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";

// Minimal dataset for demo
const OUI_DB: Record<string, string> = {
    "00:00:0C": "Cisco Systems, Inc",
    "00:50:56": "VMware, Inc.",
    "B8:27:EB": "Raspberry Pi Foundation",
    "DC:A6:32": "Raspberry Pi Trading Ltd",
    "00:01:42": "Cisco Systems, Inc",
    "00:0A:95": "Apple, Inc.",
    "00:1E:8C": "ASUSTek COMPUTER INC.",
    "04:D4:C4": "Amazon Technologies Inc.",
    "18:66:DA": "Google, Inc.",
};

export function MacLookup() {
    const [mac, setMac] = useState("");
    const [vendor, setVendor] = useState<string | null>(null);

    const lookup = (val: string) => {
        setMac(val);
        // Normalized: B8-27-EB -> B8:27:EB
        const clean = val.toUpperCase().replace(/[^0-9A-F]/g, "");

        if (clean.length >= 6) {
            const prefix = `${clean.substring(0, 2)}:${clean.substring(2, 4)}:${clean.substring(4, 6)}`;
            setVendor(OUI_DB[prefix] || "Unknown / Not in Demo DB");
        } else {
            setVendor(null);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>MAC Address</CardTitle>
                    <CardDescription>Enter a MAC address to identify the manufacturer (OUI).</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                        value={mac}
                        onChange={(e) => lookup(e.target.value)}
                        placeholder="00:50:56:XX:XX:XX"
                        className="text-xl font-mono text-center"
                    />
                </CardContent>
            </Card>

            {vendor && (
                <Card className="text-center bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
                    <CardHeader>
                        <CardDescription>Manufacturer</CardDescription>
                        <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">{vendor}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500">
                            Based on OUI prefix: <strong>{mac.substring(0, 8).toUpperCase()}</strong>
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
