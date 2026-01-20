"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/tool-shell";
import { Lock, RefreshCw } from "lucide-react";

type Algo = "bcrypt" | "md5" | "sha1";

export function HtpasswdGenerator() {
    const [username, setUsername] = useState("user");
    const [password, setPassword] = useState("");
    const [algo, setAlgo] = useState<Algo>("bcrypt");
    const [entry, setEntry] = useState("");
    const [loading, setLoading] = useState(false);

    // Generate HTPasswd Entry
    const generate = async () => {
        if (!username || !password) return;

        setLoading(true);

        // Allow UI to update before heavy calc
        setTimeout(() => {
            let hash = "";

            try {
                if (algo === "bcrypt") {
                    const salt = bcrypt.genSaltSync(10);
                    hash = bcrypt.hashSync(password, salt);
                } else if (algo === "md5") {
                    // Apache MD5 is specialized ($apr1$...), crypto-js is standard MD5.
                    // For simple basic auth, sometimes standard Crypt(3) is used, but often APR1.
                    // Implementing full APR1 in client-side JS is complex.
                    // We will stick to Bcrypt (best practice) and SHA1 ({SHA}base64) which is easy.

                    // Fallback: SHA1 (insecure but supported)
                    // Format: {SHA}base64-digest
                    const sha1 = CryptoJS.SHA1(password);
                    hash = "{SHA}" + CryptoJS.enc.Base64.stringify(sha1);
                }
            } catch (e) {
                console.error(e);
                hash = "Error generating hash";
            }

            setEntry(`${username}:${hash}`);
            setLoading(false);
        }, 100);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Credentials</CardTitle>
                    <CardDescription>Create an entry for your .htpasswd file.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="secret123"
                            />
                        </div>
                        {/* Random Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                                const random = Math.random().toString(36).slice(-10);
                                setPassword(random);
                            }}
                        >
                            <RefreshCw className="h-3 w-3 mr-2" />
                            Generate Random
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="algo">Algorithm</Label>
                        <Select value={algo} onValueChange={(v) => setAlgo(v as Algo)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bcrypt">Bcrypt (Recommended)</SelectItem>
                                <SelectItem value="md5">SHA1 (Legacy)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={generate} disabled={loading || !password} className="w-full">
                        {loading ? "Hashing..." : "Generate Entry"}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-slate-50">
                <CardHeader>
                    <CardTitle className="text-slate-400 uppercase text-sm tracking-wider">Output File Entry</CardTitle>
                </CardHeader>
                <CardContent>
                    {entry ? (
                        <div className="space-y-4">
                            <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono break-all text-green-400">
                                {entry}
                            </div>
                            <div className="flex justify-end">
                                <CopyButton text={entry} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" />
                            </div>
                            <p className="text-xs text-slate-500">
                                Append this line to your <code>.htpasswd</code> file.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-slate-600">
                            <Lock className="h-8 w-8 mb-2 opacity-50" />
                            <p>Enter credentials to generate</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
