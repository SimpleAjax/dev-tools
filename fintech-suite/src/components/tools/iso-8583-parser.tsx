"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simplified ISO 8583 Field Definitions (subset)
const ISO_FIELDS: Record<number, { name: string; type: string }> = {
    1: { name: "Bitmap (Secondary)", type: "b 64" },
    2: { name: "Primary Account Number (PAN)", type: "n..19" },
    3: { name: "Processing Code", type: "n 6" },
    4: { name: "Amount, Transaction", type: "n 12" },
    7: { name: "Transmission Date & Time", type: "n 10" },
    11: { name: "System Trace Audit Number (STAN)", type: "n 6" },
    12: { name: "Time, Local Transaction", type: "n 6" },
    13: { name: "Date, Local Transaction", type: "n 4" },
    17: { name: "Date, Capture", type: "n 4" },
    18: { name: "Merchant Type", type: "n 4" },
    19: { name: "Acquiring Institution Country Code", type: "n 3" },
    22: { name: "Point of Service Entry Mode", type: "n 3" },
    24: { name: "Function Code", type: "n 3" },
    25: { name: "Point of Service Condition Code", type: "n 2" },
    32: { name: "Acquiring Institution ID Code", type: "n..11" },
    37: { name: "Retrieval Reference Number", type: "an 12" },
    38: { name: "Authorization Identification Response", type: "an 6" },
    39: { name: "Response Code", type: "an 2" },
    41: { name: "Card Acceptor Terminal ID", type: "ans 8" },
    42: { name: "Card Acceptor ID Code", type: "ans 15" },
    43: { name: "Card Acceptor Name/Location", type: "ans 40" },
    48: { name: "Additional Data - Private", type: "ans...999" },
    49: { name: "Currency Code, Transaction", type: "n 3" },
    52: { name: "PIN Data", type: "b 64" },
    55: { name: "ICC Data - EMV Request/Response", type: "b...255" },
    // Add more as needed or make generic
};

const SAMPLE_ISO = "080082200000000000000400000000000000100421160444301";
// MTI (0800) + Bitmap (8220... -> Fields 1, 7, 11) + Data
// Wait, parsing raw ISO requires knowing the packing (ASCII/Binary/Hex).
// We will assume ASCII Hex string for simplicity or pure Hex dump.

export function Iso8583Parser() {
    const [input, setInput] = useState(SAMPLE_ISO);
    const [parsed, setParsed] = useState<{ mti: string; bitmap: string; activeFields: number[]; fields: any[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Basic Parsing Logic (Assumption: ASCII-encoded Hex String)
        // Structure: MTI (4 chars) + Bitmap (16 chars hex = 64 bits) + Data...
        // This is VERY simplified. A real parser needs field definitions (fixed/var length).
        // For this demo, we will visualize the Bitmap primarily and maybe try to guess fields?
        // Getting field data without definitions is impossible for Var fields.
        // So we will focus on MTI + Bitmap decoding which is the "Glass Box" value here.

        try {
            const cleanInput = input.replace(/\s/g, "");
            if (cleanInput.length < 20) {
                setParsed(null);
                return;
            }

            const mti = cleanInput.substring(0, 4);
            const bitmapHex = cleanInput.substring(4, 20); // Primary Bitmap (64 bits) -> 16 Hex chars

            // Hex to Binary
            let binaryBitmap = "";
            for (let i = 0; i < bitmapHex.length; i++) {
                const bin = parseInt(bitmapHex[i], 16).toString(2).padStart(4, "0");
                if (isNaN(parseInt(bitmapHex[i], 16))) throw new Error("Invalid Hex in Bitmap");
                binaryBitmap += bin;
            }

            const activeFields: number[] = [];
            for (let i = 0; i < binaryBitmap.length; i++) {
                if (binaryBitmap[i] === "1") {
                    activeFields.push(i + 1); // 1-based index
                }
            }

            setParsed({
                mti,
                bitmap: binaryBitmap,
                activeFields,
                fields: activeFields.map(f => ({
                    field: f,
                    name: ISO_FIELDS[f]?.name || "Unknown Field",
                    type: ISO_FIELDS[f]?.type || "?"
                }))
            });
            setError(null);
        } catch (e: any) {
            // Silent fail or set error if meaningful
            // setError(e.message);
            setParsed(null);
        }

    }, [input]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Input Side */}
            <div className="space-y-6">
                <Card className="h-full border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle>ISO Message Input</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Raw Hex String</Label>
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="0200..."
                                className="font-mono h-64 bg-slate-950 border-slate-800"
                            />
                            <p className="text-xs text-muted-foreground">
                                Currently supports standard 4-digit MTI + 16-char Hex Primary Bitmap structure.
                            </p>
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Visualization Side */}
            <div className="space-y-6">
                <Card className="h-full border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Decoded Glass Box</CardTitle>
                            {parsed && <Badge variant="outline" className="text-green-400 border-green-400">Valid Bitmap</Badge>}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!parsed ? (
                            <div className="flex items-center justify-center h-64 text-muted-foreground">
                                Enter a valid ISO string to visualize...
                            </div>
                        ) : (
                            <div className="space-y-6">

                                {/* MTI */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-950 rounded border border-slate-800">
                                        <div className="text-xs text-muted-foreground uppercase">MTI</div>
                                        <div className="text-xl font-mono text-primary">{parsed.mti}</div>
                                    </div>
                                    <div className="p-3 bg-slate-950 rounded border border-slate-800">
                                        <div className="text-xs text-muted-foreground uppercase">Function</div>
                                        <div className="text-base font-mono">Request / Response</div>
                                    </div>
                                </div>

                                {/* BITMAP GRID */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Bitmap Visualization</div>
                                    <div className="grid grid-cols-8 gap-1">
                                        {Array.from({ length: 64 }).map((_, i) => {
                                            const bit = i + 1;
                                            const isActive = parsed.activeFields.includes(bit);
                                            return (
                                                <div
                                                    key={i}
                                                    className={`
                                        h-8 flex items-center justify-center text-xs font-mono border rounded
                                        ${isActive
                                                            ? "bg-green-500/20 border-green-500 text-green-400"
                                                            : "bg-slate-950 border-slate-800 text-slate-700"}
                                    `}
                                                    title={`Field ${bit}`}
                                                >
                                                    {bit}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* FIELDS LIST */}
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Active Fields</div>
                                    <div className="rounded-md border border-slate-800 bg-slate-950 max-h-64 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-800 text-left">
                                                    <th className="p-2 w-16 text-muted-foreground font-normal">Bit</th>
                                                    <th className="p-2 text-muted-foreground font-normal">Description</th>
                                                    <th className="p-2 text-right text-muted-foreground font-normal">Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {parsed.fields.map((f) => (
                                                    <tr key={f.field} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-900">
                                                        <td className="p-2 font-mono text-primary">{f.field}</td>
                                                        <td className="p-2">{f.name}</td>
                                                        <td className="p-2 text-right font-mono text-xs text-muted-foreground">{f.type}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
