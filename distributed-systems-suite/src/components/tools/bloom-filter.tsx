"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Check, X, RefreshCw, Hash } from "lucide-react";

// -- MurmurHash3-like simple implementation for multiple seeds --
const hashFnv32a = (str: string, seed: number): number => {
    let hval = 0x811c9dc5 + seed;
    for (let i = 0; i < str.length; i++) {
        hval ^= str.charCodeAt(i);
        hval = (hval * 0x01000193) >>> 0;
    }
    return hval;
}

const getHashes = (str: string, k: number, m: number): number[] => {
    const hashes = [];
    for (let i = 0; i < k; i++) {
        // Use different seed for each 'k'
        const hash = hashFnv32a(str, i * 1337);
        hashes.push(hash % m);
    }
    return hashes;
};

export default function BloomFilter() {
    const [size, setSize] = useState(50); // m (bits)
    const [hashesCount, setHashesCount] = useState(3); // k (hash functions)
    const [bitArray, setBitArray] = useState<boolean[]>(Array(50).fill(false));
    const [storedItems, setStoredItems] = useState<string[]>([]);
    const [inputText, setInputText] = useState("");
    const [testResult, setTestResult] = useState<"Found" | "NotFound" | "FalsePositive" | null>(null);

    // Reset when settings change
    useEffect(() => {
        setBitArray(Array(size).fill(false));
        setStoredItems([]);
        setTestResult(null);
    }, [size, hashesCount]);

    const currentHashes = useMemo(() => {
        if (!inputText) return [];
        return getHashes(inputText, hashesCount, size);
    }, [inputText, hashesCount, size]);

    const add = () => {
        if (!inputText) return;
        if (storedItems.includes(inputText)) return;

        const newBits = [...bitArray];
        currentHashes.forEach(idx => newBits[idx] = true);
        setBitArray(newBits);
        setStoredItems(prev => [...prev, inputText]);
        setInputText("");
        setTestResult(null);
    };

    const test = () => {
        if (!inputText) return;

        const allBitsSet = currentHashes.every(idx => bitArray[idx]);
        const actuallyExists = storedItems.includes(inputText);

        if (allBitsSet) {
            if (actuallyExists) setTestResult("Found");
            else setTestResult("FalsePositive"); // The interesting case!
        } else {
            setTestResult("NotFound");
        }
    };

    // Calculate generic probability
    // p = (1 - e^(-kn/m))^k
    const n = storedItems.length;
    const fpProb = Math.pow(1 - Math.exp(-hashesCount * n / size), hashesCount);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Tune the filter parameters.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex justify-between">
                                <span>Bit Array Size (m)</span>
                                <span>{size} bits</span>
                            </label>
                            <Slider min={20} max={200} step={10} value={[size]} onValueChange={v => setSize(v[0])} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex justify-between">
                                <span>Hash Functions (k)</span>
                                <span>{hashesCount}</span>
                            </label>
                            <Slider min={1} max={10} step={1} value={[hashesCount]} onValueChange={v => setHashesCount(v[0])} />
                        </div>

                        <div className="mt-4 p-3 bg-secondary/50 rounded text-sm text-center">
                            Estimated False Positive Rate: <br />
                            <span className="text-xl font-bold font-mono">{(fpProb * 100).toFixed(4)}%</span>
                            <div className="text-xs text-muted-foreground mt-1 relative bottom-0">
                                (with {n} items stored)
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Interact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type a string..."
                                value={inputText}
                                onChange={e => {
                                    setInputText(e.target.value);
                                    setTestResult(null);
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button onClick={add} disabled={!inputText}>
                                Add to Filter
                            </Button>
                            <Button onClick={test} variant="secondary" disabled={!inputText}>
                                Check Existence
                            </Button>
                        </div>

                        {testResult && (
                            <div className={`p-3 rounded text-center font-bold border ${testResult === "Found" ? "bg-green-500/20 border-green-500 text-green-600" :
                                    testResult === "NotFound" ? "bg-slate-100 dark:bg-slate-800 border-slate-500" :
                                        "bg-amber-500/20 border-amber-500 text-amber-600" // False Positive
                                }`}>
                                {testResult === "Found" && "Probably Exists (True Positive)"}
                                {testResult === "NotFound" && "Definitely Does Not Exist"}
                                {testResult === "FalsePositive" && "Maybe Exists (False Positive!)"}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Visualization</CardTitle>
                    </CardHeader>
                    <CardContent>

                        {/* The Bit Array */}
                        <div className="mb-2 text-sm text-muted-foreground">Bit Array Index:</div>
                        <div className="grid grid-cols-10 gap-1 mb-6">
                            {bitArray.map((on, i) => {
                                const isProjected = currentHashes.includes(i) && inputText.length > 0;
                                return (
                                    <div
                                        key={i}
                                        className={`
                                        aspect-square flex items-center justify-center text-[10px] rounded transition-all duration-300 border
                                        ${on ? "bg-blue-600 text-white border-blue-600" : "bg-secondary text-muted-foreground border-transparent"}
                                        ${isProjected ? "ring-2 ring-amber-400 scale-110 z-10" : ""}
                                    `}
                                        title={`Index ${i}`}
                                    >
                                        {i}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Stored Items */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Stored Stings ({storedItems.length})</h4>
                            <div className="flex flex-wrap gap-2">
                                {storedItems.map((item, i) => (
                                    <Badge key={i} variant="outline" className="font-mono">
                                        {item}
                                    </Badge>
                                ))}
                                {storedItems.length === 0 && <span className="text-sm text-muted-foreground italic">Empty...</span>}
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
