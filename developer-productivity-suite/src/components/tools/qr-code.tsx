"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function QrCodeGenerator() {
    const [value, setValue] = useState("https://example.com");
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");

    const download = () => {
        const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
        if (canvas) {
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = "qrcode.png";
            a.click();
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label>URL or Text</Label>
                            <Input
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Enter text to generate QR code..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Size (px)</Label>
                                <span className="text-xs text-slate-500">{size}x{size}</span>
                            </div>
                            <Slider
                                value={[size]}
                                onValueChange={(v) => setSize(v[0])}
                                min={128}
                                max={512}
                                step={8}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Foreground</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="w-12 p-1 h-9 cursor-pointer"
                                    />
                                    <Input
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="font-mono uppercase"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Background</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 p-1 h-9 cursor-pointer"
                                    />
                                    <Input
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="font-mono uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="flex items-center justify-center p-8 bg-slate-100 dark:bg-slate-900 min-h-[400px]">
                <div className="flex flex-col items-center gap-6">
                    <div className="p-4 bg-white rounded-xl shadow-lg">
                        <QRCodeCanvas
                            id="qr-canvas"
                            value={value}
                            size={size}
                            fgColor={fgColor}
                            bgColor={bgColor}
                            level={"H"}
                            includeMargin={true}
                        />
                    </div>
                    <Button onClick={download} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                    </Button>
                </div>
            </Card>
        </div>
    );
}
