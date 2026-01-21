"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle } from "lucide-react";

export function CryptoAddressCheck() {
    const [address, setAddress] = useState("");
    const [chain, setChain] = useState("ETH");
    const [result, setResult] = useState<{ valid: boolean; msg: string } | null>(null);

    const validate = (val: string, c: string) => {
        setAddress(val);
        if (val.length === 0) {
            setResult(null);
            return;
        }

        let valid = false;
        let msg = "Invalid Format";

        // Basic regex validation for demo
        if (c === "ETH") {
            valid = /^0x[a-fA-F0-9]{40}$/.test(val);
            msg = valid ? "Valid Ethereum checksum format (Hex)" : "Must start with 0x and be 40 hex chars";
        } else if (c === "BTC") {
            valid = /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/.test(val);
            msg = valid ? "Valid Bitcoin format (Base58/Bech32)" : "Invalid BTC address format";
        } else if (c === "SOL") {
            valid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(val);
            msg = valid ? "Valid Solana format (Base58)" : "Invalid SOL address format";
        }

        setResult({ valid, msg });
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader><CardTitle>Crypto Address Validator</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Blockchain</Label>
                        <Select value={chain} onValueChange={(v) => { setChain(v); validate(address, v); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ETH">Ethereum (ERC-20)</SelectItem>
                                <SelectItem value="BTC">Bitcoin</SelectItem>
                                <SelectItem value="SOL">Solana</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Wallet Address</Label>
                        <Input
                            value={address}
                            onChange={(e) => validate(e.target.value, chain)}
                            placeholder="0x..."
                            className="font-mono"
                        />
                    </div>
                </CardContent>
            </Card>

            {result && (
                <div className={`p-4 rounded-lg border flex items-center gap-3 ${result.valid ? "bg-green-500/10 border-green-500 text-green-400" : "bg-red-500/10 border-red-500 text-red-400"}`}>
                    {result.valid ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    <span className="font-medium">{result.msg}</span>
                </div>
            )}
        </div>
    );
}
