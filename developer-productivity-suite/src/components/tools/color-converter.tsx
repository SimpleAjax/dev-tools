"use client";

import { useState, useEffect } from "react";
import tinycolor from "tinycolor2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ColorConverter() {
    const [hex, setHex] = useState("#3b82f6");
    const [rgb, setRgb] = useState("");
    const [hsl, setHsl] = useState("");
    const [background, setBackground] = useState("#3b82f6");

    // Update all when Hex changes
    const updateFromHex = (val: string) => {
        setHex(val);
        const color = tinycolor(val);
        if (color.isValid()) {
            setRgb(color.toRgbString());
            setHsl(color.toHslString());
            setBackground(color.toHexString());
        }
    };

    const updateFromRgb = (val: string) => {
        setRgb(val);
        const color = tinycolor(val);
        if (color.isValid()) {
            setHex(color.toHexString());
            setHsl(color.toHslString());
            setBackground(color.toHexString());
        }
    };

    const updateFromHsl = (val: string) => {
        setHsl(val);
        const color = tinycolor(val);
        if (color.isValid()) {
            setHex(color.toHexString());
            setRgb(color.toRgbString());
            setBackground(color.toHexString());
        }
    };

    // Initial load
    useEffect(() => {
        updateFromHex(hex);
    }, []);

    return (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto h-[calc(100vh-8rem)]">
            {/* Preview Panel */}
            <Card className="flex flex-col border-0 shadow-xl overflow-hidden md:h-full">
                <div
                    className="flex-1 min-h-[200px] w-full transition-colors duration-300 flex items-center justify-center"
                    style={{ backgroundColor: background }}
                >
                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur p-4 rounded-xl shadow-sm text-center">
                        <div className="font-mono font-bold text-xl">{background.toUpperCase()}</div>
                    </div>
                </div>
            </Card>

            {/* Controls */}
            <div className="flex flex-col gap-6 justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Formats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>HEX</Label>
                            <div className="flex gap-2">
                                <div
                                    className="w-10 h-10 rounded border shrink-0"
                                    style={{ backgroundColor: background }}
                                />
                                <Input
                                    value={hex}
                                    onChange={(e) => updateFromHex(e.target.value)}
                                    className="font-mono uppercase transition-colors"
                                    style={tinycolor(hex).isValid() ? { borderColor: hex } : undefined}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>RGB</Label>
                            <Input
                                value={rgb}
                                onChange={(e) => updateFromRgb(e.target.value)}
                                className="font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>HSL</Label>
                            <Input
                                value={hsl}
                                onChange={(e) => updateFromHsl(e.target.value)}
                                className="font-mono"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
