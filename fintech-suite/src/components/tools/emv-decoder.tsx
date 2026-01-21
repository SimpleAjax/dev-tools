"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Common EMV Tags
const EMV_TAGS: Record<string, string> = {
    "9F02": "Amount, Authorised (Numeric)",
    "9F03": "Amount, Other (Numeric)",
    "9F26": "Application Cryptogram",
    "9F27": "Cryptogram Information Data",
    "9F10": "Issuer Application Data",
    "9F37": "Unpredictable Number",
    "9F36": "Application Transaction Counter (ATC)",
    "95": "Terminal Verification Results",
    "9A": "Transaction Date",
    "9C": "Transaction Type",
    "5F2A": "Transaction Currency Code",
    "82": "Application Interchange Profile",
    "84": "Dedicated File (DF) Name",
    "4F": "Application Identifier (AID)",
    "50": "Application Label"
};

export function EmvDecoder() {
    const [tlv, setTlv] = useState("");
    const [decoded, setDecoded] = useState<any[]>([]);

    const parseTlv = () => {
        // Very naive TLV parser for demo
        // Doesn't handle multi-byte length prefixes correctly in all edge cases, but good for simple EMV
        let cursor = 0;
        const clean = tlv.replace(/\s/g, "").toUpperCase();
        const result = [];

        try {
            while (cursor < clean.length) {
                // Tag
                let tag = clean.substring(cursor, cursor + 2);
                cursor += 2;
                // Check if 2-byte tag (if first byte & 0x1F == 0x1F)
                if ((parseInt(tag, 16) & 0x1F) === 0x1F) {
                    tag += clean.substring(cursor, cursor + 2);
                    cursor += 2;
                }

                // Length
                let lenStr = clean.substring(cursor, cursor + 2);
                cursor += 2;
                let len = parseInt(lenStr, 16);

                // If length > 127, it's a long form length
                if (len > 127) {
                    const bytesOfLen = len - 128; // e.g. 81 -> 1 byte
                    lenStr = clean.substring(cursor, cursor + (bytesOfLen * 2));
                    cursor += (bytesOfLen * 2);
                    len = parseInt(lenStr, 16);
                }

                // Value
                const value = clean.substring(cursor, cursor + (len * 2));
                cursor += (len * 2);

                result.push({
                    tag,
                    length: len,
                    value,
                    name: EMV_TAGS[tag] || "Unknown Tag"
                });
            }
            setDecoded(result);
        } catch (e) {
            console.error(e);
            // setDecoded([]); 
            // Partial decode
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader><CardTitle>TLV Input</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Hex String</Label>
                            <Input
                                value={tlv}
                                onChange={(e) => setTlv(e.target.value)}
                                placeholder="9F0206000000000100..."
                                className="font-mono"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={parseTlv}>Decode</Button>
                            <Button variant="ghost" onClick={() => setTlv("9F02060000000001005F2A0208409A03230101")}>Sample</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50 h-full">
                    <CardHeader><CardTitle>Decoded Tags</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {decoded.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No tags decoded yet.</p>
                            ) : (
                                decoded.map((item, idx) => (
                                    <div key={idx} className="flex flex-col p-3 hover:bg-slate-900/50 rounded-md border border-transparent hover:border-slate-800 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="font-mono text-primary border-primary/20">{item.tag}</Badge>
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">Len: {item.length}</span>
                                        </div>
                                        <div className="pl-14">
                                            <code className="text-xs text-muted-foreground font-mono break-all">{item.value}</code>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
