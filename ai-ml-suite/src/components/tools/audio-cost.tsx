"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function AudioCost() {
    const [minutes, setMinutes] = useState(120);
    const PRICE_PER_MIN = 0.006; // OpenAI Whisper

    const total = minutes * PRICE_PER_MIN;

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Audio Volume</CardTitle>
                    <CardDescription>Targeting OpenAI Whisper API ($0.006/min).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Minutes to Transcribe</Label>
                            <span className="text-sm text-muted-foreground">{minutes.toLocaleString()}</span>
                        </div>
                        <Slider
                            value={[minutes]}
                            onValueChange={([v]) => setMinutes(v)}
                            max={10000}
                            step={10}
                        />
                        <Input type="number" value={minutes} onChange={e => setMinutes(Number(e.target.value))} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Roughly {(minutes / 60).toFixed(1)} hours of audio.
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>Estimated Cost</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-3/4 items-center">
                    <div className="text-6xl font-bold text-primary mb-2">
                        ${total.toFixed(2)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
