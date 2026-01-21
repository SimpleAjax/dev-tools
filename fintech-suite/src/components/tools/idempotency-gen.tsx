"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

export function IdempotencyGen() {
    const [key, setKey] = useState<string>("");

    const generate = () => {
        // Generate UUID v4 for compatibility/demo as standard JS randomUUID is effectively v4
        // v7 is better for DBs (timestamp sorting). We can simulate v7 if needed or explain it.
        // For now, crypto.randomUUID() is sufficient for visual key gen.
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            setKey(crypto.randomUUID());
        } else {
            // Fallback
            setKey("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader><CardTitle>Generator</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <Button onClick={generate} size="lg" className="w-full">Generate New Key</Button>
                        {key && (
                            <div className="p-4 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                                <code className="text-lg text-primary">{key}</code>
                                <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(key)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader><CardTitle>What is Idempotency?</CardTitle></CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                            An idempotent operation is one that can be applied multiple times without changing the result beyond the initial application.
                        </p>
                        <p>
                            <strong>In Payments:</strong> If a network timeout occurs after you charge a customer, retrying the request MUST NOT charge them twice.
                        </p>
                        <p>
                            Sending an <code>Idempotency-Key</code> header ensures the server recognizes the retry and returns the cached success response instead of processing a new charge.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50 h-full">
                    <CardHeader><CardTitle>Implementation Example</CardTitle></CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
                            {`// Client Side (React/Node)
const charge = await fetch('https://api.stripe.com/v1/charges', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_test_...',
    'Idempotency-Key': '${key || "YOUR_GENERATED_UUID"}', // <--- Critical
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'amount=2000&currency=usd'
});

// Server Side Logic
if (await db.exists(idempotencyKey)) {
   const cached = await db.get(idempotencyKey);
   return res.json(cached.response); 
} else {
   // Process Payment
   // Save { key, response } to DB
}`}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
