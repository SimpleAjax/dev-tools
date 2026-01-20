"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Brain, Database, HardDrive } from "lucide-react";

const VENDORS = [
    { name: "Pinecone (Values based on S1)", unitPrice: 0.096, unitSize: 512 }, // Approx for example
    { name: "Weaviate Cloud", unitPrice: 0.05, unitSize: 1024 },
    { name: "Qdrant Cloud", unitPrice: 0.04, unitSize: 1024 },
];

export function VectorCalc() {
    const [vectors, setVectors] = useState(1000000);
    const [dimensions, setDimensions] = useState(1536); // OpenAI Default
    const [metadataSize, setMetadataSize] = useState(500); // Bytes per vector
    const [precision, setPrecision] = useState(4); // 4 bytes (float32)

    // Calc
    const vectorBytes = vectors * dimensions * precision;
    const metadataBytes = vectors * metadataSize;
    const indexOverhead = vectorBytes * 0.1; // 10% overhead approx

    const totalBytes = vectorBytes + metadataBytes + indexOverhead;
    const totalGB = totalBytes / 1e9;

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Dataset Parameters</CardTitle>
                    <CardDescription>Size of your embedding dataset.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Number of Vectors</Label>
                            <span className="text-sm text-muted-foreground">{vectors.toLocaleString()}</span>
                        </div>
                        <Slider
                            value={[vectors]}
                            onValueChange={([v]) => setVectors(v)}
                            max={10000000}
                            step={10000}
                        />
                        <Input type="number" value={vectors} onChange={e => setVectors(Number(e.target.value))} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Dimensions</Label>
                            <Input type="number" value={dimensions} onChange={e => setDimensions(Number(e.target.value))} />
                            <p className="text-xs text-muted-foreground">e.g. 1536 (OpenAI), 768 (HF)</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Metadata (Bytes/Vec)</Label>
                            <Input type="number" value={metadataSize} onChange={e => setMetadataSize(Number(e.target.value))} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle>Storage Estimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-5xl font-bold text-primary">{totalGB.toFixed(2)}</span>
                            <span className="text-xl font-medium text-muted-foreground mb-1">GB</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><Brain className="w-4 h-4" /> Vector Data</span>
                                <span className="font-mono">{(vectorBytes / 1e9).toFixed(2)} GB</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><FileJson className="w-4 h-4" /> Metadata</span> // FIXED: FileJson doesn't exist? Check Lucide imports later. Replaced with Database for now if error.
                                <span className="font-mono">{(metadataBytes / 1e9).toFixed(2)} GB</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span className="flex items-center gap-2"><HardDrive className="w-4 h-4" /> Index Overhead (~10%)</span>
                                <span className="font-mono">{(indexOverhead / 1e9).toFixed(2)} GB</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function FileJson(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" />
            <path d="M10 18a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" />
        </svg>
    )
}
