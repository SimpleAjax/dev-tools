"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Copy, Globe } from "lucide-react";
import * as ibantools from "ibantools";
import { Button } from "@/components/ui/button";

export function IbanValidator() {
    const [iban, setIban] = useState("");
    const [result, setResult] = useState<{
        valid: boolean;
        country: string;
        checkDigits: string;
        bban: string;
        formatted: string;
    } | null>(null);

    useEffect(() => {
        const cleanToken = iban.replace(/\s/g, "").toUpperCase();
        if (cleanToken.length < 5) {
            setResult(null);
            return;
        }

        const isValid = ibantools.isValidIBAN(cleanToken);
        const country = cleanToken.substring(0, 2);
        const checkDigits = cleanToken.substring(2, 4);
        const bban = cleanToken.substring(4);
        const formatted = ibantools.electronicFormatIBAN(cleanToken) || cleanToken;

        setResult({
            valid: isValid,
            country,
            checkDigits,
            bban,
            formatted,
        });
    }, [iban]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle>Enter IBAN</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>International Bank Account Number</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={iban}
                                    onChange={(e) => setIban(e.target.value)}
                                    placeholder="DE89 3704..."
                                    className="pl-9 font-mono text-lg uppercase"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIban("DE89370400440532013000")}>
                                Try DE Example
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setIban("GB29NWBK60161331926819")}>
                                Try GB Example
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle>Validation Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!result ? (
                            <div className="text-center text-muted-foreground py-12">
                                Enter an IBAN to detect structure...
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Status Banner */}
                                <div className={`flex items-center gap-3 p-4 rounded-lg border ${result.valid
                                        ? "bg-green-500/10 border-green-500/50 text-green-400"
                                        : "bg-red-500/10 border-red-500/50 text-red-400"
                                    }`}>
                                    {result.valid ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                                    <div>
                                        <h3 className="font-semibold">{result.valid ? "Valid IBAN" : "Invalid IBAN Checksum"}</h3>
                                        <p className="text-sm opacity-80">{result.valid ? "The structure and Mod-97 checksum are correct." : "The check digits do not match the account details."}</p>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="grid grid-cols-4 gap-2 text-center text-sm font-mono">
                                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                                            <div className="text-muted-foreground text-xs mb-1">Country</div>
                                            <div className="text-primary font-bold">{result.country}</div>
                                        </div>
                                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                                            <div className="text-muted-foreground text-xs mb-1">Check</div>
                                            <div className="text-yellow-400 font-bold">{result.checkDigits}</div>
                                        </div>
                                        <div className="col-span-2 p-2 bg-slate-950 rounded border border-slate-800">
                                            <div className="text-muted-foreground text-xs mb-1">BBAN (Bank + Branch + Account)</div>
                                            <div className="text-blue-400 font-bold break-all">{result.bban}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                                    <Label className="text-xs text-muted-foreground">Electronic Format</Label>
                                    <div className="flex justify-between items-center mt-1">
                                        <code className="text-sm">{result.formatted}</code>
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                            <Copy className="h-3 w-3" />
                                        </Button>
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
