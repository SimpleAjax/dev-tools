"use client";

import { useState } from "react";
import generatePassword from "generate-password-browser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CopyButton } from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider"; // Need to install slider 
import { RefreshCw, Key } from "lucide-react";

export function RandomSecretsGenerator() {
    const [length, setLength] = useState([32]);
    const [count, setCount] = useState([5]);
    const [options, setOptions] = useState({
        numbers: true,
        symbols: true,
        uppercase: true,
        lowercase: true,
        excludeSimilar: false, // i, l, 1, L, o, 0, O
    });
    const [secrets, setSecrets] = useState<string[]>([]);

    const generate = () => {
        try {
            const newSecrets = generatePassword.generateMultiple(count[0], {
                length: length[0],
                numbers: options.numbers,
                symbols: options.symbols,
                uppercase: options.uppercase,
                lowercase: options.lowercase,
                excludeSimilarCharacters: options.excludeSimilar,
                strict: true // Include at least one of each type
            });
            setSecrets(newSecrets);
        } catch (e) {
            // Fallback or error handling if strict generation fails (rare)
            setSecrets(["Error: Could not generate with strict rules. Try increasing length."])
        }
    };

    const toggle = (key: keyof typeof options) => setOptions(p => ({ ...p, [key]: !p[key] }));

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Configure output complexity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Length: {length}</Label>
                        </div>
                        <Slider value={length} onValueChange={setLength} min={8} max={128} step={1} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Count: {count}</Label>
                        </div>
                        <Slider value={count} onValueChange={setCount} min={1} max={50} step={1} />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="uppercase">Uppercase</Label>
                            <Switch id="uppercase" checked={options.uppercase} onCheckedChange={() => toggle("uppercase")} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="lowercase">Lowercase</Label>
                            <Switch id="lowercase" checked={options.lowercase} onCheckedChange={() => toggle("lowercase")} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="numbers">Numbers</Label>
                            <Switch id="numbers" checked={options.numbers} onCheckedChange={() => toggle("numbers")} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="symbols">Symbols</Label>
                            <Switch id="symbols" checked={options.symbols} onCheckedChange={() => toggle("symbols")} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="similar">Exclude Similar</Label>
                            <Switch id="similar" checked={options.excludeSimilar} onCheckedChange={() => toggle("excludeSimilar")} />
                        </div>
                    </div>

                    <Button onClick={generate} className="w-full mt-4">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate Secrets
                    </Button>
                </CardContent>
            </Card>

            {/* Output */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Generated Secrets</CardTitle>
                    <CardDescription>API Keys, Salt values, App Secrets</CardDescription>
                </CardHeader>
                <CardContent>
                    {secrets.length > 0 ? (
                        <div className="space-y-3">
                            {secrets.map((secret, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input readOnly value={secret} className="font-mono bg-slate-50 dark:bg-slate-900" />
                                    <CopyButton text={secret} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed rounded-lg">
                            <Key className="h-10 w-10 mb-3 opacity-20" />
                            <p>Click "Generate" to create high-entropy strings.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
