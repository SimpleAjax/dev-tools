"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export function RagChunking() {
    const [text, setText] = useState("Artificial intelligence (AI) is intelligence associated with machines and computers...");
    const [chunkSize, setChunkSize] = useState(100);
    const [overlap, setOverlap] = useState(20);

    const chunks = useMemo(() => {
        const result: { content: string; start: number; end: number }[] = [];
        if (!text) return result;

        let i = 0;
        while (i < text.length) {
            const end = Math.min(i + chunkSize, text.length);
            result.push({ content: text.slice(i, end), start: i, end });
            if (end === text.length) break;
            i += (chunkSize - overlap);
        }
        return result;
    }, [text, chunkSize, overlap]);

    return (
        <div className="grid gap-6 lg:grid-cols-12 h-[calc(100vh-12rem)]">
            {/* Controls */}
            <Card className="lg:col-span-4 h-fit">
                <CardHeader>
                    <CardTitle>Splitter Settings</CardTitle>
                    <CardDescription>Configure how text is chopped for embeddings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Chunk Size (Chars)</Label>
                            <span className="text-sm text-muted-foreground">{chunkSize}</span>
                        </div>
                        <Slider
                            value={[chunkSize]}
                            onValueChange={([v]) => setChunkSize(v)}
                            min={50}
                            max={2000}
                            step={10}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Overlap (Chars)</Label>
                            <span className="text-sm text-muted-foreground">{overlap}</span>
                        </div>
                        <Slider
                            value={[overlap]}
                            onValueChange={([v]) => setOverlap(v)}
                            min={0}
                            max={Math.floor(chunkSize * 0.5)}
                            step={10}
                        />
                    </div>

                    <div className="p-4 bg-muted rounded-lg text-sm">
                        <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">Total Chunks:</span>
                            <span className="font-bold">{chunks.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. Vectors:</span>
                            <span className="font-bold">{chunks.length}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Input & Vis */}
            <div className="lg:col-span-8 flex flex-col gap-4 h-full">
                <Card className="flex flex-col h-1/3 min-h-[200px]">
                    <CardHeader>
                        <CardTitle>Source Text</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0">
                        <Textarea
                            className="h-full resize-none font-mono text-sm"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col flex-1 min-h-0 bg-muted/20">
                    <CardHeader>
                        <CardTitle>Chunks Preview</CardTitle>
                        <CardDescription>Visual representation of overlap (highlighted).</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto space-y-2 custom-scrollbar p-6">
                        {chunks.map((chunk, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute -left-8 top-1 text-xs text-muted-foreground w-6 text-right">#{i + 1}</div>
                                <div className="p-3 bg-card border rounded-lg shadow-sm font-mono text-sm break-words relative overflow-hidden">
                                    {/* Visualizing Overlap if i > 0 */}
                                    {i > 0 && overlap > 0 && (
                                        <span className="bg-yellow-500/20 text-yellow-500 rounded px-0.5 -mx-0.5">
                                            {chunk.content.slice(0, overlap)}
                                        </span>
                                    )}

                                    {/* Main Content */}
                                    <span className="text-foreground">
                                        {chunk.content.slice(i > 0 && overlap > 0 ? overlap : 0, chunk.content.length - (chunks[i + 1] ? overlap : 0))}
                                    </span>

                                    {/* End Overlap */}
                                    {chunks[i + 1] && overlap > 0 && (
                                        <span className="bg-blue-500/20 text-blue-500 rounded px-0.5 -mx-0.5">
                                            {chunk.content.slice(chunk.content.length - overlap)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
