"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}

export function AspectRatioCalc() {
    const [width, setWidth] = useState<number>(1920);
    const [height, setHeight] = useState<number>(1080);
    const [ratioW, setRatioW] = useState<number>(16);
    const [ratioH, setRatioH] = useState<number>(9);

    // lock modes: 'ratio' (keep ratio const), 'width' (keep w/h?), simplistic for now just calc ratio on change
    // Actually, usually users want: "I have 1920x1080 (16:9). If I change width to 1280, what is height?"

    const handleDimensionChange = (w: number, h: number) => {
        setWidth(w);
        setHeight(h);
        if (w > 0 && h > 0) {
            const divisor = gcd(w, h);
            setRatioW(w / divisor);
            setRatioH(h / divisor);
        }
    };

    const handleRatioChange = (rw: number, rh: number) => {
        setRatioW(rw);
        setRatioH(rh);
        // Adjust height based on current width
        setHeight(Math.round(width * (rh / rw)));
    };

    const handleNewWidth = (w: number) => {
        setWidth(w);
        setHeight(Math.round(w * (ratioH / ratioW)));
    };

    const handleNewHeight = (h: number) => {
        setHeight(h);
        setWidth(Math.round(h * (ratioW / ratioH)));
    };

    return (
        <div className="grid gap-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dimensions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Width (px)</Label>
                                <Input
                                    type="number"
                                    value={width}
                                    onChange={(e) => handleNewWidth(Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Height (px)</Label>
                                <Input
                                    type="number"
                                    value={height}
                                    onChange={(e) => handleNewHeight(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Aspect Ratio</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="space-y-2 flex-1">
                                <Label>Ratio W</Label>
                                <Input
                                    type="number"
                                    value={ratioW}
                                    onChange={(e) => handleRatioChange(Number(e.target.value), ratioH)}
                                />
                            </div>
                            <div className="pt-8 text-xl font-bold">:</div>
                            <div className="space-y-2 flex-1">
                                <Label>Ratio H</Label>
                                <Input
                                    type="number"
                                    value={ratioH}
                                    onChange={(e) => handleRatioChange(ratioW, Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {[
                                [16, 9], [4, 3], [1, 1], [21, 9], [9, 16]
                            ].map(([rw, rh]) => (
                                <Button
                                    key={`${rw}:${rh}`}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRatioChange(rw, rh)}
                                    className={rw === ratioW && rh === ratioH ? "bg-slate-100 dark:bg-slate-800" : ""}
                                >
                                    {rw}:{rh}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Visual Preview */}
            <div className="flex items-center justify-center p-12 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden min-h-[400px]">
                <div
                    className="bg-blue-500 shadow-xl transition-all duration-300 flex items-center justify-center text-white font-bold relative"
                    style={{
                        width: width > height ? '300px' : `${300 * (width / height)}px`,
                        // We constrain the box to max 300px in either dimension for display
                        height: width > height ? `${300 * (height / width)}px` : '300px',
                        maxWidth: '100%',
                    }}
                >
                    <span className="absolute inset-0 flex items-center justify-center text-shadow">{width} x {height}</span>
                </div>
            </div>
        </div>
    );
}
