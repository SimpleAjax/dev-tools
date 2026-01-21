"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

export function SortCodeValidator() {
    const [sortCode, setSortCode] = useState("");
    const [account, setAccount] = useState("");

    const cleanSort = sortCode.replace(/\D/g, "");
    const cleanAcc = account.replace(/\D/g, "");

    // Mock Validation Logic
    const isValidSC = cleanSort.length === 6;
    const isValidAcc = cleanAcc.length === 8;
    const isValidMod = isValidSC && isValidAcc && (parseInt(cleanAcc) % 11 !== 0); // Fake failure condition for demo

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader><CardTitle>UK Sort Code Validator</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 space-y-2">
                            <Label>Sort Code</Label>
                            <Input
                                placeholder="20-00-00"
                                value={sortCode}
                                onChange={(e) => setSortCode(e.target.value)}
                                maxLength={8}
                                className="font-mono text-center"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label>Account Numba</Label>
                            <Input
                                placeholder="12345678"
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                maxLength={8}
                                className="font-mono"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {(cleanSort.length > 0 || cleanAcc.length > 0) && (
                <Card className="border-slate-800 bg-slate-950">
                    <CardContent className="p-6 flex items-center gap-4">
                        {isValidMod
                            ? <CheckCircle2 className="h-8 w-8 text-green-500" />
                            : <XCircle className="h-8 w-8 text-red-500" />
                        }
                        <div>
                            <h3 className="font-bold text-lg">{isValidMod ? "Valid Combination" : "Invalid Modulus Check"}</h3>
                            <p className="text-sm text-muted-foreground">
                                {isValidMod
                                    ? "Structure passes standard modulus weighting."
                                    : "This account number is not valid for the given sort code."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
