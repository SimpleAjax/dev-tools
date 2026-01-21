"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function WebhookVerifier() {
    const [secret, setSecret] = useState("whsec_test_12345");
    const [payload, setPayload] = useState('{"id": "evt_test_123", "object": "event"}');
    const [headerSig, setHeaderSig] = useState("");
    const [computedSig, setComputedSig] = useState("");
    const [status, setStatus] = useState<"match" | "mismatch" | "idle">("idle");

    useEffect(() => {
        const compute = async () => {
            if (!secret || !payload) return;

            try {
                const enc = new TextEncoder();
                const key = await crypto.subtle.importKey(
                    "raw",
                    enc.encode(secret),
                    { name: "HMAC", hash: "SHA-256" },
                    false,
                    ["sign"]
                );
                const signature = await crypto.subtle.sign(
                    "HMAC",
                    key,
                    enc.encode(payload)
                );

                // Convert to hex
                const hashArray = Array.from(new Uint8Array(signature));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                setComputedSig(hashHex);
            } catch (e) {
                console.error(e);
            }
        };
        compute();
    }, [secret, payload]);

    useEffect(() => {
        if (!headerSig || !computedSig) {
            setStatus("idle");
            return;
        }
        // Stripe style headers often look like t=123,v1=SIGNATURE
        // We will assume the user pastes just the signature hash for simplicity, or tries to extract it
        // Let's do simple substring match
        if (headerSig.includes(computedSig)) {
            setStatus("match");
        } else {
            setStatus("mismatch");
        }
    }, [headerSig, computedSig]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader><CardTitle>Webhook Data</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Signing Secret</Label>
                            <Input value={secret} onChange={(e) => setSecret(e.target.value)} type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label>Raw Payload Body</Label>
                            <Textarea
                                value={payload}
                                onChange={(e) => setPayload(e.target.value)}
                                className="font-mono h-48 bg-slate-950 border-slate-800"
                            />
                            <p className="text-xs text-muted-foreground">Ensure exact whitespace matching. Webhooks are byte-sensitive.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Header Signature (Received)</Label>
                            <Input
                                value={headerSig}
                                onChange={(e) => setHeaderSig(e.target.value)}
                                placeholder="e.g. t=12323,v1=6ab3..."
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="border-slate-800 bg-slate-900/50 h-full">
                    <CardHeader><CardTitle>Verification</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Computed HMAC-SHA256</Label>
                            <div className="p-4 bg-slate-950 rounded border border-slate-800 break-all font-mono text-sm text-blue-400">
                                {computedSig || "..."}
                            </div>
                        </div>

                        {status !== "idle" && (
                            <div className={`p-6 rounded-lg border-2 text-center ${status === "match" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}>
                                <div className="text-2xl font-bold mb-2">
                                    {status === "match" ? "Valid Signature" : "Invalid Signature"}
                                </div>
                                <p className="text-sm opacity-80">
                                    {status === "match"
                                        ? "The payload has not been tampered with and comes from the owner of the secret."
                                        : "The computed hash does not match the header. The payload may be modified or the secret is wrong."}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
