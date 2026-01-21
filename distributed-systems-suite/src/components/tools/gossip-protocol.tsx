"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, RefreshCw, Send, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Node {
    id: number;
    x: number;
    y: number;
    state: "Susceptible" | "Infected"; // Simple SI model
    generation: number; // For coloration gradient
}

interface Message {
    id: string;
    fromx: number;
    fromy: number;
    tox: number;
    toy: number;
    progress: number;
}

const TOTAL_NODES = 50;

export default function GossipProtocol() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [running, setRunning] = useState(false);
    const [fanout, setFanout] = useState(3);
    const [roundDuration, setRoundDuration] = useState(1000); // ms
    const [rounds, setRounds] = useState(0);

    // Initialize
    useEffect(() => {
        resetSim();
    }, []);

    const resetSim = () => {
        const newNodes: Node[] = Array.from({ length: TOTAL_NODES }).map((_, i) => ({
            id: i,
            x: Math.random() * 90 + 5, // 5-95%
            y: Math.random() * 90 + 5,
            state: "Susceptible",
            generation: 0
        }));
        // Infect patient zero
        newNodes[0].state = "Infected";
        setNodes(newNodes);
        setMessages([]);
        setRounds(0);
        setRunning(false);
    };

    const step = () => {
        setRounds(r => r + 1);
        setNodes(prev => {
            const next = [...prev];
            const infected = next.filter(n => n.state === "Infected");
            const newMessages: Message[] = [];

            infected.forEach(node => {
                // Select 'fanout' random peers
                for (let i = 0; i < fanout; i++) {
                    const targetIdx = Math.floor(Math.random() * TOTAL_NODES);
                    const target = next[targetIdx];

                    // Add visualization message
                    newMessages.push({
                        id: Math.random().toString(36),
                        fromx: node.x,
                        fromy: node.y,
                        tox: target.x,
                        toy: target.y,
                        progress: 0
                    });

                    // Infect logic (applied immediately for data simplicity, visual will trail)
                    if (target.state === "Susceptible") {
                        // Actually, let's delay infection until visual hits? 
                        // No, for simplicity, infect now but maybe visually delay?
                        // Standard SI: simple state change.
                        next[targetIdx] = { ...target, state: "Infected", generation: rounds + 1 };
                    }
                }
            });

            // Trigger message animations
            animateMessages(newMessages);

            return next;
        });
    };

    const animateMessages = (msgs: Message[]) => {
        // We'll manage visualization separately via local state or just CSS transition tricks?
        // React state for 150 messages might be heavy. 
        // Let's use the 'messages' state just for the rendering loop of the lines.
        setMessages(msgs);
        // Clear messages after animation
        setTimeout(() => setMessages([]), 500);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (running) {
            interval = setInterval(step, roundDuration);
        }
        return () => clearInterval(interval);
    }, [running, roundDuration, fanout, rounds]); // Adding rounds to dependency to capture latest state if needed, though setInterval closure usually needs ref

    const infectedCount = nodes.filter(n => n.state === "Infected").length;
    const coverage = Math.round((infectedCount / TOTAL_NODES) * 100);

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Controls */}
            <Card className="lg:w-80 h-fit">
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <h3 className="font-medium text-sm">Simulation Status</h3>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Infected</span>
                            <span className="font-bold">{infectedCount} / {TOTAL_NODES} ({coverage}%)</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${coverage}%` }} />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Round: {rounds}</div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Fanout (Peers)</label>
                            <div className="flex items-center gap-2">
                                <Slider min={1} max={10} step={1} value={[fanout]} onValueChange={v => setFanout(v[0])} />
                                <span className="w-8 text-right text-sm">{fanout}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Speed (ms)</label>
                            <Slider min={100} max={2000} step={100} value={[roundDuration]} onValueChange={v => setRoundDuration(v[0])} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button onClick={() => setRunning(!running)} className={running ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}>
                            {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {running ? "Pause Spread" : "Start Spread"}
                        </Button>
                        <Button variant="outline" onClick={resetSim}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    </div>

                    <div className="text-xs text-muted-foreground rounded bg-secondary/50 p-2">
                        <strong>Gossip Protocol:</strong> At every round (t), each infected node picks <em>{fanout}</em> random peers and shares the state. This results in exponential propagation (Log N convergence).
                    </div>
                </CardContent>
            </Card>

            {/* Vis */}
            <div className="flex-1 bg-slate-950 rounded-xl relative overflow-hidden border shadow-inner">

                {/* Edges (Transient Messages) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {messages.map((msg, i) => (
                        <motion.line
                            key={msg.id}
                            x1={`${msg.fromx}%`} y1={`${msg.fromy}%`}
                            x2={`${msg.tox}%`} y2={`${msg.toy}%`}
                            stroke="rgba(239, 68, 68, 0.4)"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </svg>

                {/* Nodes */}
                {nodes.map(node => (
                    <div
                        key={node.id}
                        className={`absolute w-3 h-3 rounded-full transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 shadow-lg
                        ${node.state === "Infected" ? "bg-red-500 scale-125 shadow-red-500/50" : "bg-slate-700 hover:bg-slate-600"}
                    `}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    />
                ))}

                {/* Overlay for start */}
                {!running && rounds === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="inline-flex p-4 bg-primary rounded-full text-primary-foreground mb-4 shadow-lg animate-pulse">
                                <Users className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Gossip Simulator</h2>
                            <p className="text-white/80 max-w-md mx-auto mt-2">
                                One node is infected (Red). Click Start to see how fast the message propagates to 100% of the cluster.
                            </p>
                            <Button onClick={() => setRunning(true)} size="lg" className="mt-6 bg-white text-black hover:bg-slate-200">
                                Start Simulation
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
