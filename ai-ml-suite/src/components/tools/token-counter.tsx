"use client";

import { useState, useEffect } from "react";
import { getEncoding } from "js-tiktoken";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const MODELS = {
    "gpt-4o": { pricePer1k: 0.005, name: "GPT-4o" },
    "gpt-4-turbo": { pricePer1k: 0.01, name: "GPT-4 Turbo" },
    "gpt-3.5-turbo": { pricePer1k: 0.0005, name: "GPT-3.5 Turbo" },
    "cl100k_base": { pricePer1k: 0, name: "Generic cl100k" },
};

export function TokenCounter() {
    const [text, setText] = useState("");
    const [model, setModel] = useState("gpt-4o");
    const [tokens, setTokens] = useState<number>(0);
    const [encoding, setEncoding] = useState<any>(null);

    useEffect(() => {
        try {
            // cl100k_base is used by gpt-4, gpt-3.5-turbo, text-embedding-ada-002
            const enc = getEncoding("cl100k_base");
            setEncoding(enc);
            return () => {
                // enc.free();
            };
        } catch (e) {
            console.error("Failed to load tokenizer", e);
        }
    }, []);

    useEffect(() => {
        if (!encoding) return;
        try {
            const encoded = encoding.encode(text);
            setTokens(encoded.length);
        } catch (e) {
            console.error("Tokenization error", e);
        }
    }, [text, encoding]);

    const cost = (tokens / 1000) * (MODELS[model as keyof typeof MODELS]?.pricePer1k || 0);

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-12rem)]">
            {/* Input Section */}
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex flex-col h-full border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Input Text</CardTitle>
                        <CardDescription>Paste your prompt or text here.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            placeholder="Paste text here..."
                            className="h-full resize-none font-mono text-sm"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Analysis Section */}
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Label htmlFor="model">Model Pricing</Label>
                            <Select value={model} onValueChange={setModel}>
                                <SelectTrigger id="model">
                                    <SelectValue placeholder="Select model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(MODELS).map(([key, info]) => (
                                        <SelectItem key={key} value={key}>
                                            {info.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle>Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Tokens</p>
                                <div className="text-4xl font-bold text-primary">{tokens.toLocaleString()}</div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Characters</p>
                                <div className="text-4xl font-bold">{text.length.toLocaleString()}</div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Estimated Cost (Input)</p>
                            <div className="text-5xl font-bold text-green-500">
                                ${cost.toFixed(6)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Based on {MODELS[model as keyof typeof MODELS].name} pricing.
                            </p>
                        </div>

                        <div className="pt-4">
                            <div className="mb-2 flex justify-between text-sm">
                                <span>Context Usage (128k)</span>
                                <span>{((tokens / 128000) * 100).toFixed(2)}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                                    style={{ width: `${Math.min((tokens / 128000) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
