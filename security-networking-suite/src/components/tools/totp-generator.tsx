"use client";

import { useState, useEffect } from "react";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/tool-shell";
import { Progress } from "@/components/ui/progress";
import { Clock, QrCode } from "lucide-react";

export function TotpGenerator() {
    const [secret, setSecret] = useState("NB2HI4DTHIXS653XO4XDX4L5"); // Default random base32
    const [token, setToken] = useState("000000");
    const [period, setPeriod] = useState(30);
    const [seconds, setSeconds] = useState(0);
    const [qrUrl, setQrUrl] = useState("");

    // Update token logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const update = () => {
            try {
                // Clean secret
                const cleanSecret = secret.replace(/\s/g, '').toUpperCase();
                if (!cleanSecret) return;

                const totp = new OTPAuth.TOTP({
                    issuer: "DevTools",
                    label: "Debugger",
                    algorithm: "SHA1",
                    digits: 6,
                    period: 30,
                    secret: cleanSecret, // OTPAuth handles base32 decoding
                });

                const tok = totp.generate();
                setToken(tok);

                // Calculate time remaining
                const epoch = Math.round(new Date().getTime() / 1000.0);
                setSeconds(period - (epoch % period));

                // Generate QR once
                const uri = totp.toString();
                // otpauth://totp/Debugger:DevTools?issuer=DevTools&secret=...
                QRCode.toDataURL(uri, (err: Error | null | undefined, url: string) => {
                    if (!err) setQrUrl(url);
                });

            } catch (err) {
                console.error(err);
                setToken("INVALID");
            }
        };

        update();
        interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [secret]);

    return (
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <Card>
                <CardHeader>
                    <CardTitle>Secret Key</CardTitle>
                    <CardDescription>Enter your Base32 secret.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="font-mono text-lg tracking-widest uppercase"
                        placeholder="JBSWY3DPEHPK3PXP"
                    />
                    <p className="text-xs text-muted-foreground">
                        Commonly provided by services when "Scanning QR code" fails.
                    </p>
                </CardContent>
            </Card>

            {/* Output */}
            <Card className="flex flex-col justify-center items-center text-center p-6 bg-slate-950 text-white border-slate-900">
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">Current Token</div>

                    <div className="text-6xl font-mono font-bold tracking-[1rem] tabular-nums text-blue-400">
                        {token}
                    </div>

                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Refresh in</span>
                            <span>{seconds}s</span>
                        </div>
                        <Progress value={(seconds / period) * 100} className="h-1" />
                    </div>
                </div>
            </Card>

            {/* QR Code */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>QR Code Debugging</CardTitle>
                    <CardDescription>Scan this with Google Authenticator to verify if your secret produces the same code.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                    {qrUrl ? (
                        <img src={qrUrl} alt="TOTP QR Code" className="border-4 border-white rounded-lg shadow-sm" />
                    ) : (
                        <div className="h-40 w-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
