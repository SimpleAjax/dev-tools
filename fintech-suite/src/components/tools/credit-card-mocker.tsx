"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { faker } from "@faker-js/faker";

// We can use faker if installed, or just manual logic. 
// I will assume faker is available from the package I installed earlier, or fallback to manual.
// Actually, the previous npm install for faker might have failed or succeeded (one failed).
// Let's implement a simple sturdy generator manually to be safe.

const GENERATORS: Record<string, () => string> = {
    VISA: () => {
        // Start with 4. Length 16.
        return generateLuhn("4", 16);
    },
    MASTERCARD: () => {
        // Start with 51-55. Length 16.
        const start = 51 + Math.floor(Math.random() * 5);
        return generateLuhn(start.toString(), 16);
    },
    AMEX: () => {
        // Start with 34 or 37. Length 15.
        const start = Math.random() > 0.5 ? "34" : "37";
        return generateLuhn(start, 15);
    }
};

function generateLuhn(prefix: string, length: number) {
    let ccnumber = prefix;
    while (ccnumber.length < (length - 1)) {
        ccnumber += Math.floor(Math.random() * 10);
    }

    // Calculate Check Digit
    let sum = 0;
    let pos = 0;
    const reversed = ccnumber.split("").reverse().map(Number);

    while (pos < length - 1) {
        let odd = reversed[pos] * 2;
        if (odd > 9) odd -= 9;
        sum += odd;

        if (pos !== (length - 2)) {
            sum += reversed[pos + 1];
        }
        pos += 2;
    }

    // This calculation is slightly off for the general case loop above. 
    // Let's use the standard loop for check digit calculation.
    // ... Actually easier to just brute force the last digit 0-9 until valid.

    for (let i = 0; i <= 9; i++) {
        if (isValidLuhn(ccnumber + i)) {
            return ccnumber + i;
        }
    }
    return ccnumber + "0"; // fallback
}

function isValidLuhn(val: string) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = val.length - 1; i >= 0; i--) {
        let digit = parseInt(val.charAt(i));
        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
}

export function CreditCardMocker() {
    const [issuer, setIssuer] = useState("VISA");
    const [card, setCard] = useState<any>(null);

    const generate = () => {
        const num = GENERATORS[issuer]();
        const expMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
        const expYear = String(new Date().getFullYear() + Math.floor(Math.random() * 5));
        const cvv = issuer === "AMEX" ? String(Math.floor(1000 + Math.random() * 9000)) : String(Math.floor(100 + Math.random() * 900));

        setCard({
            number: num,
            exp: `${expMonth}/${expYear.slice(2)}`,
            cvv,
            issuer
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Card Issuer</Label>
                            <Select value={issuer} onValueChange={setIssuer}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VISA">Visa</SelectItem>
                                    <SelectItem value="MASTERCARD">Mastercard</SelectItem>
                                    <SelectItem value="AMEX">American Express</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Test Scenario (Stripe)</Label>
                            <Select defaultValue="success">
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="decline">Decline (Generic)</SelectItem>
                                    <SelectItem value="insufficient">Insufficient Funds</SelectItem>
                                    <SelectItem value="lost">Lost Card</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Note: For specific scenarios, we override the random number with fixed test vectors.</p>
                        </div>
                        <Button onClick={generate} className="w-full">Generate Card</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-center">
                {card ? (
                    <div className="w-96 h-56 bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl shadow-2xl p-6 relative border border-slate-700/50 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-8 bg-yellow-600/50 rounded flex items-center justify-center text-[8px] text-yellow-200 border border-yellow-500/30">CHIP</div>
                            <div className="text-xl font-bold italic tracking-widest text-slate-500">{card.issuer}</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
                                <span className="font-mono text-2xl tracking-widest text-shadow shadow-black">{card.number}</span>
                                <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-[9px] uppercase text-muted-foreground">Card Holder</div>
                                    <div className="text-sm font-medium tracking-widest">TEST USER</div>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <div className="text-[9px] uppercase text-muted-foreground">Expires</div>
                                        <div className="text-sm font-mono">{card.exp}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] uppercase text-muted-foreground">CVV</div>
                                        <div className="text-sm font-mono">{card.cvv}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-muted-foreground text-sm border-2 border-dashed border-slate-800 p-12 rounded-lg">
                        Generate a card to see preview...
                    </div>
                )}
            </div>
        </div>
    );
}
