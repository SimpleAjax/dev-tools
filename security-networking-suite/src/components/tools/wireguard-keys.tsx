"use client";

import { useState } from "react";
import nacl from "tweetnacl";
import util from "tweetnacl-util";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/tool-shell";
import { RefreshCw, Eye, EyeOff, ShieldCheck } from "lucide-react";

export function WireGuardKeyGenerator() {
    const [keyPair, setKeyPair] = useState<{ publicKey: string; privateKey: string } | null>(null);
    const [showPrivate, setShowPrivate] = useState(false);
    const [presharedKey, setPresharedKey] = useState<string>("");

    const generate = () => {
        // Generate KeyPair
        const pair = nacl.box.keyPair();
        const publicKey = util.encodeBase64(pair.publicKey);
        const privateKey = util.encodeBase64(pair.secretKey);

        setKeyPair({ publicKey, privateKey });

        // Generate Preshared Key (32 random bytes)
        const psk = nacl.randomBytes(32);
        setPresharedKey(util.encodeBase64(psk));
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <Button size="lg" onClick={generate} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <RefreshCw className="h-4 w-4" />
                    Generate New Keypair
                </Button>
                <p className="text-sm text-muted-foreground">
                    Keys are generated locally using <code>tweetnacl-js</code> (Curve25519).
                </p>
            </div>

            {keyPair && (
                <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Private Key Card */}
                    <Card className="border-red-200 dark:border-red-900 bg-red-50/10">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-red-600 dark:text-red-400">
                                <span>Private Key (Interface)</span>
                                <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">KEEP SECRET</span>
                            </CardTitle>
                            <CardDescription>
                                This goes into your <strong>[Interface]</strong> section as <code>PrivateKey</code>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        readOnly
                                        value={keyPair.privateKey}
                                        type={showPrivate ? "text" : "password"}
                                        className="font-mono bg-white dark:bg-black pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPrivate(!showPrivate)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPrivate ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <CopyButton text={keyPair.privateKey} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Public Key Card */}
                    <Card className="border-green-200 dark:border-green-900 bg-green-50/10">
                        <CardHeader>
                            <CardTitle className="text-green-600 dark:text-green-400">Public Key (Peer)</CardTitle>
                            <CardDescription>
                                This goes into the peer's <strong>[Peer]</strong> section as <code>PublicKey</code>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input readOnly value={keyPair.publicKey} className="font-mono bg-white dark:bg-black" />
                                <CopyButton text={keyPair.publicKey} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preshared Key Card */}
                    <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/10">
                        <CardHeader>
                            <CardTitle className="text-blue-600 dark:text-blue-400">Preshared Key (Optional)</CardTitle>
                            <CardDescription>
                                For additional quantum resistance layer. Use as <code>PresharedKey</code>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input readOnly value={presharedKey} className="font-mono bg-white dark:bg-black" />
                                <CopyButton text={presharedKey} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Generated entirely in-browser. No network requests made.
                    </div>
                </div>
            )}
        </div>
    );
}
