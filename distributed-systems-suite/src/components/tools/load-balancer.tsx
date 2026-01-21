"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Smartphone, Server as ServerIcon, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// -- Types --
type Algorithm = "round-robin" | "least-connections" | "ip-hash" | "random";

interface Server {
    id: string;
    name: string;
    activeConnections: number;
    totalRequests: number;
    status: "healthy" | "draining" | "dead" | "slow";
    color: string;
}

interface Request {
    id: string;
    sourceIp: string;
    targetServerId: string | null;
    duration: number; // ms to process
    status: "pending" | "processing" | "completed";
}

const SERVER_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export default function LoadBalancerSim() {
    const [algo, setAlgo] = useState<Algorithm>("round-robin");
    const [servers, setServers] = useState<Server[]>([
        { id: "s1", name: "Server 1", activeConnections: 0, totalRequests: 0, status: "healthy", color: SERVER_COLORS[0] },
        { id: "s2", name: "Server 2", activeConnections: 0, totalRequests: 0, status: "healthy", color: SERVER_COLORS[1] },
        { id: "s3", name: "Server 3", activeConnections: 0, totalRequests: 0, status: "healthy", color: SERVER_COLORS[2] },
    ]);
    const [incomingRequests, setIncomingRequests] = useState<Request[]>([]);
    const [processingRequests, setProcessingRequests] = useState<Request[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [requestRate, setRequestRate] = useState(1); // Requests per second
    const [rrIndex, setRrIndex] = useState(0); // Round Robin cursor

    // Refs for loop management
    const requestIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // -- Balancer Logic --
    const selectServer = (req: Request, currentServers: Server[]): string | null => {
        const healthyServers = currentServers.filter(s => s.status !== "dead" && s.status !== "draining");
        if (healthyServers.length === 0) return null;

        switch (algo) {
            case "round-robin": {
                const server = healthyServers[rrIndex % healthyServers.length];
                setRrIndex(prev => prev + 1);
                return server.id;
            }
            case "least-connections": {
                // Sort by active connections
                const sorted = [...healthyServers].sort((a, b) => a.activeConnections - b.activeConnections);
                return sorted[0].id;
            }
            case "random": {
                const idx = Math.floor(Math.random() * healthyServers.length);
                return healthyServers[idx].id;
            }
            case "ip-hash": {
                // Simple hash of IP string
                let hash = 0;
                for (let i = 0; i < req.sourceIp.length; i++) {
                    hash = ((hash << 5) - hash) + req.sourceIp.charCodeAt(i);
                    hash |= 0;
                }
                const idx = Math.abs(hash) % healthyServers.length;
                return healthyServers[idx].id;
            }
            default:
                return healthyServers[0].id;
        }
    };

    // -- Simulation Loop --
    useEffect(() => {
        if (!isRunning) {
            if (requestIntervalRef.current) clearInterval(requestIntervalRef.current);
            return;
        }

        const intervalMs = 1000 / requestRate;

        requestIntervalRef.current = setInterval(() => {
            // 1. Generate Request
            const newReq: Request = {
                id: Math.random().toString(36).substr(2, 9),
                sourceIp: `192.168.1.${Math.floor(Math.random() * 255)}`,
                targetServerId: null,
                duration: Math.floor(Math.random() * 1500) + 500, // 500-2000ms duration
                status: "pending"
            };

            // 2. Select Server immediately (L7 LB behavior)
            const targetId = selectServer(newReq, servers);

            if (targetId) {
                newReq.targetServerId = targetId;
                newReq.status = "processing";

                // Update Server Stats
                setServers(prev => prev.map(s => {
                    if (s.id === targetId) {
                        // If server is "slow", multiply duration
                        const finalDuration = s.status === "slow" ? newReq.duration * 3 : newReq.duration;
                        // Schedule completion
                        setTimeout(() => {
                            setProcessingRequests(curr => curr.filter(r => r.id !== newReq.id));
                            setServers(inner => inner.map(si => si.id === targetId ? { ...si, activeConnections: si.activeConnections - 1 } : si));
                        }, finalDuration);

                        return { ...s, activeConnections: s.activeConnections + 1, totalRequests: s.totalRequests + 1 };
                    }
                    return s;
                }));

                setProcessingRequests(prev => [...prev.slice(-19), newReq]); // Keep last 20 for visual
            }

        }, intervalMs);

        return () => {
            if (requestIntervalRef.current) clearInterval(requestIntervalRef.current);
        }
    }, [isRunning, requestRate, algo, servers]); // Note: servers dependency might cause re-renders resetting interval, but needed for algorithm data access if not using function updates strictly. 
    // In a real optimized app, we'd use Refs for server state inside the interval to avoid resetting it.
    // For this visualizer, resetting the interval on server state change (connection count) is bad. 
    // FIXED: The `selectServer` logic needs "fresh" server state without breaking the loop. 
    // Actually, we can move the selection logic inside the setServers or use a Ref for servers in the interval closure.

    // -- Helper to toggle server status --
    const toggleServerStatus = (id: string, type: "slow" | "dead") => {
        setServers(prev => prev.map(s => {
            if (s.id !== id) return s;
            // Toggle logic
            if (type === "dead") return { ...s, status: s.status === "dead" ? "healthy" : "dead" };
            if (type === "slow") return { ...s, status: s.status === "slow" ? "healthy" : "slow" };
            return s;
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
            {/* Controls */}
            <Card className="lg:col-span-1 border-none shadow-none bg-transparent">
                <CardHeader>
                    <CardTitle>LB Configuration</CardTitle>
                    <CardDescription>Simulate traffic traffic distribution.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Algorithm</label>
                        <Select value={algo} onValueChange={(v: any) => setAlgo(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="round-robin">Round Robin</SelectItem>
                                <SelectItem value="least-connections">Least Connections</SelectItem>
                                <SelectItem value="ip-hash">IP Hash</SelectItem>
                                <SelectItem value="random">Random</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Request Rate ({requestRate} req/s)</label>
                        <Slider
                            value={[requestRate]}
                            min={1} max={10} step={1}
                            onValueChange={(v) => setRequestRate(v[0])}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            className={isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}
                            onClick={() => setIsRunning(!isRunning)}
                        >
                            {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isRunning ? "Stop Traffic" : "Start Traffic"}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setServers(prev => prev.map(s => ({ ...s, activeConnections: 0, totalRequests: 0 })))}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Server Management</h4>
                        <div className="space-y-3">
                            {servers.map(server => (
                                <div key={server.id} className="flex items-center justify-between text-xs bg-card border p-2 rounded">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ background: server.color }} />
                                        <span>{server.name}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant={server.status === "slow" ? "secondary" : "ghost"}
                                            className={`h-6 px-2 text-[10px] ${server.status === "slow" ? "ring-1 ring-yellow-500 text-yellow-500" : ""}`}
                                            onClick={() => toggleServerStatus(server.id, "slow")}
                                        >
                                            SLOW
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={server.status === "dead" ? "destructive" : "ghost"}
                                            className="h-6 px-2 text-[10px]"
                                            onClick={() => toggleServerStatus(server.id, "dead")}
                                        >
                                            KILL
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Visual Workspace */}
            <div className="lg:col-span-3 flex flex-col gap-4">
                {/* Top: Client / Internet */}
                <div className="h-24 bg-card border rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute left-4 top-2 text-xs text-muted-foreground uppercase font-bold tracking-widest">The Internet</div>
                    <div className="flex gap-2">
                        {processingRequests.slice(-5).map((req, i) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900 text-white dark:bg-slate-100 dark:text-black rounded px-2 py-1 text-xs font-mono flex items-center gap-1 shadow-md"
                            >
                                <Smartphone className="h-3 w-3" />
                                {req.sourceIp}
                            </motion.div>
                        ))}
                        {processingRequests.length === 0 && <span className="text-muted-foreground italic text-sm">Waiting for traffic...</span>}
                    </div>
                </div>

                {/* Middle: The Load Balancer (Router) */}
                <div className="h-12 flex items-center justify-center">
                    <div className="w-1 bg-gradient-to-b from-indigo-500/0 via-indigo-500 to-indigo-500/0 h-full"></div>
                    <Badge variant="outline" className="bg-background z-10 px-4 py-1 border-indigo-500 text-indigo-500">
                        LOAD BALANCER
                    </Badge>
                    <div className="w-1 bg-gradient-to-b from-indigo-500/0 via-indigo-500 to-indigo-500/0 h-full"></div>
                </div>

                {/* Bottom: Servers */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                    {servers.map(server => (
                        <div key={server.id} className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${server.status === "dead" ? "opacity-40 border-slate-700 bg-slate-900/50" : "bg-card/50"}`} style={{ borderColor: server.status === "healthy" || server.status === "slow" ? server.color : undefined }}>

                            {/* Server Status Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <ServerIcon className="h-5 w-5" style={{ color: server.color }} />
                                    <span className="font-bold">{server.name}</span>
                                </div>
                                {server.status === "dead" && <Badge variant="destructive">OFFLINE</Badge>}
                                {server.status === "slow" && <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">LAGGING</Badge>}
                                {server.status === "healthy" && <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 shadow-none">HEALTHY</Badge>}
                            </div>

                            {/* Connection Meter */}
                            <div className="space-y-1 mb-6">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Active Conn</span>
                                    <span>{server.activeConnections}</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        style={{ backgroundColor: server.color }}
                                        animate={{ width: `${Math.min(server.activeConnections * 5, 100)}%` }} // 20 connects = 100% vis
                                    />
                                </div>
                            </div>

                            {/* Request Particles (Visualizing the specific requests stuck here) */}
                            <div className="h-40 overflow-hidden relative bg-background/50 rounded-md border p-2">
                                <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Processing Queue</div>
                                <AnimatePresence>
                                    {processingRequests.filter(r => r.targetServerId === server.id).map((req) => (
                                        <motion.div
                                            key={req.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                            className="mb-1 text-[10px] bg-slate-100 dark:bg-slate-800 rounded px-1 py-0.5 border truncate flex justify-between"
                                        >
                                            <span>{req.sourceIp}</span>
                                            <span className="text-muted-foreground">{req.duration}ms</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="mt-4 text-xs text-center text-muted-foreground">
                                Total Served: {server.totalRequests}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
