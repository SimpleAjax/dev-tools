"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROVIDERS = [
    { name: "Groq (Llama 3 70B)", speed: 300, color: "text-orange-500", bg: "bg-orange-500" },
    { name: "OpenAI (GPT-3.5)", speed: 90, color: "text-green-500", bg: "bg-green-500" },
    { name: "Anthropic (Claude 3 Haiku)", speed: 120, color: "text-purple-500", bg: "bg-purple-500" },
    { name: "OpenAI (GPT-4o)", speed: 80, color: "text-blue-500", bg: "bg-blue-500" },
];

const TARGET_TOKENS = 500;

export function LatencyComp() {
    const [racing, setRacing] = useState(false);
    const [progress, setProgress] = useState<Record<string, number>>(
        Object.fromEntries(PROVIDERS.map(p => [p.name, 0]))
    );

    const startRace = () => {
        setRacing(true);
        setProgress(Object.fromEntries(PROVIDERS.map(p => [p.name, 0])));
    };

    useEffect(() => {
        if (!racing) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                const next = { ...prev };
                let allFinished = true;

                PROVIDERS.forEach(p => {
                    if (next[p.name] < TARGET_TOKENS) {
                        // Speed is tokens/sec. Update runs every 50ms.
                        // Tokens added = speed * (50/1000)
                        const added = p.speed * 0.05;
                        next[p.name] = Math.min(next[p.name] + added, TARGET_TOKENS);
                        allFinished = false;
                    }
                });

                if (allFinished) setRacing(false);
                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [racing]);

    return (
        <div className="grid gap-6 lg:grid-cols-1 max-w-4xl mx-auto">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Token Generation Race</CardTitle>
                        <CardDescription>Visualizing {TARGET_TOKENS} output tokens at advertised speeds.</CardDescription>
                    </div>
                    <Button onClick={startRace} disabled={racing} size="lg">
                        <Play className="mr-2 h-4 w-4" /> Start Race
                    </Button>
                </CardHeader>
                <CardContent className="space-y-8">
                    {PROVIDERS.map((p) => {
                        const current = progress[p.name] || 0;
                        const percent = (current / TARGET_TOKENS) * 100;
                        const finished = current >= TARGET_TOKENS;
                        const timeInfo = finished ? `Finished in ${(TARGET_TOKENS / p.speed).toFixed(2)}s` : `${current.toFixed(0)} tokens`;

                        return (
                            <div key={p.name} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                        <Zap className={`w-4 h-4 ${p.color}`} />
                                        <span className="font-semibold">{p.name}</span>
                                        <span className="text-muted-foreground text-xs">({p.speed} t/s)</span>
                                    </div>
                                    <span className="font-mono text-sm">{timeInfo}</span>
                                </div>
                                <div className="h-4 w-full bg-secondary rounded-full overflow-hidden relative">
                                    <div
                                        className={`h-full transition-all duration-75 ease-linear ${p.bg}`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
                *Based on average public benchmarks (May 2024). Actual speeds vary by load.
            </div>
        </div>
    );
}
