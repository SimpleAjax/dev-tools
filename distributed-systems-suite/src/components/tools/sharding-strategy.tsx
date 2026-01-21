"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RefreshCw, Layers, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Strategy = "range" | "hash";
type KeyType = "sequential" | "random";

interface Shard {
    id: number;
    count: number;
}

interface IncomingData {
    id: string;
    val: number; // The numeric value used for range
    targetShard: number;
}

export default function ShardingStrategy() {
    const [strategy, setStrategy] = useState<Strategy>("range");
    const [keyType, setKeyType] = useState<KeyType>("sequential");
    const [shardCount, setShardCount] = useState(4);
    const [shards, setShards] = useState<Shard[]>(Array.from({ length: 4 }, (_, i) => ({ id: i, count: 0 })));
    const [running, setRunning] = useState(false);
    const [sequence, setSequence] = useState(1000); // Start ID for sequential
    const [items, setItems] = useState<IncomingData[]>([]);

    // Reset logic
    useEffect(() => {
        setShards(Array.from({ length: shardCount }, (_, i) => ({ id: i, count: 0 })));
        setSequence(1000);
        setItems([]);
        setRunning(false);
    }, [strategy, keyType, shardCount]);

    // Generator Loop
    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            generateItem();
        }, 200); // 5 items/sec

        return () => clearInterval(interval);
    }, [running, sequence, strategy, keyType, shardCount]); // Deps needed for closure state

    const generateItem = () => {
        // 1. Generate Key
        let val = 0;
        if (keyType === "sequential") {
            val = sequence;
            setSequence(s => s + 1);
        } else {
            // Random value between 1000 and 9999
            val = Math.floor(Math.random() * 9000) + 1000;
        }

        // 2. Determine Shard
        let target = 0;
        if (strategy === "hash") {
            // Simple Modulo Hash
            target = val % shardCount;
        } else {
            // Range Sharding (Assuming range 1000-9999 split evenly?)
            // Or typically, range sharding splits by predefined pivots.
            // If we have 4 shards for 1000-Infinity...
            // Let's assume dynamic splitting or fixed ranges:
            // S0: 1000-3000, S1: 3000-5000, S2: 5000-7000, S3: 7000+
            // If sequential (1000++), it hits S0 then S1... 
            // BUT if sequential usually implies "time based" or "auto increment", 
            // it hits the *current* active shard (High Key).
            // Let's simulate "Key Range" partitions.
            const max = 10000;
            const rangeSize = max / shardCount; // 2500 per shard
            // Normalize val to [0, max]
            const norm = (val - 1000) % max;
            // Actually for Sequential: 
            // If seq < 3500 -> S0
            // If seq < 6000 -> S1
            // ...
            // The issue with Sequential + Range is it fills S0, then S1, then S2.
            // At any given moment, only ONE shard is taking writes (Hotspot).
            // Let's simulate that behavior.

            if (val < 2000) target = 0;
            else if (val < 3000) target = 1;
            else if (val < 4000) target = 2;
            else target = 3;

            // Adjust sequence reset just to keep visualization looping or clear
            if (keyType === 'sequential' && val > 5000) {
                // wrap around for vis purposes?
            }
        }

        const newItem = { id: Math.random().toString(36), val, targetShard: target };

        // Add to items for animation
        setItems(prev => [...prev.slice(-10), newItem]);

        // Update Shard Counts (Delayed for visual sync? Nah, instant logic)
        setShards(prev => {
            const next = [...prev];
            if (next[target]) { // Safety check
                next[target] = { ...next[target], count: next[target].count + 1 };
            }
            return next;
        });
    };

    const maxCount = Math.max(...shards.map(s => s.count), 1);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            <Card className="md:col-span-1">
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sharding Strategy</label>
                        <Select value={strategy} onValueChange={(v: any) => setStrategy(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="range">Range Based</SelectItem>
                                <SelectItem value="hash">Hash Based (Modulo)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Key Generator</label>
                        <Select value={keyType} onValueChange={(v: any) => setKeyType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sequential">Sequential (Auto Inc / Time)</SelectItem>
                                <SelectItem value="random">Random Distribution</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="p-4 bg-secondary/50 rounded-lg text-sm space-y-2">
                        <div className="font-semibold flex items-center gap-2">
                            <span className={strategy === 'range' && keyType === 'sequential' ? "text-red-500" : "text-green-500"}>
                                {strategy === 'range' && keyType === 'sequential' ? "Hotspot Warning!" : "Balanced"}
                            </span>
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {strategy === "range" && keyType === "sequential" &&
                                "Writing sequential keys to Range Shards focuses all load on the last shard (The 'Tail')."}
                            {strategy === "range" && keyType === "random" &&
                                "Random keys distribute well on Range shards if ranges are pre-split correctly."}
                            {strategy === "hash" &&
                                "Hashing distributes keys uniformly regardless of sequence, preventing hotspots, but kills range queries."}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => setRunning(!running)} variant={running ? "secondary" : "default"}>
                            {running ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
                            {running ? "Stop Writes" : "Start Writes"}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => { setShards(shards.map(s => ({ ...s, count: 0 }))); }}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>

                </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="h-full flex flex-col pt-6">

                    {/* Incoming Stream */}
                    <div className="h-24 border-b flex items-center justify-end px-4 overflow-hidden relative mb-4">
                        <div className="absolute left-0 text-xs font-bold text-muted-foreground uppercase tracking-widest">Write Stream</div>
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="mx-1 font-mono text-xs bg-white dark:bg-slate-800 border rounded px-2 py-1 shadow-sm shrink-0"
                                >
                                    {item.val}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Shards Visual */}
                    <div className="flex-1 grid grid-cols-4 gap-4 items-end pb-8 px-4">
                        {shards.map((shard) => {
                            const isHot = shard.id === shards.length - 1 && strategy === 'range' && keyType === 'sequential';
                            // Calculate load percentage relative to max
                            const height = Math.min(100, (shard.count / (maxCount * 1.2)) * 100);

                            return (
                                <div key={shard.id} className="h-full flex flex-col justify-end group">
                                    <div className="flex justify-between items-end mb-2 px-1">
                                        <span className="font-bold text-xl">{shard.count}</span>
                                        {/* <span className="text-xs text-muted-foreground">recs</span> */}
                                    </div>

                                    {/* Bar */}
                                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-t-lg relative overflow-hidden transition-all duration-300" style={{ height: "60%" }}>
                                        <motion.div
                                            className={`absolute bottom-0 w-full rounded-t-lg transition-colors duration-300 ${isHot && shard.count > 5 ? "bg-red-500" : "bg-blue-500"}`}
                                            animate={{ height: `${height}%` }}
                                        />
                                    </div>

                                    {/* Label */}
                                    <div className="mt-4 border-t pt-2 text-center">
                                        <div className="font-bold flex items-center justify-center gap-1">
                                            <Database className="w-4 h-4" />
                                            S{shard.id}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-1">
                                            {strategy === 'range' ? (
                                                shard.id === 0 ? "< 2000" :
                                                    shard.id === 1 ? "2000-3000" :
                                                        shard.id === 2 ? "3000-4000" : "> 4000"
                                            ) : (
                                                `Mod ${shardCount} == ${shard.id}`
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
