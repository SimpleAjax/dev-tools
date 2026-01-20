"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const PRESETS = [
    { name: "GPT-4 (8k)", size: 8192 },
    { name: "GPT-4 Turbo (128k)", size: 128000 },
    { name: "Claude 3 (200k)", size: 200000 },
    { name: "Gemini 1.5 Pro (1M)", size: 1000000 },
    { name: "Gemini 1.5 Pro (2M)", size: 2000000 },
    { name: "Llama 3 (8k)", size: 8192 },
];

export function ContextVisualizer() {
    const [text, setText] = useState("");
    // Simple approximation: 1 token ~= 4 chars
    const tokenCount = Math.ceil(text.length / 4);

    return (
        <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-12rem)]">
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex flex-col h-full border-muted-foreground/20">
                    <CardHeader>
                        <CardTitle>Content Input</CardTitle>
                        <CardDescription>Paste content to see how it fits.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            placeholder="Paste your long text here..."
                            className="h-full resize-none font-mono text-sm"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 overflow-auto">
                {PRESETS.map((preset) => {
                    const percentage = Math.min((tokenCount / preset.size) * 100, 100);
                    const isOverflow = tokenCount > preset.size;

                    return (
                        <Card key={preset.name} className={`overflow-hidden transition-colors ${isOverflow ? 'border-destructive/50' : ''}`}>
                            <CardContent className="p-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold">{preset.name}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Limit: {preset.size.toLocaleString()} tokens
                                        </p>
                                    </div>
                                    <Badge variant={isOverflow ? "destructive" : "secondary"}>
                                        {isOverflow ? "Overflow" : `${percentage.toFixed(2)}% Used`}
                                    </Badge>
                                </div>

                                <div className="relative h-6 w-full rounded-full bg-secondary overflow-hidden">
                                    {/* The Bar */}
                                    <div
                                        className={`absolute top-0 left-0 h-full transition-all duration-500 rounded-full ${isOverflow ? 'bg-destructive' : 'bg-primary'}`}
                                        style={{ width: `${percentage}%` }}
                                    />

                                    {/* Grid lines for visualization */}
                                    <div className="absolute top-0 left-0 w-full h-full flex justify-between px-1">
                                        {[0.25, 0.5, 0.75].map(p => (
                                            <div key={p} className="h-full w-px bg-background/20 z-10" style={{ left: `${p * 100}%` }} />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                                    <span>0</span>
                                    <span>{tokenCount.toLocaleString()} tokens</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
