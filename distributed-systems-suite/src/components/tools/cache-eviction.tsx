"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RefreshCw, Archive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Algo = "LRU" | "LFU" | "FIFO";

interface CacheItem {
    key: string;
    val: string;
    lastAccessed: number; // Timestamp/Tick
    freq: number;
    insertedAt: number;
}

export default function CacheEviction() {
    const [algo, setAlgo] = useState<Algo>("LRU");
    const [capacity, setCapacity] = useState(5);
    const [cache, setCache] = useState<CacheItem[]>([]);
    const [tick, setTick] = useState(0);
    const [hits, setHits] = useState(0);
    const [misses, setMisses] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [autoPlay, setAutoPlay] = useState(false);

    // Helpers
    const log = (msg: string) => setLogs(p => [msg, ...p].slice(0, 10));

    const access = (key: string) => {
        setTick(t => t + 1);
        const now = tick + 1;

        setCache(prev => {
            const existingIdx = prev.findIndex(i => i.key === key);

            // HIT
            if (existingIdx !== -1) {
                setHits(h => h + 1);
                log(`HIT: ${key}`);
                const updated = [...prev];
                updated[existingIdx] = {
                    ...updated[existingIdx],
                    lastAccessed: now,
                    freq: updated[existingIdx].freq + 1
                };
                return updated;
            }

            // MISS
            setMisses(m => m + 1);
            const newItem: CacheItem = { key, val: `Data-${key}`, lastAccessed: now, freq: 1, insertedAt: now };

            if (prev.length < capacity) {
                log(`MISS: ${key} (Added)`);
                return [...prev, newItem];
            } else {
                // EVICT
                let evictIdx = -1;

                if (algo === "FIFO") {
                    // Lowest insertedAt
                    evictIdx = getMinIndex(prev, i => i.insertedAt);
                } else if (algo === "LRU") {
                    // Lowest lastAccessed
                    evictIdx = getMinIndex(prev, i => i.lastAccessed);
                } else if (algo === "LFU") {
                    // Lowest freq, tie-break with LRU (usually)
                    evictIdx = getMinIndex(prev, i => i.freq);
                    // Note: Real LFU is O(1) complex, simplistic here
                }

                const evicted = prev[evictIdx];
                log(`MISS: ${key} (Evicted ${evicted.key})`);

                const nextCache = [...prev];
                nextCache.splice(evictIdx, 1);
                nextCache.push(newItem);
                return nextCache;
            }
        });
    };

    const getMinIndex = (arr: CacheItem[], selector: (i: CacheItem) => number) => {
        let minVal = Infinity;
        let minIdx = -1;
        arr.forEach((item, idx) => {
            const v = selector(item);
            if (v < minVal) {
                minVal = v;
                minIdx = idx;
            }
        });
        return minIdx;
    };

    // Auto Play Logic
    useEffect(() => {
        if (!autoPlay) return;
        const interval = setInterval(() => {
            // Generate random key from set A..J (size 10)
            // Gaussian-ish distribution to encourage hits?
            // Or Zipf?
            // Simple random for now with small set relative to capacity
            const keys = ["A", "B", "C", "D", "E", "F", "G", "H"];
            // Skewed random: A-D used 80% time
            const r = Math.random();
            let k = "";
            if (r < 0.7) k = keys[Math.floor(Math.random() * 4)]; // 0-3
            else k = keys[Math.floor(Math.random() * 8)]; // 0-7

            access(k);
        }, 800);
        return () => clearInterval(interval);
    }, [autoPlay, tick, cache]); // Dependencies for closure state update if not functional

    const reset = () => {
        setCache([]);
        setHits(0);
        setMisses(0);
        setLogs([]);
        setTick(0);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Algorithm</label>
                            <Select value={algo} onValueChange={(v: any) => { setAlgo(v); reset(); }}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LRU">LRU (Least Recently Used)</SelectItem>
                                    <SelectItem value="LFU">LFU (Least Frequently Used)</SelectItem>
                                    <SelectItem value="FIFO">FIFO (First In First Out)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cache Capacity: {capacity}</label>
                            <Slider min={2} max={10} step={1} value={[capacity]} onValueChange={v => { setCapacity(v[0]); reset(); }} />
                        </div>
                        <div className="flex gap-2">
                            <Button className="w-full" onClick={() => setAutoPlay(!autoPlay)} variant={autoPlay ? "destructive" : "default"}>
                                {autoPlay ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
                                {autoPlay ? "Stop Traffic" : "Simulate Traffic"}
                            </Button>
                            <Button variant="outline" size="icon" onClick={reset}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="pt-4 border-t grid grid-cols-3 text-center">
                            <div>
                                <div className="text-2xl font-bold">{hits + misses}</div>
                                <div className="text-xs text-muted-foreground uppercase">Reqs</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-500">{hits}</div>
                                <div className="text-xs text-muted-foreground uppercase">Hits</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-red-500">{misses}</div>
                                <div className="text-xs text-muted-foreground uppercase">Misses</div>
                            </div>
                        </div>

                        <div className="text-xs text-center text-muted-foreground">
                            Hit Ratio: {hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(1) : 0}%
                        </div>

                    </CardContent>
                </Card>

                <Card className="h-64 flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Access Log</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto text-xs font-mono space-y-1">
                        {logs.map((l, i) => (
                            <div key={i} className="border-b last:border-0 pb-1 border-dashed opacity-80">{l}</div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="md:col-span-2 bg-slate-50 dark:bg-slate-900/50">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Cache State</span>
                        <div className="flex gap-2 text-sm">
                            {["A", "B", "C", "D", "E", "F", "G", "H"].map(k => (
                                <Button key={k} size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => access(k)}>
                                    {k}
                                </Button>
                            ))}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center p-10">
                    <div className="relative w-full max-w-2xl flex gap-4 overflow-x-auto p-4 min-h-[160px] border-2 border-dashed rounded-xl items-center bg-background/50">

                        <AnimatePresence mode="popLayout">
                            {cache.map((item) => (
                                <motion.div
                                    layout
                                    key={item.key}
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, y: -20, backgroundColor: "#fee2e2" }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="relative flex-shrink-0 w-24 h-32 bg-card border shadow-md rounded-lg flex flex-col items-center justify-between p-3 select-none"
                                >
                                    <div className="text-2xl font-bold text-primary">{item.key}</div>

                                    <div className="w-full space-y-1">
                                        {algo === "LRU" && (
                                            <div className="text-[10px] text-muted-foreground bg-secondary rounded px-1 flex justify-between">
                                                <span>Time:</span> <span>{item.lastAccessed}</span>
                                            </div>
                                        )}
                                        {algo === "LFU" && (
                                            <div className="text-[10px] text-muted-foreground bg-secondary rounded px-1 flex justify-between">
                                                <span>Freq:</span> <span>{item.freq}</span>
                                            </div>
                                        )}
                                        {algo === "FIFO" && (
                                            <div className="text-[10px] text-muted-foreground bg-secondary rounded px-1 flex justify-between">
                                                <span>In:</span> <span>{item.insertedAt}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Visual Indicators */}
                                    <Archive className="w-4 h-4 text-muted-foreground opacity-20 absolute top-1 right-1" />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {cache.length === 0 && (
                            <div className="w-full text-center text-muted-foreground">Cache is Empty</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
