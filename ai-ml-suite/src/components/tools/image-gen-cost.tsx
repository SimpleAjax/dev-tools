"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const IMG_MODELS = [
    { id: "dall-e-3-std", name: "DALL-E 3 (Standard)", price: 0.040 },
    { id: "dall-e-3-hd", name: "DALL-E 3 (HD)", price: 0.080 },
    { id: "dall-e-2-1024", name: "DALL-E 2 (1024x1024)", price: 0.020 },
    { id: "midjourney-basic", name: "Midjourney (Basic Plan)", price: 10 / 200 }, // Approx $10/mo for ~200 imgs
];

export function ImageGenCost() {
    const [modelId, setModelId] = useState("dall-e-3-std");
    const [count, setCount] = useState(100);

    const model = IMG_MODELS.find(m => m.id === modelId) || IMG_MODELS[0];
    const total = count * model.price;

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Generation Plan</CardTitle>
                    <CardDescription>Configure volume and quality.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Model / Quality</Label>
                        <Select value={modelId} onValueChange={setModelId}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {IMG_MODELS.map(m => (
                                    <SelectItem key={m.id} value={m.id}>{m.name} (~${m.price.toFixed(3)}/img)</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Images per Month</Label>
                            <span className="text-sm text-muted-foreground">{count.toLocaleString()}</span>
                        </div>
                        <Slider
                            value={[count]}
                            onValueChange={([v]) => setCount(v)}
                            max={5000}
                            step={10}
                        />
                        <Input type="number" value={count} onChange={e => setCount(Number(e.target.value))} />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle>Projected Cost</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center h-3/4 items-center">
                    <div className="text-6xl font-bold text-primary mb-2">
                        ${total.toFixed(2)}
                    </div>
                    <p className="text-muted-foreground text-sm">
                        per month
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
