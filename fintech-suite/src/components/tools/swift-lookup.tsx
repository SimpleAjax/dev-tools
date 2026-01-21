"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export function SwiftLookup() {
    const [code, setCode] = useState("");
    const [result, setResult] = useState<any>(null);

    // Mock Database for Engineering as Marketing demo
    // In real app, this hits an API
    const lookup = (val: string) => {
        const c = val.toUpperCase().trim();
        setCode(c);
        if (c.length === 8 || c.length === 11) {
            // Fake logic based on structure
            const bank = c.substring(0, 4);
            const country = c.substring(4, 6);
            const location = c.substring(6, 8);
            const branch = c.length === 11 ? c.substring(8, 11) : "Head Office";

            setResult({
                bankName: "Sample Bank International", // Placeholder
                bankCode: bank,
                countryName: getCountryName(country),
                locationCode: location,
                branchCode: branch,
                network: "SWIFT / BIC"
            });
        } else {
            setResult(null);
        }
    };

    const getCountryName = (code: string) => {
        const map: Record<string, string> = { US: "United States", GB: "United Kingdom", DE: "Germany", IN: "India", FR: "France" };
        return map[code] || "Unknown Country";
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader><CardTitle>Search BIC / SWIFT Code</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9 h-12 text-lg font-mono uppercase"
                            placeholder="BOFAUS3N..."
                            value={code}
                            onChange={(e) => lookup(e.target.value)}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">Enter an 8 or 11 character ISO 9362 Business Identifier Code.</p>
                </CardContent>
            </Card>

            {result && (
                <div className="grid grid-cols-2 gap-4">
                    <Card className="border-slate-800 bg-slate-950 p-4">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">Bank Code</div>
                        <div className="text-2xl font-bold text-primary">{result.bankCode}</div>
                    </Card>
                    <Card className="border-slate-800 bg-slate-950 p-4">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">Country</div>
                        <div className="text-2xl font-bold text-white">{result.countryName}</div>
                    </Card>
                    <Card className="border-slate-800 bg-slate-950 p-4">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">Location</div>
                        <div className="text-2xl font-mono text-white">{result.locationCode}</div>
                    </Card>
                    <Card className="border-slate-800 bg-slate-950 p-4">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">Branch</div>
                        <div className="text-2xl font-mono text-white">{result.branchCode}</div>
                    </Card>
                </div>
            )}
        </div>
    );
}
