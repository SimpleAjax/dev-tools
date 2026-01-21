"use client";

import { ToolShell } from "@/components/tool-shell";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Map, ArrowRight, Activity, Terminal } from "lucide-react";
import { motion } from "framer-motion";

interface Hop {
    ip: string;
    location: string;
    latency: number;
    x: number; // For visualization on map (0-100%)
    y: number;
}

const CITIES = [
    { name: "New York, USA", x: 28, y: 35 },
    { name: "London, UK", x: 48, y: 25 },
    { name: "Frankfurt, DE", x: 52, y: 28 },
    { name: "Singapore, SG", x: 78, y: 60 },
    { name: "Tokyo, JP", x: 88, y: 35 },
    { name: "Sydney, AU", x: 92, y: 80 },
    { name: "Sao Paulo, BR", x: 32, y: 75 },
    { name: "Mumbai, IN", x: 68, y: 45 },
];

export default function TracerouteVisualizer() {
    const [target, setTarget] = useState("");
    const [hops, setHops] = useState<Hop[]>([]);
    const [tracing, setTracing] = useState(false);

    const startTrace = async () => {
        if (!target) return;
        setTracing(true);
        setHops([]);

        // Start point (Simulated User at San Francisco)
        const startHop: Hop = { ip: "192.168.1.1", location: "Local Network", latency: 1, x: 15, y: 38 };
        setHops([startHop]);

        await new Promise(r => setTimeout(r, 600));

        // Simulating hops
        const pathLength = 4 + Math.floor(Math.random() * 4);
        const path = [];
        for (let i = 0; i < pathLength; i++) {
            // Pick random city moving generally East
            const city = CITIES[Math.min(i + Math.floor(Math.random() * 2), CITIES.length - 1)];
            // Just pick random unique ones for visual
            path.push(CITIES[Math.floor(Math.random() * CITIES.length)]);
        }

        // Sort by x approximate to prevent criss-cross for simple visual
        path.sort((a, b) => a.x - b.x);

        let currentLatency = 10;

        for (const city of path) {
            await new Promise(r => setTimeout(r, 800));
            currentLatency += 10 + Math.random() * 40;
            setHops(prev => [...prev, {
                ip: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                location: city.name,
                latency: Math.round(currentLatency),
                x: city.x,
                y: city.y
            }]);
        }

        setTracing(false);
    };

    return (
        <ToolShell toolName="Traceroute Visualizer" description="Visualize network path and latency (Simulated Demo)." icon={<Map className="h-6 w-6" />}>
            <div className="space-y-6">
                <Card className="p-6">
                    <div className="flex gap-4">
                        <Input
                            placeholder="google.com"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && startTrace()}
                        />
                        <Button onClick={startTrace} disabled={tracing}>
                            {tracing ? "Tracing..." : "Start Trace"}
                        </Button>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Visual Map */}
                    <Card className="lg:col-span-2 min-h-[400px] relative bg-slate-900 border-slate-800 overflow-hidden text-white flex items-center justify-center">
                        {/* Abstract World Map Background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Simple grid lines */}
                                <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.1" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.1" />
                                <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.1" />
                                <line x1="20" y1="0" x2="20" y2="100" stroke="currentColor" strokeWidth="0.1" />
                                <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.1" />
                                <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" strokeWidth="0.1" />
                            </svg>
                        </div>

                        <div className="absolute inset-0 p-8">
                            {hops.map((hop, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute flex items-center justify-center w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                                    style={{ left: `${hop.x}%`, top: `${hop.y}%` }}
                                >
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-1 rounded text-[10px] text-blue-200 pointer-events-none">
                                        {hop.location}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Connecting Lines */}
                            <svg className="absolute inset-0 pointer-events-none w-full h-full">
                                {hops.map((hop, i) => {
                                    if (i === 0) return null;
                                    const prev = hops[i - 1];
                                    return (
                                        <motion.line
                                            key={i}
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            x1={`${prev.x}%`}
                                            y1={`${prev.y}%`}
                                            x2={`${hop.x}%`}
                                            y2={`${hop.y}%`}
                                            stroke="url(#gradient)"
                                            strokeWidth="2"
                                            strokeDasharray="4 2"
                                        />
                                    );
                                })}
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </Card>

                    {/* Hops List */}
                    <Card className="h-[400px] overflow-auto p-0">
                        <div className="p-4 border-b bg-muted/30">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Terminal className="h-4 w-4" />
                                Path Results
                            </h3>
                        </div>
                        <div className="p-2 space-y-1">
                            {hops.map((hop, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-3 rounded-lg hover:bg-muted/50 flex items-center gap-3 text-sm"
                                >
                                    <div className="font-mono text-muted-foreground w-6 text-right">{i + 1}</div>
                                    <div className="flex-1">
                                        <div className="font-medium">{hop.ip}</div>
                                        <div className="text-xs text-muted-foreground">{hop.location}</div>
                                    </div>
                                    <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-16 text-center">
                                        {hop.latency}ms
                                    </div>
                                </motion.div>
                            ))}
                            {tracing && (
                                <div className="p-4 text-center text-muted-foreground text-xs animate-pulse">
                                    Scanning next hop...
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </ToolShell>
    );
}
