"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Textarea } from "@/components/ui/textarea"; // Need to install textarea
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Need to install alert
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function JwtDebugger() {
    const [token, setToken] = useState("");
    const [header, setHeader] = useState<any>(null);
    const [payload, setPayload] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setHeader(null);
            setPayload(null);
            setError(null);
            return;
        }

        try {
            // Decode header
            const decodedHeader = jwtDecode(token, { header: true });
            // Decode payload
            const decodedPayload = jwtDecode(token);

            setHeader(decodedHeader);
            setPayload(decodedPayload);
            setError(null);
        } catch (err) {
            setHeader(null);
            setPayload(null);
            setError("Invalid JWT format");
        }
    }, [token]);

    const parts = token.split('.');

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Input */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Encoded Token</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Paste your JWT here (e.g. eyJhbGci...)"
                            className="font-mono text-sm min-h-[300px] break-all p-4 leading-relaxed"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />

                        {/* Color Legend inside Input for visual mapping */}
                        <div className="mt-4 flex gap-4 text-xs font-medium">
                            <span className="text-red-500">Header</span>
                            <span className="text-purple-500">Payload</span>
                            <span className="text-blue-500">Signature</span>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Right Column: Decoded Output */}
            <div className="space-y-6">
                {/* Header Section */}
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Header</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-sm font-mono bg-slate-50 dark:bg-slate-900 p-4 rounded-md overflow-x-auto">
                            {header ? JSON.stringify(header, null, 2) : <span className="text-muted-foreground italic">// Header content</span>}
                        </pre>
                    </CardContent>
                </Card>

                {/* Payload Section */}
                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Payload</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-sm font-mono bg-slate-50 dark:bg-slate-900 p-4 rounded-md overflow-x-auto">
                            {payload ? JSON.stringify(payload, null, 2) : <span className="text-muted-foreground italic">// Payload content</span>}
                        </pre>
                    </CardContent>
                </Card>

                {/* Signature Section */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Signature Verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            <p className="mb-2">Signature ensures the token hasn't been altered.</p>
                            {parts[2] ? (
                                <code className="break-all bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                    {parts[2]}
                                </code>
                            ) : (
                                <span className="italic">// Signature missing</span>
                            )}

                            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded border border-yellow-200 dark:border-yellow-800">
                                Note: We do not verify the signature against your secret key here to ensure security (Client-Side Only).
                                We only decode the structure.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
