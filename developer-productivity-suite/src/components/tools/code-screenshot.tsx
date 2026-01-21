"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Download } from "lucide-react";

export function CodeScreenshot() {
    const [code, setCode] = useState("console.log('Hello World');");
    const [padding, setPadding] = useState(64);
    const [theme, setTheme] = useState("dark-blue");

    const captureRef = useRef<HTMLDivElement>(null);

    const download = async () => {
        if (captureRef.current) {
            const canvas = await html2canvas(captureRef.current, { scale: 2 } as any);
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = "code-snippet.png";
            a.click();
        }
    };

    const themes: Record<string, string> = {
        "dark-blue": "linear-gradient(to bottom right, #1e3a8a, #3b82f6)",
        "sunset": "linear-gradient(to bottom right, #f97316, #ec4899)",
        "forest": "linear-gradient(to bottom right, #14532d, #22c55e)",
        "midnight": "linear-gradient(to bottom right, #0f172a, #334155)",
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            {/* Toolbar */}
            <Card className="flex-none">
                <CardContent className="p-4 flex flex-wrap gap-6 items-end">
                    <div className="w-[150px] space-y-2">
                        <Label>Background Theme</Label>
                        <Select value={theme} onValueChange={setTheme}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dark-blue">Dark Blue</SelectItem>
                                <SelectItem value="sunset">Sunset</SelectItem>
                                <SelectItem value="forest">Forest</SelectItem>
                                <SelectItem value="midnight">Midnight</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-[150px] space-y-2">
                        <Label>Padding: {padding}px</Label>
                        <Slider value={[padding]} onValueChange={v => setPadding(v[0])} min={16} max={128} step={16} />
                    </div>

                    <Button onClick={download} className="ml-auto">
                        <Download className="mr-2 h-4 w-4" /> Export PNG
                    </Button>
                </CardContent>
            </Card>

            {/* Editor & Preview Split */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
                <div className="flex-1 flex flex-col min-h-0">
                    <Label className="mb-2">Code</Label>
                    <Textarea
                        className="flex-1 font-mono text-sm resize-none"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="// Type your code here..."
                    />
                </div>

                <div className="flex-[2] bg-slate-100 dark:bg-slate-900 border rounded-lg overflow-auto flex items-center justify-center p-8">
                    <div ref={captureRef} style={{ background: themes[theme], padding: `${padding}px` }} className="shadow-2xl rounded-lg">
                        <div className="bg-slate-950 rounded-lg shadow-xl overflow-hidden min-w-[300px]">
                            {/* Window Controls */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            {/* Code Area */}
                            <div className="p-6">
                                <pre className="font-mono text-sm text-slate-300 pointer-events-none whitespace-pre-wrap break-all">
                                    {code || "// Your code here"}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
