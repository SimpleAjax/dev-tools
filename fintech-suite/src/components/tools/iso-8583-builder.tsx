"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simplified fields for builder
const BUILDER_FIELDS = [
    { id: 2, name: "PAN", type: "n..19", label: "Primary Account Number" },
    { id: 3, name: "Proc Code", type: "n 6", label: "Processing Code (e.g. 000000)" },
    { id: 4, name: "Amount", type: "n 12", label: "Amount (in cents)" },
    { id: 7, name: "Trans Date", type: "n 10", label: "MMDDhhmmss" },
    { id: 11, name: "STAN", type: "n 6", label: "System Trace Audit Number" },
    { id: 37, name: "RRN", type: "an 12", label: "Retrieval Reference Number" },
    { id: 38, name: "Auth Code", type: "an 6", label: "Authorization Code" },
    { id: 39, name: "Resp Code", type: "an 2", label: "Response Code (00=Appr)" },
    { id: 41, name: "Terminal ID", type: "ans 8", label: "Card Acceptor Terminal ID" },
    { id: 49, name: "Currency", type: "n 3", label: "Currency Code (840=USD)" },
];

export function Iso8583Builder() {
    const [mti, setMti] = useState("0200");
    const [selectedFields, setSelectedFields] = useState<Record<number, boolean>>({
        2: true, 3: true, 4: true, 7: true, 11: true, 49: true
    });
    const [fieldValues, setFieldValues] = useState<Record<number, string>>({
        2: "4000123456789012",
        3: "000000",
        4: "000000010000",
        7: "1201103000",
        11: "123456",
        49: "840"
    });

    // Calculate Bitmap
    const calculateBitmap = () => {
        let bitmap = "";
        // We only support primary bitmap (64 bits) for this demo
        for (let i = 1; i <= 64; i++) {
            bitmap += selectedFields[i] ? "1" : "0";
        }
        // Convert binary string to hex
        let hex = "";
        for (let i = 0; i < 64; i += 4) {
            const chunk = bitmap.substr(i, 4);
            hex += parseInt(chunk, 2).toString(16).toUpperCase();
        }
        return hex;
    };

    const generateMessage = () => {
        const bmp = calculateBitmap();
        let data = "";
        BUILDER_FIELDS.forEach(f => {
            if (selectedFields[f.id]) {
                data += fieldValues[f.id] || "";
            }
        });
        return `MTI: ${mti}\nBitmap: ${bmp}\nDataPayload: ${data}`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader><CardTitle>Message Configuration</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Message Type Indicator (MTI)</Label>
                            <Select value={mti} onValueChange={setMti}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0200">0200 - Financial Request</SelectItem>
                                    <SelectItem value="0210">0210 - Financial Response</SelectItem>
                                    <SelectItem value="0400">0400 - Reversal Request</SelectItem>
                                    <SelectItem value="0800">0800 - Network Management</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <Label>Active Fields</Label>
                            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                                {BUILDER_FIELDS.map(field => (
                                    <div key={field.id} className="flex flex-col space-y-2 p-3 border border-slate-800 rounded bg-slate-950/50">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`field-${field.id}`}
                                                checked={selectedFields[field.id] || false}
                                                onCheckedChange={(c) => setSelectedFields({ ...selectedFields, [field.id]: c === true })}
                                            />
                                            <label htmlFor={`field-${field.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Field {field.id} - {field.name}
                                            </label>
                                        </div>

                                        {selectedFields[field.id] && (
                                            <div className="pl-6">
                                                <Input
                                                    value={fieldValues[field.id] || ""}
                                                    onChange={(e) => setFieldValues({ ...fieldValues, [field.id]: e.target.value })}
                                                    className="h-8 text-xs font-mono"
                                                    placeholder={field.label}
                                                />
                                                <p className="text-[10px] text-muted-foreground mt-1">{field.label} ({field.type})</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50 h-full">
                    <CardHeader><CardTitle>Generated Output</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Calculated Bitmap (Hex)</Label>
                            <div className="p-4 bg-slate-950 font-mono text-lg tracking-widest border border-slate-800 rounded text-primary text-center">
                                {calculateBitmap()}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Simulated Wire Message</Label>
                            <div className="p-4 bg-slate-950 font-mono text-xs text-muted-foreground border border-slate-800 rounded whitespace-pre-wrap break-all h-64 overflow-y-auto">
                                {generateMessage()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                *Note: This is a visual representation. Real ISO 8583 requires strict binary packing or ASCII headers depending on the variant.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
