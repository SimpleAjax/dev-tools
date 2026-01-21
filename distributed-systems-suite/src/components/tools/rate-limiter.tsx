"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Algo = "token-bucket" | "leaky-bucket";

interface Request {
    id: string;
    accepted: boolean;
    y: number; // for animation
}

export default function RateLimiter() {
    const [algo, setAlgo] = useState<Algo>("token-bucket");
    const [capacity, setCapacity] = useState(10);
    const [fillRate, setFillRate] = useState(1); // tokens/sec or leak/sec
    const [tokens, setTokens] = useState(10);
    const [queue, setQueue] = useState<number>(0);
    const [requests, setRequests] = useState<Request[]>([]);
    const [autoPlay, setAutoPlay] = useState(false);

    // Stats
    const [accepted, setAccepted] = useState(0);
    const [dropped, setDropped] = useState(0);

    // Refill / Leak Loop
    useEffect(() => {
        const interval = setInterval(() => {
            if (algo === "token-bucket") {
                setTokens(prev => Math.min(capacity, prev + (fillRate / 10))); // 10 ticks per second
            } else {
                // Leaky Bucket: Process/Leak items from queue
                setQueue(prev => Math.max(0, prev - (fillRate / 10)));
            }
        }, 100);
        return () => clearInterval(interval);
    }, [algo, capacity, fillRate]);

    // Request Generator Loop
    useEffect(() => {
        if (!autoPlay) return;
        const interval = setInterval(() => {
            if (Math.random() > 0.3) handleRequest();
        }, 500);
        return () => clearInterval(interval);
    }, [autoPlay, algo, tokens, queue, capacity]);

    const handleRequest = () => {
        const id = Math.random().toString(36).substr(2, 9);
        let isAccepted = false;

        if (algo === "token-bucket") {
            if (tokens >= 1) {
                setTokens(prev => prev - 1);
                isAccepted = true;
            }
        } else {
            // Leaky Bucket (Queue)
            // If queue has space
            if (queue < capacity) {
                setQueue(prev => prev + 1);
                isAccepted = true;
            }
        }

        if (isAccepted) setAccepted(p => p + 1);
        else setDropped(p => p + 1);

        // Visual only
        setRequests(prev => [...prev.slice(-15), { id, accepted: isAccepted, y: 0 }]);
    };

    const reset = () => {
        setAccepted(0);
        setDropped(0);
        setTokens(capacity);
        setQueue(0);
        setRequests([]);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-100px)]">
            {/* Controls */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Algorithm Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Algorithm</label>
                            <Select value={algo} onValueChange={(v: any) => { setAlgo(v); reset(); }}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="token-bucket">Token Bucket</SelectItem>
                                    <SelectItem value="leaky-bucket">Leaky Bucket</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                {algo === "token-bucket"
                                    ? "Allows bursts if tokens are available. Tokens refill at constant rate."
                                    : "Smooths outgoing traffic. Requests queue up and are processed at constant rate."}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Capacity (Size): {capacity}</label>
                            <Slider min={5} max={50} step={1} value={[capacity]} onValueChange={v => setCapacity(v[0])} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rate ({fillRate}/s):</label>
                            <Slider min={1} max={10} step={1} value={[fillRate]} onValueChange={v => setFillRate(v[0])} />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button className="flex-1" onClick={handleRequest}>Single Request</Button>
                            <Button variant={autoPlay ? "destructive" : "secondary"} onClick={() => setAutoPlay(!autoPlay)}>
                                {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button variant="outline" size="icon" onClick={reset}>
                                <RefreshCw className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex justify-between text-sm pt-4 border-t">
                            <div className="text-green-600">Accepted: {accepted}</div>
                            <div className="text-red-600">Dropped: {dropped}</div>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Visualization */}
            <Card className="bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
                <CardContent className="h-full flex flex-col items-center justify-center p-0">

                    {/* The Bucket */}
                    <div className="relative w-48 h-64 border-b-4 border-x-4 border-slate-400 dark:border-slate-600 rounded-b-xl flex flex-col-reverse overflow-hidden bg-white dark:bg-slate-950">

                        {/* Bucket Fill Level */}
                        <motion.div
                            className={`w-full transition-all duration-100 ease-linear ${algo === 'token-bucket' ? 'bg-amber-400/80' : 'bg-blue-500/80'}`}
                            style={{
                                height: `${Math.min(100, (algo === 'token-bucket' ? tokens : queue) / capacity * 100)}%`
                            }}
                        >
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                {algo === 'token-bucket' ? Math.floor(tokens) : Math.floor(queue)}
                            </div>
                        </motion.div>

                        {/* Capacity Marker */}
                        <div className="absolute top-0 right-0 p-1 text-[10px] text-muted-foreground w-full text-right border-b border-dashed border-red-500/50">
                            Max: {capacity}
                        </div>
                    </div>

                    {/* Pipe / Spout Visuals */}
                    {algo === "token-bucket" && (
                        <div className="absolute top-10 flex flex-col items-center animate-pulse">
                            <div className="text-xs text-amber-500 font-bold mb-1">Refill ({fillRate}/s)</div>
                            <div className="w-2 h-10 bg-amber-400/50 rounded-b"></div>
                        </div>
                    )}

                    {algo === "leaky-bucket" && (
                        <div className="absolute bottom-10 flex flex-col items-center">
                            <div className="w-2 h-10 bg-blue-500/50 rounded-b"></div>
                            <div className="text-xs text-blue-500 font-bold mt-1">Leak ({fillRate}/s)</div>
                        </div>
                    )}

                    {/* Incoming Requests Animation */}
                    <div className="absolute top-4 right-4 w-40 space-y-2">
                        <AnimatePresence>
                            {requests.map(req => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`text-xs px-2 py-1 rounded shadow-sm border flex items-center gap-2 ${req.accepted ? "bg-green-100 border-green-200 text-green-700" : "bg-red-100 border-red-200 text-red-700"
                                        }`}
                                >
                                    {req.accepted ? <CheckIcon /> : <XIcon />}
                                    Request {req.id}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    )
}

function XIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    )
}
