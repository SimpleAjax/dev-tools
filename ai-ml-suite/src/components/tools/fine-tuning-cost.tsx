"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const FT_MODELS = [
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", price: 0.0080 }, // Per 1K tokens
    { id: "davinci-002", name: "Davinci-002", price: 0.0060 },
    { id: "babbage-002", name: "Babbage-002", price: 0.0004 },
    { id: "gpt-4o-mini", name: "GPT-4o-mini", price: 0.0030 }, // Recently announced
];

export function FineTuningCalc() {
    const [modelId, setModelId] = useState("gpt-3.5-turbo");
    const [rows, setRows] = useState(500);
    const [tokensPerRow, setTokensPerRow] = useState(250); // prompt + completion
    const [epochs, setEpochs] = useState(3);

    const selectedModel = FT_MODELS.find(m => m.id === modelId) || FT_MODELS[0];

    const totalTokens = rows * tokensPerRow * epochs;
    const totalCost = (totalTokens / 1000) * selectedModel.price;

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Training Parameters</CardTitle>
                    <CardDescription>Configure your dataset size and training duration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Base Model</Label>
                        <Select value={modelId} onValueChange={setModelId}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {FT_MODELS.map(m => (
                                    <SelectItem key={m.id} value={m.id}>
                                        {m.name} (${m.price}/1k tokens)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Dataset Rows (Examples)</Label>
                            <span className="text-sm text-muted-foreground">{rows.toLocaleString()}</span>
                        </div>
                        <Slider
                            value={[rows]}
                            onValueChange={([v]) => setRows(v)}
                            max={10000}
                            step={10}
                        />
                        <Input type="number" value={rows} onChange={e => setRows(Number(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Avg Tokens per Example</Label>
                            <span className="text-sm text-muted-foreground">{tokensPerRow}</span>
                        </div>
                        <Slider
                            value={[tokensPerRow]}
                            onValueChange={([v]) => setTokensPerRow(v)}
                            max={4096}
                            step={10}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Epochs (Passes)</Label>
                            <span className="text-sm text-muted-foreground">{epochs}</span>
                        </div>
                        <Slider
                            value={[epochs]}
                            onValueChange={([v]) => setEpochs(v)}
                            min={1}
                            max={10}
                            step={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>Estimated Training Cost</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-3/4 gap-8">
                    <div className="text-center space-y-2">
                        <div className="text-6xl font-bold text-primary">
                            ${totalCost.toFixed(2)}
                        </div>
                        <p className="text-muted-foreground table-fixed">
                            Total One-Time Fee
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm bg-background/50 p-4 rounded-lg border">
                        <div>
                            <span className="text-muted-foreground">Total Training Tokens</span>
                            <p className="font-mono font-bold text-lg">{totalTokens.toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Dataset Volume</span>
                            <p className="font-mono font-bold text-lg">
                                {(rows * tokensPerRow).toLocaleString()} tokens
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
